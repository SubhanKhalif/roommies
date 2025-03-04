import { useState } from "react";
import { Button, IconButton } from "@mui/material";
import { Image, VideoLibrary, EmojiEmotions, Event, MoreHoriz } from "@mui/icons-material";

export default function PostForm({ user, onClose }) {
  const [post, setPost] = useState({ title: "", description: "", location: "", rent: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage("Please log in to create a post.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found. Please log in again.");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/posts/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...post, author: user._id, authorName: user.name, authorPic: user.pic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
      }

      setSuccessMessage("Post created successfully!");
      setPost({ title: "", description: "", location: "", rent: "" });
      setTimeout(() => setSuccessMessage(""), 3000);
      onClose();
    } catch (error) {
      console.error("Post creation error:", error);
      setErrorMessage(error.message || "Error creating post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <input type="text" placeholder="Title" className="w-full p-2 border rounded-md"
        value={post.title} onChange={(e) => setPost((prev) => ({ ...prev, title: e.target.value }))} required />

      <textarea placeholder="Description" rows="4" className="w-full p-2 border rounded-md"
        value={post.description} onChange={(e) => setPost((prev) => ({ ...prev, description: e.target.value }))} required />

      <input type="text" placeholder="Location" className="w-full p-2 border rounded-md"
        value={post.location} onChange={(e) => setPost((prev) => ({ ...prev, location: e.target.value }))} required />

      <input type="number" placeholder="Rent Amount" className="w-full p-2 border rounded-md"
        value={post.rent} onChange={(e) => setPost((prev) => ({ ...prev, rent: e.target.value }))} required />

      <div className="flex justify-between items-center mt-3 border-t pt-2">
        <div className="flex space-x-2">
          <IconButton><Image color="primary" /></IconButton>
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
