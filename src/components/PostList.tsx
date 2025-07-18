import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem";
import Loading from "./Loading";


export type Post = {
    id: number;
    title: string;
    content: string;
    image_url: string | null;
    created_at: string;
    avatar_url?: string | null;
    like_count: number;
    comment_count: number;
}

const fetchPosts = async () : Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");
  if (error) throw new Error(error.message);
  return data as Post[];
}
const PostList = () => {
    const { data, error, isLoading } = useQuery<Post[], Error>({
        queryKey: ["posts"],
        queryFn: fetchPosts,
    });

    if (isLoading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;
  
    return (
    <div className="flex flex-wrap gap-6 justify-center">
      {data?.map((post) => (
        <PostItem key={post.id} post={post} />))}
    </div>
  )
}

export default PostList
