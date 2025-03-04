import { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../services/Actions/User/actions.js';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useDispatch();
  const dataredux = useSelector((state) => state.user.userInfo);

  const data = JSON.parse(localStorage.getItem('info'));
  const [pic, setPic] = useState(data?.pic || '');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (dataredux === null) return;
    setPic(dataredux.pic);
  }, [dataredux]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image to upload.');
      return;
    }

    const isConfirmed = window.confirm('Are you sure you want to upload this image?');
    if (!isConfirmed) return;

    try {
      const formData = new FormData();
      formData.append('photo', selectedFile);

      const cookie = localStorage.getItem('jwt');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/uploadPhoto`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log('Upload response:', result);
      
      if (result.status === 'success' && result.data?.user) {
        toast.success('Image uploaded successfully!');
        const updatedUser = result.data.user;
        localStorage.setItem('info', JSON.stringify(updatedUser));
        dispatch(setUser(updatedUser));
        setPic(updatedUser.pic);
        setSelectedFile(null);
        
        // Reset file input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
        
        // Force a reload of the image
        const timestamp = new Date().getTime();
        setPic(`${updatedUser.pic}?t=${timestamp}`);
      } else {
        console.error('Invalid response format:', result);
        toast.error('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    }
  };

  const getImageUrl = () => {
    if (!pic) return '';
    if (pic.startsWith('http')) return pic;
    
    // Ensure we have the complete URL for the user's picture
    return `${process.env.REACT_APP_API_URL}/img/user/${pic}`;
  };

  return (
    <div className="flex flex-row items-center gap-10 mt-[2%]">
      <Avatar
        referrerPolicy="no-referrer"
        alt="User-pic"
        sx={{ width: 150, height: 150 }}
        src={getImageUrl()}
      />
      <div className="flex justify-center flex-col gap-5">
        <label
          htmlFor="fileInput"
          className="bg-[#202142] hover:bg-[#202162] text-white cursor-pointer px-4 py-2 max-[1024px]:px-2 max-[1024px]:py-1 max-[1024px]:text-sm rounded-md font-Roboto tracking-tight"
        >
          Select Picture
        </label>
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <div
          onClick={handleUpload}
          className="font-medium border-[1px] cursor-pointer border-[#000000] px-4 py-2 rounded-md font-Roboto tracking-tight max-[1024px]:px-2 max-[1024px]:py-1 max-[1024px]:text-sm"
        >
          Upload Picture
        </div>
      </div>
    </div>
  );
};

export default Profile;
