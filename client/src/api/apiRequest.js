import axios from 'axios'

// 'Authorization': `Bearer ${accessToken}`
export const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_URL,
    withCredentials: true
})

export const axiosPrivate = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_URL,
    headers: {'Content-Type': 'application/json' },
    withCredentials: true
})

// export const jwtInterceptor = () => {
//     const {currentUser} = useSelector(state => state.auth)
//     console.log(currentUser)
//     axiosPrivate.interceptors.request.use(request => {
//         console.log(request)
//         console.log(currentUser)
//         request.headers.Authorization =  currentUser.accessToken ? `Bearer ${currentUser.accessToken}` : '';
//         return request;
//     }), (error) => Promise.reject(error)
// } 
