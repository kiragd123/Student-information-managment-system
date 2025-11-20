import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import {
    BottomNavigation, BottomNavigationAction, Container, Paper,
    Table, TableBody, TableHead, Typography, Box, Card, CardContent,
    Grid, Chip, LinearProgress, Avatar
} from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart'

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import {
    Subject as SubjectIcon,
    School as SchoolIcon,
    EmojiEvents as TrophyIcon,
    Grade as GradeIcon
} from '@mui/icons-material';

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

// Calculate GPA based on marks
const calculateGPA = (subjectMarks) => {
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

const StudentSubjects = () => {
    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id])

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(userDetails.examResult || []);
        }
    }, [userDetails])

    useEffect(() => {
        if (subjectMarks.length === 0) {
            dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
        }
    }, [subjectMarks, dispatch, currentUser.sclassName._id]);

    const renderTableSection = () => {
        return (
            <>
                <Typography variant="h4" align="center" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} paddingTop={4}>
                    <GradeIcon sx={{ mr: 1 }} /> Course Marks
                </Typography>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Course</StyledTableCell>
                            <StyledTableCell align="center">Marks</StyledTableCell>
                            <StyledTableCell align="center">Grade</StyledTableCell>
                            <StyledTableCell>Performance</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {subjectMarks
                            .filter(result => result && result.subName && result.marksObtained !== undefined)
                            .map((result, index) => {
                                const percentage = (result.marksObtained / 100) * 100;
                                const grade = calculateGrade(result.marksObtained);
                                const gradeColor = getGradeColor(grade);
                                let performanceColor = 'error';
                                if (percentage >= 80) performanceColor = 'success';
                                else if (percentage >= 50) performanceColor = 'warning';

                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}>
                                                    {result.subName.subName.charAt(0)}
                                                </Avatar>
                                                {result.subName.subName}
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Typography variant="h6" component="span">
                                                {result.marksObtained}/100
                                            </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Chip
                                                label={grade}
                                                sx={{
                                                    backgroundColor: gradeColor,
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '1rem',
                                                    minWidth: '50px'
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
                                                        sx={{ height: 10, borderRadius: 5 }}
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

                {subjectMarks.length > 0 && (
                    <Card sx={{ mt: 3, backgroundColor: '#f5f5f5' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Academic Summary
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ textAlign: 'center', p: 1 }}>
                                        <Typography variant="h4" color="primary" fontWeight="bold">
                                            {calculateGPA(subjectMarks)}
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
                        </CardContent>
                    </Card>
                )}
            </>
        );
    };
    const renderClassDetailsSection = () => {
        return (
            <Container>
                <Typography variant="h4" align="center" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SchoolIcon sx={{ mr: 1 }} /> Class Details
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                        <SchoolIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6">
                                            Class Information
                                        </Typography>
                                        <Typography variant="h5" color="primary">
                                            {sclassDetails && sclassDetails.sclassName}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                        <SubjectIcon />
                                    </Avatar>
                                    <Typography variant="h6">
                                        Courses ({subjectsList ? subjectsList.length : 0})
                                    </Typography>
                                </Box>
                                {subjectsList && subjectsList.length > 0 ? (
                                    <Box sx={{ maxHeight: '200px', overflow: 'auto' }}>
                                        {subjectsList.map((subject, index) => (
                                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Chip
                                                    label={subject.subCode}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{ mr: 1 }}
                                                />
                                                <Typography variant="body2">
                                                    {subject.subName}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No subjects available
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {subjectMarks && subjectMarks.length === 0 && (
                    <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
                        <TrophyIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            No Marks Available Yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Your marks will appear here once they are published by your teachers.
                        </Typography>
                    </Paper>
                )}
            </Container>
        );
    };

    return (
        <>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Typography variant="h6">Loading your subjects...</Typography>
                </Box>
            ) : (
                <Container>
                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0
                        ?
                        (<>
                            {selectedSection === 'table' && renderTableSection()}                                                    
                        </>)
                        :
                        (<>
                            {renderClassDetailsSection()}
                        </>)
                    }
                </Container>
            )}
        </>
    );
};

export default StudentSubjects;