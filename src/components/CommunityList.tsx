import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import Loading from "./Loading";
import { Link } from "react-router";

export type Community = {
    id : number;
    name: string;
    description: string;
    created_at: string;
}
export const fetchCommunities = async () : Promise<Community[]> => {
  const { data, error } = await supabase.from("communities").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Community[];
}

const CommunityList = () => {

    const { data, error, isLoading } = useQuery<Community[], Error>({
        queryKey: ["communities"],
        queryFn: fetchCommunities,
    });

      if (isLoading) return <Loading />;
      if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {data?.map((community, index) => (
        <div
          key={index}
          className="p-4 border border-white/10 rounded hover:-translate-y-1 transition-transform"
        >
          <Link
            to={`/community/${community.id}`}
            className="text-2xl font-bold text-purple-500 hover:underline"
          >
            {community.name}
          </Link>
          <p className="text-gray-400 mt-2">{community.description}</p>
        </div>
      ))}
    </div>
  );
}

export default CommunityList
