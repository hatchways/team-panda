import { authRequest } from "../utils/auth";
import axios from "axios";

export const createPet = async (userId, petInfo) => {
    let formData = new FormData();
    for (let prop in petInfo) {
        if (petInfo[prop]) formData.append(prop, petInfo[prop]);
    }
    const res = await authRequest(`/users/${userId}/pets`, {
        method: "POST",
        data: formData,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
};

export const updatePet = async (userId, petId, petInfo) => {
    let formData = new FormData();
    for (let prop in { petId, ...petInfo }) {
        if (petInfo[prop]) formData.append(prop, petInfo[prop]);
    }
    const res = await authRequest(`/users/${userId}/pets/${petId}/edit`, {
        method: "PUT",
        data: formData,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data.profile;
};

export const getUsersPets = async userId => {
    const res = await authRequest(`/users/${userId}/pets`, {
        method: "GET"
    });
    if (res.status === 200) {
        return res.data;
    }
};

export const getPetWithPosts = async (userId, petId) => {
    const res = await authRequest(`/users/${userId}/pets/${petId}`, {
        method: "GET"
    });
    if (res.status === 200) {
        return res.data;
    }
    return {};
};

export const getPets = search => {
    return axios.get(`/query?type=pet&search=${search}`);
};
