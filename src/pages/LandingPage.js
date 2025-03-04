import { useEffect, useState } from "react";
import { PostCard } from "../components/LandingPageComponents/PostCard.js";

const LandingPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/posts`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();
        if (result.status === "success") {
          const sortedPosts = result.data.posts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setPosts(sortedPosts);
        } else {
          console.error("Failed to fetch posts:", result.message);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div className='w-[80vw] relative flex flex-col h-screen overflow-hidden'>
      <h1 className="text-3xl font-bold text-center mb-6">Find Your Perfect Roommate</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by location..."
          className="p-3 w-1/2 border rounded-lg"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
      </div>

      {/* Post Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto scrollbar-hide">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-center text-gray-500 col-span-3">No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
