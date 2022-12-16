const Order = require("../models/orderSchema");
const { Subject } = require("rxjs");

const newOrderRx = new Subject();

const getByRestaurantId = async (req, res) => {
  const { restaurantId } = req.params;
  const orders = await Order.find({ restaurantId });

  res.send({ data: orders, msg: "success" });
};

const addNewOrder = async (req, res) => {
  const newOrder = await Order.create(req.body);
  const { order } = newOrder;
  newOrderRx.next(newOrder);
  res.status(201).json({ order, msg: "success" });
};

const editSingleOrder = async (req, res) => {
  const { orderId, ...body } = req.body;
  const editedOrder = await Order.findByIdAndUpdate({ _id: orderId }, body, {
    returnDocument: "after",
    runValidators: true,
  });
  const { updatedAt } = editedOrder;
  res.send({ msg: "updated successfully", updatedAt });
};

const deleteSingleOrder = async (req, res) => {
  // console.log("req body", req.body);
  const { orderId } = req.params;
  const deletedOrder = await Order.findOneAndDelete({ _id: orderId });
  // console.log(deletedOrder);
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

module.exports = {
  getByRestaurantId,
  addNewOrder,
  watchNewOrder,
  editSingleOrder,
  deleteSingleOrder,
};
