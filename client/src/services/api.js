// import { ApiService } from "../utils/apicall";
// import { commonService } from "../utils/commonService";

// const API_URL = import.meta.env.VITE_API_URL;
// const CHAT_FAST_API_URL = import.meta.env.VITE_BACKEND_PYTHON_BASE_URL;

// // auth apis
// export const loginUser = async (loginData) => {
//   const url = `${API_URL}/api/auth/login`;
//   return await ApiService({ url, data: loginData });
// };

// export const signUp = async (data) => {
//   const url = `${API_URL}/api/register`;
//   return await ApiService({ url, data: data });
// };

// export const forgotPassword = async (email) => {
//   const url = `${API_URL}/api/auth/forgot_password`;
//   return await ApiService({ url, data: email });
// };

// export const setPassword = async (data) => {
//   const url = `${API_URL}/api/auth/set_password`;
//   return await ApiService({ url, data });
// };

// // client apis
// export const getclientList = async (id) => {
//   const url = `${API_URL}/api/client`;
//   return await ApiService({ url, data: id, method: "get" });
// };

// export const getListForCatalogue = async (id) => {
//   const url = `${API_URL}/api/client/getListForCatalogue`;
//   return await ApiService({ url, data: id, method: "get" });
// };

// export const addClient = async (data) => {
//   const url = `${API_URL}/api/client`;
//   return await ApiService({ url, data });
// };

// export const deleteClient = async (data) => {
//   const url = `${API_URL}/api/client`;
//   return await ApiService({ url, data, method: "delete" });
// };

// export const updateClient = async (id, data) => {
//   const url = `${API_URL}/api/client/${id}`;
//   return await ApiService({ url, data, method: "put" });
// };

// // project apis
// export const addNewProjectApi = async (data) => {
//   const url = `${API_URL}/api/client/project`;
//   return await ApiService({ url, data });
// };

// export const getAllProjectsListById = async (data) => {
//   const url = `${API_URL}/api/client/project/list`;
//   return await ApiService({ url, data });
// };

// export const deleteProjectApi = async (data) => {
//   const url = `${API_URL}/api/client/project/delete`;
//   return await ApiService({ url, data, method: "put" });
// };

// export const getprojectDataSetApi = async (id) => {
//   const url = `${API_URL}/api/client/project/data/${commonService.getEncodedValue(id)}`;
//   return await ApiService({ url, data: null, method: "get" });
// };

// export const getprojectDetailsByIdApi = async (id, custID) => {
//   const url = `${API_URL}/api/client/project/${commonService.getEncodedValue(
//     id
//   )}?customerId=${custID || 0}`;
//   // const url = `${API_URL}/api/client/project/${id}?customerId=${custID || 0}`;
//   return await ApiService({ url, data: null, method: "get" });
// };

// export const updateProjectInstructions = async (data) => {
//   const url = `${API_URL}/api/client/project/instructions`;
//   return await ApiService({ url, data, method: "put" });
// };

// export const updateProjectDataSetApi = async (data) => {
//   const url = `${API_URL}/api/client/project/data_set`;
//   return await ApiService({ url, data, method: "put" });
// };

// export const fetchScriptApi = async (data) => {
//   const url = `${API_URL}/api/client/project/script`;
//   return await ApiService({ url, data });
// };

// export const getTemplateImgApi = async () => {
//   const url = `${API_URL}/api/client/project/template_images`;
//   return await ApiService({ url, data: null, method: "get" });
// };

// export const updateProjectAssistantApi = async (data) => {
//   const url = `${API_URL}/api/client/project/update_assistant`;
//   return await ApiService({ url, data, method: "put" });
// };

// export const updateProjectDetailsApi = async (data) => {
//   const url = `${API_URL}/api/client/project/basic_details`;
//   return await ApiService({ url, data });
// };

// export const updateProjectDetailsImgApi = async (data) => {
//   const url = `${API_URL}/api/client/project/basic_details`;
//   return await ApiService({
//     url,
//     data,
//     method: "post",
//     Content_Type: "multipart/form-data",
//   });
// };

// // ai_config apis

// export const getAiConfigList = async (id) => {
//   const url = `${API_URL}/api/ai_config`;
//   return await ApiService({ url, data: id, method: "get" });
// };

// export const insertAiConfig = async (data) => {
//   const url = `${API_URL}/api/ai_config`;
//   return await ApiService({ url, data });
// };

// export const deleteAiConfig = async (data) => {
//   const url = `${API_URL}/api/ai_config`;
//   return await ApiService({ url, data, method: "delete" });
// };

// //terms apis
// export const getTermsApi = async (term) => {
//   const url = `${API_URL}/utils/terms?term=${term}`;
//   return await ApiService({ url, data: null, method: "get" });
// };

// //chat bot
// export const getInitialChatApi = async () => {
//   const url = `${API_URL}/chat/message/initiate_chat`;
//   return await ApiService({ url, data: null, method: "get" });
// };

// export const getChatHistory = async (thread_id, code, last_msg_id = "") => {
//   const url = `${API_URL}/chat/message/get_history?thread_id=${thread_id}&code=${code}&last_msg_id=${last_msg_id}`;
//   return await ApiService({ url, data: null, method: "get" });
// };
// export const getNewChatHistory = async (thread_id) => {
//   const url = `${API_URL}/chat/message/get_history?thread_id=${thread_id}`;
//   return await ApiService({ url, data: null, method: "get" });
// };

// export const getMessageConfigByCodeApi = async (code) => {
//   const url = `${API_URL}/chat/message/config?code=${code}`;
//   return await ApiService({ url, data: null, method: "get" });
// };

// export const sendMessageApi = async (data) => {
//   const url = `${API_URL}/chat/message/send_message`;
//   return await ApiService({ url, data });
// };
// export const sendPythonMessageApi = async (data) => {
//   const url = `${CHAT_FAST_API_URL}get_message`;
//   return await ApiService({ url, data });
// };

// export const clearMessageApi = async (data) => {
//   const url = `${API_URL}/chat/message/clear-history`;
//   return await ApiService({ url, data });
// };
// export const getAiFunctionDetails = async () => {
//   const url = `${API_URL}/api/setup/fn`;
//   return await ApiService({ url, data: null, method: "get" });
// };

// //voice assistant

// export const getVoiceAssistantById = async (projectId) => {
//   const url = `${API_URL}/api/voice_config`;
//   return await ApiService({ url, data: projectId });
// };

// export const getSessionsList = async (data) => {
//   const url = `${API_URL}/api/client/project/session_list`;
//   return await ApiService({ url, data });
// };
