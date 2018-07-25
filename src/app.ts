import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as mongoose from "mongoose";
import customerRoute from "./routes/customer";
import orderRoute from "./routes/order";
import productRoute from "./routes/product";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/bordership";

console.log(`Connecting in mongo-db url: ${mongoUrl}`);

mongoose.connect(mongoUrl);
mongoose.set("debug", true);

// Create a new express application instance
const app: express.Application = express();

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/customer", customerRoute);
app.use("/order", orderRoute);
app.use("/product", productRoute);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const err = new Error("Not Found");
    res.status(404);
    next(err);
});

// error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.Errback) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    console.log("Error was caught");
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.send(err);
});

export const server = app.listen(3000, () => {
    console.log("Started environment listening at http://%s:%s", "localhost", 3000);
});
