// import axios from "axios";

// const API_URL = "http://localhost:5000"; // change to your backend URL

// export const verifyLicense = async (licenseKey) => {
//     try {
//         const res = await axios.get(`${API_URL}/verifyLicense`, {
//             params: { licenseKey },
//         });
//         return res.data;
//     } catch (err) {
//         return { valid: false, message: err.response?.data?.message || "Error verifying license" };
//     }
// };

// export const createLicense = async (data) => {
//     const res = await axios.post(`${API_URL}/createLicense`, data);
//     return res.data;
// };
