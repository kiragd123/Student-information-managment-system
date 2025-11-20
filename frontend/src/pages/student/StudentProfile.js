import React from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Container,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  Cake as CakeIcon,
  EmailRounded as EmergencyIcon,
  Transgender as GenderIcon,
  Badge as RollNumberIcon
} from '@mui/icons-material';

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response); }
  else if (error) { console.log(error); }

  const sclassName = currentUser?.sclassName || {};
  const studentSchool = currentUser?.school || {};

  // Sample data (in a real app, this would come from the user object)
  const studentData = {
    name: currentUser?.name || 'Student Name',
    rollNum: currentUser?.rollNum || 'N/A',
    class: sclassName?.sclassName || 'Not assigned',
    school: studentSchool?.schoolName || 'Not assigned',
    email: currentUser?.email || 'john.doe@example.com',
    dob: 'January 1, 2000',
    gender: 'Male',
    phone: '(123) 456-7890',
    address: '123 Main Street, City, Country',
    emergencyContact: '(987) 654-3210'
  };

  const InfoItem = ({ icon, label, value }) => (
    <ListItem>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={value}
        secondary={label}
        primaryTypographyProps={{ variant: 'body1' }}
        secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
      />
    </ListItem>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading profile: {error}
        </Alert>
      )}

      {/* Profile Header Card */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'rgba(255,255,255,0.2)',
                fontSize: '3rem',
                border: '3px solid rgba(255,255,255,0.3)'
              }}
            >
              {String(studentData.name).charAt(0).toUpperCase()}
            </Avatar>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              {studentData.name}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              <Chip
                icon={<RollNumberIcon />}
                label={`Roll No: ${studentData.rollNum}`}
                variant="outlined"
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)'
                }}
              />
              <Chip
                icon={<ClassIcon />}
                label={`Class: ${studentData.class}`}
                variant="outlined"
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)'
                }}
              />
              <Chip
                icon={<SchoolIcon />}
                label={studentData.school}
                variant="outlined"
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)'
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Personal Information Card */}
      <Card elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom color="primary" fontWeight="bold">
              <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Personal Information
            </Typography>
          </Box>
          <Divider />
          <Grid container>
            <Grid item xs={12} md={6}>
              <List dense>
                <InfoItem
                  icon={<EmailIcon color="primary" />}
                  label="Email Address"
                  value={studentData.email}
                />
                <InfoItem
                  icon={<CakeIcon color="primary" />}
                  label="Date of Birth"
                  value={studentData.dob}
                />
                <InfoItem
                  icon={<GenderIcon color="primary" />}
                  label="Gender"
                  value={studentData.gender}
                />
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List dense>
                <InfoItem
                  icon={<PhoneIcon color="primary" />}
                  label="Phone Number"
                  value={studentData.phone}
                />
                <InfoItem
                  icon={<HomeIcon color="primary" />}
                  label="Address"
                  value={studentData.address}
                />
                <InfoItem
                  icon={<EmergencyIcon color="primary" />}
                  label="Emergency Contact"
                  value={studentData.emergencyContact}
                />
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Academic Information Card */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom color="primary" fontWeight="bold">
              <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Academic Information
            </Typography>
          </Box>
          <Divider />
          <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ClassIcon color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Class
                  </Typography>
                  <Typography variant="body1">
                    {studentData.class}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RollNumberIcon color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Roll Number
                  </Typography>
                  <Typography variant="body1">
                    {studentData.rollNum}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    School
                  </Typography>
                  <Typography variant="body1">
                    {studentData.school}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Student ID
                  </Typography>
                  <Typography variant="body1">
                    {currentUser?._id || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StudentProfile;