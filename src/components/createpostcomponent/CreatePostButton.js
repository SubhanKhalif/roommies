import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";

const CreatePostButton = ({ onOpen }) => {
  return (
    <div className="flex justify-end p-4">
      <Button 
        variant="outlined" 
        startIcon={<Add />} 
        className="rounded-full"
        onClick={onOpen}
      >
        Create a Post
      </Button>
    </div>
  );
};

export default CreatePostButton;
