import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import CommentItem from "./CommentItem";
import Loading from "./Loading";

type Props = {
  postId: number;
}

type NewComment = {
  content: string;  
    parent_comment_id: number | null;
}

export type Comment = {
    id: number;
    content: string;
    created_at: string;
    post_id: number;
    user_id: string;
    parent_comment_id: number | null;
    author: string;
}

const fetchComments = async (postId: number) : Promise<Comment[]> => {
const {data, error} = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
    if(error) throw new Error(error.message);
    return data as Comment[];
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
    if(!userId || !author) {
        throw new Error("User ID and author name are required to create a comment.");
    }
    const {error} = await supabase.from("comments").insert({
        content: newComment.content,
        parent_comment_id: newComment.parent_comment_id,
        post_id: postId,
        user_id: userId,
        author: author
    });
    if (error) {
        throw new Error("Error creating comment: " + error.message);
    }
};

const CommentSection = ({postId}:Props) => {
    const [newCommentText, setNewCommentText] = useState<string>("")
    const {user} = useAuth();    
    const queryClient = useQueryClient();
      const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });

     const { mutate, isPending, isError } = useMutation({
       mutationFn: (newComment: NewComment) =>
         createComment(
           newComment,
           postId,
           user!.id,
           user!.user_metadata?.user_name
         ),
         onSuccess: () => {
           queryClient.invalidateQueries({ queryKey: ["comments", postId] });
         }
     });

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    mutate({content:newCommentText, parent_comment_id: null});
    setNewCommentText("");
}

const buildCommentTree = (
  flatComments: Comment[]
): (Comment & { children?: Comment[] })[] => {
  const map = new Map<number, Comment & { children?: Comment[] }>();
  const roots: (Comment & { children?: Comment[] })[] = [];

  flatComments.forEach((comment) => {
    map.set(comment.id, { ...comment, children: [] });
  });

  flatComments.forEach((comment) => {
    if (comment.parent_comment_id) {
      const parent = map.get(comment.parent_comment_id);
      if (parent) {
        parent.children!.push(map.get(comment.id)!);
      }
    } else {
      roots.push(map.get(comment.id)!);
    }
  });

  return roots;
};


    if (isLoading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;

    const commentTree = comments ? buildCommentTree(comments) : [];

    return (
      <div>
        <h3  className='text-3xl font-bold my-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'>Comments</h3>
        {user ? (
          <form onSubmit={handleSubmit}>
            <textarea
            className="w-full border border-white/10 bg-transparent p-2 rounded"
              rows={3}
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            />

            <button
              type="submit"
              className="mt-2 bg-purple-500 ext-white px-4 py-2 rounded cursor-pointer"
              disabled={!newCommentText}
            >
              {isPending ? "Posting..." : "Post Comment"}
            </button>
            {isError && (
              <p className="text-red-500 mt-2">Error posting comment</p>
            )}
          </form>
        ) : (
          <p className="mb-4 text-gray-600">Please log in to add a comment.</p>
        )}

        <div className="space-y-4 mt-4">
            {commentTree?.map((comment, key) => (
                <CommentItem key={key} comment={comment} postId={postId} />
            ))}
        </div>
      </div>
    );
}

export default CommentSection
