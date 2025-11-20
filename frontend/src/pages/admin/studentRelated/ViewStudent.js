import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import {
    Box, Button, Collapse, IconButton, Table, TableBody, TableHead,
    Typography, Tab, Paper, BottomNavigation, BottomNavigationAction,
    Container, Card, CardContent, Grid, TextField, Avatar,
    LinearProgress, Chip, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, MenuItem, Select, InputLabel,
    FormControl, Tooltip, Fab, Zoom
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
    KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon,
    Edit, Save, Cancel, Add, Visibility, VisibilityOff,
    BarChart, PieChart, TableChart, Person, Assessment, Grade
} from '@mui/icons-material';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart'
import CustomPieChart from '../../../components/CustomPieChart'
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

import Popup from '../../../components/Popup';

// Grade calculation function
const calculateGrade = (marks) => {
    if (marks >= 97) return 'A+';
    if (marks >= 93) return 'A';
    if (marks >= 90) return 'A-';
    if (marks >= 87) return 'B+';
    if (marks >= 83) return 'B';
    if (marks >= 80) return 'B-';
    if (marks >= 77) return 'C+';
    if (marks >= 73) return 'C';
    if (marks >= 70) return 'C-';
    if (marks >= 67) return 'D+';
    if (marks >= 63) return 'D';
    if (marks >= 60) return 'D-';
    return 'F';
};

// Grade color mapping
const getGradeColor = (grade) => {
    switch (grade) {
        case 'A+': return '#4caf50';
        case 'A': return '#4caf50';
        case 'A-': return '#4caf50';
        case 'B+': return '#8bc34a';
        case 'B': return '#cddc39';
        case 'B-': return '#cddc39';
        case 'C+': return '#ffeb3b';
        case 'C': return '#ffc107';
        case 'C-': return '#ff9800';
        case 'D+': return '#ff9800';
        case 'D': return '#ff5722';
        case 'D-': return '#ff5722';
        case 'F': return '#f44336';
        default: return '#9e9e9e';
    }
};

const ViewStudent = () => {
    const [showTab, setShowTab] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()
    const { userDetails, response, loading, error } = useSelector((state) => state.user);

    const studentID = params.id
    const address = "Student"

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID])

    useEffect(() => {
        if (userDetails && userDetails.sclassName && userDetails.sclassName._id !== undefined) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState('');
    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const [openStates, setOpenStates] = useState({});

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [selectedSection, setSelectedSection] = useState('table');
    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const fields = password === ""
        ? { name, rollNum }
        : { name, rollNum, password }

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setRollNum(userDetails.rollNum || '');
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || '');
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const submitHandler = (event) => {
        event.preventDefault()
        dispatch(updateUser(fields, studentID, address))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
                setEditMode(false);
                setPassword('');
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const cancelEdit = () => {
        setName(userDetails.name || '');
        setRollNum(userDetails.rollNum || '');
        setPassword('');
        setEditMode(false);
    }

    const deleteHandler = () => {
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)
        setDeleteDialogOpen(false);
    }

    const openDeleteDialog = () => {
        setDeleteDialogOpen(true);
    }

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
    }

    const removeHandler = (id, deladdress) => {
        dispatch(removeStuff(id, deladdress))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
    }

    const removeSubAttendance = (subId) => {
        dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten"))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
    }

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    // Calculate GPA based on marks
    const calculateGPA = () => {
        if (!subjectMarks || subjectMarks.length === 0) return 0;

        let totalPoints = 0;
        let totalSubjects = 0;

        subjectMarks.forEach(result => {
            if (result.marksObtained) {
                const marks = result.marksObtained;
                if (marks >= 97) totalPoints += 4.0;
                else if (marks >= 93) totalPoints += 4.0;
                else if (marks >= 90) totalPoints += 3.7;
                else if (marks >= 87) totalPoints += 3.3;
                else if (marks >= 83) totalPoints += 3.0;
                else if (marks >= 80) totalPoints += 2.7;
                else if (marks >= 77) totalPoints += 2.3;
                else if (marks >= 73) totalPoints += 2.0;
                else if (marks >= 70) totalPoints += 1.7;
                else if (marks >= 67) totalPoints += 1.3;
                else if (marks >= 63) totalPoints += 1.0;
                else if (marks >= 60) totalPoints += 0.7;
                else totalPoints += 0.0;

                totalSubjects++;
            }
        });

        return totalSubjects > 0 ? (totalPoints / totalSubjects).toFixed(2) : 0;
    };

    const StudentAttendanceSection = () => {
        const renderTableSection = () => {
            return (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Assessment sx={{ mr: 1 }} /> Attendance Details
                    </Typography>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Present</StyledTableCell>
                                <StyledTableCell>Total Sessions</StyledTableCell>
                                <StyledTableCell>Attendance Percentage</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                            const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                            return (
                                <TableBody key={index}>
                                    <StyledTableRow>
                                        <StyledTableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
                                                    {subName.charAt(0)}
                                                </Avatar>
                                                {subName}
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell>{present}</StyledTableCell>
                                        <StyledTableCell>{sessions}</StyledTableCell>
                                        <StyledTableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ width: '100%', mr: 1 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={Number(subjectAttendancePercentage)}
                                                        color={
                                                            subjectAttendancePercentage >= 75 ? 'success' :
                                                                subjectAttendancePercentage >= 50 ? 'warning' : 'error'
                                                        }
                                                    />
                                                </Box>
                                                <Box sx={{ minWidth: 35 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {`${Math.round(subjectAttendancePercentage)}%`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Tooltip title="View details">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleOpen(subId)}
                                                    size="small"
                                                >
                                                    {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete attendance">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => removeSubAttendance(subId)}
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                            
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1 }}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Attendance Details for {subName}
                                                    </Typography>
                                                    <Table size="small" aria-label="attendance-details">
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
                                                                )
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            )
                        }
                        )}
                    </Table>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Overall Attendance: {overallAttendancePercentage.toFixed(2)}%
                        </Typography>
                        <Box>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => removeHandler(studentID, "RemoveStudentAtten")}
                                sx={{ mr: 1 }}
                            >
                                Delete All
                            </Button>                        
                        </Box>
                    </Box>
                </Box>
            )
        }

        const renderChartSection = () => {
            return (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <BarChart sx={{ mr: 1 }} /> Attendance Overview
                    </Typography>
                    <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                </Box>
            )
        }

        return (
            <>
                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }} elevation={3}>
                            
                        </Paper>
                    </>
                    :
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            No attendance records found
                        </Typography>               
                    </Box>
                }
            </>
        )
    }

    const StudentMarksSection = () => {
        const renderTableSection = () => {
            return (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Grade sx={{ mr: 1 }} /> Subject Marks
                    </Typography>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell align="right">Marks Obtained</StyledTableCell>
                                <StyledTableCell>Grade</StyledTableCell>
                                <StyledTableCell>Performance</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {subjectMarks.map((result, index) => {
                                if (!result.subName || !result.marksObtained) {
                                    return null;
                                }

                                const percentage = (result.marksObtained / 100) * 100;
                                const grade = calculateGrade(result.marksObtained);
                                const gradeColor = getGradeColor(grade);
                                let performanceColor = 'error';
                                if (percentage >= 80) performanceColor = 'success';
                                else if (percentage >= 50) performanceColor = 'warning';

                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell component="th" scope="row">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'secondary.main', fontSize: '0.8rem' }}>
                                                    {result.subName.subName.charAt(0)}
                                                </Avatar>
                                                {result.subName.subName}
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{result.marksObtained}/100</StyledTableCell>
                                        <StyledTableCell>
                                            <Chip
                                                label={grade}
                                                sx={{
                                                    backgroundColor: gradeColor,
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    minWidth: '45px'
                                                }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ width: '100%', mr: 1 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={percentage}
                                                        color={performanceColor}
                                                    />
                                                </Box>
                                                <Box sx={{ minWidth: 35 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {`${Math.round(percentage)}%`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {subjectMarks && subjectMarks.length > 0 && (
                        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Academic Summary
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ textAlign: 'center', p: 1 }}>
                                        <Typography variant="h4" color="primary" fontWeight="bold">
                                            {calculateGPA()}
                                        </Typography>
                                        <Typography variant="body2">GPA Score</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={9}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                        <Typography variant="body2" sx={{ mr: 1 }}>Grade Legend:</Typography>
                                        {['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'].map(grade => (
                                            <Chip
                                                key={grade}
                                                label={grade}
                                                size="small"
                                                sx={{
                                                    backgroundColor: getGradeColor(grade),
                                                    color: 'white',
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}                
                </Box>
            )
        }

        const renderChartSection = () => {
            // Prepare data for chart with grades
            const chartData = subjectMarks.map(result => {
                if (!result.subName || !result.marksObtained) return null;
                return {
                    subject: result.subName.subName,
                    marks: result.marksObtained,
                    grade: calculateGrade(result.marksObtained)
                };
            }).filter(item => item !== null);

            return (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <BarChart sx={{ mr: 1 }} /> Marks Overview
                    </Typography>
                    <CustomBarChart
                        chartData={chartData}
                        dataKey="marks"
                        showGrade={true}
                        gradeCalculator={calculateGrade}
                        gradeColorGetter={getGradeColor}
                    />

                    {subjectMarks && subjectMarks.length > 0 && (
                        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Academic Summary
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ textAlign: 'center', p: 1 }}>
                                        <Typography variant="h4" color="primary" fontWeight="bold">
                                            {calculateGPA()}
                                        </Typography>
                                        <Typography variant="body2">GPA Score</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={9}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                        <Typography variant="body2" sx={{ mr: 1 }}>Grade Legend:</Typography>
                                        {['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'].map(grade => (
                                            <Chip
                                                key={grade}
                                                label={grade}
                                                size="small"
                                                sx={{
                                                    backgroundColor: getGradeColor(grade),
                                                    color: 'white',
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Box>
            )
        }

        return (
            <>
                {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}                  

                    </>
                    :
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            No marks records found
                        </Typography>
                        
                    </Box>
                }
            </>
        )
    }

    const StudentDetailsSection = () => {
        return (
            <Box>
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h4" component="h1">
                                Student Details
                            </Typography>
                            <Box>
                                {!editMode ? (
                                    <Tooltip title="Edit student details">
                                        <IconButton color="primary" onClick={() => setEditMode(true)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                    <>
                                        <Tooltip title="Save changes">
                                            <IconButton color="success" onClick={submitHandler}>
                                                <Save />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Cancel editing">
                                            <IconButton color="error" onClick={cancelEdit}>
                                                <Cancel />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )}
                            </Box>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={!editMode}
                                    variant={editMode ? "outlined" : "filled"}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Roll Number"
                                    value={rollNum}
                                    onChange={(e) => setRollNum(e.target.value)}
                                    disabled={!editMode}
                                    variant={editMode ? "outlined" : "filled"}
                                />
                            </Grid>
                            {editMode && (
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            ),
                                        }}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Class"
                                    value={sclassName.sclassName || ''}
                                    disabled
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="School"
                                    value={studentSchool.schoolName || ''}
                                    disabled
                                    variant="filled"
                                />
                            </Grid>
                        </Grid>

                        {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Overall Attendance
                                </Typography>
                                <CustomPieChart data={chartData} />
                                <Box sx={{ textAlign: 'center', mt: 1 }}>
                                    <Chip
                                        label={`${overallAttendancePercentage.toFixed(2)}% Attendance`}
                                        color={
                                            overallAttendancePercentage >= 75 ? 'success' :
                                                overallAttendancePercentage >= 50 ? 'warning' : 'error'
                                        }
                                    />
                                </Box>
                            </Box>
                        )}

                        {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Academic Performance
                                </Typography>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Chip
                                        label={`GPA: ${calculateGPA()}`}
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontSize: '1.1rem', p: 2 }}
                                    />
                                </Box>
                            </Box>
                        )}

                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={openDeleteDialog}
                            >
                                Delete Student
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        )
    }

    return (
        <>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Typography variant="h6">Loading student data...</Typography>
                </Box>
            ) : (
                <Box sx={{ width: '100%', typography: 'body1' }} >
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                            <TabList
                                onChange={handleChange}
                                sx={{
                                    position: 'sticky',
                                    top: 64,
                                    bgcolor: 'background.paper',
                                    zIndex: 10,
                                    '& .MuiTab-root': { fontWeight: 'bold' }
                                }}
                                centered
                            >
                                <Tab icon={<Person />} label="Details" value="1" />
                                <Tab icon={<Assessment />} label="Attendance" value="2" />
                                <Tab icon={<Grade />} label="Marks" value="3" />
                            </TabList>
                        </Box>
                        <Container sx={{ marginTop: "2rem", marginBottom: "4rem" }}>
                            <TabPanel value="1">
                                <StudentDetailsSection />
                            </TabPanel>
                            <TabPanel value="2">
                                <StudentAttendanceSection />
                            </TabPanel>
                            <TabPanel value="3">
                                <StudentMarksSection />
                            </TabPanel>
                        </Container>
                    </TabContext>
                </Box>
            )}

            <Fab
                color="primary"
                aria-label="edit"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={() => setEditMode(!editMode)}
            >
                <Zoom in={true}>
                    {editMode ? <Save /> : <Edit />}
                </Zoom>
            </Fab>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Student?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this student? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog}>Cancel</Button>
                    <Button onClick={deleteHandler} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ViewStudent

const styles = {
    attendanceButton: {
        marginLeft: "20px",
        backgroundColor: "#270843",
        "&:hover": {
            backgroundColor: "#3f1068",
        }
    },
    styledButton: {
        margin: "20px",
        backgroundColor: "#02250b",
        "&:hover": {
            backgroundColor: "#106312",
        }
    }
}