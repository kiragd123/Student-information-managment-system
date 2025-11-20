import React, { useEffect, useState } from 'react'
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Tab, Container, Typography, BottomNavigation,
  BottomNavigationAction, Paper, Card, CardContent, Grid,
  Avatar, Divider, Chip, Skeleton, Alert, IconButton
} from '@mui/material';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import SubjectIcon from '@mui/icons-material/Subject';
import ClassIcon from '@mui/icons-material/Class';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import CodeIcon from '@mui/icons-material/Code';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradingIcon from '@mui/icons-material/Grading';

const ViewSubject = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

  const { classID, subjectID } = params

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  const [value, setValue] = useState('1');
  const [selectedSection, setSelectedSection] = useState('attendance');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const studentColumns = [
    { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'actions', label: 'Actions', minWidth: 250, align: 'center' },
  ]

  const studentRows = sclassStudents.map((student) => {
    return {
      rollNum: student.rollNum,
      name: student.name,
      id: student._id,
    };
  })

  const StudentsAttendanceButtonHaver = ({ row }) => {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <BlueButton
          variant="contained"
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton
          variant="contained"
          size="small"
          startIcon={<AssignmentIcon />}
          onClick={() => navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)}
        >
          Attendance
        </PurpleButton>
      </Box>
    );
  };

  const StudentsMarksButtonHaver = ({ row }) => {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <BlueButton
          variant="contained"
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton
          variant="contained"
          size="small"
          startIcon={<GradingIcon />}
          onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}
        >
          Marks
        </PurpleButton>
      </Box>
    );
  };

  const DetailItem = ({ icon, label, value, action }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, mr: 2 }}>
        {icon}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
        <Typography variant="h6">
          {value || 'Not assigned'}
        </Typography>
      </Box>
      {action && (
        <Box>
          {action}
        </Box>
      )}
    </Box>
  );

  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;

    if (!subjectDetails) {
      return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" color="error">
            Subject details not available.
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            color: 'primary.main'
          }}
        >
          <SubjectIcon sx={{ mr: 1, fontSize: '2.2rem' }} />
          Course Details
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <SubjectIcon sx={{ mr: 1 }} />
                  Course Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <DetailItem
                  icon={<SubjectIcon />}
                  label="Course Name"
                  value={subjectDetails.subName}
                />

                <DetailItem
                  icon={<CodeIcon />}
                  label="Course Code"
                  value={subjectDetails.subCode}
                />

                <DetailItem
                  icon={<ScheduleIcon />}
                  label="Course Sessions"
                  value={subjectDetails.sessions}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <ClassIcon sx={{ mr: 1 }} />
                  Class & Teacher Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <DetailItem
                  icon={<ClassIcon />}
                  label="Class Name"
                  value={subjectDetails.sclassName?.sclassName}
                />

                <DetailItem
                  icon={<GroupIcon />}
                  label="Number of Students"
                  value={numberOfStudents}
                />

                <DetailItem
                  icon={<PersonIcon />}
                  label="Teacher Name"
                  value={subjectDetails.teacher?.name}
                  
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Paper>
    );
  };

  const SubjectStudentsSection = () => {
    return (
      <>
        {getresponse ? (
          <>
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '16px',
              marginBottom: '16px'
            }}>
              <GreenButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
              >
                Add Students
              </GreenButton>
            </Box>
            <Box sx={{
              textAlign: 'center',
              py: 8,
              backgroundColor: 'grey.50',
              borderRadius: 2
            }}>
              <GroupIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No students in this class
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Add students to get started with attendance and marks
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupIcon sx={{ mr: 1 }} />
                Students List
              </Typography>
              <Chip
                label={`${sclassStudents.length} students`}
                color="primary"
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Box>

            {selectedSection === 'attendance' &&
              <TableTemplate
                buttonHaver={StudentsAttendanceButtonHaver}
                columns={studentColumns}
                rows={studentRows}
              />
            }
            {selectedSection === 'marks' &&
              <TableTemplate
                buttonHaver={StudentsMarksButtonHaver}
                columns={studentColumns}
                rows={studentRows}
              />
            }

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
              <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                <BottomNavigationAction
                  label="Attendance"
                  value="attendance"
                  icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                />
                <BottomNavigationAction
                  label="Marks"
                  value="marks"
                  icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                />
              </BottomNavigation>
            </Paper>
          </>
        )}
      </>
    )
  }

  return (
    <>
      {subloading ? (
        <Container>
          <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
          </Grid>
        </Container>
      ) : (
        <>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Error: {error}
            </Alert>
          )}

          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <TabList
                  onChange={handleChange}
                  sx={{
                    position: 'sticky',
                    top: 0,
                    width: '100%',
                    bgcolor: 'background.paper',
                    zIndex: 1100,
                    pt: 1
                  }}
                >
                  <Tab
                    label="Details"
                    value="1"
                    icon={<SubjectIcon />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Students"
                    value="2"
                    icon={<GroupIcon />}
                    iconPosition="start"
                  />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "2rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <SubjectDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <SubjectStudentsSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      )}
    </>
  )
}

export default ViewSubject