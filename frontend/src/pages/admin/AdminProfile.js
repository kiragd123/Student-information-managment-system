import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Collapse,
    Divider,
    Avatar,
    IconButton,
    Alert,
    Paper,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import {
    Edit as EditIcon,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Delete as DeleteIcon,
    School as SchoolIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Security as SecurityIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
import { useNavigate } from 'react-router-dom';
import { authLogout } from '../../redux/userRelated/userSlice';

const AdminProfile = () => {
    const [showEdit, setShowEdit] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser, response, error } = useSelector((state) => state.user);
    const address = "Admin";

    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [schoolName, setSchoolName] = useState(currentUser.schoolName);

    const handleSubmit = (event) => {
        event.preventDefault();
        const fields = { name, email, schoolName };
        dispatch(updateUser(fields, currentUser._id, address));
    };

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords don't match");
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        const fields = { password: newPassword };
        dispatch(updateUser(fields, currentUser._id, address));
        setPasswordDialogOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
    };

    const handleDelete = () => {
        dispatch(deleteUser(currentUser._id, address));
        dispatch(authLogout());
        navigate('/');
        setDeleteDialogOpen(false);
    };

    const handleCancelEdit = () => {
        setName(currentUser.name);
        setEmail(currentUser.email);
        setSchoolName(currentUser.schoolName);
        setShowEdit(false);
    };

    const InfoItem = ({ icon, label, value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ color: 'primary.main', mr: 2 }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="subtitle2" color="textSecondary">
                    {label}
                </Typography>
                <Typography variant="body1">
                    {value}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{
                fontWeight: 'bold',
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                color: 'primary.main'
            }}>
                <PersonIcon sx={{ mr: 2, fontSize: '2rem' }} />
                Admin Profile
            </Typography>

            {response && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {response.message || "Profile updated successfully!"}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error.message || "An error occurred. Please try again."}
                </Alert>
            )}

            <Card elevation={3} sx={{ mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                mr: 3,
                                bgcolor: 'primary.main',
                                fontSize: '2rem'
                            }}
                        >
                            {currentUser.name?.charAt(0) || 'A'}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" component="h2" gutterBottom>
                                {currentUser.name}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Administrator
                            </Typography>
                        </Box>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <InfoItem
                                icon={<PersonIcon />}
                                label="Full Name"
                                value={currentUser.name}
                            />
                            <InfoItem
                                icon={<EmailIcon />}
                                label="Email Address"
                                value={currentUser.email}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoItem
                                icon={<SchoolIcon />}
                                label="School Name"
                                value={currentUser.schoolName}
                            />
                            <InfoItem
                                icon={<SecurityIcon />}
                                label="Account Type"
                                value="Administrator"
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            startIcon={showEdit ? <CancelIcon /> : <EditIcon />}
                            onClick={() => setShowEdit(!showEdit)}
                        >
                            {showEdit ? 'Cancel Edit' : 'Edit Profile'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<SecurityIcon />}
                            onClick={() => setPasswordDialogOpen(true)}
                        >
                            Change Password
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            Delete Account
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Collapse in={showEdit}>
                <Card elevation={2}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <EditIcon sx={{ mr: 1 }} />
                            Edit Profile Information
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="School Name"
                                        value={schoolName}
                                        onChange={(e) => setSchoolName(e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="email"
                                        label="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Collapse>

            {/* Change Password Dialog */}
            <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Please enter your current password and your new password.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Current Password"
                        type="password"
                        fullWidth
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handlePasswordChange} variant="contained">
                        Change Password
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete Account
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminProfile;