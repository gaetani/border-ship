import { Document, model, PaginateModel, Schema } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate";
import { ICustomer } from "./customer";
import { IProduct } from "./product";

interface IOrder extends Document {
    customer: ICustomer;
    item: IProduct[];
    createdDate: Date;
}

const OrderSchema: Schema = new Schema({
    createdDate: {
      default: Date.now,
      type: Date,
    },
    customer: {
      ref: "Customer",
      required: "Enter a customer",
      type: Schema.Types.ObjectId,
    },
    items: {
      ref: "Product",
      type: [ Schema.Types.ObjectId ],
    },
}).plugin(mongoosePaginate);

interface IOrderModel<T extends Document> extends PaginateModel<T> {}

export const OrderModel: IOrderModel<IOrder> = model<IOrder>("Order", OrderSchema);
