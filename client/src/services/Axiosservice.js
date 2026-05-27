// import axios from "axios";
// import { commonService } from "../utils/commonService";
// // import { commonservices } from "../commonservices";
// let tokenValue = "";
// // DATA SEND LIKE BELOW OBJECT
// // {
// //   method: "",
// //   url: "",
// //   body: {
// //     username: "",
// //     password: "",
// //   }
// // }

// // IF formType PARAMETER IS TRUE THEN IT WILL BE FORM DATA OTHERWISE NORMAL JSON
// export const apiCall = async (data, formType) => {
//   tokenValue = localStorage.getItem("adminToken");
//   if (tokenValue !== "" && tokenValue !== undefined && tokenValue !== null) {
//     try {
//       let formData = new FormData();

//       if (formType) {
//         for (const [key, value] of Object.entries(data?.body)) {
//           if (
//             typeof value === "object" &&
//             Array.isArray(value) &&
//             key !== "componentjson"
//           ) {
//             value?.map((item, index) => {
//               for (const [nestedKey, nestedValue] of Object.entries(item)) {
//                 formData.append(`${key}[${index}].${nestedKey}`, nestedValue);
//               }
//             });
//           } else {
//             formData.append(`${key}`, value);
//           }
//         }
//       }
//       let response = await axios({
//         method: data.method,
//         url: data?.url,
//         maxBodyLength: Infinity,
//         data: formType ? formData : data?.body,
//         headers: formType
//           ? commonService.getHeadersFromData()
//           : commonService.getHeaders(),
//       });
//       return response?.data;
//     } catch (error) {
//       return error;
//     }
//   } else {
//     try {
//       let formData = new FormData();

//       if (formType) {
//         for (const [key, value] of Object.entries(data?.body)) {
//           if (
//             typeof value === "object" &&
//             Array.isArray(value) &&
//             key !== "componentjson"
//           ) {
//             value?.map((item, index) => {
//               for (const [nestedKey, nestedValue] of Object.entries(item)) {
//                 formData.append(`${key}[${index}].${nestedKey}`, nestedValue);
//               }
//             });
//           } else {
//             formData.append(`${key}`, value);
//           }
//         }
//       }
//       let response = await axios({
//         method: data.method,
//         url: data?.url,
//         data: formType ? formData : data?.body,
//       });
//       return response?.data;
//     } catch (error) {
//       return error;
//     }
//   }
// };
// export const apiCallWithoutToken = async (data, formType) => {
//   try {
//     let formData = new FormData();

//     if (formType) {
//       for (const [key, value] of Object.entries(data?.body)) {
//         if (
//           typeof value === "object" &&
//           Array.isArray(value) &&
//           key !== "componentjson"
//         ) {
//           value?.map((item, index) => {
//             for (const [nestedKey, nestedValue] of Object.entries(item)) {
//               formData.append(`${key}[${index}].${nestedKey}`, nestedValue);
//             }
//           });
//         } else {
//           formData.append(`${key}`, value);
//         }
//       }
//     }
//     let response = await axios({
//       method: data.method,
//       url: data?.url,
//       data: formType ? formData : data?.body,
//     });
//     return response?.data;
//   } catch (error) {
//     return error;
//   }
// };
