import React, { useEffect, useState } from 'react'
import { CoverImage, CoverImageContainer, CoverImageEdit } from '../styles'
import { AiOutlineCamera } from 'react-icons/ai'
import axios from 'axios'
import { axiosPrivate } from '../../../api/apiRequest'
import { useDispatch } from 'react-redux'
import { updateUser } from '../../../features/auth/authSlice'

const CoverPicture = ({isMyProfile, currentUser}) => {
    const dispatch = useDispatch()
    const [cover, setCover] = useState('')

    useEffect(() => {
        const uploadCoverPicHandler = async() => {
          try {
            const image = new FormData();
            image.append("file", cover);
            image.append("upload_preset", import.meta.env.VITE_APP_UPLOAD_PRESET);
    
            // save image to cloudinary
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUD_NAME}/image/upload?folder=${import.meta.env.VITE_APP_CLOUDINARY_FOLDER}/${import.meta.env.VITE_APP_CLOUDINARY_COVER_PIC_FOLDER}`, image);
            console.log(res?.data)
            console.log(res.data.url)
    
            //save to db
            await dispatch(updateUser({...currentUser, coverPic: res?.data?.url?.toString()}))

          } catch (error) {
            console.log(error) //cloudinary error 
            //console.log(error?.response?.data?.error?.message) // TODO: ignore this error, no need to show it
          }
        }
        uploadCoverPicHandler()
      }, [cover])

  return (
    <>
        {isMyProfile 
          ? 
          <CoverImageContainer isCoverPic={currentUser?.coverPic}>
            {currentUser?.coverPic ? <CoverImage src={currentUser?.coverPic} alt={currentUser?.fullname} /> : <h1 style={{color: 'grey'}}>Add cover photo</h1>}
            <CoverImageEdit htmlFor="cover">
              <AiOutlineCamera />
              <span>Edit</span>
            </CoverImageEdit>
            <input type="file" name="cover" id="cover" onChange={(e) => setCover(e.target?.files[0])} style={{display: 'none'}} />
          </CoverImageContainer> 
          :
          <CoverImageContainer isCoverPic={currentUser?.coverPic}>
            {currentUser?.coverPic ? <CoverImage src={currentUser?.coverPic} alt={currentUser?.fullname} /> : <div style={{backgroundColor: 'grey'}}></div>}
          </CoverImageContainer>
        }
    </>
  )
}

export default CoverPicture