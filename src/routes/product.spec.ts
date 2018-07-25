import { test } from "ava";
import * as mongoose from "mongoose";
import * as supertest from "supertest";
import { server } from "../app";

test.before(async (t: any) => {
  const res = await supertest(server)
    .post("/product")
    .send({
      currency: "USD",
      item: "Flux compensator",
      price: 2000,
    });
  t.context.product = res.body;
});

test.after.always(async ( ) => {
  await mongoose.connection.db.dropDatabase();
});

test("product:post - insert a new product", async (t: any) => {
    t.plan(2);
    const res = await supertest(server)
                .post("/product")
                .send({
                  currency: "EUR",
                  item: "Macbook",
                  price: 1700,
                });
    t.context.product = res.body;
    t.is(res.status, 200);
    t.is(res.body.item, "Macbook");
});

test("product:put - update a product", async (t: any) => {
  t.plan(2);
  const product = t.context.product;
  product.price = 1800;
  const res = await supertest(server)
    .put(`/product/${product._id}`)
    .send(product);
  t.is(res.status, 200);
  t.is(res.body.price, product.price);
});

test("product:get - get an product by customer name", async (t: any) => {
  t.plan(2);
  const res = await supertest(server)
    .get(`/product`)
    .send();
  t.is(res.status, 200);
  t.is(res.body.total, 2);
});

test("product:delete - delete a product", async (t: any) => {
  t.plan(1);
  const product = t.context.product;
  const res = await supertest(server)
    .delete(`/product/${product._id}`)
    .send(product);
  t.is(res.status, 201);
});
