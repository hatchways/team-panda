import { authRequest } from "../utils/auth";

export const updateProfile = async (userId, userProfile) => {
    let formData = new FormData();
    for (let prop in userProfile) {
        if (userProfile[prop]) formData.append(prop, userProfile[prop]);
    }
    const res = await authRequest(`/users/${userId}`, {
        method: "PUT",
        data: formData,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
};
