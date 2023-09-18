import React from 'react'
import styled from 'styled-components'
import { borderedButton } from '../../styles/variables'
import { axiosPrivate } from '../../api/apiRequest'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

const CancelRequestButton = styled.button`
    ${borderedButton}
    padding: ${props => props.sidebar === 'sidebar' && '6px 10px'};
    font-size: ${props => props.sidebar === 'sidebar' && '12px'};
`

const CancelRequest = ({user, sidebar}) => {
    const path = useLocation().pathname.split('/')[1]
    const queryClient = useQueryClient();

    const cancelMutation = useMutation({
        mutationFn: async () => {
            try {
                const {data} = await axiosPrivate.put('/friend/withdrawReq', {userId: user?._id})
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
    <CancelRequestButton sidebar={sidebar} onClick={() => cancelMutation.mutate()}>Cancel Request</CancelRequestButton>
  )
}

export default CancelRequest