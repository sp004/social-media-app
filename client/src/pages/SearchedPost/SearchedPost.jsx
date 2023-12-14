import React, { useEffect, useState } from 'react'
import { axiosPrivate } from '../../api/apiRequest'
import { useSearchParams } from 'react-router-dom'
import Post from '../../components/Post/Post'
import styled from 'styled-components'
import { EmptyPlaceHolder } from '../../styles/variables'
import { device } from '../../styles/responsive'
import { ClipLoader } from 'react-spinners'

const SearchedPosts = styled.section`
  width: 80%;
  margin: 6rem auto 2rem auto;
  color: ${({theme}) => theme.text};

  h1{
    margin-left: 8rem;

    @media ${device.tablet}{
      margin: 1rem auto;
      text-align: center;
    }
  }
`

const Posts = styled.div`
  width: 60%;
  margin: 2rem auto;

  @media ${device.tablet}{
    width: 100%;
    margin: 1rem auto;
  }
`

const SearchedPost = () => {
  const [searchedPosts, setSearchedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams();
  const hashtag = searchParams.get('hashtag'); 
  document.title = `Posts with ${hashtag}`

  useEffect(() => {
    const fetchPostsByHashtags = async () => {
      setIsLoading(true);
      try {
        const {data} = await axiosPrivate.get(`/post/postByHashtags?hashtag=${hashtag}`)
        setSearchedPosts(() => data?.data)
      } catch (error) {
        console.error(error)
      }
      setIsLoading(false)
    }
    fetchPostsByHashtags()
  }, [hashtag])
  
  return (
    <SearchedPosts>
        <h1>Posts with <span style={{color: '#ae35f0'}}>#{hashtag}</span></h1>

        {isLoading ? 
          <EmptyPlaceHolder>
            <ClipLoader color='#ae35f0' />
          </EmptyPlaceHolder>
        : searchedPosts?.length > 0
          ?
            <Posts>
              {searchedPosts?.map((post, i) => (
                <Post key={i} post={post} />
              ))}
            </Posts>
          :
            <EmptyPlaceHolder style={{height: '70vh'}}>No matched posts</EmptyPlaceHolder>
        }
    </SearchedPosts>
  )
}

export default SearchedPost