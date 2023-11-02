module.exports.getAllImages = (request, response, next) => {
  const db = request.db;
  db.collection("images")
    .get()
    .then((snapshot) => {
      const images = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      response.status(200).json(images);
    })
    .catch((error) => next(error));
};

module.exports.getImageById = (request, response, next) => {
  const db = request.db;

  const { id } = request.params;
  db.collection("images")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        response.status(404).json({ error: "Image not found" });
      } else {
        response.status(200).json({ id: doc.id, ...doc.data() });
      }
    })
    .catch((error) => next(error));
};

module.exports.postImage = (request, response, next) => {
  const db = request.db;
  const image = request.file;

  const imageData = {
    name: image.originalname,
    imageURL: image.path,
  };

  // Save the image URL to Firestore
  db.collection("images")
    .add(imageData)
    .then((data) => {
      response
        .status(201)
        .json({ message: "Image added successfully", imagePath: data.path });
    })
    .catch((error) => next(error));
};

module.exports.updateImage = (request, response, next) => {
  const db = request.db;
  const { id } = request.params;
  const image = request.file;
  // Check if the image exists before deleting it
  db.collection("images")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        // image with the specified ID does not exist
        return response.status(404).json({ error: "Image not found" });
      }
      // update the image
      db.collection("images")
        .doc(id)
        .update({ imageURL: image.path, name: image.originalname })
        .then((doc) => {
          response.status(200).json({ message: "Image updated successfully" });
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
};

module.exports.deleteImage = (request, response, next) => {
  const db = request.db;
  const { id } = request.params;

  // Check if the image exists before deleting it
  db.collection("images")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        // image with the specified ID does not exist
        return response.status(404).json({ error: "Image not found" });
      }

      // Delete the image
      db.collection("images")
        .doc(id)
        .delete()
        .then(() => {
          response.status(200).json({ message: "Image deleted successfully" });
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
};
