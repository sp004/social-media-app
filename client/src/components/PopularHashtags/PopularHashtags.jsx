import React, { useEffect, useState } from 'react'
import { SuggestedFriendsContainer, SuggestedFriendsList, Tag } from './styles'
import { axiosPrivate } from '../../api/apiRequest'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const PopularHashtags = () => {
  // const [hashtags, setHashtags] = useState([])
  const navigate = useNavigate()

  const fetchTopHashtags = async () => {
    const {data} = await axiosPrivate.get('/post/topHashtags')
    // console.log("🧧🧧", data?.data)
    return data?.data?.sort((a, b) => b?.number - a?.number)
  }

  const { isLoading, error, data: hashtags } = useQuery({
    queryKey: ['hashtags'],
    queryFn: fetchTopHashtags
  })
  
  return (
    <SuggestedFriendsContainer>
      <h4>Top 5 trending <i style={{color: '#ae35f0'}}>#hashtags</i></h4>  
      <hr style={{width: '150px', height: '4px', background: '#ae35f0', border: 'none', marginTop: '4px'}} />

      <SuggestedFriendsList>
        {isLoading && <p>Loading...</p>}
        {hashtags?.map((hashtag, i) => (
          <Tag key={i} onClick={() => navigate(`/posts?hashtag=${hashtag?.tag?.split('#')[1]}`)}>
            <p onClick={() => navigate(`/posts?hashtag=${hashtag?.tag?.split('#')[1]}`)} 
              style={{fontWeight: '600'}} key={i}>{hashtag?.tag}</p>
            <p>{hashtag?.number > 1 ? `${hashtag?.number} Posts` : `${hashtag?.number} Post`}</p>
          </Tag>
        ))}
      </SuggestedFriendsList>
    </SuggestedFriendsContainer>
  )
}

export default PopularHashtags