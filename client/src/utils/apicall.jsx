import axios from "axios";
import { commonService } from "./commonService";
// import { commonService } from "./commonService";

export const ApiService = async ({
  url,
  data,
  method,
  Content_Type = "application/json",
}) => {
  const config = {
    method: method || "post",
    url:
      method?.toLowerCase() === "delete" && data
        ? `${url}/${data}`
        : method?.toLowerCase() === "put" && data.id
        ? `${url}/${data.id}`
        : url,
    headers: {
      "Content-Type": Content_Type,
      // Authorization: `Bearer ${commonService?.getItem("token")}`,
      Authorization: "Bearer " + commonService?.getDecryptData("token"),
    },
    ...(method?.toLowerCase() === "get"
      ? { params: data }
      : method?.toLowerCase() === "put"
      ? { data }
      : method?.toLowerCase() !== "delete"
      ? { data }
      : {}),
  };

  try {
    const response = await axios(config);
    if (response?.data?.status === 1) {
      return response?.data;
    } else {
      return response?.data;
    }
  } catch (error) {
    if (error.status === 401) {
      localStorage.clear();
      throw error;
    } else {
      throw error;
    }
  }
};
