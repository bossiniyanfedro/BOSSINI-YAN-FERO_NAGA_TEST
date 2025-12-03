require("dotenv").config();
const app = require("./app");
const { initDb } = require("./db");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server jalan di port ${PORT}`);
    });
  } catch (err) {
    console.error("Gagal start server:", err);
    process.exit(1);
  }
}

start();


