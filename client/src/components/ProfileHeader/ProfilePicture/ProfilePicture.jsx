import React, { useEffect, useRef, useState } from "react";
import { AvatarPreviewWrapper, EditIcon, ProfileImage, ProfilePicContainer, ToolBox, ToolBoxItem, UploadButton, UserInfo, UserInfoHeader, ViewAvatar } from "../styles";
import { Modal } from "../../CreatePostModal/styles";
import AvatarEditor from "react-avatar-editor";
import axios from "axios";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../features/auth/authSlice";
import { device } from "../../../styles/responsive";
import { toast } from "react-hot-toast";

const ProfilePicture = ({isMyProfile, currentUser, auth}) => {
  const dispatch = useDispatch()
  const [avatar, setAvatar] = useState(null);
  const [showToolbox, setShowToolbox] = useState(false);
  const [editor, setEditor] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [viewAvatar, setViewAvatar] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const modalAvatarRef = useRef();
  const viewAvatarRef = useRef();

  useEffect(() => {
    setShowToolbox(false)
    setTimeout(() => {
      avatar && setOpenModal(true)
    }, 1000);
    setOpenModal(false)
  }, [avatar])

  // Close the component if the user clicks outside of it
  const handleClickOutside = event => {
    if (modalAvatarRef.current && !modalAvatarRef.current.contains(event.target)) {
      setOpenModal(false);
    }
    if (viewAvatarRef.current && !viewAvatarRef.current.contains(event.target)) {
      setViewAvatar(false);
    }
  };

  // Add event listener to detect clicks outside of the component
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  const handleAvatarUpload = async() => {
    if(!editor) return 

    // Create a canvas with the cropped image
    const canvas = editor.getImageScaledToCanvas();

    try {
      canvas.toBlob(async (blob) => {
        // Upload the cropped image to Cloudinary
        const image = new FormData();
        image.append("file", blob);
        image.append("upload_preset", import.meta.env.VITE_APP_UPLOAD_PRESET);

        // save image to cloudinary
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUD_NAME}/image/upload?folder=${import.meta.env.VITE_APP_CLOUDINARY_FOLDER}/${import.meta.env.VITE_APP_CLOUDINARY_PROFILE_PIC_FOLDER}`, image);

        //save to db
        await dispatch(updateUser({...currentUser, profilePic: res?.data?.url?.toString()}))
        if(auth?.isSuccess){
          setShowToolbox(false)
          setMessage('Profile picture updated successfully')
        } 
        setTimeout(() => {
          setOpenModal(false)
        }, 1500);
      }, 'image/*');
    } catch (error) {
      setError('Something went wrong')
    }
  }

  const removeAvatarHandler = async () => {
    await dispatch(updateUser({...currentUser, profilePic: `https://i.ibb.co/4pDNDk1/avatar.png`}))
    // try {
    //   await axiosPrivate.put(`/user/edit`, {...currentUser, profilePic: `https://i.ibb.co/4pDNDk1/avatar.png`})
    //   setShowToolbox(false)
    // } catch (error) {
    //   console.log(error?.response?.data?.message)
    // }
  }

  return (
    <>
        <UserInfo>
          <ProfilePicContainer isMyProfile={isMyProfile}>
            <ProfileImage 
              src={currentUser?.profilePic} 
              alt={currentUser?.fullname} onClick={() => setViewAvatar(true)} />
            {isMyProfile && <EditIcon as={MdOutlineModeEditOutline} onClick={() => {
              if(!currentUser?.isVerified){
                toast.error('You are not verified yet')
                return
              } 
              setShowToolbox(prev => !prev)
            }} />}

            {/* toolbox for avatar edit  */}
            {isMyProfile && showToolbox && <ToolBox>
              <ToolBoxItem>
                <label htmlFor="avatar">Upload a photo</label>
                <input type="file" name="avatar" id="avatar" accept='image/*' onChange={(e) => setAvatar(e.target.files[0])} style={{display: 'none'}} />
              </ToolBoxItem>
              <hr />
              <ToolBoxItem onClick={removeAvatarHandler}>Remove avatar</ToolBoxItem>
            </ToolBox>}
          </ProfilePicContainer>
          
          <UserInfoHeader>
            <h2>{currentUser?.fullname}</h2>
            {!isMyProfile && currentUser?.mutualFriends.length > 0 && <sub>{currentUser?.mutualFriends.length} mutual friends</sub>}
            <p>{currentUser?.status}</p>
          </UserInfoHeader>
        </UserInfo>

        {viewAvatar && <ViewAvatar src={currentUser?.profilePic} alt={currentUser?.fullname} ref={viewAvatarRef} />}

        {openModal && <Modal style={{width: '75%', height: '80%', background: `${({theme}) => theme.bgTertiary}`}} profilePic={true} ref={modalAvatarRef}>
          <AvatarPreviewWrapper>
            <AvatarEditor
              ref={(e) => setEditor(e)}
              image={avatar}
              width={device.tabletS ? 200 : 400}
              height={device.tabletS ? 200 : 400}
              borderRadius={200}
              color={[255, 255, 255, 0.7]}
              scale={zoom}
              position={crop}
              onPositionChange={(data) => setCrop({ x: data.x, y: data.y })}
            />
            <div>
              <label htmlFor="zoom">Zoom: </label> 
              <input
                type="range"
                id="zoom"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
              />
            </div>
            {message && <sub style={{color: '#54ad54'}}>{message}</sub>}
            <UploadButton onClick={handleAvatarUpload}>Upload</UploadButton>
            {error && <p style={{color: 'red'}}>{error}</p>}
          </AvatarPreviewWrapper>
        </Modal>}
    </>
  );
};

export default ProfilePicture;
