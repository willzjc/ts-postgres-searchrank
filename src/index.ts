import express from "express";
import { Client } from "pg";

const PORT = process.env.PORT || 3000;

const client = new Client({
  password: "postgres",
  user: "postgres",
  host: "postgres",
});

const app = express();

app.get("/ping", async (req, res) => {
  const database = await client.query("SELECT 1 + 1").then(() => "up").catch(() => "down");

  res.send({
    environment: process.env.NODE_ENV,
    database,
  });
});


// app.get("/table", async (req, res) => {
  // const database = await client.query("SELECT 1 + 1").then(() => "up").catch(() => "down");
// app.use('/static', express.static('public'))
// app.use(express.static(__dirname + '/public'));
var path = require('path');
// app.use(express.static(path.join(__dirname, 'static'))); //  "public" off of current is root
app.use(express.static('public'))

app.get("/getclosestusers", async (req, res) => {

  var user_lookup = req.query['user'];

  var query =`SELECT username, count(*) as total_transactions FROM (
    SELECT c3.username as username
    FROM user_search_rank.transactions t
             JOIN
         user_search_rank.customers c3 on (t.from_customer_id = c3.customer_id)
             JOIN
         user_search_rank.customers c4 on (t.to_customer_id = c4.customer_id)
    WHERE (c4.username = '` + user_lookup + `')
    UNION ALL
    SELECT c2.username as username
    FROM user_search_rank.transactions t
             JOIN
         user_search_rank.customers c1 on (t.from_customer_id = c1.customer_id)
             JOIN
         user_search_rank.customers c2 on (t.to_customer_id = c2.customer_id)
    WHERE (c1.username = '` + user_lookup + `')
) as NESTED
GROUP BY username
ORDER BY total_transactions DESC`;

  console.log("Running query");

  client.query(query, (err, query_res) => {
    if (err) throw err;

      var fs = require('fs');
      
      fs.writeFile("/home/app/public/data.json", JSON.stringify(query_res), function(err) {
          if (err) {
              console.log(err);
          }
      });

      var fs2 = require('fs');

      fs2.writeFile("/home/app/public/data.csv", "username,total_transactions\n", function(err) {
            if (err) {
                console.log(err);
            }
      });

      var items=query_res['rows'];
      var i;
      for (i = 0 ; i < items.length ; i++ ){  
        var r=items[i];
        console.log(r);
        fs2.appendFile("/home/app/public/data.csv", r['username']+','+r['total_transactions']+"\n", function(err) {
          if (err) {
              console.log(err);
          }
        });
      }

      res.send({
      environment: process.env.NODE_ENV,
      query_res
    });
  })
  const result = client.query(query);
  
});

(async () => {
  await client.connect();
  app.listen(PORT, () => {
    console.log("Started at http://localhost:%d", PORT);
  });
})();
