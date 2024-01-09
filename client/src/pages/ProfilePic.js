import React, { useContext, useState,useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;


const ProfileForm = () => {

  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = function (e) {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };


  const handleUploadCloudinary = async () => {
    // console.log("skjfhsovjf");
    if (file) {
      try {
        const formData = new FormData();
        formData.append('profilePicture', file);
        
        //  console.log("aaaaaaaaaaaaa");
        formData.append('username', user.username);
  
        const response = await axios.post('http://localhost:5000/upload-cloudinary', formData);
        console.log("bbbbbbbbbbbbbbb");
        if (response.data.success) {
          console.log('Profile picture uploaded to Cloudinary:', response.data.imageUrl);
         
        } else {
          console.error('Failed to upload profile picture to Cloudinary:', response.data.message);
         
        }
      } catch (error) {
        console.error('Error during Cloudinary upload:', error);
        
      }
    } else {
      console.warn('No file selected for Cloudinary upload');
      alert('No Pic Selected');
    }
  };
  


  const { user, setUser,setIsAuth,IsAuth } = useContext(AuthContext);

  const RefreshToken = async () => {
      try {
          const res = await axios.get("http://localhost:5000/api/refresh", {
            withCredentials: true,
          });
          const data = res.data;
          setUser(data.message);
  
          return data;
      } catch (error) {
          console.error("Error refreshing token:", error);
          throw error;
      }
  }
  
  const SendRequest = async () => {
      try {
          const res = await axios.get("http://localhost:5000/api/user", {
            withCredentials: true,
          });
          const data = res.data;
          console.log(data);
          setUser(data.user);

      } catch (error) {
          console.error("Error sending request:", error);
          // throw error; 
          setIsAuth(false);
          navigate('/login');
      }
  }
  
     
     let firstRender = true;
     useEffect(() => {
      if (firstRender) {
        firstRender = false;
        SendRequest();
      }
      // let interval = setInterval(() => {
      //   RefreshToken();
      // }, 1000 * 29);
  
      // return () => clearInterval(interval);
    }, []);
  

  return (
    <>
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800">
        Welcome, {user && user.username}
      </h1>
    </div>
    <div className="flex items-center justify-center h-screen dark:bg-gray-900">
      <form className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <img
              id="preview_img"
              className="h-16 w-16 object-cover rounded-full"
              src={
                previewImage ||
                'https://lh3.googleusercontent.com/a-/AFdZucpC_6WFBIfaAbPHBwGM9z8SxyM1oV4wB4Ngwp_UyQ=s96-c'
              }
              alt="Current profile photo"
            />
          </div>
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input
              type="file"
              onChange={handleFileChange}
              className="block text-sm text-slate-500
                file:mb-4 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100
              "
            />
          </label>
      
          <button
            type="button"
            onClick={handleUploadCloudinary}
            className="mt-4 ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Upload Profile Pic
          </button>
        </div>
      </form>
    </div>
  </>

  );
};

export default ProfileForm;
