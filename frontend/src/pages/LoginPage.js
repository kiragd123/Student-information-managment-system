import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress, Backdrop, DialogTitle } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff,Email } from '@mui/icons-material'

import {DialogContent,DialogActions,Alert,Dialog}from '@mui/material';
import bgpic from "../assets/designlogin.jpg"
import { LightPurpleButton } from '../components/buttonStyles';
import styled from 'styled-components';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
import ForgotPass from './forgotPass';
import axios from 'axios';

const defaultTheme = createTheme();

const LoginPage = ({ role }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);
    console.log("Current Role:", currentRole, "Current User:", currentUser, "Status:", status);

    const [toggle, setToggle] = useState(false)
    const [guestLoader, setGuestLoader] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [rollNumberError, setRollNumberError] = useState(false);
    const [studentNameError, setStudentNameError] = useState(false);

    // Forgot Password State
    const [forgotOpen, setForgotOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotEmailError, setForgotEmailError] = useState(false);
    const [forgotLoader, setForgotLoader] = useState(false);
    const [forgotSuccess, setForgotSuccess] = useState(false);
    const [forgotError, setForgotError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);


    const handleSubmit = (event) => {
        event.preventDefault();

        if (role === "Student") {
            const rollNum = event.target.rollNumber.value;
            const studentName = event.target.studentName.value;
            const password = event.target.password.value;

            if (!rollNum || !studentName || !password) {
                if (!rollNum) setRollNumberError(true);
                if (!studentName) setStudentNameError(true);
                if (!password) setPasswordError(true);
                return;
            }
            const fields = { rollNum, studentName, password, rememberMe }
            setLoader(true)
            dispatch(loginUser(fields, role))
        }

        else {
            const email = event.target.email.value;
            const password = event.target.password.value;

            if (!email || !password) {
                if (!email) setEmailError(true);
                if (!password) setPasswordError(true);
                return;
            }

            const fields = { email, password }
            setLoader(true)
            dispatch(loginUser(fields, role))
        }
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'rollNumber') setRollNumberError(false);
        if (name === 'studentName') setStudentNameError(false);
    };

    const handleForgotPassword = async () => {
        if (!forgotEmail) {
            setForgotEmailError(true);
            return;
        }

        if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
            setMessage("Please enter a valid email address");
            setShowPopup(true);
            return;
        }
        setForgotLoader(true);
        setForgotError('');


        try {
            const API = 'http://localhost:5000';
            const response = await axios.post(`${API}/forgot-password`, {
                email: forgotEmail
            });

            if (response.status === 200) {
                setForgotSuccess(true);
                setMessage('Password reset link sent to your email!');

                // Auto-close after success
                setTimeout(() => {
                    setForgotOpen(false);
                    setForgotSuccess(false);
                    setForgotEmail('');
                }, 3000);
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            if (error.response && error.response.data) {
                setForgotError(error.response.data.message || 'Failed to send reset link');
            } else {
                setForgotError('Network error. Please try again.');
            }
        } finally {
            setForgotLoader(false);
        }
    };

    const handleCloseForgot = () => {
        setForgotOpen(false);
        setForgotEmail('');
        setForgotEmailError(false);
        setForgotSuccess(false);
    };

    useEffect(() => {
        if (status === 'success' || currentUser !== null) {
            if (currentRole === 'Admin') {
                navigate('/Admin/dashboard');
            }
            else if (currentRole === 'Student') {
                navigate('/Student/dashboard');
            } else if (currentRole === 'Teacher') {
                navigate('/Teacher/dashboard');
            } 
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
            setGuestLoader(false)
        }
    }, [status, currentRole, navigate, error, response, currentUser]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
                            {role} Login
                        </Typography>
                        <Typography variant="h7">
                            Welcome back! Please enter your details
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            {role === "Student" ? (
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="rollNumber"
                                        label="Enter your Roll Number"
                                        name="rollNumber"
                                        autoComplete="off"
                                        type="number"
                                        autoFocus
                                        error={rollNumberError}
                                        helperText={rollNumberError && 'Roll Number is required'}
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="studentName"
                                        label="Enter your name"
                                        name="studentName"
                                        autoComplete="name"
                                        autoFocus
                                        error={studentNameError}
                                        helperText={studentNameError && 'Name is required'}
                                        onChange={handleInputChange}
                                    />
                                </>
                            ) : (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Enter your email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    error={emailError}
                                    helperText={emailError && 'Email is required'}
                                    onChange={handleInputChange}
                                />
                            )}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={toggle ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                error={passwordError}
                                helperText={passwordError && 'Password is required'}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)}>
                                                {toggle ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormControlLabel
                                    control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
                                    label="Remember me"
                                />
                                <StyledLink onClick={() => setForgotOpen(true)} style={{ cursor: "pointer" }}>
                                    Forgot password?
                                </StyledLink>

                            </Grid>
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                            >
                                {loader ?
                                    <CircularProgress size={24} color="inherit" />
                                    : "Login"}
                            </LightPurpleButton>               
                            {role === "Admin" &&
                                <Grid container sx={{marginTop:5}}>
                                    <Grid>
                                        Don't have an account?
                                    </Grid>
                                    <Grid item sx={{ ml: 2 }}>
                                        <StyledLink to="/Adminregister">
                                            Sign up
                                        </StyledLink>
                                    </Grid>
                                </Grid>
                            }
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={guestLoader}
            >
                <CircularProgress color="primary" />
                Please Wait
            </Backdrop>
            {/* Forgot Password Dialog */}
            <Dialog
                open={forgotOpen}
                onClose={handleCloseForgot}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f8f5ff',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c2143' }}>
                        Reset Password
                    </Typography>
                    <IconButton onClick={handleCloseForgot} size="small"/>
                </DialogTitle>

                <DialogContent sx={{ mt: 2 }}>
                    {forgotSuccess ? (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                Password reset instructions sent!
                            </Typography>
                            <Typography variant="body2">
                                Check your email for further instructions.
                            </Typography>
                        </Alert>
                    ) : (
                        <>
                            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                                Enter your email address and we'll send you instructions to reset your password.
                            </Typography>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => {
                                    setForgotEmail(e.target.value);
                                    setForgotEmailError(false);
                                }}
                                error={forgotEmailError}
                                helperText={forgotEmailError && 'Email is required'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />
                        </>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    {!forgotSuccess && (
                        <>
                            <Button onClick={handleCloseForgot} color="inherit">
                                Cancel
                            </Button>
                            <lightPurpleButton
                                onClick={handleForgotPassword}
                                variant="contained"
                                disabled={forgotLoader}
                                sx={{ minWidth: 120 }}
                            >
                                {forgotLoader ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
                            </lightPurpleButton>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={guestLoader}
            >
                <CircularProgress color="primary" />
                <Typography sx={{ ml: 2 }}>Please Wait</Typography>
            </Backdrop>

            {/* Popup for errors */}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );

}

export default LoginPage

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
`;
