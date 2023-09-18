import { useState, useEffect } from "react";
import { axiosPrivate } from "../api/apiRequest";

const useFriendshipStatus = (userId) => {
  const [friendshipStatus, setFriendshipStatus] = useState("");

  useEffect(() => {
    const fetchFriendshipStatus = async () => {
      try {
        const {data} = await axiosPrivate.get(`/api/checkFriendshipStatus/${userId}`);
        setFriendshipStatus(data?.status);
      } catch (error) {
        console.error("Failed to fetch friendship status", error);
      }
    };

    fetchFriendshipStatus();
  }, [userId]);

  return friendshipStatus;
};

export default useFriendshipStatus;
