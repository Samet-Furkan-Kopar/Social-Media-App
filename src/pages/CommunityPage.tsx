import { useParams } from "react-router";
import CommunityDisplay from "../components/CommunityDisplay"

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  console.log(typeof id)
  return (
    <div className='pt-3'>
      <CommunityDisplay communityId={Number(id)}/>
    </div>
  )
}

export default CommunityPage
