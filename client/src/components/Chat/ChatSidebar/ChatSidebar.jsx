import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "../../CreatePost/styles";
import { axiosPrivate } from "../../../api/apiRequest";
import { useSelector } from "react-redux";
import { ChatContext } from "../../../context/ChatContext";
import { GrFormClose } from "react-icons/gr";
import { flexBetween, style } from "../../../styles/variables";
import moment from "moment";
import { device } from "../../../styles/responsive";
import { useLocation } from "react-router-dom";

const ChatSidebarContainer = styled.div`
  flex: 0.25;
  background-color: ${({theme}) => theme.chatSidebar};
  /* height: calc(100vh - 60px); */

  ::-webkit-scrollbar {
    display: none;
  }

  @media ${device.tablet}{ 
    flex: 0.3;
  }

  @media ${device.tabletS}{ 
    flex: ${(props) => props.isSelected ? 0 : 1};
  }
`;

const ChatSidebarWrapper = styled.div`
  width: 100%;
  padding: 1rem 4px;
`;

const SearchFriendWrapper = styled.div`
  ${flexBetween}
  margin-bottom: 1rem;
`;

const SearchFriend = styled.input`
  border: none;
  border-bottom: 2px solid ${({theme}) => theme.soft};
  color: ${({theme}) => theme.text};
  outline: none;
  width: 100%;
  height: 40px;
  background-color: transparent;
  padding: 4px 8px;
  font-size: 14px;
  /* margin-bottom: 1rem; */

  ::placeholder{
    color: ${({theme}) => theme.text};
  }

  @media ${device.tablet}{ 
    font-size: ${style.mobileText};
  }
`;

const ReceiverCard = styled.div`
  padding: 6px;
  ${flexBetween}
  gap: 10px;
  background-color: ${(props) => (props.selected ? "#ae35f0" : `${props.theme.bgTertiary}`)};
  color: ${(props) => (props.selected ? "#fff" : `${props.theme.text}`)};
  cursor: pointer;
  border-radius: 5px;
  margin: 6px 0;

  h5 {
    text-transform: capitalize;
  }
`;

const MessageSender = styled.div`
  height: 50px;
  overflow: hidden;
  flex: 1;
`;

const SidebarMessage = styled.span`
  /* width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; */

  span {
    margin: 0;
  }
`;

const ChatSidebar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  // const [allConversations, setAllConversations] = useState([])
  // const [selectedConversation, setSelectedConversation] = useState({})
  // const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  // const [blockedList, setBlockedList] = useState([])
  const { currentUser } = useSelector((state) => state.auth);
  const { unblockedUsers } = useSelector((state) => state.user); 
  const {
    conversation,
    setConversation,
    setChats,
    chats,
    allConversations,
    setAllConversations,
    setSelectedConversation,
  } = useContext(ChatContext);
  const {state: user} = useLocation()

  //fetch all conversations
  useEffect(() => {
    console.log("calling fetch all conversations =============================")
    const getAllConversations = async () => {
      // setLoading(true)
      try {
        const { data } = await axiosPrivate.get("/conversation/getConversation");

        setAllConversations(
          data?.data?.map((item) => {
            const [user] = item?.users?.filter(user => user._id !== currentUser._id);
            // console.log("✔✔✔", user)
            // console.log(unblockedUsers)
            const checkStatus = unblockedUsers?.some(item => item?._id === user?._id)
            const isBlocked = unblockedUsers?.filter(item => item?._id === user?._id)[0]?.isBlocked
            // console.log(checkStatus, isBlocked) 
            return {
              user,
              blocked: !checkStatus,
              isBlocked,
              ...item,
            };
          })
        );
        // setAllConversations(data?.data?.map(con => con?.users.filter(item => item._id !== currentUser._id)))
      } catch (error) {
        console.error(error);
      }
      // setLoading(false)
    };
    getAllConversations();
    conversation?._id && setSelectedConversation(conversation);
  }, [chats?.length, conversation]);

  
  // useEffect(() => {
  //   if(user && Object.keys(user).length > 0 && !allConversations?.some(conversation => conversation.user._id === user._id)){
  //     axiosPrivate.post('/conversation/create', {
  //       senderId: currentUser?._id,
  //       receiverId: user?._id
  //     })
  //     .then(response => {
  //       const data = response.data;
  //       const matched = allConversations?.filter(conversation => {
  //         return conversation._id === data?.data?._id
  //       })
  //       setConversation(matched);
  //     })
  //     .catch(error => {
  //       // Handle error if the axios request fails
  //       console.error(error);
  //     });
  //   }
  // }, [allConversations, user])

  useEffect(() => {
    const loadChat = async () => {
      if (!conversation?._id) {
        return;
      } else {
        try {
          const { data } = await axiosPrivate.get(
            `/message/getMessage/${conversation?._id}`
          );
          setChats(data.data);
          // setChats((prev) => [...prev, data?.data])
        } catch (error) {
          console.error(error);
        }
      }
    };
    loadChat();
  }, [conversation?._id]);

  const selectConversationHandler = async (conversation) => {
    conversation?._id && setConversation(conversation);
    setSearch("");
    setSearchResult([]);
  };
  // console.log("chat ==>", chats)

  //user search for conversation
  const searchUserHandler = async (e) => {
    setSearch(e.target.value);

    // const filteredUsers = allConversations.reduce((acc, curr) => {
    //   const filtered = curr.user.fullname.includes(e.target.value)
    //   return acc.concat(filtered)
    // }, [])
    setSearchResult(
      allConversations?.filter((conversation) =>
        conversation?.user?.fullname
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <ChatSidebarContainer isSelected={Object.keys(conversation).length > 0 ? true : false}>
      {!loading ? 
      <ChatSidebarWrapper>
        <SearchFriendWrapper>
          <SearchFriend
            type="text"
            placeholder="Search friend"
            name="search"
            value={search}
            onChange={searchUserHandler}
            autoComplete="off"
          />
          {search && (
            <GrFormClose
              style={{ cursor: "pointer", marginLeft: "-1rem" }}
              onClick={() => {
                setSearch("");
                setSearchResult([]);
              }}
            />
          )}
        </SearchFriendWrapper>

        {search && searchResult?.length > 0 ? (
          <>
            {searchResult?.map((item, index) => (
              <ReceiverCard
                style={{justifyContent: 'flex-start'}}
                key={index}
                onClick={() => selectConversationHandler(item)}
                selected={item._id === conversation?._id}
              >
                <Avatar
                  src={item?.user?.profilePic}
                  alt={item?.user?.fullname}
                />
                <h5>{item?.user?.fullname}</h5>
              </ReceiverCard>
            ))}
          </>
        ) : (
          <>
            {allConversations?.map((item, index) => (
              <ReceiverCard
                key={index}
                onClick={() => selectConversationHandler(item)}
                selected={item._id === conversation?._id}
              >
                <Avatar
                  src={item?.user?.profilePic}
                  alt={item?.user?.fullname}
                />
                <MessageSender>
                  <h5>{item?.user ? `${item?.user?.fullname}` : 'Unknown'}</h5>
                  {item?.lastMessage ? (
                    <sub>
                      <span style={{ fontWeight: "500" }}>
                        {item?.lastMessage?.sender === currentUser._id
                          ? "You"
                          : item?.user?.fullname.split(" ")[0]}
                      </span>
                      :{" "}
                      <SidebarMessage>
                        <span>
                          {item?.lastMessage?.message.slice(0, 35)}
                          {item?.lastMessage?.message.length > 35 && "..."}
                        </span>
                      </SidebarMessage>
                    </sub>
                  ) : (
                    <>
                      <sub>No message yet</sub>
                    </>
                  )}
                </MessageSender>
                {item?.lastMessage && <p style={{fontSize: '10px', fontWeight: '500'}}>{moment(item?.lastMessage?.createdAt).format('D/M')}</p>}
              </ReceiverCard>
            ))}
          </>
        )}
      </ChatSidebarWrapper>
      : 
      <div style={{height: '80vh', display: 'grid', placeItems: 'center'}}>
        {/* <PuffLoader loading={loading} size={50} color='#ae35f0' /> */}
      </div>
      }
    </ChatSidebarContainer>
  );
};

export default ChatSidebar;
