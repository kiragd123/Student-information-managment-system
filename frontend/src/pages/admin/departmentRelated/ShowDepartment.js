import { useEffect, useState } from 'react';
import { IconButton, Box, Menu, MenuItem, ListItemIcon, Tooltip } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import styled from 'styled-components';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import axios from 'axios';
import { fetchDepartmentList } from '../../../redux/departmentRelated/departmentHandle';
import { getAllSclasses,getSubjectList } from '../../../redux/sclassRelated/sclassHandle';

const ShowDepartment = () => {
  const API ='http://localhost:5000';
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { departmentList, loading, error, getresponse } = useSelector((state) => state.department);
  const { currentUser } = useSelector((state) => state.user);
  const { sclassesList, subjectsList } = useSelector((state) => state.sclass);

  //const data  = useSelector((state) => state.department)


  console.log('subjects',subjectsList)
  console.log('sclasses',sclassesList)
  console.log('departments',departmentList)

  const adminID = currentUser._id

  useEffect(() => {
    if(!adminID) return;
    dispatch(fetchDepartmentList(adminID));
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getSubjectList(adminID, "AllSubjects"));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error)
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = async(deleteID, address) => {

    const url = `${API}/department/${deleteID}`;
    if(!url) return;
    
    await axios.delete(url)
    .then((res) => {
      console.log(res.data);
      setMessage("Deleted Successfully");
      setShowPopup(true);
      dispatch(fetchDepartmentList(adminID));
    })
    .catch((err) => {
      console.log(err);
      setMessage("Sorry the delete function has been disabled for now.");
      setShowPopup(true);
    });

  }

  const departmentColumns = [
    { id: 'name', label: 'Department Name', minWidth: 170 },
  ]
  const departmentRows = departmentList && departmentList.length > 0 && departmentList.map((department) => {
    const sclassForDept = sclassesList.find(
      (sclass) => sclass.department?._id === department._id
    );

    const subjectForSclass = subjectsList.find(
      (subject) => subject.department?._id === department._id
    );
    return {
      name: department.departmentName,
      id: department._id,
      sclassId: sclassForDept?._id || null,
      subjectId: subjectForSclass?._id || null, // first matching class id or empty string
    };
  });

  const DepartmentButtonHaver = ({ row }) => {
    const actions = [
      {
        icon: <PersonAddAlt1Icon />,
        name: 'Add Course',
        action: () => navigate(`/Admin/addsubject/${row.id}?sclassId=${row.sclassId}`),
      },
      {
        icon: <PersonAddAlt1Icon />,
        name: 'Add Student',
        action: () => navigate(`/Admin/class/addstudents/${row.id}?sclassId=${row.sclassId}`),
      },
      {
        icon: <PersonAddAlt1Icon />,
        name: 'Add Teacher',
        action: () => navigate(`/Admin/teachers/addTeacher/${row.sclassId}/${row.id}/${row.subjectId}`),
      },
      {
        icon: <PersonAddAlt1Icon />,
        name: 'Add Classes',
        action: () => navigate(`/Admin/addclass/${row.id}`),
      },
    ];
    return (
      <ButtonContainer>
        <IconButton onClick={() => deleteHandler(row.id, "Department")} color="secondary">
          <DeleteIcon color="error" />
        </IconButton>       
        <ActionMenu actions={actions} />
      </ButtonContainer>
    );
  };

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title="Add Students & Courses">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <h5>Add</h5>
              <SpeedDialIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: styles.styledPaper,
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {actions.map((action) => (
            <MenuItem key={action.name} onClick={action.action}>
              <ListItemIcon fontSize="small">
                {action.icon}
              </ListItemIcon>
              {action.name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  const actions = [
    {
      icon: <AddCardIcon color="primary" />, name: 'Add New Department',
      action: () => navigate("/Admin/addDepartment")
    }
  ];

  return (
    <>
      {loading ?
        <div>Loading...</div>
        :
        <>
          {getresponse ?
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <GreenButton variant="contained" onClick={() => navigate("/Admin/addDepartment")}>
                Add Department
              </GreenButton>
            </Box>
            :
            <>
              {Array.isArray(departmentList) && departmentList.length > 0 &&
                <TableTemplate buttonHaver={DepartmentButtonHaver} columns={departmentColumns} rows={departmentRows} />
              }
              <SpeedDialTemplate actions={actions} />
            </>}
        </>
      }
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

    </>
  );
};

export default ShowDepartment;

const styles = {
  styledPaper: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  }
}

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;