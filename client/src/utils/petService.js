import { authRequest } from "../utils/auth";

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
    if (res.status === 201) {
        console.log(res.data);
    }
    return res.data;
};
