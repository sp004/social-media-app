import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUnblockedUsers, getUserProfile } from './userService'

const initialState = {
    user: [],
    unblockedUsers: [],
    suggestedUsers: [],
    isLoading: false,
    isSuccess: false,
    message: ''
}


//get user profile
export const fetchUserProfile = createAsyncThunk("user/fetchUserProfile", async (username, thunkApi) => {
    try {
        return await getUserProfile(username)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
        return thunkApi.rejectWithValue(message)
    }
})

//get all unblocked users
export const fetchUnblockedUsers = createAsyncThunk("user/fetchUnblockedUsers", async (_, thunkApi) => {
    try {
        return await getUnblockedUsers()
    } catch (error) {
        // console.log(error)
        return thunkApi.rejectWithValue(error?.response?.data?.message)
    }
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUsers: (state) => {
        state.isLoading = false,
        state.user = [],
        state.unblockedUsers = [],
        state.isSuccess = false,
        state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
        //get logged in user profile
        .addCase(fetchUserProfile.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchUserProfile.fulfilled, (state, {payload}) => {
            // console.log(payload.data)
            state.isLoading = false 
            state.isSuccess = true
            state.user = payload.data
            state.message = payload.message
        })
        .addCase(fetchUserProfile.rejected, (state, {payload}) => {
            // console.log(payload)
            state.isLoading = false 
            state.isSuccess = false
            state.message = payload
        })

        //get all unblocked users
        .addCase(fetchUnblockedUsers.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchUnblockedUsers.fulfilled, (state, {payload}) => {
            // console.log(payload.data)
            state.isLoading = false 
            state.isSuccess = true
            state.unblockedUsers = payload.data
            state.message = payload.message
        })
        .addCase(fetchUnblockedUsers.rejected, (state, {payload}) => {
            // console.log(payload)
            state.isLoading = false 
            state.isSuccess = false
            state.message = payload
        })
  },
});

export const {resetUsers} = userSlice.actions

export default userSlice.reducer