import { Document, model, PaginateModel,  Schema } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate";

export interface ICustomer extends Document {
    address: string;
    city: string;
    country: string;
    birth: Date;
    name: string;
    title: string;
    email: string;
    createdDate: Date;
}

const CustomerSchema: Schema = new Schema({
    address: {
      required: "Enter a address",
      type: String,
    },
    birth: {
      required: "Enter a birth date",
      type: Date,
    },
    city: {
      required: "Enter a City",
      type: String,
    },
    country: {
      required: "Enter a Country",
      type: String,
    },
    createdDate: {
      default: Date.now,
      type: Date,
    },
    email: {
      required: "Enter an email",
      type: String,
    },
    name: {
      required: "Enter a name",
      type: String,
    },
    title: {
      required: "Enter a title",
      type: String,
    },
}).plugin(mongoosePaginate);

interface ICustomerModel<T extends Document> extends PaginateModel<T> {}

export const CustomerModel: ICustomerModel<ICustomer> = model<ICustomer>("Customer", CustomerSchema);
