const axios = require("axios");

const getPlaceImages = async (queryParam) => {
  if (!queryParam) return null;

  try {
    const apiKey = process.env.GOOGLE_PLACE_API_KEY;

    const url = "https://places.googleapis.com/v1/places:searchText";
    const payload = {
      textQuery: queryParam,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.photos",
      },
    };

    const response = await axios.post(url, payload, config);

    const refPhoto = response?.data?.places?.[0]?.photos?.[0]?.name;

    if (!refPhoto) return null;

    const photoUrl = `https://places.googleapis.com/v1/${refPhoto}/media?key=${apiKey}&maxWidthPx=900&maxHeightPx=500`;

    return photoUrl;
  } catch (error) {
    console.error("Error fetching image from Google Places API:", error.message);
    return null;
  }
};

module.exports = getPlaceImages;
