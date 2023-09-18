import { axiosPrivate, axiosPublic } from "../../api/apiRequest"

export const registerUser = async(user) => {
    const response = await axiosPublic.post('/auth/register', user, { withCredentials: true })
    return response.data
}

export const loginUser = async(data) => {
    const response = await axiosPublic.post('/auth/login', data, { withCredentials: true })
    return response.data
}

export const verificationEmail = async () => { 
    const response = await axiosPrivate.post('/user/verification', {withCredentials: true})
    return response.data
}

export const verifyUser = async (token) => { 
    const response = await axiosPrivate.patch(`/auth/verify/${token}`, {withCredentials: true})
    return response.data
}

export const logoutUser = async() => {
    const response = await axiosPrivate.get('/auth/logout', { withCredentials: true })
    return response.data
}

export const editProfile = async (data) => { 
    // axiosPublic.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axiosPrivate.put(`/user/edit`, {...data})
    return response.data
}

export const deleteProfile = async () => { 
    const {data} = await axiosPrivate.delete(`/user/delete`)
    return data
}

// export const getLoggedInProfile = async () => { 
//     const response = await axiosPrivate.get('/user/profile', {withCredentials: true})
//     return response.data
// }