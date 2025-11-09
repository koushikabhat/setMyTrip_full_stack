
const { ai } = require('../config/gemeni')
const  {db}  = require('../config/firebase');
const getPlaceImages = require('../service/getPlaceImages');

const generateTrip  = async(req, res)=>{

    try
    {   
        const { destination, days, budget, members } = req.body;
        const userId = req.user && req.user.userId;


        if (!destination || !days || !budget || !members) 
        {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (!userId) 
        {
            return res.status(401).json({ error: "User not authenticated" });
        }


        const prompt = `Generate a trip plan for ${destination} for ${days} days with a budget of ${budget} for ${members} people. 
        Give me only a valid JSON response without any extra text and also give me "valid and working " image url for the image of the location and multiple hotels recomend atleast 5 hotels to stay   and suggest atleast 3 to 4  places per day . The JSON should include:
        {
        "hotels": [ { "name": "Hotel X", "address": "XYZ", "price": 100, "image_url": "URL", "geo": { "lat": 0, "lng": 0 } },
                    {"name": "Hotel y", "address": "XYZ", "price": 100, "image_url": "URL", "geo": { "lat": 0, "lng": 0 }},
                    {"name": "Hotel z", "address": "XYZ", "price": 100, "image_url": "URL", "geo": { "lat": 0, "lng": 0 }}
                ],
        "itinerary": [ { "day": 1, "places": [ { "name": "Place A", "address": "XYZ", "details": "desc", "image_url": "URL", "geo": { "lat": 0, "lng": 0 }, "ticket_price": 10, "travel_time": "30 mins" } ] } ]
        }`


        //generate response from gemeni ai 
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        
        //validate the response if the gemini is given a valid json or not
        const responseText = response.text;
        const jsonStart = responseText.indexOf("{");
        const jsonEnd = responseText.lastIndexOf("}");


        if (jsonStart === -1 || jsonEnd === -1) 
        {
            console.error("AI returned invalid JSON:", responseText);
            return res.status(500).json({ error: "AI returned invalid response" });
        }

        //string to json conversion
        const tripplan = JSON.parse(responseText.substring(jsonStart, jsonEnd + 1).trim());
        const tripId = Date.now().toString();

      
        //step 2  : fetching images fron=m heper function 
        const destinationImage = await getPlaceImages(destination); 


        //hotel image url 
        if(tripplan?.hotels)
        {
            for(const hotel of tripplan.hotels)
            {
                const imagurl = await getPlaceImages(hotel.name);
                hotel.image_url = imagurl || null;

            } 
        }

        //for place 
        if(tripplan?.itinerary) 
        {
            for(const day of tripplan.itinerary)
            {
                for(const place of day.places)
                {
                    const placeimgurl = await getPlaceImages(place.name);
                    place.image_url = placeimgurl || null;
                }
            }
        }

        await db.collection("AiGeneratedTrips").doc(tripId).set({
            tripId,
            userId,
            destination,
            days,
            budget,
            members,
            tripplan,
            coverImage: destinationImage || null,
            
            createdAt: new Date(),
        });


        return res.status(201).json({
            message: "Trip successfully created",
            success: true,
            docId: tripId,
        });

    }
    catch(error)
    {
        console.error("generateTrip error:", error);
        return res.status(500).json({ error: "Failed to generate trip" });
    }
    
}






const fetchTripById = async(req, res)=>{
    try
    {
        const { tripId } = req.params;
        
        const docref = db.collection("AiGeneratedTrips").doc(tripId);
        const docSnap = await docref.get();

        if (!docSnap.exists) 
        {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        return res.status(200).json({
            success: true,
            trip: docSnap.data(),
        });

    }
    catch(error)
    {
        console.log("fetchTripById error:", error);   
        res.status(500).json({ success: false, message: 'Failed to fetch trip' });
    }
}




const fetchTripHistory = async(req,res)=>{
    
    try
    {
        const userEmail = req?.user && req?.user.userId.email;

        if(!userEmail)
        {
            return res.status(401).json({ success: false, message: 'User not Found' });
        }

        //fetching all the trip from firebase that has email id as userEmail inside userId email 
        const tripsRef = db.collection("AiGeneratedTrips");
        const snapshot = await tripsRef.where("userId.email", "==", userEmail).get();

       
        const trips = [];
        snapshot.forEach((doc) => {
            trips.push(doc.data());
        });

        if(trips.length === 0)
        {
            return res.status(200).json({ success: true, message: 'No trips found ' });
        }

        return res.status(200).json({ success: true, data : trips });
    }
    catch(error)
    {
        console.error("fetchTripHistory error:", error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch trip history' });
    }
}


const deleteTrip = async(req,res)=>{
    console.log("Inside deleteTrip");

    try{
        const { tripId } = req.params;

        if(!tripId)
        {
            return res.status(400).json({ success: false, message: 'Trip ID is required' });
        }
        
        
        await db.collection('AiGeneratedTrips').doc(tripId).delete();

        return res.status(200).json({ success: true, message: 'Trip deleted successfully' });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to delete trip' });
    }
   
}



const fetchImage  = async(req, res)=>{
    const axios = require("axios");


    try
    {
        const imageurl = req.query.url;
        
        if (!imageurl || !imageurl.startsWith("http"))
        {
            return res.status(400).send("Invalid image URL");
        }

        const response = await axios({
            method: "GET",
            url: imageurl,
            responseType: "stream",
            timeout: 15000,
        })

        res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");
        response.data.pipe(res)

    }
    catch(error)
    {
        console.error("fetchImage error:", error.message);
        res.status(500).send("Failed to fetch image");
    }

}

module.exports = {generateTrip, fetchTripById, fetchImage, fetchTripHistory, deleteTrip};