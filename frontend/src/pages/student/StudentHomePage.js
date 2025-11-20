import React, { useEffect, useState } from 'react'
import {
    Container, Grid, Paper, Typography, Box, Card, CardContent,
    Chip, LinearProgress, Avatar, useTheme, useMediaQuery
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import Subject from "../../assets/subjects.svg";
import Assignment from "../../assets/assignment.svg";
import Attendance from "../../assets/atte.jpg";
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import {
    EmojiEvents as TrophyIcon,
    Subject as SubjectIcon,
    Assignment as AssignmentIcon,
    TrendingUp as TrendIcon,
    School as SchoolIcon,
    Person as PersonIcon
} from '@mui/icons-material';

const StudentHomePage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { userDetails, currentUser, loading, response } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [subjectMarks, setSubjectMarks] = useState([]);

    const classID = currentUser.sclassName._id

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
    }, [dispatch, currentUser._id, classID]);

    const numberOfSubjects = subjectsList && subjectsList.length;

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
            setSubjectMarks(userDetails.examResult || []);
        }
    }, [userDetails])

    // Calculate overall attendance
    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;
    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    // Calculate subject-wise attendance
    const subjectAttendanceData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, sessions }]) => {
        const attendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage,
            present,
            sessions
        };
    });

    // Calculate average marks if available
    const averageMarks = subjectMarks.length > 0
        ? subjectMarks.reduce((sum, result) => sum + (result.marksObtained || 0), 0) / subjectMarks.length
        : 0;

    // Get the best subject based on marks
    const bestSubject = subjectMarks.length > 0
        ? subjectMarks.reduce((best, current) =>
            (current.marksObtained > (best?.marksObtained || 0) ? current : best), {})
        : null;

    const StatCard = ({ icon, title, value, subtitle, color = "primary" }) => (
        <Card
            elevation={3}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                }
            }}
        >
            <Avatar sx={{ bgcolor: `${color}.main`, mb: 2, width: 60, height: 60 }}>
                {icon}
            </Avatar>
            <Typography variant="h4" component="div" color={`${color}.main`} fontWeight="bold">
                <CountUp start={0} end={value} duration={2.5} />
                {title === "Attendance" && "%"}
            </Typography>
            <Typography variant="h6" component="div" gutterBottom>
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>
            )}
        </Card>
    );

    const AttendancePieChart = () => (
        <Card
            elevation={3}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                    Attendance Overview
                </Typography>
            </Box>

            {response ? (
                <Typography variant="body2" color="text.secondary">
                    No Attendance Found
                </Typography>
            ) : loading ? (
                <Typography variant="body2">Loading...</Typography>
            ) : subjectAttendance && subjectAttendance.length > 0 ? (
                <>
                    <CustomPieChart data={chartData} />
                    <Chip
                        label={`${overallAttendancePercentage.toFixed(1)}% Overall`}
                        color={overallAttendancePercentage >= 75 ? "success" : overallAttendancePercentage >= 50 ? "warning" : "error"}
                        sx={{ mt: 2 }}
                    />
                </>
            ) : (
                <Box sx={{ textAlign: 'center' }}>
                    <img src={Attendance} alt="Attendance" style={{ width: 80, opacity: 0.5, marginBottom: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                        No Attendance Records
                    </Typography>
                </Box>
            )}
        </Card>
    );

    const PerformanceSummary = () => (
        <Card elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrophyIcon color="secondary" sx={{ mr: 1 }} /> Performance Summary
            </Typography>

            {subjectMarks.length > 0 ? (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2">Average Marks:</Typography>
                        <Chip label={`${averageMarks.toFixed(1)}/100`} color="primary" variant="outlined" />
                    </Box>

                    {bestSubject && bestSubject.subName && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2">Best Subject:</Typography>
                            <Chip
                                label={`${bestSubject.subName.subName} (${bestSubject.marksObtained})`}
                                color="success"
                                size="small"
                            />
                        </Box>
                    )}

                    <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                        Subject Performance:
                    </Typography>
                    {subjectMarks.slice(0, 3).map((result, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2">{result.subName?.subName}</Typography>
                                <Typography variant="body2" fontWeight="bold">{result.marksObtained}/100</Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={result.marksObtained}
                                color={result.marksObtained >= 80 ? "success" : result.marksObtained >= 50 ? "warning" : "error"}
                                sx={{ height: 6, borderRadius: 3 }}
                            />
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                    <AssignmentIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        No marks available yet
                    </Typography>
                </Box>
            )}
        </Card>
    );

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* Welcome Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <SchoolIcon color="primary" sx={{ mr: 1 }} /> Welcome, {currentUser.name}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here's your academic overview and latest updates.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Stats Cards */}
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<SubjectIcon />}
                            title="Total Courses"
                            value={numberOfSubjects || 0}
                            color="primary"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<AssignmentIcon />}
                            title="Assignments"
                            value={15}
                            subtitle="This month"
                            color="secondary"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<PersonIcon />}
                            title="Attendance"
                            value={Math.round(overallAttendancePercentage)}
                            subtitle="Overall percentage"
                            color="info"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<TrophyIcon />}
                            title="Average Marks"
                            value={Math.round(averageMarks)}
                            color="success"
                        />
                    </Grid>

                    {/* Attendance Chart */}
                    <Grid item xs={12} md={5}>
                        <AttendancePieChart />
                    </Grid>

                    {/* Performance Summary */}
                    <Grid item xs={12} md={4}>
                        <PerformanceSummary />
                    </Grid>

                    {/* Class Info */}
                    <Grid item xs={12} md={3}>
                        <Card elevation={3} sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <SchoolIcon color="action" sx={{ mr: 1 }} /> Class Info
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>Class:</Typography>
                                <Typography variant="body2">{currentUser.sclassName?.sclassName}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>Roll No:</Typography>
                                <Typography variant="body2">{currentUser.rollNum}</Typography>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Recent Subjects:</Typography>
                                {subjectsList && subjectsList.slice(0, 3).map((subject, index) => (
                                    <Chip
                                        key={index}
                                        label={subject.subName}
                                        size="small"
                                        sx={{ m: 0.5 }}
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </Card>
                    </Grid>

                    {/* Notices Section */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <AssignmentIcon color="primary" sx={{ mr: 1 }} /> Notices & Announcements
                            </Typography>
                            <SeeNotice />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default StudentHomePage