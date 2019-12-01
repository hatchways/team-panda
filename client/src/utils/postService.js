import { authRequest } from "./auth";
export const createPost = async (userId, petId, postInfo) => {
    let formData = new FormData();
    for (let prop in postInfo) {
        if (postInfo[prop]) formData.append(prop, postInfo[prop]);
    }
    const res = await authRequest(`/users/${userId}/pets/${petId}/posts/new`, {
        method: "POST",
        data: formData,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
};

export const updatePost = async (userId, petId, postInfo) => {
    let formData = new FormData();
    for (let prop in { petId, ...postInfo }) {
        if (postInfo[prop]) formData.append(prop, postInfo[prop]);
    }
    const res = await authRequest(
        `/users/${userId}/pets/${petId}/posts/${postInfo.id}`,
        {
            method: "PUT",
            data: formData,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "multipart/form-data"
            }
        }
    );
    return res.data;
};
