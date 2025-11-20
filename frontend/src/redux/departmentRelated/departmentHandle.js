import axios from 'axios';
import {
  requestStart,
  getDepartmentListSuccess,
  getDepartmentDetailSuccess,
  departmentActionSuccess,
  requestFailed,
} from './departmentSlice';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// 1. Get all departments for a school
export const fetchDepartmentList = (adminId) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await axios.get(`${BASE_URL}/DepartmentList/${adminId}`);
    if (res.data.message) {
      dispatch(requestFailed(res.data.message));
    } else {
      dispatch(getDepartmentListSuccess(res.data));
    }
  } catch (err) {
    dispatch(requestFailed(err.message || "Failed to fetch departments"));
  }
};

// 2. Get details of a specific department
export const fetchDepartmentDetails = (id) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await axios.get(`${BASE_URL}/Department/${id}`);
    if (res.data.message) {
      dispatch(requestFailed(res.data.message));
    } else {
      dispatch(getDepartmentDetailSuccess(res.data));
    }
  } catch (err) {
    dispatch(requestFailed(err.message || "Failed to fetch department details"));
  }
};

// 3. Create a new department
export const createDepartment = (departmentData) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await axios.post(`${BASE_URL}/DepartmentCreate`, departmentData);
    dispatch(departmentActionSuccess(res.data));
  } catch (err) {
    dispatch(requestFailed(err.response?.data?.message || "Department creation failed"));
  }
};

// 4. Assign subject to department
export const assignSubjectToDepartment = (departmentId, subjectId) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await axios.put(`${BASE_URL}/AssignSubjectToDepartment/${departmentId}`, {
      subjectId,
    });
    dispatch(departmentActionSuccess(res.data));
  } catch (err) {
    dispatch(requestFailed(err.response?.data?.message || "Subject assignment failed"));
  }
};

// 5. Assign teacher to department
export const assignTeacherToDepartment = (departmentId, teacherId) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await axios.put(`${BASE_URL}/AssignTeacherToDepartment/${departmentId}`, {
      teacherId,
    });
    dispatch(departmentActionSuccess(res.data));
  } catch (err) {
    dispatch(requestFailed(err.response?.data?.message || "Teacher assignment failed"));
  }
};

// 6. Assign class to department
export const assignClassToDepartment = (departmentId, classId) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await axios.put(`${BASE_URL}/AssignClassToDepartment/${departmentId}`, {
      classId,
    });
    dispatch(departmentActionSuccess(res.data));
  } catch (err) {
    dispatch(requestFailed(err.response?.data?.message || "Class assignment failed"));
  }
};

// 7. Assign student to department
export const assignStudentToDepartment = (departmentId, studentId) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await axios.put(`${BASE_URL}/AssignStudentToDepartment/${departmentId}`, {
      studentId,
    });
    dispatch(departmentActionSuccess(res.data));
  } catch (err) {
    dispatch(requestFailed(err.response?.data?.message || "Student assignment failed"));
  }
};

// 8. Delete a department
export const deleteDepartment = (id) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await axios.delete(`${BASE_URL}/Department/${id}`);
    dispatch(departmentActionSuccess(res.data));
  } catch (err) {
    dispatch(requestFailed(err.response?.data?.message || "Department deletion failed"));
  }
};
