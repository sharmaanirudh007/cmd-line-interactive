
const fs = require("fs");
const Pool = require("pg").Pool;
const fastcsv = require("fast-csv");
let stream = fs.createReadStream("tx.csv");
let csvData = [];
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  database: "testdb",
  password: "password",
  port: 5432
});
let csvStream = fastcsv
  .parse()
  .on("data", async(data) =>{
   console.log('data',data);
      const query =
        "INSERT INTO transactions (timestamp, transaction_type, token, amount) VALUES ($1, $2, $3, $4)";
      try {
        const res = await pool.query(query,data);
        console.log(res);
      }
      catch(err){
        throw err
      }
  })
stream.pipe(csvStream);