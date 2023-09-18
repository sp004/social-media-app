import React, { useEffect, useState } from "react";
import { fetchReceivedRequests } from "../../../features/friend/friendSlice";
import { ButtonDiv, Friend, FriendAvatar, FriendDetails, FriendInfo, FriendsDiv } from "../styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../../api/apiRequest";
import Accept from "../../FriendButtons/Accept";
import Reject from "../../FriendButtons/Reject";
import AddFriend from "../../FriendButtons/AddFriend";
import Block from "../../FriendButtons/Block";

const FriendRequest = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const dispatch = useDispatch()
  const {friendRequestsReceived} = useSelector(state => state.friend)
  const navigate = useNavigate()

  // useEffect(() => {
  //   dispatch(fetchReceivedRequests())
  // }, [])

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const {data} = await axiosPrivate.get('/friend/suggestions')
        console.log(data?.data)
        setSuggestedUsers(data?.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchSuggestedUsers()
  }, [])
  

  console.log("🤑🤑🤑", friendRequestsReceived)
  console.log("😨😨😨", suggestedUsers)

  return (
    <>
      {friendRequestsReceived?.length > 0 ?
      <FriendsDiv>
        {friendRequestsReceived?.map((user, i) => (
          <Friend key={i}>
            <FriendInfo onClick={() => navigate(`/profile/${user?.username}`)}>
              <FriendAvatar src={user?.profilePic} alt={user?.fullname} />
              <FriendDetails>
                <h5>{user?.fullname}</h5>
                <p>{user?.mutualFriends?.length > 0 ? `${user?.mutualFriends?.length} mutual friends` : ''}</p>
              </FriendDetails>
            </FriendInfo>
            {!user?.isDeactivated && <ButtonDiv>
              <Accept user={user} />
              <Reject user={user} />
              {/* <FriendStatusButton onClick={() => acceptRequestHandler(user?._id)}>Accept</FriendStatusButton> */}
              {/* <FriendStatusButton onClick={() => rejectRequestHandler(user?._id)}>Reject</FriendStatusButton> */}
            </ButtonDiv>}
          </Friend>
        ))}
      </FriendsDiv>
      : (
        <FriendsDiv style={{height: '15vh', color: 'lightgrey', textAlign: 'center'}}>
          <h1>No friend requests received</h1>
        </FriendsDiv>
      )}

      <hr />

      <FriendsDiv>
        <h3 style={{margin: '12px 0'}}>Suggestions for you</h3>

        {suggestedUsers?.map((user, i) => (
          <Friend key={i}>
            <FriendInfo onClick={() => navigate(`/profile/${user?.username}`)}>
              <FriendAvatar src={user?.profilePic} alt={user?.fullname} />
              <FriendDetails>
                <h5>{user?.fullname}</h5>
                <p>{user?.mutualFriends?.length > 0 ? `${user?.mutualFriends?.length} mutual friends` : ''}</p>
              </FriendDetails>
            </FriendInfo>
            {!user?.isDeactivated && <ButtonDiv>
              <AddFriend user={user} />
              <Block user={user} />
            </ButtonDiv>}
          </Friend>
        ))}
      </FriendsDiv>
    </>
  );
};

export default FriendRequest;
