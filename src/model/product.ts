import { Document, model, PaginateModel, Schema } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate";

export interface IProduct extends Document {
  item: string;
  currency: string;
  price: number;
  createdDate: Date;
}

const ProductSchema: Schema = new Schema({
  createdDate: {
    default: Date.now,
    type: Date,
  },
  currency: {
    required: "Enter a currency",
    type: String,
  },
  item: {
    required: "Enter an item",
    type: String,
  },
  price: {
    required: "Enter a price",
    type: Number,
  },
}).plugin(mongoosePaginate);

interface IProductModel<T extends Document> extends PaginateModel<T> {}

export const ProductModel: IProductModel<IProduct> = model<IProduct>("Product", ProductSchema);
