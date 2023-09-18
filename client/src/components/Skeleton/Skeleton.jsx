import React from 'react'
import styled, { keyframes } from 'styled-components'
import { PostBottomRow, PostContainer, PostInfo, PostTopRow } from '../Post/styles';

const shimmer = keyframes`
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
`;

const ProfilePictureSkeleton = styled.div`
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  margin-right: 10px;
  animation: ${shimmer} 2s infinite;
  background-image: linear-gradient(
    to right,
    #ccc 0%,
    #d8d8d8 20%,
    #ccc 40%,
    #ccc 100%
  );
`;

const PostContentSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ccc;
  padding: 10px;
  border-radius: 10px;
  animation: ${shimmer} 2s infinite;
  background-image: linear-gradient(
    to right,
    #ccc 0%,
    #d8d8d8 20%,
    #ccc 40%,
    #ccc 100%
  );
`;

const PostHeaderSkeleton = styled.div`
  width: 70px;
  height: 10px;
  margin-bottom: 10px;
  animation: ${shimmer} 2s infinite;
  background-image: linear-gradient(
    to right,
    #ccc 0%,
    #d8d8d8 20%,
    #ccc 40%,
    #ccc 100%
  );
`;

const PostActionSkeleton = styled.div`
  width: 100%;
  height: 15px;
  animation: ${shimmer} 2s infinite;
  background-image: linear-gradient(
    to right,
    #ccc 0%,
    #d8d8d8 20%,
    #ccc 40%,
    #ccc 100%
  );
`;

const PostTextSkeleton = styled.div`
  width: 100px;
  height: 6px;
  margin-bottom: 10px;
  animation: ${shimmer} 2s infinite;
  background-image: linear-gradient(
    to right,
    #ccc 0%,
    #d8d8d8 20%,
    #ccc 40%,
    #ccc 100%
  );
`;

const PostImageSkeleton = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  animation: ${shimmer} 2s infinite;
  background-image: linear-gradient(
    to right,
    #ccc 0%,
    #d8d8d8 20%,
    #ccc 40%,
    #ccc 100%
  );
`;

const Skeleton = () => {
  return (
    <PostContainer>
        <PostTopRow style={{justifyContent: 'flex-start'}}>
            <ProfilePictureSkeleton />
            <PostInfo>
                <PostHeaderSkeleton />
                <PostTextSkeleton />
            </PostInfo>
        </PostTopRow>

        <PostImageSkeleton />

        <PostBottomRow>
            <PostActionSkeleton />
        </PostBottomRow>

    </PostContainer>
  )
}

export default Skeleton