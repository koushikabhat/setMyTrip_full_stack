
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../../../index.css';
import axios from 'axios';


const Viewtrip = () => {
  const [trip, setTrip] = useState(null);
  const { tripId } = useParams();
 

  const navigate = useNavigate();

  
  const  getTripData = async () => {
    try
    {
      // console.log("inisde gettripdata")
      
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/trips/${tripId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      });

      if (res.data.success) {
        setTrip(res?.data?.trip);
        // console.log('Trip fetched:', res.data.trip);
      }
    }
    catch(error)
    {
      console.error('Error fetching trip:', error);
      alert('Error fetching trip data. Please try again.');
    }
  }



  //start point 
  useEffect(() => {
    getTripData();
  }, [tripId]);


  
  // Handle navigation
  const handleTrip = () => {
    console.log('Clicked on generate another trip');
    navigate('/create-trip');
  };

  return (
    <>
      <div className="main-page">
        <div className="info">


          <div className="flex-bg">
              <img
                src= {trip?.coverImage || './bg.jpg'}
                alt='trip image'
                className='bg-img'
              />
          </div>


          <div className="subdiv1">


            <div className="dbm">
              <span className="bold">Destination 🌍</span> :
              <span className="bold2">{trip?.destination}</span>
            </div>

            <div className="dbm">
              <span className="bold">Budget 💸</span> :
              <span className="bold2">{trip?.budget}</span>
            </div>


            <div className="dbm">
              <span className="bold">Members 👪</span> :
              <span className="bold2">{trip?.members}</span>
            </div>


            <div className="dbm">
              <span className="bold">Days 📅</span> :
              <span className="bold2">{trip?.days}</span>
            </div>


          </div>
        </div>




        {/* Hotels */}
        <h2 className="heading-hotel">
          <span className="heading-span">🏩 Hotel Recommendation 🛌</span>
        </h2>
        <div className="hotels-info-div">
          
          {trip?.tripplan?.hotels?.map((hotel, index) => (
            <Link
              to={
                'https://www.google.com/maps/search/?api=1&query=' +
                hotel?.name +
                ' ,' +
                hotel?.address
              }
              target="_blank"
              key={index}
              className="link-element"
            >
              <div className="hotel-card animate-fade">

                <img src={trip.tripplan.hotels[index].image_url || '/bg.jpg'} alt="hotelimages" />
                <div className="hotel-name">{hotel.name}</div>
                <div className="hotel-address">📍 {hotel.address}</div>
                <div className="hotel-price">🏷️ Price: {hotel.price}</div>


              </div>
            </Link>
          ))}
        </div>

        {/* Places */}
        <h2 className="heading-places">
          <span className="heading-span-places">⛰️ Places To Visit 🏞️</span>
        </h2>
        <div className="trip-info">
          {trip?.tripplan?.itinerary?.map((data, index) => (
            <div className="place-card-container" key={index}>
              <h3 className="day-heading-places">Day {data?.day}</h3>
              {data?.places?.map((place, i) => (
                <Link
                  to={
                    'https://www.google.com/maps/search/?api=1&query=' +
                    place?.name +
                    ',' +
                    place?.address
                  }
                  key={i}
                  target="_blank"
                  className="link-element"
                >
                  <div className="place-card">
                    <div className="img-card">
                      <img
                        src={trip?.tripplan?.itinerary[index]?.places[i]?.image_url || '/bg.jpg'}
                        alt={place?.name}
                        className="place-img"
                      />
                    </div>
                    <div className="place-info">
                      <h4 className="place-name-h4">{place?.name}</h4>
                      <p>
                        <strong className="strong">📍 Address:</strong>{' '}
                        {place?.address}
                      </p>
                      <p>
                        <strong className="strong">📝 Details:</strong>{' '}
                        {place?.details}
                      </p>
                      <p>
                        <strong className="strong">🕒 Travel Time:</strong>{' '}
                        {place?.travel_time}
                      </p>
                      <p>
                        <strong className="strong">🎟️ Ticket Price:</strong> ₹
                        {place?.ticket_price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-buttons">
          <button className="footer-btn" onClick={handleTrip}>
            Generate Another Trip
          </button>
        </div>
      </div>
    </>
  );
};

export default Viewtrip;
