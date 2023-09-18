import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchSentRequests, getFriends, requestsReceived } from './friendService'

const initialState = {
    isLoading: false,
    friends: [],
    friendRequestsReceived: [],
    friendRequestsSent: [],
    // mutualFriends: [],
    isSuccess: false,
    message: ''
}

//get all friends
export const fetchFriends = createAsyncThunk("friend/fetchFriends", async (_, thunkApi) => {
    try {
        return await getFriends()
    } catch (error) {
        console.log(error)
        return thunkApi.rejectWithValue(error?.response?.data?.message)
    }
})

//get users to whom request is sent
export const fetchSentFriendRequests = createAsyncThunk("friend/fetchSentFriendRequests", async (_, thunkApi) => {
    try {
        return await fetchSentRequests()
    } catch (error) {
        console.log(error)
        return thunkApi.rejectWithValue(error?.response?.data?.message)
    }
})

//get all users from whom request has been received
export const fetchReceivedRequests = createAsyncThunk("friend/fetchReceivedRequests", async (_, thunkApi) => {
    try {
        return await requestsReceived()
    } catch (error) {
        console.log(error)
        return thunkApi.rejectWithValue(error?.response?.data?.message)
    }
})

//get mutual friends
// export const fetchMutualFriends = createAsyncThunk("friend/fetchMutualFriends", async (userId, thunkApi) => {
//     try {
//         return await getMutualFriends(userId)
//     } catch (error) {
//         console.log(error)
//         return thunkApi.rejectWithValue(error?.response?.data?.message)
//     }
// })


const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    resetFriends: (state) => {
        state.friends = [],
        state.friendRequestsReceived = [],
        state.friendRequestsSent = [],
        state.isLoading = false,
        state.isSuccess = false,
        state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
        //get all friends
        .addCase(fetchFriends.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchFriends.fulfilled, (state, {payload}) => {
            console.log(payload.data)
            state.isLoading = false 
            state.isSuccess = true
            state.friends = payload.data
            state.message = payload.message
        })
        .addCase(fetchFriends.rejected, (state, {payload}) => {
            console.log(payload)
            state.isLoading = false 
            state.isSuccess = false
            state.message = payload
        })

        //sent friend request
        .addCase(fetchSentFriendRequests.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchSentFriendRequests.fulfilled, (state, {payload}) => {
            console.log(payload)
            state.isLoading = false 
            state.isSuccess = true
            state.friendRequestsSent = payload.data
            state.message = payload.message
        })
        .addCase(fetchSentFriendRequests.rejected, (state, {payload}) => {
            console.log(payload)
            state.isLoading = false 
            state.isSuccess = false
            state.message = payload
        })

        //received friend request
        .addCase(fetchReceivedRequests.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchReceivedRequests.fulfilled, (state, {payload}) => {
            console.log(payload)
            state.isLoading = false 
            state.isSuccess = true
            state.friendRequestsReceived = payload.data
            state.message = payload.message
        })
        .addCase(fetchReceivedRequests.rejected, (state, {payload}) => {
            console.log(payload)
            state.isLoading = false 
            state.isSuccess = false
            state.message = payload
        })
  },
});

export const {resetFriends} = friendSlice.actions

export default friendSlice.reducer