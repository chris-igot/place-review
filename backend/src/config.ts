import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import dotenv from "dotenv";

dotenv.config();

export const port = 3010;

export const mySQLOptions: MysqlConnectionOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "poirev_user",
    password: process.env.DB_PASSWORD,
    database: "poirev_db",
    synchronize: true,
    logging: false,
    entities: ["src/entities/*"],
    migrations: [],
    subscribers: [],
};

export const cookieSessionConfig = {
    name: "session",
    keys: [process.env.COOKIE_SECRET1, process.env.COOKIE_SECRET2],
    maxAge: 60 * 60 * 1000,
};

export const voteInterval = 300000; //2592000000; //1000 * 3600 * 24 * 30
