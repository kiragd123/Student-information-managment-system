import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import {
    getClassDetails,
    getClassStudents,
    getSubjectList,
} from "../../../redux/sclassRelated/sclassHandle";
import {
    Box, Container, Typography, Tab, IconButton,
    Card, CardContent, Grid, Chip, CircularProgress,
    Alert, Stack
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import SubjectIcon from '@mui/icons-material/Subject';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";


const ClassDetails = () => {
    const API = 'http://localhost:5000'
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectsList=[], sclassStudents=[],  sclassDetails={}, loading, error, response, getresponse } = useSelector((state) => state.sclass);
    const { teachersList, loading: teachersLoading, error: teachersError, response: teachersResponse } = useSelector((state) => state.teacher);
    console.log(sclassStudents);
    console.log(teachersList);

    const classID = params.id;
    

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
        dispatch(getClassStudents(classID));
        dispatch(getAllTeachers(classID));
        //dispatch(getClassDetails(classID, "Sclass"));
    }, [dispatch, classID]);

    const [value, setValue] = useState('1');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const deleteHandler = async (deleteID, address) => {
        console.log(address);
        console.log(deleteID);

        let url = "";
        if (address === "Course") {
            url = `${API}/Subject/${deleteID}`;
            console.log('url', url);
        } else if (address === "Subjects") {
            url = `${API}/Subjects/${deleteID}`;
        } else if (address === "SubjectsClass") {
            url = `${API}/SubjectsClass/${deleteID}`;
        } else if (address === "Sclass") {
            url = `${API}/Sclass/${deleteID}`;
        } else if (address === "Sclasses") {
            url = `${API}/Sclasses/${deleteID}`;
        } else if (address === "Teacher") {
            url = `${API}/Teacher/${deleteID}`;
        } else if (address === "TeachersClass") {
            url = `${API}/TeachersClass/${deleteID}`;
        } else if (address === "Teachers") {
            url = `${API}/Teachers/${deleteID}`;
        } else if (address === "student") {
            url = `${API}/Student/${deleteID}`;
        } else if (address === "StudentsClass") {
            url = `${API}/StudentsClass/${deleteID}`;
        } else if (address === "Students") {
            url = `${API}/Students/${deleteID}`;
        }

        try {
            await axios.delete(url);

            if (
                address === "Course" ||
                address === "Subjects" ||
                address === "SubjectsClass"
            ) {
                dispatch(getSubjectList(classID, "ClassSubjects"));
            } else if (
                address === "student" ||
                address === "Students" ||
                address === "StudentsClass"
            ) {
                dispatch(getClassStudents(classID));
            } else if (
                address === "Teacher" ||
                address === "Teachers" ||
                address === "TeachersClass"
            ) {
                dispatch(getAllTeachers(classID));
            } else if (address === "Sclass" || address === "Sclasses") {
                dispatch(getClassDetails(classID, "Sclass"));
            }
        } catch (err) {
            console.log(err);
            setMessage("Sorry the delete function has been disabled for now.");
            setShowPopup(true);
        }
    };

    const subjectColumns = [
        { id: 'name', label: 'Course Name', minWidth: 170 },
        { id: 'code', label: 'Course Code', minWidth: 100 },
    ];

    const subjectRows = subjectsList && subjectsList.length > 0 && subjectsList.map((subject) => {
        return {
            name: subject.subName,
            code: subject.subCode,
            id: subject._id,
        };
    });

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <Stack direction="row" spacing={1} alignItems={'center'}>
                <IconButton
                    onClick={() => deleteHandler(row.id, "Course")}
                    size="small"
                    title="Delete Course"
                >
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/Admin/class/subject/${classID}/${row.id}`)}
                    startIcon={<VisibilityIcon />}
                >
                    View
                </BlueButton>
            </Stack>
        );
    }

    const ClassSubjectsSection = () => {
        return (
            
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h4" gutterBottom>
                                Courses
                            </Typography>
                            <Chip
                                label={`${subjectsList?.length || 0} Courses`}
                                color="primary"
                                variant="outlined"
                                icon={<SubjectIcon />}
                            />
                        </Box>

                        {subjectsList && subjectsList.length > 0 ? (
                            <>
                                <TableTemplate
                                    buttonHaver={SubjectsButtonHaver}
                                    columns={subjectColumns}
                                    rows={subjectRows}
                                />                                
                            </>
                        ) : (
                            <Card sx={{ textAlign: 'center', p: 4, mt: 2 }}>
                                <SubjectIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    No Course Found
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    This class doesn't have any courses yet. Add courses to get started.
                                </Typography>                            
                            </Card>
                        )}
                    </>
                
            
        );
    };

    const studentColumns = [
        { id: 'name', label: 'Student Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ];

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    });

    const StudentsButtonHaver = ({ row }) => {
        return (
            <Stack direction="row" spacing={2}>
                <IconButton
                    onClick={() => deleteHandler(row.id, "Student")}
                    size="small"
                    title="Remove Student"
                >
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    size="small"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                    startIcon={<VisibilityIcon />}
                >
                    Profile
                </BlueButton>
                <PurpleButton
                    variant="contained"
                    size="small"
                    onClick={() => navigate("/Admin/students/student/attendance/" + row.id)}
                    startIcon={<AssignmentIcon />}
                >
                    Attendance
                </PurpleButton>
            </Stack>
        );
    };

    const ClassStudentsSection = () => {
        return (
            
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h4" gutterBottom>
                                Students
                            </Typography>
                            <Chip
                                label={`${sclassStudents.length} Students`}
                                color="secondary"
                                variant="outlined"
                                icon={<GroupsIcon />}
                            />
                        </Box>

                        {sclassStudents.length > 0 ? (
                            <>
                                <TableTemplate
                                    buttonHaver={StudentsButtonHaver}
                                    columns={studentColumns}
                                    rows={studentRows}
                                />
                            </>
                        ) : (
                            <Card sx={{ textAlign: 'center', p: 4, mt: 2 }}>
                                <GroupsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    No Students Enrolled
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    This class doesn't have any students yet. Add students to get started.
                                </Typography>
                                
                            </Card>
                        )}
                    </>
            
        );
    };

    const teacherColumns = [
        { id: 'name', label: 'Teacher Name', minWidth: 170 },
        { id: 'subject', label: 'Subject', minWidth: 100 },
    ];

    const teacherRows = teachersList?.map((teacher) => ({
        name: teacher.name,
        subject: teacher.teachSubject?.subName || 'Not assigned',
        id: teacher._id,
    })) || [];
    console.log(teacherRows);
    const TeachersButtonHaver = ({ row }) => {
        return (
            <Stack direction="row" spacing={2}>
                <IconButton
                    onClick={() => deleteHandler(row.id, "Teacher")}
                    size="small"
                    title="Remove Teacher"
                >
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    size="small"
                    onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}
                    startIcon={<VisibilityIcon />}
                >
                    Profile
                </BlueButton>
            </Stack>
        );
    };

    const ClassTeachersSection = () => {
        return (
            <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Teachers
                    </Typography>
                    <Chip
                        label={`${teachersList.length} Teachers`}
                        color="primary"
                        variant="outlined"
                        icon={<PersonIcon />}
                    />
                </Box>

                {teachersList.length > 0 ? (
                    <>
                        <TableTemplate
                            buttonHaver={TeachersButtonHaver}
                            columns={teacherColumns}
                            rows={teacherRows}
                        />
                    </>
                ) : (
                    <Card sx={{ textAlign: 'center', p: 4, mt: 2 }}>
                        <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            No Teachers Assigned
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            This class doesn't have any teachers yet. Add teachers to get started.
                        </Typography>
                        
                    </Card>
                )}
            </>
        );
    };

    const ClassDetailsSection = () => {
        const numberOfSubjects = subjectsList?.length || 0;
        const numberOfStudents = sclassStudents.length;
        const numberOfTeachers = teachersList.length || 0;
        console.log(numberOfTeachers)

        return (
            <>
                <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                    Class Details
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                            <ClassIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                {sclassDetails?.sclassName || 'Class Name'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Class Information
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <SubjectIcon color="primary" sx={{ mr: 2, fontSize: 30 }} />
                                <Box>
                                    <Typography variant="h6" color="text.secondary">
                                        Courses
                                    </Typography>
                                    <Typography variant="h4" color="primary">
                                        {numberOfSubjects}
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <GroupsIcon color="secondary" sx={{ mr: 2, fontSize: 30 }} />
                                <Box>
                                    <Typography variant="h6" color="text.secondary">
                                        Students
                                    </Typography>
                                    <Typography variant="h4" color="secondary">
                                        {numberOfStudents}
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PersonIcon color="primary" sx={{ mr: 2, fontSize: 30 }} />
                                <Box>
                                    <Typography variant="h6" color="text.secondary">
                                        Teachers
                                    </Typography>
                                    <Typography variant="h4" color="primary">
                                        {numberOfTeachers}
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>

                
            </>
        );
    };

    return (
        <>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        position: 'sticky',
                        top: 64,
                        zIndex: 10,
                        boxShadow: 1
                    }}>
                        <Container maxWidth="lg">
                            <TabList
                                onChange={handleChange}
                                aria-label="class details tabs"
                                variant="scrollable"
                                scrollButtons="auto"
                            >
                                <Tab icon={<ClassIcon />} iconPosition="start" label="Overview" value="1" />
                                <Tab icon={<SubjectIcon />} iconPosition="start" label={`Courses (${subjectsList?.length || 0})`} value="2" />
                                <Tab icon={<GroupsIcon />} iconPosition="start" label={`Students (${sclassStudents.length})`} value="3" />
                                <Tab icon={<PersonIcon />} iconPosition="start" label={`Teachers (${teachersList.length})`} value="4" />
                            </TabList>
                        </Container>
                    </Box>
                    <Container maxWidth="lg" sx={{ py: 4 }}>
                        <TabPanel value="1">
                            <ClassDetailsSection />
                        </TabPanel>
                        <TabPanel value="2">
                            <ClassSubjectsSection />
                        </TabPanel>
                        <TabPanel value="3">
                            <ClassStudentsSection />
                        </TabPanel>
                        <TabPanel value="4">
                            <ClassTeachersSection />
                        </TabPanel>
                    </Container>
                </TabContext>
            </Box>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ClassDetails;