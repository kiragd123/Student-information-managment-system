import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
    Container, Paper, Typography, TextField, Button,
    Box, Alert, CircularProgress
} from '@mui/material';
import { PurpleButton } from '../components/buttonStyles';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const formData = new FormData(e.target);
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const API = 'http://localhost:5000';
            const response = await axios.post(`${API}/reset-password`, {
                token,
                email,
                newPassword
            });

            if (response.status === 200) {
                setSuccess(true);
                setMessage('Password reset successfully!');

                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            console.error('Reset password error:', error);
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Failed to reset password');
            } else {
                setError('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <Alert severity="error">
                        Invalid reset link. Please request a new password reset.
                    </Alert>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Reset Password
                </Typography>

                {success ? (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {message}
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            margin="normal"
                            label="New Password"
                            name="newPassword"
                            type="password"
                            required
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            required
                        />

                        <Box sx={{ mt: 3 }}>
                            <PurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                            </PurpleButton>
                        </Box>
                    </form>
                )}
            </Paper>
        </Container>
    );
};

export default ResetPassword;