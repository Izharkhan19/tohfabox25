import axios from "axios";

// const BASE_URL = "http://localhost:2025"; // or Local URL
const BASE_URL = "https://tohfabox25-backend.onrender.com"; // or Production URL

export const fetchPhotos = async () => {
    const res = await axios.get(`${BASE_URL}/media`);
    return res.data.media.length ? res.data.media.filter((item: any) => item?.resourceType === "image") : [];
};

export const fetchVideos = async () => {
    const res = await axios.get(`${BASE_URL}/media`);
    return res.data.media.length ? res.data.media.filter((item: any) => item?.resourceType === "video") : [];
};

export const uploadMedia = async (file: File, type: "photo" | "video") => {
    const formData = new FormData();
    formData.append("media", file);
    return await axios.post(`${BASE_URL}/upload?type=${type}`, formData);
};

export const deleteMedia = async (publicId: string, resourceType: "image" | "video") => {
    return await axios.delete(`${BASE_URL}/delete`, {
        data: {
            publicId,
            resourceType,
        },
    });
};