import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { deleteProfile, editProfile, loginUser, logoutUser, registerUser, verificationEmail, verifyUser } from './authService'

const initialState = {
    isLoading: false,
    currentUser: null,
    isSuccess: false,
    isLoggedIn: false,
    message: '',
    accessToken: null,
}

//register user
export const userRegister = createAsyncThunk("auth/authregister", async (user, thunkApi) => {
    try {
        return await registerUser(user)
    } catch (error) {
        console.log(error)
        const message = error?.response?.data?.message    
        return thunkApi.rejectWithValue(message)
    }
})

//login
export const userLogin = createAsyncThunk("auth/authLogin", async (data, thunkApi) => {
    try {
        return await loginUser(data)
    } catch (error) {
        const  message = error?.response?.data?.message    
        return thunkApi.rejectWithValue(message)
    }
})  

//send Verification Email
export const sendVerificationEmail = createAsyncThunk("auth/sendVerificationEmail", async (_, thunkApi) => {
    try {
        return await verificationEmail()
    } catch (error) {
        console.log(error)
        const message = (error.response && error.response.data && error.response.data.message)
        return thunkApi.rejectWithValue(message)
    }
})

//logout
export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
    try {
        return await logoutUser()
    } catch (error) {
        const message = error?.response?.data?.message    
        return thunkApi.rejectWithValue(message)
    }
}) 

//verify user
export const userVerification = createAsyncThunk("auth/userVerification", async (token, {rejectWithValue}) => {
    try {
        return await verifyUser(token)
    } catch (error) {
        console.log(error)
        const message = (error.response && error.response.data && error.response.data.errMsg)
        return rejectWithValue(message)
    }
})

// update user profile
export const updateUser = createAsyncThunk("auth/updateUser", async (data, thunkApi) => {
    try {
        return await editProfile(data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
        return thunkApi.rejectWithValue(message)
    }
})

// delete user profile
export const deleteUser = createAsyncThunk("auth/deleteUser", async (_, thunkApi) => {
    try {
        return await deleteProfile()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
        return thunkApi.rejectWithValue(message)
    }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
        state.isLoading = false
        state.message = ""  
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(userRegister.pending, (state) => {
            state.isLoading = true
        })
        .addCase(userRegister.fulfilled, (state, {payload}) => {
            state.isLoading = false 
            state.currentUser = payload.user 
            state.isSuccess = true
            state.isLoggedIn = true
            state.message = payload.message
            state.accessToken = payload.accessToken
        })
        .addCase(userRegister.rejected, (state, {payload}) => {
            console.log(payload)
            state.isLoading = false 
            state.currentUser = null 
            state.isSuccess = false
            state.isLoggedIn = false
            state.message = payload
            state.accessToken = null
        })

        .addCase(userLogin.pending, (state) => {
            state.isLoading = true
        })
        .addCase(userLogin.fulfilled, (state, {payload}) => {
            state.isLoading = false 
            state.currentUser = payload.user 
            state.isSuccess = true
            state.isLoggedIn = true
            state.message = payload.message
            state.accessToken = payload.accessToken
        })
        .addCase(userLogin.rejected, (state, {payload}) => {
            console.log(payload)
            state.isLoading = false 
            state.currentUser = null 
            state.isLoggedIn = false
            state.isSuccess = false
            state.message = payload
            state.accessToken = null
        })

        //logout
        .addCase(logout.pending, (state) => {
            state.isLoading = true
        })
        .addCase(logout.fulfilled, (state, {payload}) => {
            state.isLoading = false 
            state.currentUser = null
            state.isSuccess = true
            state.isLoggedIn = false
            state.message = payload?.message
            state.accessToken = null
        })
        .addCase(logout.rejected, (state, {payload}) => {
            console.log(payload)
            state.isLoading = false 
            state.isSuccess = false
            state.message = payload
        })

        .addCase(sendVerificationEmail.pending, (state) => {
            state.isLoading = true
        })
        .addCase(sendVerificationEmail.fulfilled, (state, {payload}) => {
            state.isLoading = false 
            state.isSuccess = true
            state.message = payload.message
        })
        .addCase(sendVerificationEmail.rejected, (state, {payload}) => {
            console.log(payload)
            state.isLoading = false 
            state.isSuccess = false
            state.message = payload.message
        })

        //verify user
        .addCase(userVerification.pending, (state) => {
            state.isLoading = true
        })
        .addCase(userVerification.fulfilled, (state, {payload}) => {
            state.isLoading = false 
            state.isSuccess = true
            state.currentUser = payload.user
            state.message = payload.message
        })
        .addCase(userVerification.rejected, (state, {payload}) => {
            console.log(payload)
            state.isLoading = false 
            state.isSuccess = false
            state.message = payload.message
        })

        // update user profile
        .addCase(updateUser.pending, (state) => {
            state.isLoading = true
        })
        .addCase(updateUser.fulfilled, (state, {payload}) => {
            console.log(payload)
            state.isLoading = false 
            state.isSuccess = true
            state.currentUser = payload.user
            state.message = payload.message
        })
        .addCase(updateUser.rejected, (state, {payload}) => {
            console.log(payload)
            state.isLoading = false 
            state.isSuccess = false
            state.message = payload
        })

        // delete user profile
        .addCase(deleteUser.pending, (state) => {
            state.isLoading = true
        })
        .addCase(deleteUser.fulfilled, (state, {payload}) => {
            console.log(payload)
            state.isLoading = false 
            state.isSuccess = true
            state.currentUser = null
            state.isLoggedIn = false
            state.accessToken = null
            state.message = payload.message
        })
        .addCase(deleteUser.rejected, (state, {payload}) => {
            console.log(payload)
            state.isLoading = false 
            state.isSuccess = false
            state.message = payload
        })
    },
});

export const {reset} = authSlice.actions

export default authSlice.reducer