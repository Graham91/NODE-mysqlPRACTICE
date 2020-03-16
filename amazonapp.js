const inquirer = require('inquirer'); 
const mysql = require("mysql");
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
   connection.end();
});

function afterConnection(){
    console.log("hi");
    connection.query('SELECT * FROM bamazon.products;', function (error, results, fields) {
        if (error) throw error;
        const allproducts = results;
        for(let i = 0; i < allproducts.length; i++){
            let currentproduct = allproducts[i];
            console.log("ID: " + currentproduct.item_id);
            console.log("Product: "+currentproduct.product_name);
            console.log("Product Department: " + currentproduct.department_name);
            console.log("Price: $" + currentproduct.price);
            console.log("Items in stock: "+currentproduct.stock_quantity);
            console.log("----------------------------");

        }
      });
}
inquirer
  .prompt([
    /* Pass your questions in here */
  ])
  .then(answers => {
    // Use user feedback for... whatever!!
  })
  .catch(error => {
    if(error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  });