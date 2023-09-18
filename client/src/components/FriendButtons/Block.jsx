import React from 'react'
import styled from 'styled-components'
import { borderedButton } from '../../styles/variables'
import { axiosPrivate } from '../../api/apiRequest'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

const BlockButton = styled.button`
    ${borderedButton}
`

const Block = ({user}) => {
    const path = useLocation().pathname.split('/')[1]
    const queryClient = useQueryClient();

    const blockMutation = useMutation({
        mutationFn: async () => {
            try {
                const {data} = await axiosPrivate.put('/friend/block', {userId: user?._id})
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

  return (
    <BlockButton onClick={() => blockMutation.mutate()}>Block</BlockButton>
  )
}

export default Block