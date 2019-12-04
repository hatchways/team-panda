import React, { createContext, useState, useContext } from "react";
import { authLogIn, authSignUp, authLogOut, authRequest } from "./auth";
import jwt from "jsonwebtoken";

const AuthContext = createContext();

//provider component to wrap app and creates an auth object that can be
//consumed in any child using useAuth hook
export default function AuthProvider({ children }) {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

//hook for child component to get access to auth object
export const useAuth = () => {
    return useContext(AuthContext);
};

const getErrorMsgFromRes = (error) => {
    let msg = "";
    if (typeof error.response === "string"){
        msg = error.response;
    } else if (error.response.data){
        msg = error.response.data.error;
    }
    if (typeof msg !== "string"){
        msg = error.response.statusText;
    }
    return msg;
}
//hook provider that creates auth object and handles user state
function useProvideAuth() {
    const [user, setUser] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [snackBarMsg, setSnackBarMsg] = useState(null);

    const logIn = async credentials => {
        try {
            const res = await authLogIn(credentials);
            setAuthUser(res);
            setUser(res);
            return res
        } catch (error) {
            const errorMsg = getErrorMsgFromRes(error);
            setAuthError(errorMsg);
            setSnackBarMsg(errorMsg);
        }
    };
    const signUp = async credentials => {
        try {
            const res = await authSignUp(credentials);
            setAuthUser(res);
            setUser(res);
            return res;
        } catch (error) {
            const errorMsg = getErrorMsgFromRes(error);
            setAuthError(errorMsg);
            setSnackBarMsg(errorMsg);
        }
    };
    const signOut = async () => {
        try {
            const res = await authLogOut();
            setUser(res);
        } catch (error) {
            setAuthError(error.response);
        }
    };

    const getUserProfile = async id => {
        try {
            const res = await authRequest(`/users/${id}`, { method: "GET" });
            let mergedUser = {
                ...res.data.profile,
                ...user,
                userProfileId: res.data.profile.id,
                ...res.data
            };
            delete mergedUser.profile;
            setUser(mergedUser);
            return mergedUser;
        } catch (error) {
            const errorMsg = getErrorMsgFromRes(error);
            setAuthError(errorMsg);
            setSnackBarMsg(errorMsg);
        }
    };

    const getAuthUser = async () => {
        const token = localStorage.getItem("access_token");
        try {
            if (token){
                const tokenUser = jwt.decode(token);
                const res = await authRequest(`/users/${tokenUser.id}`, {method: "GET"});
                let flattenedUser = {
                    ...res.data.profile,
                    userProfileId: res.data.profile.id,
                    ...res.data
                };
                delete flattenedUser.profile;
                setAuthUser(flattenedUser);
            }
        } catch (error) {
            const errorMsg = getErrorMsgFromRes(error);
            setAuthError(errorMsg);
            setSnackBarMsg(errorMsg);
        }
    }

    return {
        logIn,
        signUp,
        signOut,
        user,
        setUser,
        authError,
        setAuthError,
        getUserProfile,
        snackBarMsg,
        setSnackBarMsg,
        authUser,
        getAuthUser
    };
}
