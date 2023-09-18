import { axiosPrivate } from "../../api/apiRequest"

export const getFriends = async () => { 
    const response = await axiosPrivate.get(`/friend/allFriends`, {withCredentials: true})
    console.log("33333333333333333333333333333333", response.data)
    return response.data
}

export const fetchSentRequests = async () => { 
    const response = await axiosPrivate.get(`/friend/requestSent`)
    console.log(response.data)
    return response.data
}

export const requestsReceived = async () => { 
    const response = await axiosPrivate.get(`/friend/requestReceived`)
    console.log(response.data)
    return response.data
}

// export const getMutualFriends = async (userId) => { 
//     const response = await axiosPrivate.get(`/friend/mutualFriends/${userId}`)
//     console.log(response.data)
//     return response.data
// }