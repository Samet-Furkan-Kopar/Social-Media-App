import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react"
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { fetchCommunities, type Community } from "./CommunityList";

type PostInput = {
    title: string;
    content: string;
    avatar_url?: string | null;
    community_id?: number | null;
};

const createPost = async (post: PostInput, imageFile: File) => {

  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);
  if(uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = await supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);
    
  const {data, error} = await supabase.from("posts").insert({...post , image_url: publicURLData.publicUrl});

  if(error) throw new Error(error.message);
    return data
};


const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [communityId, setCommunityId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {user} = useAuth();
  console.log(user)

   const { data: communities } = useQuery<Community[], Error>({
        queryKey: ["communities"],
        queryFn: fetchCommunities,
    });


const { mutate, isPending, isError } = useMutation({
  mutationFn: (data: { post: PostInput; imageFile: File }) =>
    createPost(data.post, data.imageFile),
  onSuccess: () => {
    setSuccessMessage("Post başarıyla oluşturuldu ✅");
    // inputları temizle (isteğe bağlı)
    setTitle("");
    setContent("");
    setSelectedFile(null);
    // mesajı birkaç saniye sonra otomatik kaldırmak istersen:
    setTimeout(() => setSuccessMessage(null), 5000);
  },
});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
      },
      imageFile: selectedFile!,
    });
  };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0]);
        }
    };
    const handleCommunityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setCommunityId(value ? Number(value) : null);
    };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label className="block font-medium mb-2">Title</label>
        <input
          type="text"
          id="title"
            value={title}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          placeholder="Enter post title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-medium mb-2">Content</label>
        <textarea
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          placeholder="Enter post content"
          id="content"
            value={content}
          required
          rows={5}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Select Community</label>
        <select id="community" onChange={handleCommunityChange} className="w-full border border-white/10 p-2 rounded bg-black">
          <option  value="">Select a community</option>
          {communities?.map((community, index) => (
            <option key={index} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
      </div>
       <div>
        <label className="block font-medium mb-2">Upload File</label>
        <input
          type="file"
          accept="image/*"
          id="image"
          className="w-full text-gray-200"
          placeholder="Enter post title"
          required
          onChange={handleFileChange}
        />
      </div>
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating Post..." : "Create Post"}
      </button>
      {isError && <p className="text-red-500">Error Creating Post!</p>}
      {successMessage && (
  <div className="mt-2  text-green-300">
    {successMessage}
  </div>
)}

    </form>
  );
}

export default CreatePost

