const Restaurant = require("../models/restaurantSchema");
const User = require("../models/userSchema");
const { randomUUID } = require("crypto");
const s3Client = require("../db/awsClient");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const registerRestaurant = async (req, res) => {
  const {
    name,
    firstPhone,
    secondPhone,
    address,
    establishedIn,
    delivery,
    paymentMethods,
    restaurantImage,
    ownerId,
  } = req.body;

  let restaurantPhotoUrl = "";
  let restaurantPhotoId = "";

  if (restaurantImage) {
    const format = restaurantImage.substring(
      restaurantImage.indexOf("data:") + 5,
      restaurantImage.indexOf(";base64")
    );
    const base64String = restaurantImage.replace(
      /^data:image\/\w+;base64,/,
      ""
    );

    const buff = Buffer.from(base64String, "base64");

    restaurantPhotoId = randomUUID();
    restaurantPhotoUrl = `https://ytu-cafeteria-restaurants.s3.ap-southeast-1.amazonaws.com/${restaurantPhotoId}`;

    const params = {
      Bucket: process.env.AWS_RESTAURANT_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: restaurantPhotoId, // The name of the object. For example, 'sample_upload.txt'.
      Body: buff,
      ContentEncoding: "base64",
      ContentType: format,
    };

    const results = await s3Client.send(new PutObjectCommand(params));
  }
  const restaurant = await Restaurant.create({
    name,
    firstPhone,
    secondPhone,
    address,
    establishedIn,
    delivery,
    paymentMethods,
    restaurantPhotoId,
    restaurantPhotoUrl,
    ownerId,
  });
  const userUpdate = await User.findOneAndUpdate(
    { _id: ownerId },
    { restaurantId: restaurant._id },
    {
      returnDocument: "after",
      runValidators: true,
    }
  ).select({ password: 0 });

  res
    .status(201)
    .json({ restaurant, user: userUpdate, message: "Registered Successfully" });
};

const updateRestaurant = async (req, res) => {
  let {
    _id,
    name,
    firstPhone,
    secondPhone,
    address,
    establishedIn,
    delivery,
    paymentMethods,
    restaurantPhotoUrl,
    restaurantPhotoId,
    restaurantImage,
  } = req.body;

  let updatedRestaurant = {};

  if (restaurantImage) {
    console.log("if ran");
    const format = restaurantImage.substring(
      restaurantImage.indexOf("data:") + 5,
      restaurantImage.indexOf(";base64")
    );
    const base64String = restaurantImage.replace(
      /^data:image\/\w+;base64,/,
      ""
    );

    const buff = Buffer.from(base64String, "base64");

    const restaurantPhotoId = randomUUID();
    const restaurantPhotoUrl = `https://ytu-cafeteria-users.s3.ap-southeast-1.amazonaws.com/${restaurantPhotoId}`;

    const putObjectParams = {
      Bucket: process.env.AWS_RESTAURANT_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: restaurantPhotoId, // The name of the object. For example, 'sample_upload.txt'.
      Body: buff,
      ContentEncoding: "base64",
      ContentType: format,
    };

    updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: _id },
      {
        _id,
        name,
        firstPhone,
        secondPhone,
        address,
        establishedIn,
        delivery,
        paymentMethods,
        restaurantPhotoUrl,
        restaurantPhotoId,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    const putResult = await s3Client.send(
      new PutObjectCommand(putObjectParams)
    );

    if (restaurantPhotoId) {
      const deleteObjectParams = {
        Bucket: process.env.AWS_RESTAURANT_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
        Key: restaurantPhotoId, // The name of the object. For example, 'sample_upload.txt'.,
      };

      const deleteResult = await s3Client.send(
        new DeleteObjectCommand(deleteObjectParams)
      );
    }
  } else if (!restaurantPhotoUrl && restaurantPhotoId) {
    //Remove profile photo case
    // console.log("else if ran");

    const deleteObjectParams = {
      Bucket: process.env.AWS_RESTAURANT_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: restaurantPhotoId, // The name of the object. For example, 'sample_upload.txt'.,
    };

    const deleteResult = await s3Client.send(
      new DeleteObjectCommand(deleteObjectParams)
    );
    updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: _id },
      {
        _id,
        name,
        firstPhone,
        secondPhone,
        address,
        establishedIn,
        delivery,
        paymentMethods,
        restaurantPhotoUrl,
        restaurantPhotoId,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
  } else {
    updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: _id },
      {
        _id,
        name,
        firstPhone,
        secondPhone,
        address,
        establishedIn,
        delivery,
        paymentMethods,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
  }

  res.status(200).json({
    updatedRestaurant,
    msg: "updated successfully",
  });
};

const getRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findOne({ _id: restaurantId });
  res.status(200).json({ restaurant, msg: "fetch success" });
};

module.exports = {
  registerRestaurant,
  updateRestaurant,
  getRestaurant,
};
