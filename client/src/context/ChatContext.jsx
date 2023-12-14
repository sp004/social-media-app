import { createContext, useState } from "react";

export const ChatContext = createContext()

const ChatContextProvider = ({children}) => {
    const [allConversations, setAllConversations] = useState([])
    const [chats, setChats] = useState([]) //all chats for a particular conversationId
    const [chatNotification, setChatNotification] = useState('')
    const [conversation, setConversation] = useState({}) //selected conversation
    const [selectedConversation, setSelectedConversation] = useState() 

    const removeConversation = async (conversationId) => {
        try {
            // const {data} = await axiosPrivate.delete(`/`)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ChatContext.Provider value={{chats, setChats, conversation, setConversation, allConversations, setAllConversations, removeConversation, chatNotification, setChatNotification, selectedConversation, setSelectedConversation}}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatContextProvider