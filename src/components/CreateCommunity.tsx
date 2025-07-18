import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router";

type CommunityInput = {
  name: string;
  description: string;
};
const createCommunity = async (community: CommunityInput) => {
  const { data, error } = await supabase.from("communities").insert(community);
  if (error) throw new Error(error.message);
  return data;
};
const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["communities"] });
    navigate("/communities");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, description });
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Community
      </h2>
      <div>
        <label className="block mb-2 ">Community Name</label>
        <input
          type="text"
          id="name"
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-2 ">Description</label>
        <textarea
          id="description"
          rows={3}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating..." : "Create Community"}
      </button>
      {isError && <p className="text-red-500">Error creating community</p>}
    </form>
  );
};

export default CreateCommunity;
