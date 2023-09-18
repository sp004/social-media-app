import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { button } from '../../styles/variables'
import { axiosPrivate } from '../../api/apiRequest'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SocketContext } from '../../context/socketContext'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

const AddFriendBtn = styled.button`
    ${button}
`

const AddFriend = ({user}) => {
    const path = useLocation().pathname.split('/')[1]
    const {socket} = useContext(SocketContext)
    const {currentUser} = useSelector(state => state.auth)
    const queryClient = useQueryClient();

    const addFriendMutation = useMutation({
      mutationFn: async () => {
        try {
          const {data} = await axiosPrivate.put('/friend/sentReq', {userId: user?._id})
          path !== 'profile' && toast.success(data?.message)
        } catch (error) {
          error?.response?.status === 400 && toast.error(error?.response?.data?.message)
          error?.response?.status === 404 && toast.error(error?.response?.data?.message)
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user'] })
      },
    })

    const addfriendHandler = async () => {
        addFriendMutation.mutate()
        socket.emit("sentNotification", {
          sender: currentUser?._id,
          receiver: user?._id,
          type: "request",
          createdAt: Date.now()
      })
    }

  return (
    <AddFriendBtn onClick={addfriendHandler}>Add Friend</AddFriendBtn>
  )
}

export default AddFriend