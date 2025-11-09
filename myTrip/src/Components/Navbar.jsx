

import React, { useRef, useEffect, useState } from 'react';
import '../NavStyle.css';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [profileImg, setProfileImg] = useState();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [showPopOver, setShowPopOver] = useState(false);
  const popoverref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setProfileImg(user.picture);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverref.current && !popoverref.current.contains(e.target)) {
        setShowPopOver(false);
      }
    };
    if (showPopOver) document.addEventListener('mouseup', handleClickOutside);
    return () => document.removeEventListener('mouseup', handleClickOutside);
  }, [showPopOver]);



  const togglePopover = () => setShowPopOver((prev) => !prev);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google-login`, {
          access_token: tokenResponse.access_token,
        });

        if (res.data.success) {
          const { user, token } = res.data;

          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);

          setUser(user);
          setProfileImg(user.picture);

          toast.success(`Welcome, ${user.name.split(' ')[0]}!`, { autoClose: 3000 });
        }
      }
      catch (err) 
      {
        console.error('Backend login error:', err);
        toast.error('Login failed. Please try again.');
      }
    },
    onError: (err) => {
      console.error('Google login error:', err);
      toast.error('Google login failed. Try again.');
    },
  });

  const handleSignIn = () => login();

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully!', { autoClose: 5500 });
    navigate('/');
    window.location.reload();
  };

  const handleMyTrips = async () => {
    const token = localStorage.getItem('token');

    try {

      toast.info('Fetching your trips...', { autoClose: 1500 });

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/trips/user/tripHistory`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const trips = res.data.data;
        navigate('/my-trips', { state: { trips } });
      } else {
        toast.error('Failed to fetch trips. Please try again.');
      }
    } catch (error) {
      console.log('Error fetching trips:', error);
      toast.error('Error fetching trips. Please try again later.');
    }
  };

  const handleLogoClick = () => navigate('/');

  return (
    <>
      <div className="navbar">
        <img
          className="logo2-img"
          src="/logo.png"
          alt="logo"
          onClick={handleLogoClick}
        />
        {user ? (
          <div className="profile-div">
            <button className="signin-btn" onClick={() => handleMyTrips()}>
              My Trips
            </button>
            <img
              src={profileImg}
              referrerPolicy="no-referrer"
              className="profile-image"
              alt="profile"
              onClick={togglePopover}
            />
          </div>
        ) : (
          <button className="signin-btn" onClick={handleSignIn}>
            Sign In
          </button>
        )}
      </div>

      {showPopOver && (
        <div className="popover" ref={popoverref}>
          <button className="popover-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
