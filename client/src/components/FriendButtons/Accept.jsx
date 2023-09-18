import React, { useContext } from 'react'
import styled from 'styled-components'
import { button } from '../../styles/variables'
import { axiosPrivate } from '../../api/apiRequest'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SocketContext } from '../../context/socketContext'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const AcceptButton = styled.button`
    ${button}
`

const Accept = ({user}) => {
    const {socket} = useContext(SocketContext)
    const {currentUser} = useSelector(state => state.auth)
    const queryClient = useQueryClient();
    const path = useLocation().pathname.split('/')[1]

    const acceptMutation = useMutation({
        mutationFn: async () => {
            try {
                const {data} = await axiosPrivate.put('/friend/accept', {userId: user?._id})
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

    const acceptRequestHandler = async (userId) => {
        acceptMutation.mutate()
        socket.emit("sentNotification", {
            sender: currentUser?._id,
            receiver: user?._id,
            type: "accept",
            createdAt: Date.now()
        })
    }

  return (
    <AcceptButton onClick={acceptRequestHandler}>Accept</AcceptButton>
  )
}

export default Accept