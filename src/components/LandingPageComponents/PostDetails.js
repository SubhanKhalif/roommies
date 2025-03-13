export const PostDetails = ({ post }) => {
  const renderMedia = () => {
    if (!post.media) return null;

    const mediaUrl = post.media.startsWith("http") 
      ? post.media 
      : `${process.env.REACT_APP_API_URL}/api/v1/posts/${post.media}`;

    const fileExtension = mediaUrl.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
    const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);

    return (
      <div className="w-full aspect-square overflow-hidden rounded-lg mb-4">
        {isImage ? (
          <img
            src={mediaUrl}
            alt="Post media"
            className="w-full h-full object-cover"
          />
        ) : isVideo ? (
          <video controls className="w-full h-full">
            <source src={mediaUrl} type={`video/${fileExtension}`} />
            Your browser does not support the video tag.
          </video>
        ) : null}
      </div>
    );
  };

  return (
    <div className="mt-4">
      {renderMedia()}
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-2">{post.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>📍 {post.location}</span>
        <span>💰 ${post.rent}/month</span>
      </div>
    </div>
  );
};