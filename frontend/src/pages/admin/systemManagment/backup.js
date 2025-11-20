import React, { useState, useEffect } from "react";
import { Button, Typography, CircularProgress, Box, List, ListItem, ListItemText } from "@mui/material";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import axios from "axios";

const Backup = () => {
    const API = 'http://localhost:5000'
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [backups, setBackups] = useState([]);

    // Fetch list of backups from backend
    const fetchBackups = async () => {
        try {
            const res = await axios.get(`${API}/listBackups`);
            setBackups(res.data);
        } catch (err) {
            console.error(err);
            setStatus("⚠ Failed to load backups.");
        }
    };

    useEffect(() => {
        fetchBackups();
    }, []);

    // Run new backup
    const runBackup = async () => {
        setLoading(true);
        setStatus("Backing up database...");

        try {
            const res = await axios.post(`${API}/runBackup`, { createdBy: "AdminUser" });
            setStatus("✅ " + res.data.message);
            fetchBackups(); // reload list
        } catch (err) {
            console.error(err);
            setStatus("❌ Backup failed.");
        }
        setLoading(false);
    };

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom>
                <BackupOutlinedIcon /> Database Backup
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={runBackup}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : "Run Backup"}
            </Button>

            {status && <Typography mt={2}>{status}</Typography>}

            <Typography variant="h6" mt={4}>Backup History</Typography>
            <List>
                {backups.map((b) => (
                    <ListItem key={b._id}>
                        <ListItemText
                            primary={`${b.fileName} (${b.status})`}
                            secondary={`Created on ${new Date(b.createdDate).toLocaleString()} by ${b.createdBy}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Backup;
