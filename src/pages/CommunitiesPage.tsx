import CommunityList from "../components/CommunityList"


const CommunitiesPage = () => {
  return (
    <div className='pt-3'>
      <h3 className="text-6xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Communities</h3>
      <CommunityList />
    </div>
  )
}

export default CommunitiesPage
