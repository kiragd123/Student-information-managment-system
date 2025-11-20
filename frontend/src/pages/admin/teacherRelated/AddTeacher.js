import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams,useLocation } from 'react-router-dom';
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress } from '@mui/material';

const AddTeacher = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const { sclassId, departmentID, subjectId } = useParams();

  //const subjectID = subjectId; // or whichever ID is actually the subject

  const { status, response, error,currentUser } = useSelector(state => state.user);
  const { subjectDetails } = useSelector((state) => state.sclass);

 // console.log('subjectDetails',subjectDetails)

  useEffect(() => {
    if (subjectId) {
      dispatch(getSubjectDetails(subjectId, 'Subject'));
    }
  }, [dispatch, subjectId]);


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false)

  const role = "Teacher"
  const school = currentUser && currentUser._id
  const teachSubject = subjectDetails._id|| subjectId
  const teachSclass = subjectDetails?.sclassName?._id || sclassId
  //console.log('subject',teachSubject)


  const fields = { name, email, password, role, school, teachSubject, teachSclass, department:departmentID };

  const submitHandler = (event) => {
    event.preventDefault();

    if (!teachSclass) {
      setMessage("Cannot add teacher: Class ID is missing!");
      setShowPopup(true);
      return;
    }

    setLoader(true);
    dispatch(registerUser(fields, role));
  };

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl())
      navigate("/Admin/teachers")
    }
    else if (status === 'failed') {
      setMessage(response)
      setShowPopup(true)
      setLoader(false)
    }
    else if (status === 'error') {
      setMessage("Network Error")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <div>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Add Teacher</span>
          <br />
          
          <label>Name</label>
          <input className="registerInput" type="text" placeholder="Enter teacher's name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name" required />

          <label>Email</label>
          <input className="registerInput" type="email" placeholder="Enter teacher's email..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email" required />

          <label>Password</label>
          <input className="registerInput" type="password" placeholder="Enter teacher's password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password" required />

          <button className="registerButton" type="submit" disabled={loader}>
            {loader ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  )
}

export default AddTeacher