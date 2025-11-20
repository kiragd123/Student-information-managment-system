// import React, { useState } from "react";
// import { verifyLicense } from "./license.js";

// const LicenseChecker = ({ onVerified }) => {
//     const [licenseKey, setLicenseKey] = useState("");
//     const [status, setStatus] = useState(null);

//     const handleVerify = async () => {
//         const result = await verifyLicense(licenseKey);
//         setStatus(result.message);

//         if (result.valid) {
//             onVerified(result.license); // pass license info to parent
//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//             <div className="bg-white p-6 rounded-2xl shadow-md w-96">
//                 <h2 className="text-xl font-bold mb-4">Enter License Key</h2>
//                 <input
//                     type="text"
//                     className="border rounded w-full p-2 mb-4"
//                     placeholder="Enter your license key"
//                     value={licenseKey}
//                     onChange={(e) => setLicenseKey(e.target.value)}
//                 />
//                 <button
//                     onClick={handleVerify}
//                     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
//                 >
//                     Verify License
//                 </button>
//                 {status && <p className="mt-3 text-center">{status}</p>}
//             </div>
//         </div>
//     );
// };

// export default LicenseChecker;
