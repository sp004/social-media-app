import { axiosPrivate } from "../../api/apiRequest"

export const getUserProfile = async (username) => { 
    const response = await axiosPrivate.get(`/user/profile/${username}`, {withCredentials: true})
    return response.data
}

export const getUnblockedUsers = async () => { 
    const response = await axiosPrivate.get(`/friend/unblockedUsers`, {withCredentials: true})
    return response.data
}

