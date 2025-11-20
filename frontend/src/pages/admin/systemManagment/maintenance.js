import React, { useState } from "react";
import { Button, Typography, CircularProgress, Box, Paper } from "@mui/material";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import axios from "axios";

const Maintenance = () => {
    const API = 'http://localhost:5000';
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [details, setDetails] = useState(null);

    const runMaintenance = async () => {
        setLoading(true);
        setStatus("Running maintenance tasks...");
        setDetails(null);

        try {
            const res = await axios.post(`${API}/runMaintenance`);
            setStatus(res.data.message);
            setDetails(res.data);
        } catch (error) {
            console.error(error);
            setStatus("❌ Maintenance failed.");
        }

        setLoading(false);
    };

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom>
                <BuildCircleOutlinedIcon /> System Maintenance
            </Typography>
            <Typography variant="body1" gutterBottom>
                Run cleanup tasks, check database health, and optimize resources.
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={runMaintenance}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : "Run Maintenance"}
            </Button>

            {status && <Typography mt={2}>{status}</Typography>}

            {details && (
                <Paper sx={{ mt: 3, p: 2 }}>
                    <Typography variant="h6">Maintenance Report</Typography>
                    <Typography>🗑️ Old Backups Removed: {details.deletedCount}</Typography>
                    <Typography>💾 Total Backups Remaining: {details.totalBackups}</Typography>
                    <Typography>✅ DB Status: {details.dbStatus}</Typography>
                    <Typography>⏱️ DB Uptime: {details.dbUptime}</Typography>
                    <Typography>📊 Memory Usage: {details.dbMemory}</Typography>
                    <Typography>🔗 Active Connections: {details.connections}</Typography>
                </Paper>
            )}
        </Box>
    );
};

export default Maintenance;
