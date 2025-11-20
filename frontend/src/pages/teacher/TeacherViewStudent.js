import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Collapse,
    Table,
    TableBody,
    TableHead,
    Typography,
    Paper,
    Container,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Chip,
    Divider
} from '@mui/material';
import {
    KeyboardArrowDown,
    KeyboardArrowUp,
    Person,
    Class,
    School,
    Assignment,
    TrendingUp
} from '@mui/icons-material';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { PurpleButton } from '../../components/buttonStyles';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const TeacherViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { currentUser, userDetails, response, loading, error } = useSelector((state) => state.user);

    const address = "Student";
    const studentID = params.id;
    const teachSubject = currentUser.teachSubject?.subName;
    const teachSubjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID]);

    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState('');
    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    useEffect(() => {
        if (userDetails) {
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || '');
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress size={60} thickness={4} sx={{ mb: 2, color: 'purple' }} />
                    <Typography variant="h6" color="textSecondary">
                        Loading student data...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    Error loading student data: {error}
                </Alert>
                <Button variant="contained" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {response ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                    {response}
                </Alert>
            ) : null}

            {userDetails && (
                <>
                    {/* Student Information Card */}
                    <Card sx={{ mb: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                                <Person sx={{ mr: 1, fontSize: '2rem' }} />
                                {userDetails.name}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Assignment sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body1">
                                            <strong>Roll Number:</strong> {userDetails.rollNum}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Class sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body1">
                                            <strong>Class:</strong> {sclassName.sclassName}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <School sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body1">
                                            <strong>School:</strong> {studentSchool.schoolName}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography variant="h6" gutterBottom>
                                            Overall Attendance
                                        </Typography>
                                        <Chip
                                            icon={<TrendingUp />}
                                            label={`${overallAttendancePercentage.toFixed(2)}%`}
                                            color={overallAttendancePercentage >= 75 ? 'success' : overallAttendancePercentage >= 50 ? 'warning' : 'error'}
                                            variant="outlined"
                                            sx={{ fontSize: '1.1rem', p: 2 }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Attendance Section */}
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center' }}>
                        <Assignment sx={{ mr: 1 }} />
                        Attendance
                    </Typography>

                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                        <>
                            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                if (subName === teachSubject) {
                                    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);

                                    return (
                                        <Paper key={index} sx={{ mb: 3, overflow: 'hidden', boxShadow: 2 }}>
                                            <Table>
                                                <TableHead>
                                                    <StyledTableRow>
                                                        <StyledTableCell>Subject</StyledTableCell>
                                                        <StyledTableCell>Present</StyledTableCell>
                                                        <StyledTableCell>Total Sessions</StyledTableCell>
                                                        <StyledTableCell>Attendance Percentage</StyledTableCell>
                                                        <StyledTableCell align="center">Actions</StyledTableCell>
                                                    </StyledTableRow>
                                                </TableHead>

                                                <TableBody>
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ fontWeight: 'bold' }}>{subName}</StyledTableCell>
                                                        <StyledTableCell>{present}</StyledTableCell>
                                                        <StyledTableCell>{sessions}</StyledTableCell>
                                                        <StyledTableCell>
                                                            <Chip
                                                                label={`${subjectAttendancePercentage}%`}
                                                                color={subjectAttendancePercentage >= 75 ? 'success' : subjectAttendancePercentage >= 50 ? 'warning' : 'error'}
                                                                size="small"
                                                            />
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            <Button
                                                                variant="outlined"
                                                                onClick={() => handleOpen(subId)}
                                                                endIcon={openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                                sx={{ borderRadius: 2 }}
                                                            >
                                                                Details
                                                            </Button>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                    <StyledTableRow>
                                                        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                            <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                                <Box sx={{ margin: 1 }}>
                                                                    <Typography variant="h6" gutterBottom component="div">
                                                                        Attendance Details
                                                                    </Typography>
                                                                    <Table size="small" aria-label="purchases">
                                                                        <TableHead>
                                                                            <StyledTableRow>
                                                                                <StyledTableCell>Date</StyledTableCell>
                                                                                <StyledTableCell align="right">Status</StyledTableCell>
                                                                            </StyledTableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {allData.map((data, index) => {
                                                                                const date = new Date(data.date);
                                                                                const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                                return (
                                                                                    <StyledTableRow key={index}>
                                                                                        <StyledTableCell component="th" scope="row">
                                                                                            {dateString}
                                                                                        </StyledTableCell>
                                                                                        <StyledTableCell align="right">
                                                                                            <Chip
                                                                                                label={data.status}
                                                                                                color={data.status === 'Present' ? 'success' : 'error'}
                                                                                                size="small"
                                                                                            />
                                                                                        </StyledTableCell>
                                                                                    </StyledTableRow>
                                                                                );
                                                                            })}
                                                                        </TableBody>
                                                                    </Table>
                                                                </Box>
                                                            </Collapse>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                </TableBody>
                                            </Table>
                                        </Paper>
                                    );
                                }
                                return null;
                            })}

                            <Grid container spacing={3} sx={{ mt: 1, mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2, textAlign: 'center', boxShadow: 2 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Attendance Distribution
                                        </Typography>
                                        <CustomPieChart data={chartData} />
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: 2 }}>
                                        <Typography variant="h6" gutterBottom align="center">
                                            Attendance Summary
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            Overall Attendance Percentage: <strong>{overallAttendancePercentage.toFixed(2)}%</strong>
                                        </Typography>                                       
                                    </Paper>
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <Paper sx={{ p: 3, mb: 4, textAlign: 'center', boxShadow: 2 }}>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                No Attendance Records Found
                            </Typography>
                            <PurpleButton
                                variant="contained"
                                onClick={() => navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)}
                                sx={{ mt: 2 }}
                            >
                                Add First Attendance Record
                            </PurpleButton>
                        </Paper>
                    )}

                    {/* Marks Section */}
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center' }}>
                        <Assignment sx={{ mr: 1 }} />
                        Course Marks
                    </Typography>

                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
                        <>
                            {subjectMarks.map((result, index) => {
                                if (result.subName?.subName === teachSubject) {
                                    return (
                                        <Paper key={index} sx={{ mb: 3, overflow: 'hidden', boxShadow: 2 }}>
                                            <Table>
                                                <TableHead>
                                                    <StyledTableRow>
                                                        <StyledTableCell>Course</StyledTableCell>
                                                        <StyledTableCell>Marks Obtained</StyledTableCell>
                                                    </StyledTableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ fontWeight: 'bold' }}>{result.subName.subName}</StyledTableCell>
                                                        <StyledTableCell>
                                                            <Chip
                                                                label={result.marksObtained}
                                                                color={result.marksObtained >= 75 ? 'success' : result.marksObtained >= 50 ? 'warning' : 'error'}
                                                                variant="outlined"
                                                            />
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                </TableBody>
                                            </Table>
                                        </Paper>
                                    );
                                }
                                return null;
                            })}
                        </>
                    ) : (
                        <Paper sx={{ p: 3, mb: 4, textAlign: 'center', boxShadow: 2 }}>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                No Marks Records Found
                            </Typography>
                        </Paper>
                    )}
                </>
            )}
        </Container>
    );
};

export default TeacherViewStudent;