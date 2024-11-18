import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import inputRouter from "./routes/input.routes";

dotenv.config();

// this if we add swagger
// const options = {
//     definition: {
//         openapi: "",
//         servers: [
//             {url: "/api", description: "local server"},
//         ],
//         info: {
//             title: "CodeStylistTA",
//             version: "0.5",
//         }
//     },
//     apis: ["src/routes/*.routes.js"],
// };

const app = express();

app.use(
    cors({
        methods: ["GET", "POST"],
        allowedHeaders: [
            "Content-Type",
            "Origin",
            "Accept",
            "*"
        ]
    })
);

// commons
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("combined"));

// routers
app.use("/api", inputRouter);

// maybe add swagger for documentation. we'll se about this later