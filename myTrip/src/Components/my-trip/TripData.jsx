

import React, { useEffect, useState } from 'react'
import './TripHistory.css'

import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AiOutlineLoading3Quarters } from "react-icons/ai";



const TripData = () => {
   
    const [trip, setTrip] = useState([])  
    const [loading , setLoading] = useState(false);



    const Navigate = useNavigate();

    useEffect(()=>{
      fetchUserTrips();
    },[])

    const fetchUserTrips = async()=>{
      try
      {
        const token = localStorage.getItem('token');  

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/trips/user/tripHistory`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if(res.data.success)
        {
          
          return setTrip(res.data.data);
          // console.log("user trips data", res.data.data);
        }
        else
        {
          
          return alert("Failed to fetch user trips");
        }
      }
      catch(error)
      {
        
        console.log("Error in fetching user trips", error)
        alert("Error in fetching user trips");
      }
    }


    const handledelete = async(tripid)=>{
      
      
      if(!tripid){
        return alert("Trip ID not found");
      }

      const token = localStorage.getItem('token');

      try
      {
        setLoading(true);
        const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/trips/trip/delete/${tripid}`,{
          headers :{
            Authorization : `Bearer ${token}`,
          }
        })

        if(res.data.success)
        {
          alert("Trip deleted successfully");
          setLoading(false);
          // window.location.reload();
          fetchUserTrips(); 
        }
        else
        {
          setLoading(false);
          return alert("Failed to delete trip");
        }
      }
      catch(error)
      {
        setLoading(false);
        console.log("error in deleting trip", error);
        return alert("Error in deleting trip");
      }
    }
    
    const handleNavigate = (tripId)=>{
      Navigate(`/view-trip/${tripId}`);
    }
  
  return (
    <>
      <div className="trip-container">
        <h2 className='heading2'>My Trips</h2>
          <div className="grid-container">
            
          

            { Array.isArray(trip) && trip.length > 0 ? (
              trip.map((tripdata, index) => (
                <div className="placess-card" key={index}>
                  <img src={tripdata.coverImage || null} alt="placeimage" />
                  <h2>Destination : {tripdata.destination}</h2>
                  <h2>Days : {tripdata?.days}</h2>

                  <div className="delete-btn-div">
                    <button
                      className="delete-btn"
                      onClick={() => handleNavigate(tripdata.tripId)}
                    >
                      View Trip
                    </button>
                  </div>

                  <div className="delete-btn-div">
                    <button
                      className="delete-btn"
                      onClick={() => handledelete(tripdata.tripId)}
                      disabled={loading}
                    >
                      {loading ? (
                        <AiOutlineLoading3Quarters className="spin-icon" />
                      ) : (
                        "DELETE"
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className='nothing-word'>Nothing is Stored</p>
            )}

          </div>
      </div>
      
    </>
  )
}

export default TripData

