const axios = require("axios");

module.exports.postShortUrl = async (request, response, next) => {
  const db = request.db;
  const accessToken = "68ae3fc91849e9feb258179d7877f6d37fcb86d4";
  const apiUrl = `https://api-ssl.bitly.com/v4/shorten`;
  const longUrl = request.query.url;

  try {
    const { data } = await axios.post(
      apiUrl,
      {
        long_url: longUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    await db
      .collection("Urls")
      .add({ original_link: longUrl, short_link: data.link });
    response.status(201).json({ shortLink: data.link });
  } catch (error) {
    next(error);
  }
};

// try {
//   const LongUrl = `https://api.shrtco.de/v2/shorten?url=${req.query.url}`;

//   // Make an Axios request to the shortening service
//   const axiosResponse = await axios.post(LongUrl);

//   // Save the shortened URL in the database
//   const shortLink = axiosResponse.data.result.full_short_link;
//   await db.collection("Urls").add({ shortLink });

//   response.status(201).json({ shortLink: data.link });
// } catch (error) {
//   next(error);
// }
