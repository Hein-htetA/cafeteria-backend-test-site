const User = require("../models/userSchema");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError } = require("../errors");
const { randomUUID } = require("crypto");
const s3Client = require("../db/awsClient");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const registerUser = async (req, res) => {
  const { name, phone, password, address, email, extraPhone, profileImage } =
    req.body;

  let profilePhotoUrl = "";
  let profilePhotoId = "";

  if (profileImage) {
    const format = profileImage.substring(
      profileImage.indexOf("data:") + 5,
      profileImage.indexOf(";base64")
    );
    const base64String = profileImage.replace(/^data:image\/\w+;base64,/, "");

    const buff = Buffer.from(base64String, "base64");

    profilePhotoId = randomUUID();
    profilePhotoUrl = `https://ytu-cafeteria-users.s3.ap-southeast-1.amazonaws.com/${profilePhotoId}`;

    const params = {
      Bucket: process.env.AWS_USER_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: profilePhotoId, // The name of the object. For example, 'sample_upload.txt'.
      Body: buff,
      ContentEncoding: "base64",
      ContentType: format,
    };

    const results = await s3Client.send(new PutObjectCommand(params));
  }

  const user = await User.create({
    name,
    phone,
    password,
    address,
    email,
    extraPhone,
    profilePhotoUrl,
    profilePhotoId,
  });

  user.password = undefined;

  res.status(201).json({
    user,
    msg: "register success",
  });
};

const login = async (req, res) => {
  const { phone, password } = req.body;
  console.log(phone);
  console.log(password);

  let user = await User.findOne({ phone });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  user.password = undefined; //removing password field

  // compare password
  // const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user,
    msg: "Logged In Successfully",
  });
};

module.exports = {
  registerUser,
  login,
};
