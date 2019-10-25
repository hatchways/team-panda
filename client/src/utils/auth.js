import axios from 'axios';

export const authLogIn = async(credentials) => {
    const res = await axios.post('/users/login', credentials);
    if (res.status === 200){
        localStorage.setItem('access_token', res.data.token)
    }
    return res.data;
}

export const authSignUp = async(credentials) => {
    const res = await axios.post('/users/register', credentials);
    if (res.status === 201){
        localStorage.setItem('access_token', res.data.token)
    }
    return res.data;
}

export const authLogOut = async() => {
    //WIP depending on what the logout route returns
    const res = await axios.post('/users/logout');
    return res.data;
}

export const authRequest = async(url, options) => { //authenticated request wrapper
    return axios(url, {
        method: options.method,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        ...options
    });
}
