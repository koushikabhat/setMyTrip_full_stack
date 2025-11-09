const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware')
const {generateTrip, fetchTripById, fetchImage, fetchTripHistory, deleteTrip} = require('../controllers/tripController');


router.get("/user/tripHistory", protect,fetchTripHistory )
router.get("/image", fetchImage);
router.post("/generate-trip", protect, generateTrip);
router.get("/:tripId", protect, fetchTripById);
router.delete("/trip/delete/:tripId", protect, deleteTrip);


module.exports = router;