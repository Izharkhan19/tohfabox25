import axios from "axios";
import { BASE_URL } from "./constants";

export const authSignIn = async (input: any) => {
    return await axios.post(`${BASE_URL}/api/auth/signin`,
        input,
    );
};

export const authSignUp = async (input: any) => {
    return await axios.post(`${BASE_URL}/api/auth/signup`,
        input,
    );
};