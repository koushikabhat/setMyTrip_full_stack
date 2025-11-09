require('dotenv').config();
const app = require('./app');

const PORT =  3000; 

//routes
const tripRoutes = require("./routes/tripRoutes");
const authRoutes = require("./routes/authRoutes");




//middlewares

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);







// app.get('/', (req, res) => {
//     res.send('Welcome to the Travel App API');
// });


// app.get('/welcome', async(req,res)=>{
//   res.json({message  : "Succefully at backend ", success : true});
// })



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

