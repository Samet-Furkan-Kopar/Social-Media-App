import React from 'react'
import Loading from './Loading';
import type { Post } from './PostList';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import PostItem from './PostItem';

type Props = {
  communityId: number;
}

interface PostWithCommunity extends Post {
  communities: {
    name: string;
  }
}

const fetchCommunityPost = async (communityId: number) : Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase.from("posts").select("*, communities(name)").eq("community_id", communityId).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as PostWithCommunity[];
}

const CommunityDisplay = ({ communityId }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["community_post", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data && data[0]?.communities.name} Community Posts
      </h2>
      {data && data?.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {data.map((post, i) => (
            <PostItem key={i} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400">
          No posts available in this community
        </div>
      )}
    </div>
  );
}

export default CommunityDisplay
