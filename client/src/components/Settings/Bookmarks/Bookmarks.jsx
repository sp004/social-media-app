import React, { useEffect, useState } from 'react'
import { axiosPrivate } from '../../../api/apiRequest'
import { EmptyPlaceHolder } from '../../../styles/variables'
import Post from '../../Post/Post'
import styled from 'styled-components'
import { ClipLoader } from "react-spinners";
import { device } from '../../../styles/responsive'

const BookmarkContainer = styled.div`
  width: 60%;
  margin: 0 auto;

  @media ${device.laptop}{ 
    width: 80%;
  }

  @media ${device.tablet}{ 
    width: 100%;
  }
`

const Bookmarks = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  document.title = 'MeetChat - Bookmarks'

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      setIsLoading(true)
      try {
        const {data} = await axiosPrivate.get(`/bookmark/fetch`)
        console.log("++++++++++++", data?.data?.map(item => item.postId).flat())
        setBookmarkedPosts(data?.data?.map(item => item.postId).flat())
        setIsLoading(false)
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    }
    fetchBookmarkedPosts()
  }, [])
  

  return (
    <>
    {isLoading 
    ? 
      <EmptyPlaceHolder>
        <ClipLoader color='#ae35f0' />
      </EmptyPlaceHolder>
    : 
      <>
        {bookmarkedPosts?.length > 0 
        ? <BookmarkContainer>
          {bookmarkedPosts?.map((post, i) => (
            <Post key={i} post={post} />
          ))}
        </BookmarkContainer>
        : <>
          <EmptyPlaceHolder>
            No bookmarks found
          </EmptyPlaceHolder>
        </>
        }
      </>
    }
    </>
  )
}

export default Bookmarks