import { test } from "ava";
import * as mongoose from "mongoose";
import * as supertest from "supertest";
import { server } from "../app";

test.before(async (t: any) => {
  const res = await supertest(server)
    .post("/customer")
    .send({
      address: "Steindamm 80",
      birth: new Date(),
      city: "Berlin",
      country: "germany",
      email: "peter@lustig.com",
      name: "Peter Lustig",
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
  t.context.products.push(res.body._id);
});

test.before(async (t: any) => {
  const res = await supertest(server)
    .post("/product")
    .send({
      currency: "EUR",
      item: "Book \"Guide to Hamburg\"",
      price: 20,
    });
  t.context.products.push(res.body._id);
});

test.before(async (t: any) => {
  const res = await supertest(server)
    .post("/product")
    .send({
      currency: "EUR",
      item: "Inline Skates",
      price: 75,
    });
  t.context.products.push(res.body._id);
});

test.before(async (t: any) => {
  const res = await supertest(server)
    .post("/order")
    .send({
      customer: t.context.customer._id,
      items: t.context.products,
    });
  t.context.order = res.body;
});

test.after.always(async ( ) => {
  await mongoose.connection.db.dropDatabase();
});

test("customer:post - insert a new customer", async (t: any) => {
    t.plan(2);

    const res = await supertest(server)
                .post("/customer")
                .send({
                  address: "Steindamm 80",
                  birth: new Date(),
                  city: "Berlin",
                  country: "germany",
                  email: "peter@lustig.com",
                  name: "Peter Lustig",
                  title: "Mr.",
                });
    t.is(res.status, 200);
    t.is(res.body.name, "Peter Lustig");
});

test("customer:put - update a new order", async (t: any) => {
  t.plan(2);

  const customer = t.context.customer;
  const res = await supertest(server)
    .put(`/customer/${customer._id}`)
    .send({
      address: "Steindamm 80",
      birth: new Date(),
      city: "Berlin",
      country: "germany",
      email: "peter@lustig.com",
      name: "Peter Lustig1",
      title: "Mr.",
    });
  t.is(res.status, 200);
  t.is(res.body.name, "Peter Lustig1");
});

test("customer:get - get an inserted order", async (t: any) => {
  t.plan(2);
  const customer = t.context.customer;
  const res = await supertest(server)
    .get(`/customer/${customer._id}`)
    .send();
  t.is(res.status, 200);
  t.is(res.body.name, "Peter Lustig1");
});

test("customer:orders - get all orders from a customer", async (t: any) => {
  t.plan(3);
  const res = await supertest(server)
    .get(`/customer/orders`)
    .send();
  t.is(res.status, 200);
  t.is(res.body[0].name, "Peter Lustig1");
  t.is(res.body[0].orders.length, 1);
});

test("customer:delete - delete an inserted order", async (t: any) => {
  t.plan(2);
  const customer = t.context.customer;
  const res = await supertest(server)
    .delete(`/customer/${customer._id}`)
    .send();
  t.is(res.status, 200);
  t.is(res.body.name, "Peter Lustig1");
});
