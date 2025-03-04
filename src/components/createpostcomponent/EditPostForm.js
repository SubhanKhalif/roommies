import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton } from "@mui/material";
import { Image, VideoLibrary, EmojiEmotions, Event, MoreHoriz } from "@mui/icons-material";

export default function EditPostForm({ user, onClose, postToEdit, fetchUserPosts, open }) {
  const [post, setPost] = useState({ title: "", description: "", location: "", rent: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postToEdit) {
      setPost({
        title: postToEdit.title || "",
        description: postToEdit.description || "",
        location: postToEdit.location || "",
        rent: postToEdit.rent || "",
      });
    }
  }, [postToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to edit the post.");

    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found. Please log in again.");

      const url = `${process.env.REACT_APP_API_URL}/api/v1/posts/${postToEdit._id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(post),
      });

      if (!response.ok) throw new Error("Failed to update post");

      fetchUserPosts();
      onClose();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Post</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          margin="dense"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
        />
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          margin="dense"
          multiline
          rows={4}
          value={post.description}
          onChange={(e) => setPost({ ...post, description: e.target.value })}
        />
        <TextField
          fullWidth
          label="Location"
          variant="outlined"
          margin="dense"
          value={post.location}
          onChange={(e) => setPost({ ...post, location: e.target.value })}
        />
        <TextField
          fullWidth
          label="Rent Amount"
          variant="outlined"
          margin="dense"
          type="number"
          value={post.rent}
          onChange={(e) => setPost({ ...post, rent: e.target.value })}
        />

        {/* Media Upload Icons */}
        <div className="flex justify-between items-center mt-3 border-t pt-2">
          <div className="flex space-x-2">
            <IconButton><Image color="primary" /></IconButton>
            <IconButton><VideoLibrary color="secondary" /></IconButton>
            <IconButton><EmojiEmotions color="warning" /></IconButton>
            <IconButton><Event color="success" /></IconButton>
            <IconButton><MoreHoriz /></IconButton>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? "Updating..." : "Update Post"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
