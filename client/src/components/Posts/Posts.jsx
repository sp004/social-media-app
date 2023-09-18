import React, { useCallback, useRef } from "react";
import CreatePost from "../CreatePost/CreatePost";
import Post from "../Post/Post";
import { FeedLeft, PostSection } from "./styles";
import { EmptyPlaceHolder } from "../../styles/variables";
import { axiosPrivate } from "../../api/apiRequest";
import { useInfiniteQuery } from "@tanstack/react-query";
import Skeleton from "../Skeleton/Skeleton";

const Posts = () => {
  const fetchAllPosts = async (page) => {
    console.log("page number ==> " + page)
    const { data } = await axiosPrivate.get(`/post/allPosts?page=${page}`);
    return data?.data;
  };

  const {
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    data: allPosts,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({pageParam = 1}) => fetchAllPosts(pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.length ? pages?.length + 1 : undefined
    },
  });

  const intObserver = useRef();

  const lastPostRef = useCallback(
    (post) => {
      if (isFetchingNextPage) return;
      if (intObserver.current) intObserver.current.disconnect();
      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) fetchNextPage();
      });
      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, hasNextPage]
  );

  return (
    <FeedLeft>
      <PostSection>
        <CreatePost />
        {isLoading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <>
            {allPosts?.pages[0]?.length > 0 ? (
              <>
                {allPosts?.pages?.map(pg => {
                  return pg?.map((post, i) => {
                    if (pg?.length === i + 1) {
                      return <Post ref={lastPostRef} key={i} post={post} />
                    }
                    return <Post key={i} post={post} />
                  })}
                )}
              </>
            ) : (
              <EmptyPlaceHolder>No posts found</EmptyPlaceHolder>
            )}
          </>
        )}
      </PostSection>
    </FeedLeft>
  );
};

export default Posts;
