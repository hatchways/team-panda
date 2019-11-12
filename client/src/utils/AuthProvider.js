import React, { createContext, useState, useContext } from "react";
import { authLogIn, authSignUp, authLogOut, authRequest } from "./auth";

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

//hook provider that creates auth object and handles user state
function useProvideAuth() {
    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);

    const logIn = async credentials => {
        try {
            const res = await authLogIn(credentials);
            setUser(res);
        } catch (error) {
            setAuthError(error.response);
        }
    };
    const signUp = async credentials => {
        try {
            const res = await authSignUp(credentials);
            setUser(res);
        } catch (error) {
            setAuthError(error.response);
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
            setUser({ ...user, ...res.data });
        } catch (error) {
            setAuthError(error.response);
        }
    };

    return {
        logIn,
        signUp,
        signOut,
        user,
        setUser,
        authError,
        setAuthError,
        getUserProfile
    };
}
