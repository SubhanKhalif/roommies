import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PostItem from "./PostItem.js";
import EditPostForm from "./EditPostForm.js";

export default function UserCreatedPosts() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    if (userInfo && userInfo._id) {
      fetchUserPosts();
    }
  }, [userInfo]);

  const fetchUserPosts = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found");
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/posts/${userInfo._id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 404) {
        setPosts([]); // No posts found, set empty array
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch user posts: ${response.statusText}`);
      }

      const data = await response.json();
      setPosts(data.data?.posts || []);
    } catch (error) {
      setErrorMessage(error.message);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setOpenForm(true);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      {isLoading && <div className="text-blue-500 mb-4">Loading posts...</div>}
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      {openForm && editingPost && (
        <EditPostForm
          user={userInfo}
          postToEdit={editingPost}
          fetchUserPosts={fetchUserPosts}
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setEditingPost(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              onEdit={() => handleEdit(post)}
              fetchUserPosts={fetchUserPosts}
            />
          ))
        ) : (
          !isLoading && <div className="text-gray-500">No posts found</div>
        )}
      </div>
    </div>
  );
}
