const User = require("../models/userSchema");
const { randomUUID } = require("crypto");
const s3Client = require("../db/awsClient");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const getUser = async (req, res) => {
  res.send("get user");
};

const updateUser = async (req, res) => {
  let {
    _id,
    name,
    phone,
    address,
    email,
    extraPhone,
    profilePhotoUrl,
    profilePhotoId,
    profileImage,
  } = req.body;

  let updatedUser = {};

  if (profileImage) {
    console.log("if ran");
    const format = profileImage.substring(
      profileImage.indexOf("data:") + 5,
      profileImage.indexOf(";base64")
    );
    const base64String = profileImage.replace(/^data:image\/\w+;base64,/, "");

    const buff = Buffer.from(base64String, "base64");

    const newImageId = randomUUID();
    const newImageUrl = `https://ytu-cafeteria-users.s3.ap-southeast-1.amazonaws.com/${newImageId}`;

    const putObjectParams = {
      Bucket: process.env.AWS_USER_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: newImageId, // The name of the object. For example, 'sample_upload.txt'.
      Body: buff,
      ContentEncoding: "base64",
      ContentType: format,
    };

    updatedUser = await User.findOneAndUpdate(
      { _id: _id },
      {
        name,
        phone,
        address,
        email,
        extraPhone,
        profilePhotoUrl: newImageUrl,
        profilePhotoId: newImageId,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select({ password: 0 });

    const putResult = await s3Client.send(
      new PutObjectCommand(putObjectParams)
    );

    if (profilePhotoId) {
      const deleteObjectParams = {
        Bucket: process.env.AWS_USER_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
        Key: profilePhotoId, // The name of the object. For example, 'sample_upload.txt'.,
      };

      const deleteResult = await s3Client.send(
        new DeleteObjectCommand(deleteObjectParams)
      );
    }
  } else if (!profilePhotoUrl && profilePhotoId) {
    //Remove profile photo case
    // console.log("else if ran");

    const deleteObjectParams = {
      Bucket: process.env.AWS_USER_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: profilePhotoId, // The name of the object. For example, 'sample_upload.txt'.,
    };

    const deleteResult = await s3Client.send(
      new DeleteObjectCommand(deleteObjectParams)
    );
    updatedUser = await User.findOneAndUpdate(
      { _id: _id },
      {
        name,
        phone,
        address,
        email,
        extraPhone,
        profilePhotoUrl: "",
        profilePhotoId: "",
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select({ password: 0 });
  } else {
    updatedUser = await User.findOneAndUpdate(
      { _id: _id },
      {
        name,
        phone,
        address,
        email,
        extraPhone,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select({ password: 0 });
  }

  res.status(200).json({
    updatedUser,
    msg: "updated successfully",
  });
};

module.exports = {
  updateUser,
  getUser,
};
