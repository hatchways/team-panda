import axios from 'axios';

export const authLogIn = async() => {
    //WIP depending on what the login route returns
    const res = await axios.post('/login');
    return res;
}

export const authSignUp = async() => {
    //WIP depending on what the signup route returns
    const res = await axios.post('/signup');
    return res;
}

export const authLogOut = async() => {
    //WIP depending on what the logout route returns
    const res = await axios.post('/logout');
    return res;
}

