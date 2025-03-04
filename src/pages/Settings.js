import { useState } from "react";
import Profile from "../components/SettingsComponents/Profile.js";
import InputName from "../components/SettingsComponents/InputName.js";
import InputEmail from "../components/SettingsComponents/InputEmail.js";
import { setUser } from '../services/Actions/User/actions.js';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";

const Settings = () => {
  const dispatch = useDispatch();
  const storedData = JSON.parse(localStorage.getItem("info"));
  const [name, setName] = useState(storedData?.name || '');
  const [email, setEmail] = useState(storedData?.email || '');

  const resetData = () => {
    setName(storedData.name);
    setEmail(storedData.email);
  };

  const notify = (value) => toast[value === "error" ? "error" : "success"](value === "error" ? "Something went wrong!" : "Successfully updated!", {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

  const updateHandler = async () => {
    const dataSent = { name, email };
    const cookie = localStorage.getItem("jwt");
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/updateMe`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
        body: JSON.stringify(dataSent),
      });
      
      const data = await response.json();
      console.log('Update response:', data);
      
      if (data.status === "success" && data.data?.user) {
        notify("success");
        localStorage.setItem("info", JSON.stringify(data.data.user));
        dispatch(setUser(data.data.user));
        setName(data.data.user.name);
        setEmail(data.data.user.email);
      } else {
        console.error('Invalid response format:', data);
        notify("error");
      }
    } catch (error) {
      console.error('Update error:', error);
      notify("error");
    }
  };

  return (
    <div className="grid w-[80vw] relative grid-rows-[1fr,7fr]">
      <div className="border-[1px] border-[#f5f5f5]" />
      <div className="border-[1px] border-[#f5f5f5]">
        <ToastContainer />
        <div className="px-[5%] py-[2%]">
          <div className="font-Poppins max-[1024px]:text-xl font-semibold text-2xl">
            Public profile
          </div>
          <div className="flex items-center mt-2">
            <span className="text-blue-500 mr-2">ℹ️</span>
            <div className="font-Poppins text-xs">To update your profile picture, select an image and upload it.</div>
          </div>
          <Profile />
          <div className="mt-[3%] flex flex-col gap-8">
            <InputName name={name} setName={setName} />
            <InputEmail email={email} setEmail={setEmail} />
          </div>
          <div className="flex flex-row mt-[2%] gap-2">
            <div
              onClick={updateHandler}
              className="bg-[#202142] hover:bg-[#202162] text-white font-medium cursor-pointer border-[#000000] px-4 py-2 max-[1024px]:px-2 max-[1024px]:py-1 max-[1024px]:text-sm rounded-md font-Roboto tracking-tight"
            >
              Update
            </div>
            <div
              onClick={resetData}
              className="bg-[#C6CED1] text-white font-medium cursor-pointer border-[#000000] px-4 py-2 rounded-md font-Roboto tracking-tight max-[1024px]:px-2 max-[1024px]:py-1 max-[1024px]:text-sm"
            >
              Reset
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
