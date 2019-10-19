import React, {createContext, useState, useContext} from 'react';
import { authLogIn, authSignUp, authLogOut } from './auth';

const AuthContext = createContext();

//provider component to wrap app and creates an auth object that can be
//consumed in any child using useAuth hook
export default function AuthProvider({children}){
    const auth = useProvideAuth();
    return <AuthContext.Provider value = {auth}>{children}</AuthContext.Provider>
}

//hook for child component to get access to auth object
export const useAuth =() => {
    return useContext(AuthContext);
}

//hook provider that creates auth object and handles user state
function useProvideAuth(){
    const [user, setUser] = useState(null);

    const logIn = async(email, password) => {

        const res = await authLogIn();
        setUser(res.user);
    };
    const signUp = async(email, password) => {

        const res = await authSignUp();
        setUser(res.user);
    };
    const signOut = async(email, password) => {

        const res = await authLogOut();
        setUser(res.user);
    };

    return {
        logIn,
        signUp,
        signOut,
        user
    }
}

