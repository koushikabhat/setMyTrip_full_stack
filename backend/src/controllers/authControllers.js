const generateToken = require('../utils/generateTokens');
const {OAuth2Client} = require('google-auth-library');
const  {db}  = require('../config/firebase');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin  = async(req, res)=>{
    try
    {
        console.log("inside google login");
        const { access_token } = req.body;

        if (!access_token) {
            return res.status(400).json({ success: false, message: "Missing access token" });
        }
        
       // Verify token using Google's API

       const ticket = await client.getTokenInfo(access_token);

        const email = ticket.email;
        const name = ticket.name || "User";
        const picture = ticket.picture || "";
        const sub = ticket.sub;

        //store or update in db in firebase 
        // console.log("Storing trip in database:", db); //debug
        const userRef =  db.collection("users").doc(email);
        const userData = {
            email,
            name,
            picture,
            googleId: sub,
            lastLoginAt: new Date(),
        };

        await userRef.set(userData, { merge: true });

        // Generate JWT token
        const token = generateToken(userData);


        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: userData,
            token,
        });
    }
    catch(error)
    {
        console.error("googleLogin error:", error);
        return res.status(500).json({ error: "Google login failed" });
    }
};


module.exports = { googleLogin };