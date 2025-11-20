import React, { useState, useEffect } from "react";
import { Button, Typography, CircularProgress, Box, List, ListItem, ListItemText } from "@mui/material";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import axios from "axios";

const Recovery = () => {
    const API = 'http://localhost:5000';
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [backups, setBackups] = useState([]);

    // Fetch available backups
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

    // Recover from backup
    const recoverBackup = async (id) => {
        setLoading(true);
        setStatus("Recovering database...");

        try {
            const res = await axios.post(`${API}/recoverBackup/${id}`);
            setStatus("✅ " + res.data.message);
            setBackups(prevBackups=>prevBackups.filter(b=>b._id!==id)); // Remove recovered backup from list
        } catch (err) {
            console.error(err);
            setStatus("❌ Recovery failed.");
        }
        setLoading(false);
    };

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom>
                <RestoreOutlinedIcon /> Database Recovery
            </Typography>

            <Typography variant="body1" gutterBottom>
                Select a backup from the list below to recover.
            </Typography>

            {status && <Typography mt={2}>{status}</Typography>}

            <Typography variant="h6" mt={4}>Available Backups</Typography>
            <List>
                {backups.map((b) => (
                    <ListItem key={b._id}>
                        <ListItemText
                            primary={b.fileName}
                            secondary={`Created: ${new Date(b.createdDate).toLocaleString()} by ${b.createdBy}`}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => recoverBackup(b._id)}
                            disabled={loading}
                        >
                            Recover
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Recovery;
