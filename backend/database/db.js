const pg = require("pg");

const db = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DB,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_CA,
  },
});

db.connect()
  .then(() => {
    console.log("connected to postgres successfully.");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = db;
