import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { axiosPrivate } from '../api/apiRequest';

const useChat = () => {
    const navigate = useNavigate()
    const {setConversation, allConversations, setAllConversations} = useContext(ChatContext);
    const { currentUser } = useSelector((state) => state.auth);
    const { unblockedUsers } = useSelector((state) => state.user); 

    const onChatClicked = async (user) => {
        navigate('/chat', {state: user})
        console.log("cliiiiiiiiiiiiiiiiiiiiiiiickkkkkkkkkkkkkkkkkkeddddddddddddddddd")
        try {
            //check if converation with the user is already present
            //if yes, then fetch the conversation and set setConveration with that conversationId 
            if(allConversations?.some(conversation => conversation.user._id === user._id)){
                const matchedConversation = allConversations?.filter(conversation => conversation.user._id === user._id)[0]
                console.log("12323232", matchedConversation)
                setConversation(matchedConversation)
            }
            //if no, then create a new conversation
            else{
                console.log("**********conversation not matched***********")
                const {data} = await axiosPrivate.post('/conversation/create', {
                    senderId: currentUser._id,
                    receiverId: user._id
                })
                console.log("🔞🔞🔞", data?.data)
                // setAllConversations(data?.data?.map((item) => {
                //     const [user] = item?.users?.filter(user => user._id !== currentUser._id);
                //     console.log("👎👎👎", user)
                //     const checkStatus = unblockedUsers?.some(item => item?._id === user?._id)
                //     return {
                //       user,
                //       isBlocked: !checkStatus,
                //       ...item,
                //     };
                // }))
                const matched = allConversations?.filter(conversation => {
                    console.log(conversation?._id, " xxxxxx ", data?.data?._id)
                    return conversation?._id === data?.data?._id
                })
                console.log("❤❤❤ ----->", data?.data, matched)
                setConversation(matched)
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    onChatClicked
  )
}

export default useChat