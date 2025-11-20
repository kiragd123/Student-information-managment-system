import { useEffect, useState } from "react";
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { Paper, Box, Typography, ButtonGroup, Button, Popper, Grow, ClickAwayListener, MenuList, MenuItem } from '@mui/material';
import { BlackButton, BlueButton } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { resetTeacherState } from "../../redux/teacherRelated/teacherSlice";

const TeacherClassDetails = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector((state) => state.user);
    const classID = currentUser.teachSclass?._id
    const subjectID = currentUser.teachSubject?._id

    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        dispatch(getClassStudents(classID));
    }, [dispatch, classID, refreshKey]); // Add refreshKey as dependency

    useEffect(() => {
        // Reset state when component mounts
        dispatch(resetTeacherState());

        return () => {
            // Cleanup when component unmounts
            dispatch(resetTeacherState());
        };
    }, [dispatch]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (error) {
        console.log(error);
        return <div>Error: {error.message}</div>;
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 170 },
        { id: 'class', label: 'Class', minWidth: 170 },
        { id: 'department', label: 'Department', minWidth: 170 },
    ]

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
            class: student.sclassName ? student.sclassName.sclassName : 'N/A',
            department: student.department ? student.department.departmentName : 'N/A',
        };
    })

    const StudentsButtonHaver = ({ row }) => {
        const options = ['Take Attendance', 'Provide Marks'];
        const [open, setOpen] = React.useState(false);
        const anchorRef = React.useRef(null);

        const handleAttendance = () => {
            // Use window.location to force full navigation
            window.location.href = `/Teacher/class/student/attendance/${row.id}/${subjectID}`;
        }

        const handleMarks = () => {
            window.location.href = `/Teacher/class/student/marks/${row.id}/${subjectID}`;
        };

        const handleMenuItemClick = (event, index) => {
            setOpen(false);
            if (index === 0) {
                handleAttendance();
            } else if (index === 1) {
                handleMarks();
            }
        };

        const handleToggle = () => {
            setOpen((prevOpen) => !prevOpen);
        };

        const handleClose = (event) => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return;
            }
            setOpen(false);
        };

        return (
            <>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Teacher/class/student/" + row.id)}
                    sx={{ mr: 1 }}
                >
                    View
                </BlueButton>

                <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                    <Button onClick={() => handleMenuItemClick(null, 0)}>
                        Take Attendance
                    </Button>
                    <BlackButton
                        size="small"
                        aria-controls={open ? 'split-button-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </BlackButton>
                </ButtonGroup>

                <Popper
                    sx={{ zIndex: 1300 }} // Increased z-index
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                    placement === 'bottom' ? 'center top' : 'center bottom',
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id="split-button-menu" autoFocusItem>
                                        <MenuItem onClick={() => handleMenuItemClick(null, 0)}>
                                            Take Attendance
                                        </MenuItem>
                                        <MenuItem onClick={() => handleMenuItemClick(null, 1)}>
                                            Provide Marks
                                        </MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </>
        );
    };

    return (
        <>      
                    {getresponse ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                            <Typography variant="h6">No Students Found</Typography>
                        </Box>
                    ) : (
                        <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
                            <Typography variant="h5" gutterBottom>
                                Students List
                            </Typography>

                            {Array.isArray(sclassStudents) && sclassStudents.length > 0 ? (
                                <TableTemplate
                                    buttonHaver={StudentsButtonHaver}
                                    columns={studentColumns}
                                    rows={studentRows}
                                />
                            ) : (
                                <Typography variant="body1" align="center">
                                    No students available
                                </Typography>
                            )}
                        </Paper>
                    )}

                </>
                )
    
};

export default TeacherClassDetails;