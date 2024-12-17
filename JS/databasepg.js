const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  post: 5432,
  password: "amgalan0822",
  database: "login",
});

client.connect();

client.query(`Select * from user_id`, (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err.message);
  }
  client.end;
});
