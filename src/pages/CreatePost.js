import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CreatePostButton from "../components/createpostcomponent/CreatePostButton.js";
import UserCreatedPosts from "../components/createpostcomponent/UserCreatedPosts.js";
import PostModal from "../components/createpostcomponent/PostModal.js";

export default function CreatePost() {
  const [modalOpen, setModalOpen] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [user, setUser] = useState(userInfo);

  useEffect(() => {
    if (!userInfo) {
      const localUser = JSON.parse(localStorage.getItem("info"));
      if (localUser) {
        setUser(localUser);
      }
    }
  }, [userInfo]);

  return (
    <div className="w-[80vw] relative flex flex-col min-h-screen overflow-hidden">
      <h1 className="text-3xl font-bold text-center mb-6">Create a New Post</h1>

      <div className="flex justify-between items-center w-full p-6">
        <div className="text-xl font-semibold">Your Posts</div>
        <CreatePostButton onOpen={() => setModalOpen(true)} />
      </div>

      <div className="w-full mt-6">
        <UserCreatedPosts />
      </div>

      <PostModal open={modalOpen} onClose={() => setModalOpen(false)} user={user} />
    </div>
  );
}
