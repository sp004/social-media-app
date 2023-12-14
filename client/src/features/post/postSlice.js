import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAllPosts, getUserPosts } from './postService'

const initialState = {
    posts: [],
    userPosts: [],
    isLoading: false,
    isSuccess: false,
    message: ''
}

//get user profile
export const fetchAllPosts = createAsyncThunk("post/fetchAllPosts", async (_, thunkApi) => {
    try {
        return await getAllPosts()
    } catch (error) {
        // console.log(error)
        return thunkApi.rejectWithValue(error?.response?.data?.message)
    }
})

//get user profile
export const fetchUserPosts = createAsyncThunk("post/fetchUserPosts", async (userId, thunkApi) => {
    try {
        return await getUserPosts(userId)
    } catch (error) {
        // console.log(error)
        return thunkApi.rejectWithValue(error?.response?.data?.message)
    }
})

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    resetUserPosts: (state) => {
        state.isLoading = false,
        state.userPosts = [],
        state.isSuccess = false,
        state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
        //get all posts
        .addCase(fetchAllPosts.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchAllPosts.fulfilled, (state, {payload}) => {
            // console.log(payload)
            state.isLoading = false 
            state.isSuccess = true
            state.posts = payload.data
            state.message = payload.message
        })
        .addCase(fetchAllPosts.rejected, (state, {payload}) => {
            // console.log(payload)
            state.isLoading = false 
            state.isSuccess = false
            state.message = payload
        })

        //get user posts
        .addCase(fetchUserPosts.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchUserPosts.fulfilled, (state, {payload}) => {
            state.isLoading = false 
            state.isSuccess = true
            state.userPosts = payload.data
            state.message = payload.message
        })
        .addCase(fetchUserPosts.rejected, (state, {payload}) => {
            // console.log(payload)
            state.isLoading = false 
            state.isSuccess = false
            state.message = payload
        })
  },
});

export const {resetUserPosts} = postSlice.actions

export default postSlice.reducer