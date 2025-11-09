
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="773253160947-j4kdtcotke0jm2c4m0ik3k5di4i5o5ho.apps.googleusercontent.com">
    <StrictMode>
      <App /> 
    </StrictMode>
  </GoogleOAuthProvider>,
)
