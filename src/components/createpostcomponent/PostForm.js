import { useState, useRef } from "react";
import { Button, IconButton, Box } from "@mui/material";
import { Image, VideoLibrary, EmojiEmotions, Event, MoreHoriz } from "@mui/icons-material";

export default function PostForm({ user, onClose }) {
  const [post, setPost] = useState({ title: "", description: "", location: "", rent: "" });
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const renderMediaPreview = () => {
    if (!mediaPreview) return null;

    const fileExtension = media?.name?.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
    const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);

    return (
      <Box sx={{ width: "100%", maxHeight: 300, overflow: "hidden", borderRadius: 2, mb: 2 }}>
        {isImage ? (
          <img src={mediaPreview} alt="Preview" style={{ width: "100%", height: "auto", objectFit: "cover" }} />
        ) : isVideo ? (
          <video controls style={{ width: "100%", height: "auto" }}>
            <source src={mediaPreview} type={`video/${fileExtension}`} />
            Your browser does not support the video tag.
          </video>
        ) : null}
      </Box>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setErrorMessage("Please log in to create a post.");

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication error. Please log in again.");

      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("description", post.description);
      formData.append("location", post.location);
      formData.append("rent", post.rent);
      if (media) {
        formData.append("media", media);
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/posts/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create post");

      setSuccessMessage("Post created successfully!");
      setPost({ title: "", description: "", location: "", rent: "" });
      setMedia(null);
      setMediaPreview(null);
      setTimeout(() => setSuccessMessage(""), 3000);
      onClose();
    } catch (error) {
      setErrorMessage(error.message || "Error creating post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <input type="text" placeholder="Title" className="w-full p-2 border rounded-md"
        value={post.title} onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))} required />

      <textarea placeholder="Description" rows="4" className="w-full p-2 border rounded-md"
        value={post.description} onChange={(e) => setPost(prev => ({ ...prev, description: e.target.value }))} required />

      <input type="text" placeholder="Location" className="w-full p-2 border rounded-md"
        value={post.location} onChange={(e) => setPost(prev => ({ ...prev, location: e.target.value }))} required />

      <input type="number" placeholder="Rent Amount" className="w-full p-2 border rounded-md"
        value={post.rent} onChange={(e) => setPost(prev => ({ ...prev, rent: e.target.value }))} required />

      <div className="flex flex-col space-y-2">
        <input type="file" ref={fileInputRef} onChange={handleMediaChange} accept="image/*,video/*" className="hidden" />
        {renderMediaPreview()}
      </div>

      <div className="flex justify-between items-center mt-3 border-t pt-2">
        <div className="flex space-x-2">
          <IconButton onClick={() => fileInputRef.current.click()}>
            <Image color="primary" />
          </IconButton>
          <IconButton><VideoLibrary color="secondary" /></IconButton>
          <IconButton><EmojiEmotions color="warning" /></IconButton>
          <IconButton><Event color="success" /></IconButton>
          <IconButton><MoreHoriz /></IconButton>
        </div>

        <Button variant="contained" type="submit" disabled={loading || !user}>
          {loading ? "Creating..." : "Post"}
        </Button>
      </div>

      {successMessage && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">{successMessage}</div>}
      {errorMessage && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{errorMessage}</div>}
    </form>
  );
}
