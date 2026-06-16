require("dotenv").config();

const express =
  require("express");

const cors =
  require("cors");

const connectDB =
  require("./config/db");

const authRoutes =
  require("./routes/authRoutes");

const app = express();

connectDB();
const User = require("./models/User");
const bcrypt = require("bcryptjs");
app.use(cors());

app.use(express.json());

app.use(
  "/api/auth",
  authRoutes
);
const clinicRoutes =
  require("./routes/clinicRoutes");

app.use(
  "/api/clinic",
  clinicRoutes
);
const doctorProfileRoutes =
  require(
    "./routes/doctorProfileRoutes"
  );
  app.use(
  "/api/doctor",
  doctorProfileRoutes
);
const uploadRoutes =
  require("./routes/uploadRoutes");
app.use(
  "/api",
  uploadRoutes
);
app.get("/", (req, res) => {
  res.send(
    "Shri Vishwankush Ayurvedic Clinic API Running"
  );
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On ${PORT}`
  );
});