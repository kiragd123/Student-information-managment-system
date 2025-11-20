import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    Grid,
    Chip,
    Avatar,
    Divider,
    Skeleton,
    Alert,
    Paper
} from '@mui/material';
import {
    Person as PersonIcon,
    Class as ClassIcon,
    Subject as SubjectIcon,
    ArrowBack as ArrowBackIcon,
    Event as EventIcon,
    Email as EmailIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

    const {departmentID} = useParams();

    useEffect(() => {
        dispatch(getTeacherDetails(departmentID));
    }, [dispatch, departmentID]);

    const handleAddSubject = () => {
        navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error loading teacher details: {error}
                </Alert>
                <Button variant="outlined" onClick={handleGoBack} startIcon={<ArrowBackIcon />}>
                    Go Back
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                sx={{ mb: 3 }}
            >
                Back
            </Button>

            {loading ? (
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Skeleton variant="circular" width={80} height={80} sx={{ mr: 2 }} />
                            <Box>
                                <Skeleton variant="text" width={200} height={40} />
                                <Skeleton variant="text" width={150} height={30} />
                            </Box>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Skeleton variant="rectangular" height={200} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Skeleton variant="rectangular" height={200} />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Typography variant="h4" component="h1" gutterBottom sx={{
                        fontWeight: 'bold',
                        mb: 4,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <PersonIcon sx={{ mr: 1, fontSize: '2rem' }} />
                        Teacher Details
                    </Typography>

                    <Card elevation={3}>
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
                                    {teacherDetails?.name?.charAt(0) || 'T'}
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" component="h2" gutterBottom>
                                        {teacherDetails?.name}
                                    </Typography>
                                    <Chip
                                        label={teacherDetails?.teachSubject ? "Assigned" : "Not Assigned"}
                                        color={teacherDetails?.teachSubject ? "success" : "warning"}
                                        size="small"
                                    />
                                </Box>
                            </Box>

                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <PersonIcon sx={{ mr: 1 }} />
                                            Personal Information
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />

                                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                            <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                {teacherDetails?.email || 'No email provided'}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                {teacherDetails?.phone || 'No phone number provided'}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <ClassIcon sx={{ mr: 1 }} />
                                            Class Information
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />

                                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                            <ClassIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                {teacherDetails?.teachSclass?.sclassName || 'No class assigned'}
                                            </Typography>
                                        </Box>

                                        {teacherDetails?.teachSubject ? (
                                            <>
                                                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                                    <SubjectIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body1">
                                                        Course: {teacherDetails.teachSubject.subName}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body1">
                                                        Sessions: {teacherDetails.teachSubject.sessions}
                                                    </Typography>
                                                </Box>
                                            </>
                                        ) : (
                                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    This teacher doesn't have a subject assigned yet.
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleAddSubject}
                                                    startIcon={<SubjectIcon />}
                                                    sx={{ mt: 1 }}
                                                >
                                                    Assign Course
                                                </Button>
                                            </Box>
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>
                          
                        </CardContent>
                    </Card>
                </>
            )}
        </Container>
    );
};

export default TeacherDetails;