import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Class as ClassIcon,
  Subject as SubjectIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const TeacherProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response); }
  else if (error) { console.log(error); }

  const teachSclass = currentUser.teachSclass || {};
  const teachSubject = currentUser.teachSubject || {};
  const teachSchool = currentUser.school || {};

  const ProfileItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%' }}>
      <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
        {icon}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          {label}
        </Typography>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {value || 'Not assigned'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 500,
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            textAlign: 'center',
            py: 3,
            px: 2
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              bgcolor: 'white',
              color: 'primary.main',
              fontSize: '2.5rem'
            }}
          >
            <PersonIcon sx={{ fontSize: '2.5rem' }} />
          </Avatar>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {currentUser.name}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Teacher Profile
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <ProfileItem
            icon={<EmailIcon />}
            label="EMAIL"
            value={currentUser.email}
          />

          <ProfileItem
            icon={<ClassIcon />}
            label="CLASS"
            value={teachSclass.sclassName}
          />

          <ProfileItem
            icon={<SubjectIcon />}
            label="SUBJECT"
            value={teachSubject.subName}
          />

          <ProfileItem
            icon={<SchoolIcon />}
            label="SCHOOL"
            value={teachSchool.schoolName}
          />
        </CardContent>

        <Box
          sx={{
            bgcolor: 'grey.100',
            py: 2,
            px: 3,
            textAlign: 'center',
            borderTop: 1,
            borderColor: 'grey.200'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Teacher ID: {currentUser._id}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default TeacherProfile;