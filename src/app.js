const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const todosRoutes = require("./routes/todos");

const app = express();

app.use(cors());
app.use(express.json());

// logger 
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "API OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todosRoutes);

// handle error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;


