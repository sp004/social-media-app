import { useLocation, useNavigate } from 'react-router-dom'
import { axiosPublic } from '../api/apiRequest'

const useRefreshToken = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const refresh = async () => {
    try {
      const res = await axiosPublic.get('/auth/refresh', {
        withCredentials: true
      })
      console.log(res.data)
      return res.data.accessToken
    } catch (error) {
      navigate('/', { state: { from: location }, replace: true });
    }
  }
  return refresh
}

export default useRefreshToken