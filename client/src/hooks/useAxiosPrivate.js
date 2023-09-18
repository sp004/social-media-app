import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { axiosPrivate } from '../api/apiRequest'
import useRefreshToken from './useRefreshToken'

const useAxiosPrivate = () => {
    const {currentUser} = useSelector(state => state?.auth)
    console.log("user", currentUser)
    const refresh = useRefreshToken()

    useEffect(() => {
        const requestInterceptor = axiosPrivate.interceptors.request.use(
            config => {
                console.log(config)
                if(!config?.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${currentUser?.accessToken}`
                }
                return config
            }, (error) => Promise.reject(error)
        )
    
        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                console.log(error) //accessToken has expired, please login
                const prevRequest = error?.config
                console.log(prevRequest?.sent, "--", error?.response?.status)
                if(error?.response?.status === 403 && !prevRequest?.sent){
                    prevRequest.sent = true
                    const newAccessToken = await refresh()
                    console.log("nAt:", newAccessToken)
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return axiosPrivate(prevRequest)
                }
                return Promise.reject(error)
            }
        )
      
        return () => {
          axiosPrivate.interceptors.request.eject(requestInterceptor)
          axiosPrivate.interceptors.response.eject(responseInterceptor)
        }
      }, [refresh, currentUser])

  return axiosPrivate
}

export default useAxiosPrivate