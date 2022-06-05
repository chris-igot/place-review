import { AppDataSource } from "./data-source";
import express from "express";
import cookieSession from "cookie-session";
import { cookieSessionConfig, port } from "./config";
import UserRouter from "./routes/UserRoutes";
import PlaceRouter from "./routes/PlaceRoutes";

const app = express();

app.use(cookieSession(cookieSessionConfig));

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.use("/api", UserRouter);
app.use("/api", PlaceRouter);

AppDataSource.initialize()
    .then(async () => {
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
