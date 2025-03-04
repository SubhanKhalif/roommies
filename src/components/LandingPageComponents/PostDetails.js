export const PostDetails = ({ post }) => {
    return (
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-2">{post.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>📍 {post.location}</span>
          <span>💰 ${post.rent}/month</span>
        </div>
      </div>
    );
  };
  