import React from 'react'
import styled from 'styled-components'
import { button } from '../../styles/variables'
import { axiosPrivate } from '../../api/apiRequest'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const UnblockButton = styled.button`
    ${button}
`

const Unblock = ({user}) => {
    const queryClient = useQueryClient();

    const unblockMutation = useMutation({
        mutationFn: async () => {
            await axiosPrivate.put('/friend/unblock', {userId: user?._id})
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blockedUser'] })
        },
    })
    
  return (
    <UnblockButton onClick={() => unblockMutation.mutate()}>Unblock</UnblockButton>
  )
}

export default Unblock