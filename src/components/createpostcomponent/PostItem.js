import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Box } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useState } from "react";
import { UserInfo } from "../LandingPageComponents/UserInfo.js";

export default function PostItem({ post, onEdit }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Card className="p-4">
      <CardContent>
        <div className="flex justify-between items-center">
          <UserInfo user={post.user} createdAt={post.createdAt} />
          <Box display="flex" alignItems="center">
            <IconButton onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          </Box>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={() => onEdit(post)}>Edit</MenuItem>
            <MenuItem onClick={() => console.log("Delete Post")}>Delete</MenuItem>
          </Menu>
        </div>

        <Typography variant="h6">{post.title}</Typography>
        <Typography variant="body2">{post.description}</Typography>
        <Typography variant="body2">{post.location}</Typography>
        <Typography variant="body2">Rent: ₹ {post.rent}</Typography>
      </CardContent>
    </Card>
  );
}
