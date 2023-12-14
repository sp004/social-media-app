import React, { useEffect, useState } from "react";
import Post from "../Post/Post";
import { EmptyPlaceHolder } from "../../styles/variables";
import styled from "styled-components";
import { axiosPrivate } from "../../api/apiRequest";
import { device } from "../../styles/responsive";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const TaggedPostContainer = styled.div`
  width: 60%;
  margin: 0 auto;

  @media ${device.laptop}{ 
    width: 80%;
  }

  @media ${device.tablet}{ 
    width: 100%;
  }
`

const TaggedPosts = () => {
    document.title = 'MeetFrends - Tagged Posts';
    const [taggedPosts, setTaggedPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchTaggedPosts = async () => {
      setIsLoading(true)
      try {
        const {data} = await axiosPrivate.get(`/post/tagged`)
        setTaggedPosts(data?.data)
        setIsLoading(false)
      } catch (error) {
        toast.error('Please try again later')
        setIsLoading(false)
      }
    }
    fetchTaggedPosts()
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
          {taggedPosts?.length > 0 ? (
            <TaggedPostContainer>
              {taggedPosts?.map((post, i) => (
                <Post key={i} post={post} />
              ))}
            </TaggedPostContainer>
          ) : (
            <>
              <EmptyPlaceHolder>You aren't tagged in any post</EmptyPlaceHolder>
            </>
          )}
        </>
      }
    </>
  );
};

export default TaggedPosts;
