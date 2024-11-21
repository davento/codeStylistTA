import app from "./app.js";
import https from "https";
import fs from "fs";

const main = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            app.listen(process.env.PORT, () => {
                console.log()
            });
        } else if (process.env.NODE_ENV === "production") {
            
            https.createServer(app).listen(process.env.PORT, () => {
                console.log(`Server on port ${process.env.PORT} - Production`)
            });
        } else {
            console.log("UNEXPECTED EXECUTION ENVIRONMENT ERROR");
            console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
        }
    } catch (error) {
        console.log(error);
    }
};

await main();