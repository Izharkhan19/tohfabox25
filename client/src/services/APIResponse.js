// import { commonService } from "../utils/commonService";

// export const apiResponse = (isMsgDisplay, data, setLoading) => {
//   if (data?.status === 0) {
//     if (isMsgDisplay) {
//       if (setLoading) {
//         setLoading(false);
//       }
//       commonService.showAlert(data?.message, "error");
//     }
//     if (setLoading) {
//       setLoading(false);
//     }
//     return {
//       isValidate: false,
//       data: [],
//     };
//   } else if (data?.status === 1) {
//     if (setLoading) {
//       setLoading(false);
//     }
//     if (isMsgDisplay) commonService.showAlert(data?.message, "success");
//     return {
//       isValidate: true,
//       data: data,
//     };
//   } else if (data?.status === 2) {
//     if (isMsgDisplay) {
//       if (setLoading) {
//         setLoading(false);
//       }
//       commonService.showAlert(data?.message, "error");
//     }
//     if (setLoading) {
//       setLoading(false);
//     }
//     return {
//       isValidate: false,
//       data: [],
//     };
//   } else if (data?.name === "AxiosError") {
//     if (setLoading) {
//       setLoading(false);
//     }
//     if (data?.response?.status === 422) {
//       return {
//         status: 0,
//         message: commonService.showAlert(
//           data?.response?.data?.message,
//           "error"
//         ),
//       };
//     } else if (data?.response?.status === 401) {
//       commonService.clearLocalStorage();
//       window.location.reload();
//       return {
//         status: 2,
//         message: commonService.showAlert(
//           data?.response?.data?.message,
//           "error"
//         ),
//       };
//     } else if (data?.response?.status === 400) {
//       return {
//         status: 2,
//         message: commonService.showAlert(
//           data?.response?.data?.message,
//           "error"
//         ),
//       };
//     } else if (data?.response?.status === 405) {
//       return {
//         status: 0,
//         message: commonService.showAlert(
//           data?.response?.data?.message,
//           "error"
//         ),
//       };
//     } else if (data?.response?.status === 404) {
//       return {
//         status: 0,
//         message: commonService.showAlert(
//           data?.response?.data?.message,
//           "error"
//         ),
//       };
//     } else if (data?.response?.status === 500) {
//       return {
//         status: 0,
//         message: commonService.showAlert(
//           data?.response?.data?.message,
//           "error"
//         ),
//       };
//     } else {
//       return {
//         status: 0,
//         message: commonService.showAlert(
//           "Something wrong happened, please try again later.",
//           "error"
//         ),
//       };
//     }
//   } else {
//     if (isMsgDisplay) {
//       if (setLoading) {
//         setLoading(false);
//       }
//       commonService.showAlert(data?.message, "error");
//     }
//   }
// };
