import { useState } from "react";
import type { Comment } from "./CommentSection"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
    comment: Comment & {children?: Comment[]};
    postId: number;
}

const createReply = async (
    replyContent: string,
    postId: number,
    parentCommentId: number ,
    userId?: string,
    author?: string
) => {
if(!userId || !author) {
        throw new Error("you must be logged in to reply.");
    }
    const {error} = await supabase.from("comments").insert({
        content: replyContent,
        parent_comment_id: parentCommentId,
        post_id: postId,
        user_id: userId,
        author: author
    });
    if (error) {
        throw new Error("Error creating comment: " + error.message);
    }
}
const CommentItem = ({ comment, postId }: Props) => {
    const [showReply, setShowReply ]= useState<boolean>(false)
    const [replyText, setReplyText ]= useState<string>("")
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { mutate, isPending, isError } = useMutation({
       mutationFn: (replyContent: string) =>
         createReply(
           replyContent,
           postId,
           comment?.id,
           user?.id,
           user!.user_metadata?.user_name
         ),
         onSuccess: () => {
           queryClient.invalidateQueries({ queryKey: ["comments", postId] });
           setReplyText(""); 
           setShowReply(false);
         }
     });

    const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) return;
    mutate(replyText);
}

  return (
    <div className="pl-4 border-l border-white/10">
      <div className="mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-blue-400">
            {comment.author}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <p className="text-gray-300">{comment.content}</p>
        <button
          onClick={() => setShowReply((prev) => !prev)}
          className="text-blue-500 text-sm mt-1 cursor-pointer"
        >
          {showReply ? "Hide Reply" : "Reply"}
        </button>
      </div>
      {showReply && user && (
        <form onSubmit={handleReplySubmit} className="mb-2">
          <textarea
            className="w-full border border-white/10 bg-transparent p-2 rounded"
            rows={2}
            placeholder="write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />

          <button
            type="submit"
            className="mt-1 bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
            disabled={!replyText}
          >
            {isPending ? "Posting..." : "Post Reply"}
          </button>
          {isError && (
            <p className="text-red-500 mt-2">Error posting comment</p>
          )}
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div>
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-white text-sm mb-2"
          >
            {isCollapsed ? <ChevronDown /> : <ChevronUp />}
          </button>
          {!isCollapsed && (
            <div>
              {comment.children.map((childComment) => (
                <CommentItem
                  key={childComment.id}
                  comment={childComment}
                  postId={postId}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CommentItem
