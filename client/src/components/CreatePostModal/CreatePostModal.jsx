import React, { useEffect, useState } from 'react'
import { CloseIcon, Filename, ImageUpload, MentionedUser, Message, Modal, ModalContent, ModalOverlay, PreviewImage, SubmitPost, Upload, UploadLable, WritePost } from './styles'
import { BsImage } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { axiosPrivate } from '../../api/apiRequest'
import { MentionsInput, Mention } from 'react-mentions'
import defaultStyle from './defaultStyle'
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { storage } from '../../firebase'
import { Button } from '../../pages/ForgetPassword/styles'
import { MdDelete } from 'react-icons/md'

const CreatePostModal = ({openModal, formType, postToEdit}) => {
  const [postImage, setPostImage] = useState(null)
  const [post, setPost] = useState(postToEdit?.content || "")
  const [image, setImage] = useState(postToEdit?.image || "")
  const [imagePreview, setImagePreview] = useState('')
  // const [postImageLink, setPostImageLink] = useState('')
  const [message, setMessage] = useState("")
  const [mention, setMention] = useState(postToEdit?.taggedUsers?.map(u => u.fullname) || "")
  // const [isLoading, setIsLoading] = useState(false)
  const [usersToBeTagged, setUsersToBeTagged] = useState([])
  const {unblockedUsers} = useSelector(state => state.user)
  const {currentUser} = useSelector(state => state.auth)
  // const dispatch = useDispatch()

  const queryClient = useQueryClient();

  useEffect(() => {
    unblockedUsers?.length && setUsersToBeTagged(unblockedUsers?.filter(u => u?._id !== currentUser?._id && !u?.isBlocked).map(user => {
      return{
        id: user?._id,
        display: user?.fullname,
      }
    }))
  }, [])

  useEffect(() => {
    if(message){
      setTimeout(() => {
        setMessage('')
      }, 2000);
    }
  }, [message])
  

  const imageHandler = (e) => {
    //check file size
    if(e.target.files[0]?.size > 1000000){
      setMessage('Thumbnail size should not exceed 1MB')
      return
    }
    setImage(e.target.files[0])

    if (!e.target.files[0] || !(e.target.files[0] instanceof Blob)) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader?.result);
      // console.log(imagePreview)
    };
    e.target.files[0] && reader.readAsDataURL(e.target.files[0]);
    // image?.name && PreviewImage && uploadToFirebase()
  }

  useEffect(() => {
    if(image?.name){
      uploadToFirebase()
    }
  }, [image])

  // console.log("image", image)

  //upload post image to Firebase
  const uploadToFirebase = async () => {
    try {
      const storageRef = ref(storage, 'images/' + image?.name);
      // console.log("storageRef", storageRef)
      const snapshot = await uploadBytes(storageRef, image)
      setPostImage(await getDownloadURL(snapshot.ref))

      // console.log('Image uploaded successfully!');
    } catch (error) {
      console.error(error)
    }
  }

  // Mutations
  const mutation = useMutation({
    mutationFn: async (newPost) => {
      return await axiosPrivate.post('/post/create', newPost)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['hashtags'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (updatedPost) => {
      return await axiosPrivate.patch(`/post/edit/${postToEdit?._id}`, updatedPost)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['hashtags'] })
    },
  })

  const removeImageHandler = async () => {
    const uploadedImgRef = ref(storage, `images/${image?.name}`);
    await deleteObject(uploadedImgRef)
    setImage('')
    setImagePreview('')
  }

  //submit post data to db
  const submitPostHandler = async (e) => {
    e.preventDefault()

    if(post?.trim().length === 0 && !postImage) {
      setMessage('Post content cannot be empty')
      setTimeout(() => {
        setMessage('')
      }, 2000);
      return
    }

    if(formType === 'Create Post'){
      mutation.mutate({
        userId: currentUser?._id,
        content: post,
        image: postImage,
        mention: mention
      })
    }else{
      updateMutation.mutate({
        userId: currentUser?._id,
        content: post,
        image: postImage
      })
    }

    setTimeout(() => {
      openModal(false)
    }, 2000);
  }

  return (
    <>
      <Modal>
        <ModalContent>
          <CloseIcon onClick={() => openModal(false)} />
          
          {formType === 'Create Post' ? <>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px', margin: '1.5rem 0 6px 0'}}>
              <h5>Tag users using '@'</h5>
              <span style={{color: 'red', fontSize: '12px'}}> (You can't change this later)</span>
            </div>
            {usersToBeTagged && <MentionsInput 
              singleLine={true} 
              name='mention' 
              value={mention} 
              onChange={e => setMention(e.target.value)} 
              autoComplete='off'
              style={{...defaultStyle, backgroundColor: `${({theme}) => theme.text}`}}
            >
              <Mention 
                style={{backgroundColor: '#e6b7ff', color: `${({theme}) => theme.text}`}} 
                data={usersToBeTagged?.filter(item => item?.id)} 
              />
            </MentionsInput>}
          </>
          : <MentionedUser>
            {mention?.length !== 0 && <h5>Tagged users: </h5>}
            {mention?.map((user, index) => (
              <p key={index} style={{color: `${({theme}) => theme.text}`}}>{user}</p>
            ))}
          </MentionedUser>
          }

          <form onSubmit={submitPostHandler}>
            <WritePost rows={8} placeholder='Write your post' name='post' value={post} onChange={(e) => setPost(e.target.value)} />
            {imagePreview && <PreviewImage src={imagePreview} alt="Preview" />}
            {imagePreview && <MdDelete style={{color: '#ae35f0', cursor: 'pointer', marginLeft: '1rem'}} onClick={removeImageHandler} />}
            {postImage && <Filename>{postImage?.postImage?.name}</Filename>}

            <ImageUpload>
              <div>
                <UploadLable htmlFor='upload' style={{fontSize: '1.5rem', cursor: 'pointer', color: '#ae35f0'}}>
                  <BsImage />
                </UploadLable>
                <Upload type='file' accept='image/*' id='upload' name='image' onChange={imageHandler} />
                <p style={{fontSize: '11px', color: '#ae35f0', fontWeight: '500'}}>{image?.name}</p>
              </div>
              <SubmitPost>{formType}</SubmitPost>
            </ImageUpload>
          </form>
          {message && <Message>{message}</Message>}
        </ModalContent>
      </Modal>

      {/* Background overlay */}
      <ModalOverlay onClick={() => openModal(false)}></ModalOverlay>
    </>
  )
}

export default CreatePostModal