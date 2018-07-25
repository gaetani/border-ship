import { test } from "ava";
import * as mongoose from "mongoose";
import * as supertest from "supertest";
import { server } from "../app";

test.before(async (t: any) => {
  const res = await supertest(server)
    .post("/customer")
    .send({
      address: "Reeperbahn 153",
      birth: new Date(),
      city: "Berlin",
      country: "germany",
      email: "john@smith.com",
      name: "John Smith",
      title: "Mr.",
    });
  t.context.customer = res.body;
});

test.before(async (t: any) => {
  const res = await supertest(server)
    .post("/product")
    .send({
      currency: "USD",
      item: "Flux compensator",
      price: 2000,
    });
  t.context.products = [];
  t.context.products.push(res.body);
});

test.before(async (t: any) => {
  const res = await supertest(server)
    .post("/product")
    .send({
      currency: "EUR",
      item: "Book \"Guide to Hamburg\"",
      price: 20,
    });
  t.context.products.push(res.body);
});

test.before(async (t: any) => {
  const res = await supertest(server)
    .post("/product")
    .send({
      currency: "EUR",
      item: "Inline Skates",
      price: 75,
    });
  t.context.products.push(res.body);
});

test.before(async (t: any) => {
  const res = await supertest(server)
    .post("/order")
    .send({
      customer: t.context.customer,
      items: t.context.products,
    });
  t.context.order = res.body;
});

test.after.always(async ( ) => {
  await mongoose.connection.db.dropDatabase();
});

test("order:post - insert a new order", async (t: any) => {
    t.plan(3);
    const res = await supertest(server)
                .post("/order")
                .send({
                  customer: t.context.customer,
                  items: t.context.products,
                });
    t.context.order = res.body;
    t.is(res.status, 200);
    t.is(res.body.customer, t.context.customer._id);
    t.is(res.body.items.length, t.context.products.length);
});

test("order:put - update a new order", async (t: any) => {
  t.plan(2);
  const order = t.context.order;
  order.items = order.items.slice(0, 1);
  const res = await supertest(server)
    .put(`/order/${order._id}`)
    .send(order);
  t.is(res.status, 200);
  t.is(res.body.items.length, 1);
});

test("order:get - get an order by customer name", async (t: any) => {
  t.plan(2);
  const customer = t.context.customer;
  const res = await supertest(server)
    .get(`/order/?customerName=${customer.name}&page=1&limit=50`)
    .send();
  t.is(res.status, 200);
  t.is(res.body.total, 2);
});
