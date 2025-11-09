
import { useState } from 'react';
import '../CreateTripStyle.css'
import { BugetOption, MembersOptions } from '../assets/Options';
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';


const CreateTrip = () => {
  const [destination, setdestination] = useState()
  const [days, setdays] = useState()
  const [budget, setbudget] = useState()
  const [members, setmembers] = useState()

  const [showPopOver, setShowPopOver] = useState(false);
  const [openDialogBox, setopenDialogBox] = useState(false)
  const [loading, setloading] = useState(false)




  const navigate = useNavigate();
  

  const handlegenerateTrip = async()=>{
    alert("Please Wait .........It may Take a while as application uses other external Apis ")
    setloading(true)
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if(!storedUser || !token) {
      setopenDialogBox(true)
      setloading(false)
      return;
    }

    if(!destination || !days || !budget || !members ){
      alert(" Fill all the fields before clicking on the generate trip")
      setloading(false)
      return;
    }

    const tripData = { destination, days, budget, members };


    try {

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/trips/generate-trip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(tripData)
      });

      
      if(!response.ok) 
      {
        const err = await response.json().catch(()=>null);
        console.error("generate-trip error:", err);
        alert("Failed to generate trip");
      } 
      else 
      {
        const data = await response.json();
        if(data.success) 
        {
          navigate(`/view-trip/${data?.docId}`)
        }
        else 
        {
          alert(data.error || "Failed to generate trip")
        }
      }
    }
    catch(error) 
    {
      console.log("error occured while fetch", error)
      alert("failed to connect server")
    } 
    finally 
    {
      setloading(false)
    }
  }


  
  
  const login = useGoogleLogin({
    onSuccess : async(tokenResponse)=>{
      try
      {
        const access_token = tokenResponse.access_token;

        if(!access_token) {
          console.error("No access token from Google");
          return;
        }


        
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google-login`, {
          access_token
        });


        if(res?.data?.success) 
        {
          localStorage.setItem("user", JSON.stringify(res.data.user));

          localStorage.setItem("token", res.data.token);

          alert("Login successful. You can now generate a trip.");

          setopenDialogBox(false);

          window.location.reload();
        }
        else
        {
          console.error("Login response:", res.data);
          alert("Login failed");
        }
      }
      catch(error)
      {
        console.error("Error during backend google-login:", error);
        alert("Login failed (server error)");
      }
    },
    onError: (error) => {
      console.log("Google login error", error);
      alert("Google sign-in failed");
    },
    
  })




  return (
    <>
      <div className="container-main">
        <div className="sub-container-main">
          <div className="block1">Tell us your Preferences 
              <div className='subdiv'>Provide the basic information about the trip and AI will completely generate the plan.</div>
          </div>

          <div className="block2">What is your Destination place?
            <div className="subdiv2">
              
                <input className='inputtag2' type="text" placeholder='Enter destination' value={destination} onChange={(e)=>{setdestination(e.target.value)} }/>
            
            </div>
          </div>

          <div className="block2">How many days are you planning for your trip?
            <div className="subdiv2"><input  className='inputtag2' type="number" placeholder='Ex: 3'  value={days} onChange={(e)=>{setdays(e.target.value)}}/></div>
          </div>

          <div className="block3">What is your Budget for your trip?
            <div className="subdiv3">
              {BugetOption.map((item) => (
                <div  key={item.id} onClick={()=>{setbudget(item.title)}} className={`item-div ${budget === item.title ? "selected-item" : " "}`}>
                  {item.title}
                  <div className='desc-div'>{item.desc}</div>
                  {item.icon && <img className='icon-image' src={item.icon} alt="icon" />}
                </div>
              ))}
            </div>
          </div>

          <div className="block4">
            How Many Members are travelling?
            <div className="subdiv4">
              {MembersOptions.map((item) => (
                <div  key={item.id} onClick={()=>{setmembers(item.title)}} className={`item-div ${members === item.title ? "selected-item": ""}`}>
                  {item.title}
                  {item.icon && <img className='icon-image2' src={item.icon} alt="icon" />}
                </div>
              ))}
            </div> 
          </div>
        </div>
      </div> 
      <div className="buttons">
        <button disabled = {loading} onClick={handlegenerateTrip}>
          { loading ? <AiOutlineLoading3Quarters className='loading-icon'/>: "Generate Trip"}
        </button>
      </div>

      
    

      {/* Dialog Box for User Not Logged In */}
      {openDialogBox && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <img className='logo-db' src="public/logo.png" alt="" />
            <div>Login required to continue</div>
            <button onClick={login}>Sign in using Google</button>
            <div>
              <button className="close" onClick={()=>{setopenDialogBox(false)
              setloading(false)}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );


};

export default CreateTrip;
