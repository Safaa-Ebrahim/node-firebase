const axios = require("axios");

module.exports.postShortUrl = async (request, response, next) => {
  const db = request.db;
  const url = request.query;
  const LongUrl = `https://api.shrtco.de/v2/shorten?url=${url}`;
  axios
    .post(LongUrl)
    .then((res) => {
      const { short_link: shortLink } = res.data.result;
      console.log(res.data.result);
      response.status(201).json({ shortLink });
      //   Save the shortened link to Firestoreconst
      db.collection("Urls")
        .add({ original_link: url, shortLink })
        .then((docRef) => {
          response.status(201).json({ id: docRef.id, shortLink });
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
};
