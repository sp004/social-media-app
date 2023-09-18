import { axiosPrivate } from "../../api/apiRequest"

export const getUserProfile = async (username) => { 
    const response = await axiosPrivate.get(`/user/profile/${username}`, {withCredentials: true})
    console.log("-----*************---------", response.data)
    return response.data
}

export const getUnblockedUsers = async () => { 
    const response = await axiosPrivate.get(`/friend/unblockedUsers`, {withCredentials: true})
    console.log("🎅🎅🎅", response?.data)
    return response.data
}

// export const getBlockedUsers = async () => { 
//     const response = await axiosPrivate.get(`/friend/blockedUsers`, {withCredentials: true})
//     return response.data
// }
