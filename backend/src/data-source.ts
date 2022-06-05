import "reflect-metadata";
import { DataSource } from "typeorm";
import { mySQLOptions } from "./config";

export const AppDataSource = new DataSource(mySQLOptions);
