import axios from "axios";
import { BASE_URL } from "./constants";
import { getItem } from "../Common/CommonServices";

export const fetchPhotos = async () => {
    const res = await axios.get(`${BASE_URL}/api/media`, {
        headers: { "Authorization": `Bearer ${getItem("token")}` }
    },
    );
    return res.data.media.length ? res.data.media.filter((item: any) => item?.resourceType === "image") : [];
};

export const fetchVideos = async () => {
    const res = await axios.get(`${BASE_URL}/api/media`, {
        headers: { "Authorization": `Bearer ${getItem("token")}` }
    });
    return res.data.media.length ? res.data.media.filter((item: any) => item?.resourceType === "video") : [];
};

export const uploadMedia = async (file: File) => {
    const formData = new FormData();
    formData.append("media", file);
    return await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${getItem("token")}`,
        },
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            console.log(`Upload progress: ${percentCompleted}%`);
            // You can update a state variable here to show progress in your UI
        },
    });
    // return await axios.post(`${BASE_URL}/api/upload?type=${type}`, {
    //     body: formData,
    //     headers: { "Authorization": `Bearer ${getItem("token")}` }
    // });
};

export const deleteMedia = async (publicId: string, resourceType: "image" | "video") => {
    // return await axios.delete(`${BASE_URL}/api/delete`, {
    //     headers: { "Authorization": `Bearer ${getItem("token")}` },
    //     body: {
    //         publicId,
    //         resourceType,
    //     },
    // });

    return await axios.delete(`${BASE_URL}/api/delete`, {
        headers: { "Authorization": `Bearer ${getItem("token")}` },
        data: {
            publicId,
            resourceType,
        },
    });

};