const Menu = require("../models/menuSchema");
const fs = require("fs");
const path = require("path");
const s3Client = require("../db/awsClient");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { randomUUID } = require("crypto");

const addNewMenu = async (req, res) => {
  const { name, price, description, image, restaurantName, category } =
    req.body;

  let addedMenu = {};

  if (image) {
    const format = image.substring(
      image.indexOf("data:") + 5,
      image.indexOf(";base64")
    );
    const base64String = image.replace(/^data:image\/\w+;base64,/, "");

    const buff = Buffer.from(base64String, "base64");

    const imageId = randomUUID();
    const imageUrl = `https://ytu-cafeteria-menu.s3.ap-southeast-1.amazonaws.com/${imageId}`;

    const params = {
      Bucket: process.env.AWS_MENU_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: imageId, // The name of the object. For example, 'sample_upload.txt'.
      Body: buff,
      ContentEncoding: "base64",
      ContentType: format,
    };

    const results = await s3Client.send(new PutObjectCommand(params));

    addedMenu = await Menu.create({
      name,
      price,
      description,
      imageId,
      imageUrl,
      restaurantName,
      category,
    });
  } else {
    addedMenu = await Menu.create({
      name,
      price,
      description,
      imageId: "",
      imageUrl:
        "https://ytu-cafeteria-menu.s3.ap-southeast-1.amazonaws.com/Image-Coming-Soon-Placeholder.png",
      restaurantName,
      category,
    });
  }

  res.status(201).json({ addedMenu, msg: "Added Successfully" });
};

const getAllMenu = async (req, res) => {
  const { restaurantName } = req.params;
  const menuData = await Menu.find({ restaurantName });
  res
    .status(200)
    .json({ data: menuData, msg: "success", nbHits: menuData.length });
};

const deleteMenu = async (req, res) => {
  const { menuId } = req.params;
  const deletedMenu = await Menu.findByIdAndDelete({ _id: menuId });
  if (deletedMenu.imageId) {
    const deleteObjectParams = {
      Bucket: process.env.AWS_MENU_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: deletedMenu.imageId, // The name of the object. For example, 'sample_upload.txt'.,
    };

    const deleteResult = await s3Client.send(
      new DeleteObjectCommand(deleteObjectParams)
    );
  }
  console.log(deletedMenu);
  res.status(202).json({ msg: "deleted successfully" });
};

const updateMenu = async (req, res) => {
  const { _id, name, price, description, image, imageId, imageUrl } = req.body;
  let editedMenu = {};

  if (image) {
    const format = image.substring(
      image.indexOf("data:") + 5,
      image.indexOf(";base64")
    );
    const base64String = image.replace(/^data:image\/\w+;base64,/, "");

    const buff = Buffer.from(base64String, "base64");

    const newImageId = randomUUID();
    const newImageUrl = `https://ytu-cafeteria-menu.s3.ap-southeast-1.amazonaws.com/${newImageId}`;

    const putObjectParams = {
      Bucket: process.env.AWS_MENU_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: newImageId, // The name of the object. For example, 'sample_upload.txt'.
      Body: buff,
      ContentEncoding: "base64",
      ContentType: format,
    };

    const putResult = await s3Client.send(
      new PutObjectCommand(putObjectParams)
    );

    if (imageId) {
      const deleteObjectParams = {
        Bucket: process.env.AWS_MENU_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
        Key: imageId, // The name of the object. For example, 'sample_upload.txt'.,
      };

      const deleteResult = await s3Client.send(
        new DeleteObjectCommand(deleteObjectParams)
      );
    }

    editedMenu = await Menu.findOneAndUpdate(
      { _id: _id },
      { name, price, imageUrl: newImageUrl, imageId: newImageId, description },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
  } else {
    editedMenu = await Menu.findOneAndUpdate(
      { _id: _id },
      { name, price, description },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
  }

  res.status(200).json({ editedMenu, msg: "updated successfully" });
};

module.exports = {
  updateMenu,
  deleteMenu,
  addNewMenu,
  getAllMenu,
};
