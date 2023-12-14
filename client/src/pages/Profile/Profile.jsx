import React, { useEffect, useState } from "react";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import { Error, ProfileContainer } from "./styles";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, resetUsers } from "../../features/user/userSlice";
import UserPosts from "../../components/UserPosts/UserPosts";
import { fetchUserPosts, resetUserPosts } from "../../features/post/postSlice";
import { axiosPrivate } from "../../api/apiRequest";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  document.title = 'MeetFrends - Profile'
  const dispatch = useDispatch()
  
  const username = useLocation().pathname.split("/")[2];
  const auth = useSelector(state => state.auth)
  const {message, isSuccess} = useSelector(state => state.user)
  const {userPosts} = useSelector(state => state.post)

  const fetchUserProfile = async () => {
    const {data} = await axiosPrivate.get(`/user/profile/${username}`)
    console.log("data ******",data)
    return data?.data
  }

  const { isLoading, error, data: user } = useQuery({
    queryKey: ['user', username],
    queryFn: fetchUserProfile
  })

  useEffect(() => {
    // dispatch(resetUsers())
    // dispatch(fetchUserProfile(username)) //fetching other users profile

    dispatch(resetUserPosts())
    dispatch(fetchUserPosts(user?._id))
  }, [user?._id]);
  // console.log("user ===>", user)

  // useEffect(() => {
  //   if(auth?.currentUser?.username === username) return
  //   console.log(user?._id)
  //   user?._id && dispatch(fetchMutualFriends(user?._id))
  // }, [user, username])

  console.log("⭐", auth)
  console.log("🥱", user)

  return (
    <>
      {user?.length === 0
      ?
       <Error>
        <h1>Username {username} doesn't exist</h1>
       </Error> 
      :
        user?.checkStatus === 'Blocked' 
        ?
        <Error>
          <h1>You have blocked the account</h1>
        </Error>
        :
          user?.isBlocked 
          ?
          <Error>
            <h1>{user?.fullname} has blocked you</h1>
          </Error>
          :
            user?.isDeactivated
            ?
            <Error>
              <h1>User account is deactivated</h1>
            </Error>
            :
            <ProfileContainer>
              <ProfileHeader auth={auth} currentUser={user} isMyProfile={auth?.currentUser.username === username ? true : false} posts={userPosts} />
              <hr />
              <UserPosts user={user} userPosts={userPosts} />
            </ProfileContainer>
      }
    </>
  );
};

export default Profile;