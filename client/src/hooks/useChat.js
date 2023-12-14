import { useContext } from 'react'
import { ChatContext } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { axiosPrivate } from '../api/apiRequest';

const useChat = () => {
    const navigate = useNavigate()
    const {setConversation, allConversations} = useContext(ChatContext);
    const { currentUser } = useSelector((state) => state.auth);

    const onChatClicked = async (user) => {
        navigate('/chat', {state: user})

        try {
            //check if converation with the user is already present
            //if yes, then fetch the conversation and set setConveration with that conversationId 
            if(allConversations?.some(conversation => conversation.user._id === user._id)){
                const matchedConversation = allConversations?.filter(conversation => conversation.user._id === user._id)[0]
                setConversation(matchedConversation)
            }
            //if no, then create a new conversation
            else{
                const {data} = await axiosPrivate.post('/conversation/create', {
                    senderId: currentUser._id,
                    receiverId: user._id
                })

                // setAllConversations(data?.data?.map((item) => {
                //     const [user] = item?.users?.filter(user => user._id !== currentUser._id);
                //     const checkStatus = unblockedUsers?.some(item => item?._id === user?._id)
                //     return {
                //       user,
                //       isBlocked: !checkStatus,
                //       ...item,
                //     };
                // }))
                const matched = allConversations?.filter(conversation => {
                    return conversation?._id === data?.data?._id
                })
                setConversation(matched)
            }
        } catch (error) {
            console.error(error)
        }
    }
  return (
    onChatClicked
  )
}

export default useChat