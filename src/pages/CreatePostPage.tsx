import CreatePost from "../components/CreatePost"

const CreatePostPage = () => {
  return (
    <div className="pt-3">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent ">
        Create New Post
      </h2>
      <CreatePost />
    </div>
  );
}

export default CreatePostPage
