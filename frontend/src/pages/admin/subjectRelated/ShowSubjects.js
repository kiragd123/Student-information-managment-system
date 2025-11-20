import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    Paper, Box, IconButton,
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import axios from 'axios';

const ShowSubjects = () => {
    const API = 'http://localhost:5000'
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = async (deleteID, address) => {

        try {
            const response = await axios.delete(`${API}/Subject/${deleteID}`);
            console.log(response.data);
            if (response.status === 200) {
                setMessage("Deleted successfully");
                setShowPopup(true);
                dispatch(getSubjectList(currentUser._id, "AllSubjects"));
            } else {
                setMessage("Failed to delete. Please try again.");
                setShowPopup(true);
            }
        } catch (err) {
            console.log(err);
            setMessage("Sorry the delete function has been disabled for now.");
            setShowPopup(true);
        }
    }

    const subjectColumns = [
        { id: 'subName', label: 'Course Name', minWidth: 170 },
        { id: 'sessions', label: 'Sessions', minWidth: 170 },
        { id: 'department', label: 'Department Name', minWidth: 170 },
        {id:'classID', label:'Class Name', minWidth:170},
    ]

    const subjectRows = (Array.isArray(subjectsList) ? subjectsList : []).map((subject) => {
        return {
            subName: subject?.subName || "N/A",
            sessions: subject?.sessions || 0,
            department: subject?.department?.departmentName || "N/A",
            id: subject?._id || "",
            classID: subject?.sclassName?.sclassName || "n/a",
        };
    });

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton variant="contained"
                    onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}>
                    View
                </BlueButton>
            </>
        );
    };


    return (
        <>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {response ?
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton variant="contained"
                                onClick={() => navigate("/Admin/subjects/chooseclass")}>
                                Add Subjects
                            </GreenButton>
                        </Box>
                        :
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            {Array.isArray(subjectsList) && subjectsList.length > 0 &&
                                <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                            }
                        </Paper>
                    }
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

        </>
    );
};

export default ShowSubjects;