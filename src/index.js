require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authV1 = require("./api/v1/routes/auth.routes");
const jobApplivationV1 = require("./api/v1/routes/jobApplication.routes");
const { authenticate } = require("./api/v1/middleware/authenticate");
const PORT = process.env.PORT || 1338;
const app = express();

app.use(express.json());
app.use(cors({origin: "*"}));
app.use(morgan("dev"));
app.get("/", (req, res) => {
    return res.send("<h1>Server currently running</h1>");
})
app.use("/api/v1/auth", authV1);
app.use("/api/v1/job-applications", authenticate, jobApplivationV1)
app.listen(PORT, () => {
    console.log(`✅Starting...\n✅Local: http://localhost:${PORT}`)
})