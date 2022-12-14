import { DataSource } from "typeorm";
require("dotenv").config();

export const dataSource = new DataSource({
  type: "mysql",
  host: "13.124.107.224",
  username: "team6",
  password: "11111",
  database: "company",
  port: 3306,
  entities: ["src/db/schemas/*.entity.ts"],
  logging: false,
  synchronize: true,
});

export * from "./auth.repo";
export * from "./user.repo";