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

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem>Delete</MenuItem>
      </Menu>
    </>
  );
}
