import { axiosPrivate } from "../../api/apiRequest"

export const getAllPosts = async () => { 
    const response = await axiosPrivate.get(`/post/allPosts`, {withCredentials: true})
    // console.log(response.data)
    return response.data
}

export const getUserPosts = async (userId) => { 
    const response = await axiosPrivate.get(`/post/userPosts/${userId}`, {withCredentials: true})
    // console.log(response.data)
    return response.data
}
