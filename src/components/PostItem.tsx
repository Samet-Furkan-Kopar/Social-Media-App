import { Heart, MessageCircleMore } from "lucide-react";
import { Link } from "react-router";


type Props = {
    post: {
        id: number;
        title: string;
        content: string;
        image_url: string | null;
        created_at: string;
        avatar_url?: string | null;
        like_count: number;
        comment_count: number;
    };
}

const PostItem = ({post}: Props) => {
  return (
    <div className="relative group">
      <div
        className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 blur-sm opacity-0  
      group-hover:opacity-100 transition duration-300  "
      />
      <Link to={`/post/${post.id}`} className="block relative z-10 ">
        <div className="w-80 h-76 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col justify-between p-4">
          <div className="flex items-center space-x-2">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="Avatar"
                className="w-[35px] h-[35px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" />
            )}
            <div className="flex flex-col flex-1">
              <div className="text-[20px] leading-[22px] font-semibold mt-2">
                {post?.title}
              </div>
            </div>
          </div>

          <div className="mt-2 flex-1">
            <img
              src={post?.image_url || ""}
              alt={post?.title}
              className="w-full rounded-2xl object-cover max-h-[150px] mx-auto"
            />
          </div>
          <div className="flex justify-around items-center">
            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
             <Heart color="red" fill="red" /> <span className="ml-1">{post.like_count ?? 0}</span>
            </span>

            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              <MessageCircleMore /> <span className="ml-1">{post.comment_count ?? 0}</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PostItem
