import React, { useContext } from "react";
import { OnlineDot, OnlineFriendsContainer, OnlineFriendsList, UserCard, UserProfileInfo } from "./styles";
import { SocketContext } from "../../context/socketContext";
import { Avatar } from "../Post/styles";
import { BiChat } from 'react-icons/bi'
import { useNavigate } from "react-router-dom";
import { EmptyPlaceHolder } from "../../styles/variables";
import useChat from "../../hooks/useChat";

const OnLineFriends = () => {
  const {onlineUsers} = useContext(SocketContext)
  const navigate = useNavigate()
  const onChatClicked = useChat()

  return (
    <OnlineFriendsContainer>
      <h4>Active Now</h4>
      <OnlineFriendsList>
      {onlineUsers?.length === 0 
      ? 
      <EmptyPlaceHolder style={{textAlign: 'center', height: '30vh', fontSize: '1.5rem'}}>
        No active users
      </EmptyPlaceHolder>
      : 
      <>
        {onlineUsers?.map((user, i) => (
          <UserCard key={i}>
            <UserProfileInfo onClick={() => navigate(`/profile/${user?.username}`)}>
              <Avatar src={user?.profilePic} alt={user?.username} />
              <h5>{user?.fullname}</h5>
            </UserProfileInfo>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
              <BiChat onClick={() => onChatClicked(user)} style={{cursor: 'pointer'}} />
              <OnlineDot></OnlineDot>
            </div>
          </UserCard>
        ))}
      </>
      }
      </OnlineFriendsList>
    </OnlineFriendsContainer>
  );
};

export default OnLineFriends;
