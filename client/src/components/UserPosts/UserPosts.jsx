import React, { useEffect } from 'react'
import Post from '../Post/Post'
import { EmptyPlaceHolder } from '../../styles/variables'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserPosts, resetUserPosts } from '../../features/post/postSlice'
import Skeleton from '../Skeleton/Skeleton'
// import styled from 'styled-components'

// const UserPostContainer = styled.div`
    /* background-color: ${({theme}) => theme.bgTertiary}; */

// `

const UserPosts = ({user, userPosts}) => {
    const dispatch = useDispatch()
    const {isLoading} = useSelector(state => state.post)

    // useEffect(() => {
    //     dispatch(resetUserPosts())
    //     dispatch(fetchUserPosts(user?._id))
    // }, [user?._id])

    // const fetchPopularUsersPosts = async () => {
    //     try {
    //         const {data} = await axiosPrivate.get(`/post/popularUserPosts/${user?._id}`)
    //         console.log(data?.data)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    
  return (
    <>
        {
            isLoading 
                ? 
                <>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </> 
                : 
                <>
                    {userPosts?.length > 0 
                        ? 
                            <>
                                {userPosts?.map((post, i) => (
                                    <Post key={i} post={post} />
                                ))}
                            </>
                        :
                            <EmptyPlaceHolder style={{height: '40vh', fontSize: '1.5rem'}}>No posts yet</EmptyPlaceHolder>
                    }
                </>
        }
    </>
  )
}

export default UserPosts