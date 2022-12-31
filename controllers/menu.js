const Menu = require("../models/menuSchema");
const path = require("path");
const s3Client = require("../db/awsClient");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { randomUUID } = require("crypto");

const addNewMenu = async (req, res) => {
  const { name, price, description, menuImage, restaurantId, category } =
    req.body;

  let menuPhotoId = "";
  let menuPhotoUrl = "";

  if (menuImage) {
    const format = menuImage.substring(
      menuImage.indexOf("data:") + 5,
      menuImage.indexOf(";base64")
    );
    const base64String = menuImage.replace(/^data:image\/\w+;base64,/, "");

    const buff = Buffer.from(base64String, "base64");

    menuPhotoId = randomUUID();
    menuPhotoUrl = `https://ytu-cafeteria-menu.s3.ap-southeast-1.amazonaws.com/${menuPhotoId}`;

    const params = {
      Bucket: process.env.AWS_MENU_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: menuPhotoId, // The name of the object. For example, 'sample_upload.txt'.
      Body: buff,
      ContentEncoding: "base64",
      ContentType: format,
    };

    const results = await s3Client.send(new PutObjectCommand(params));
  }
  const addedMenu = await Menu.create({
    name,
    price,
    description,
    menuPhotoId,
    menuPhotoUrl,
    restaurantId,
    category,
  });
  res.status(201).json({ addedMenu, msg: "Added Successfully" });
};

const getAllMenu = async (req, res) => {
  const { restaurantId } = req.params;
  const menuData = await Menu.find({ restaurantId });

  // setTimeout(() => {
  //   res
  //     .status(200)
  //     .json({ data: menuData, msg: "success", nbHits: menuData.length });
  // }, 200000);
  res
    .status(200)
    .json({ data: menuData, msg: "success", nbHits: menuData.length });
};

const deleteMenu = async (req, res) => {
  const { menuId } = req.params;
  const deletedMenu = await Menu.findByIdAndDelete({ _id: menuId });
  if (deletedMenu.menuPhotoId) {
    const deleteObjectParams = {
      Bucket: process.env.AWS_MENU_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: deletedMenu.menuPhotoId, // The name of the object. For example, 'sample_upload.txt'.,
    };

    const deleteResult = await s3Client.send(
      new DeleteObjectCommand(deleteObjectParams)
    );
  }
  res.status(202).json({ msg: "deleted successfully" });
};

const updateMenu = async (req, res) => {
  const {
    _id,
    name,
    price,
    description,
    menuImage,
    menuPhotoId,
    menuPhotoUrl,
  } = req.body;

  let editedMenu = {};

  if (menuImage) {
    const format = menuImage.substring(
      menuImage.indexOf("data:") + 5,
      menuImage.indexOf(";base64")
    );
    const base64String = menuImage.replace(/^data:image\/\w+;base64,/, "");

    const buff = Buffer.from(base64String, "base64");

    const newMenuPhotoId = randomUUID();
    const newMenuPhotoUrl = `https://ytu-cafeteria-menu.s3.ap-southeast-1.amazonaws.com/${newMenuPhotoId}`;

    const putObjectParams = {
      Bucket: process.env.AWS_MENU_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: newMenuPhotoId, // The name of the object. For example, 'sample_upload.txt'.
      Body: buff,
      ContentEncoding: "base64",
      ContentType: format,
    };

    editedMenu = await Menu.findOneAndUpdate(
      { _id: _id },
      {
        name,
        price,
        description,
        menuPhotoId: newMenuPhotoId,
        menuPhotoUrl: newMenuPhotoUrl,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    const putResult = await s3Client.send(
      new PutObjectCommand(putObjectParams)
    );

    if (menuPhotoId) {
      const deleteObjectParams = {
        Bucket: process.env.AWS_MENU_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
        Key: menuPhotoId, // The name of the object. For example, 'sample_upload.txt'.,
      };

      const deleteResult = await s3Client.send(
        new DeleteObjectCommand(deleteObjectParams)
      );
    }
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
