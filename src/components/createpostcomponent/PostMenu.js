import { useState } from "react";
import {MoreVert} from "@mui/icons-material";
import { Menu, MenuItem, IconButton } from "@mui/material";

export default function PostMenu({ post, setEditingPost, fetchUserPosts }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    setEditingPost(post);
    handleMenuClose();
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/posts/${post._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete post");

      fetchUserPosts();
    } catch (error) {
      console.error(error.message);
    }
    handleMenuClose();
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
}
