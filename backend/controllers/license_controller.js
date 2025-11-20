
// const License=require("../models/licenseSchema.js")
// const crypto = require("crypto");

// function generateLicenseKey() {
//     return crypto.randomBytes(8).toString("hex").toUpperCase();
//     // e.g., "A1B2C3D4E5F6G7H8"
// }


// const createLicense = async (req, res) => {
//     try {
//         const { licenseKey, issuedTo, issuedBy, expiryDate } = req.body;
//         if (!licenseKey) {
//             licenseKey = generateLicenseKey();
//         }

//         const license = new License({
//             licenseKey,
//             issuedTo,
//             issuedBy,
//             expiryDate,
//         });

//         await license.save();
//         res.status(201).json({ message: "License created", license });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

// // Verify license
// const verifyLicense = async (req, res) => {
//     try {
//         const { licenseKey } = req.query;

//         const license = await License.findOne({ licenseKey });

//         if (!license) {
//             return res.status(404).json({ valid: false, message: "License not found" });
//         }

//         if (!license.isActive) {
//             return res.status(403).json({ valid: false, message: "License deactivated" });
//         }

//         if (new Date() > new Date(license.expiryDate)) {
//             return res.status(403).json({ valid: false, message: "License expired" });
//         }

//         res.json({ valid: true, message: "License is valid", license });
//     } catch (err) {
//         res.status(500).json({ valid: false, message: err.message });
//     }
// };

// // Deactivate a license (optional)
// const deactivateLicense = async (req, res) => {
//     try {
//         const { licenseKey } = req.params;

//         const license = await License.findOneAndUpdate(
//             { licenseKey },
//             { isActive: false },
//             { new: true }
//         );

//         if (!license) {
//             return res.status(404).json({ message: "License not found" });
//         }

//         res.json({ message: "License deactivated", license });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
// module.exports={createLicense,verifyLicense,deactivateLicense}
