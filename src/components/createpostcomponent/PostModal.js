import { Modal } from "@mui/material";
import PostHeader from "./PostHeader.js";
import PostForm from "./PostForm.js";

export default function PostModal({ open, onClose, user }) {
  return (
    <Modal open={open} onClose={onClose} className="flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-4">
        <PostHeader user={user} />
        <PostForm user={user} onClose={onClose} />
      </div>
    </Modal>
  );
}
