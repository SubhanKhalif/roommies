import { UserInfo } from "./UserInfo.js";
import { PostDetails } from "./PostDetails.js";

export const PostCard = ({ post }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      {/* User Info Section */}
      <UserInfo user={post.user} createdAt={post.createdAt} />

      {/* Post Details Section */}
      <PostDetails post={post} />
    </div>
  );
};
