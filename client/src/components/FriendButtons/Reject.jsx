import React from "react";
import { axiosPrivate } from "../../api/apiRequest";
import { borderedButton } from "../../styles/variables";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const RejectButton = styled.button`
  ${borderedButton}
`;

const Reject = ({ user }) => {
  const path = useLocation().pathname.split('/')[1]
  const queryClient = useQueryClient();

  const rejectMutation = useMutation({
    mutationFn: async () => {
      try {
        const {data} = await axiosPrivate.put('/friend/reject', {userId: user?._id})
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
    <RejectButton onClick={() => rejectMutation.mutate()}>
      Reject
    </RejectButton>
  );
};

export default Reject;
