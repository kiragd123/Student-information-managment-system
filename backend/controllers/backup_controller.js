const mongoose=require("mongoose");
const Backup=require("../models/backupSchema")
const path=require("path")
const fs=require("fs")

const { ObjectId } = mongoose.Types;

exports.runBackup = async (req, res) => {
    try {
        const collections = ["students", "teachers", "sclasses","admins","complains","notices","subjects",]; // your collections
        const backupData = {};

        // Fetch data from each collection
        for (const col of collections) {
            backupData[col] = await mongoose.connection.collection(col).find({}).toArray();
        }

        // Create a backup file
        const fileName = `backup_${Date.now()}.json`;
        const filePath = path.join(__dirname, "../backups", fileName);
        fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

        // Save backup record in MongoDB
        const backup = new Backup({
            fileName,
            filePath,
            backupType: "Full",
            backupSizeMB: (fs.statSync(filePath).size / 1024 / 1024).toFixed(2),
            createdBy: req.body.createdBy || "System",
            status: "Completed",
            notes: "Backup created successfully"
        });

        await backup.save();
        res.status(201).json({ message: "Backup completed", backup });
    } catch (error) {
        res.status(500).json({ message: "Backup failed", error: error.message });
    }
};
exports.listBackups = async (req, res) => {
    try {
        const backups = await Backup.find().sort({ createdDate: -1 });
        res.json(backups);
    } catch (error) {
        res.status(500).json({ message: "Error fetching backups", error: error.message });
    }
};
exports.recoverBackup = async (req, res) => {
    try {
        const { id } = req.params;
        const backup = await Backup.findById(id);

        if (!backup) {
            return res.status(404).json({ message: "Backup not found" });
        }

        const backupData = JSON.parse(fs.readFileSync(backup.filePath, "utf-8"));

        // Restore each collection
        for (const col of Object.keys(backupData)) {
            const collection = mongoose.connection.collection(col);

            // Clear old data
            await collection.deleteMany({});

            if (backupData[col].length > 0) {
                const docs = backupData[col].map(doc => {
                    // Convert _id to ObjectId
                    if (doc._id && typeof doc._id === "string") {
                        doc._id = new ObjectId(doc._id);
                    }

                    // Convert other ObjectId references dynamically
                    for (const key in doc) {
                        if (
                            key !== "_id" &&
                            typeof doc[key] === "string" &&
                            /^[0-9a-fA-F]{24}$/.test(doc[key])
                        ) {
                            doc[key] = new ObjectId(doc[key]);
                        }

                        // Handle nested arrays like attendance or examResult
                        if (Array.isArray(doc[key])) {
                            doc[key] = doc[key].map(item => {
                                for (const subKey in item) {
                                    if (
                                        typeof item[subKey] === "string" &&
                                        /^[0-9a-fA-F]{24}$/.test(item[subKey])
                                    ) {
                                        item[subKey] = new ObjectId(item[subKey]);
                                    }
                                }
                                return item;
                            });
                        }
                    }

                    return doc;
                });

                await collection.insertMany(docs);                               
            }
        }

        res.json({ message: "Database recovered successfully", backup });
    } catch (error) {
        res.status(500).json({ message: "Recovery failed", error: error.message });
    }
};
// Run maintenance (cleanup old backups)
exports.runMaintenance = async (req, res) => {
    try {
        // 1. Delete backups older than 30 days
        const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const deleted = await Backup.deleteMany({ createdDate: { $lt: cutoff } });

        // 2. Count remaining backups
        const totalBackups = await Backup.countDocuments();

        // 3. Check MongoDB connection health
        const dbState = mongoose.connection.readyState; // 0=disconnected,1=connected

        // 4. Get database stats safely
        let stats = {};
        try {
            const admin = mongoose.connection.db.admin();
            stats = await admin.serverStatus();
        } catch (err) {
            console.error("Failed to fetch DB stats:", err.message);
        }

        res.json({
            message: "✅ Maintenance completed successfully.",
            deletedCount: deleted.deletedCount,
            totalBackups,
            dbStatus: dbState === 1 ? "Connected" : "Not Healthy",
            dbUptime: stats.uptime ? stats.uptime + " seconds" : "N/A",
            dbMemory: stats.mem ? stats.mem.resident + " MB" : "N/A",
            connections: stats.connections ? stats.connections.current : "N/A"
        });
    } catch (err) {
        res.status(500).json({
            message: "❌ Maintenance failed",
            error: err.message
        });
    }
};

