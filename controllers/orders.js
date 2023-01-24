require("dotenv").config();
const Order = require("../models/orderSchema");
const Restaurant = require("../models/restaurantSchema");
const { Subject } = require("rxjs");
const webpush = require("web-push");

webpush.setVapidDetails(
  "mailto:heinha123456@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const newOrderRx = new Subject();
const updateOrderRx = new Subject();

const getByRestaurantId = async (req, res) => {
  const { restaurantId } = req.params;
  const orders = await Order.find({
    restaurantId,
    createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, //record only for last 24hrs
  }).sort({ createdAt: -1 });

  // setTimeout(() => {
  //   res.send({ data: orders, msg: "success" });
  // }, 1000);

  res.status(200).json({ data: orders, msg: "success" });
};

const getByCustomerId = async (req, res) => {
  const { customerId } = req.params;

  const orderHistory = await Order.find({
    customerId,
    createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  }).sort({ createdAt: -1 });

  res.send({ orderHistory, msg: "success" });
};

const addNewOrder = async (req, res) => {
  const { restaurantId } = req.body;
  const restaurant = await Restaurant.findOne({ _id: restaurantId });
  if (restaurant.status === "closed") {
    res
      .status(200)
      .json({ restaurant, msg: "The restaurant is recently closed!" });
    return;
  }

  try {
    const PushSubscription = restaurant.PushSubscription;
    if (PushSubscription) {
      const x = await webpush.sendNotification(PushSubscription);
    }
  } catch (error) {
    //subscription expire or error occur
    const afterRemovePushSub = await Restaurant.updateOne(
      { _id: restaurantId },
      { $unset: { PushSubscription: 1 } }
    );
  }

  //console.log("web push send noti", x);
  const newOrder = await Order.create(req.body);
  newOrderRx.next(newOrder);
  res.status(201).json({ newOrder, msg: "success" });
};

const editSingleOrder = async (req, res) => {
  //throw new Error();
  const { orderId, ...body } = req.body;
  const editedOrder = await Order.findByIdAndUpdate({ _id: orderId }, body, {
    returnDocument: "after",
    runValidators: true,
  });
  updateOrderRx.next(editedOrder);
  const { updatedAt } = editedOrder;
  // setTimeout(() => {
  //   res.send({ msg: "updated successfully", updatedAt });
  // }, 3000);
  res.send({ msg: "updated successfully", updatedAt });
};

const deleteSingleOrder = async (req, res) => {
  const { orderId } = req.params;
  const deletedOrder = await Order.findOneAndDelete({ _id: orderId });
  res.send({ msg: "deleted successfully" });
};

const watchNewOrder = async (req, res) => {
  const { restaurantId } = req.params;
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  newOrderRx.subscribe((order) => {
    if (order.restaurantId.toString() === restaurantId) {
      //order restaurant Id is new ObjectId("lorem ispen")
      // console.log("in if subcribe");
      res.write(`data: ${JSON.stringify(order)}\nid:${order._id}\n\n`);
    }
  });
  res.write(``);
};

const watchUpdateOrder = async (req, res) => {
  const { customerId } = req.params;
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  updateOrderRx.subscribe((order) => {
    const { _id, orderState, paymentStatus, updatedAt } = order;
    if (order.customerId.toString() === customerId) {
      //order restaurant Id is new ObjectId("lorem ispen")
      // console.log("in if subcribe");
      res.write(
        `data: ${JSON.stringify({
          _id,
          orderState,
          paymentStatus,
          updatedAt,
        })}\nid:${_id}\n\n`
      );
    }
  });

  res.write(``);
};

module.exports = {
  getByRestaurantId,
  getByCustomerId,
  addNewOrder,
  watchNewOrder,
  watchUpdateOrder,
  editSingleOrder,
  deleteSingleOrder,
};
