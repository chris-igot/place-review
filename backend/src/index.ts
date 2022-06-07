import { AppDataSource } from "./data-source";
import express from "express";
import cookieSession from "cookie-session";
import { cookieSessionConfig, port } from "./config";
import UserRouter from "./routes/UserRoutes";
import PlaceRouter from "./routes/PlaceRoutes";
import TagRouter from "./routes/TagRoutes";
import VoteRouter from "./routes/VoteRoutes";

const app = express();
app.use(cookieSession(cookieSessionConfig));

app.use("/api", UserRouter);
app.use("/api", PlaceRouter);
app.use("/api", TagRouter);
app.use("/api", VoteRouter);

AppDataSource.initialize()
    .then(async () => {
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
