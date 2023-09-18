import React from 'react'
import { axiosPrivate } from '../../api/apiRequest'
import styled from 'styled-components'
import { button } from '../../styles/variables'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const UnfriendButton = styled.button`
    ${button}
`

const Unfriend = ({user}) => {
    const path = useLocation().pathname.split('/')[1]
    const queryClient = useQueryClient();

    const unfriendMutation = useMutation({
        mutationFn: async () => {
          try {
            const {data} = await axiosPrivate.put('/friend/unfriend', {userId: user?._id})
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

    // const unfriendHandler = async () => {
    //     unfriendMutation.mutate()
    // }

    // const { isLoading, error, data } = useQuery("unfriend", async (userId) => {
    //     const res = await axiosPrivate.put("/friend/unfriend", {userId})
    //     console.log(res.data.data)
    //     return res.data.data;
    //   });

  return (
    <UnfriendButton onClick={() => unfriendMutation.mutate()}>Unfriend</UnfriendButton>
  )
}

export default Unfriend