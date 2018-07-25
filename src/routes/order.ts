import * as express from "express";
import * as core from "express-serve-static-core";
import { BusinessError } from "../error/BusinessError";
import { CustomerModel, ICustomer } from "../model/customer";
import { OrderModel } from "../model/order";
import removeEmpty from "../util/removeEmpty";
import wrapAsync from "../util/wrapAsync";

const orderRoute: core.Router = express.Router();

/**
 *  function to get orders from the following parameters:
 *  Query customerName -> Get all orders from a given customer
 *  Query customerAddress -> Get all orders for a given address
 */
orderRoute.get("/", (req: core.Request, res: core.Response, next: core.NextFunction) => {
  const { customerName, customerAddress } = req.query;
  if ( !customerName && !customerAddress ) {
    next("route");
  } else {
    next();
  }

}, wrapAsync(async (req: core.Request, res: core.Response) => {
    const { customerName, customerAddress, page, limit } = req.query;
    const filter = { address: customerAddress, name: customerName};
    const customerIds: string[] = await CustomerModel.distinct("_id", removeEmpty(filter));
    if ( !customerIds ) {
      throw new BusinessError(" Customer not found ", 404);
    }
    const orders = await OrderModel.paginate({ customer: {$in: customerIds} }, {page, limit: +limit});
    if ( !orders || orders.total === 0) {
      throw new BusinessError(" No orders for this customer ", 404);
    }
    res.send(orders);
}));

/**
 *  function to get orders
 */
orderRoute.get("/", wrapAsync(async (req: core.Request, res: core.Response) => {
  const { page, limit } = req.query;

  const orders = await OrderModel.paginate({},
    {page, limit});
  res.send(orders);
}));

/**
 * Create a new order, base on the following schema:
 * {
 *
 * }
 */
orderRoute.post("/", wrapAsync(async (req: core.Request, res: core.Response) => {
    const order = req.body;
    const orderInserted = await new OrderModel(order).save();
    res.status(200);
    res.send(orderInserted);
}));

/**
 *  Update an order by a given order identifier:
 */
orderRoute.put("/:_id", wrapAsync(async (req: core.Request, res: core.Response) => {
  const {_id} = req.params;
  const orderUpdated = await OrderModel.findOneAndUpdate({_id},  req.body, { new: true } );
  res.status(200);
  res.send(orderUpdated);
}));

/**
 *  Delete order by a given order identifier
 */
orderRoute.delete("/:_id", wrapAsync(async (req: core.Request, res: core.Response) => {
  const { _id } = req.params;
  const removedOrder = await OrderModel.findOneAndRemove({ _id });
  res.status(200);
  res.send(removedOrder);
}));

/**
 *  Get a list with all the item names and how many times they have been ordered,
 *  show the items that have been ordered the most at the
 *  beginning of the list, and in case of items with the same amount of occurrences,
 *  then sort their names alphabetically.
 */
orderRoute.get("/items", async (req: core.Request, res: core.Response) => {
  const items = await OrderModel.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "items",
        foreignField: "_id",
        as: "item",
      },
    },
    { $unwind: "$item" },
    { $group: {
        _id: {
          item: "$item",
        },
        orderedTimes: { $sum: 1 },
      },
    } ,
    { $project: {
        _id: 0,
        item: "$_id.item",
        orderedTimes: 1,
      },
    }, {
      $sort: {
        orderedTimes: -1,
        item: 1,
      },
    },
  ]);
  res.status(200);
  res.send(items);
});

export default orderRoute;
