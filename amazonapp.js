const inquirer = require('inquirer'); 
const mysql = require("mysql");
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});
let allproducts;
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
    
inquirerquestions();

});

function afterConnection(){
    console.log("hi");
    connection.query('SELECT * FROM bamazon.products;', function (error, results, fields) {
        if (error) throw error;
        allproducts = results;
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

  function inquirerquestions(){
    inquirer
    .prompt([
        {
            name: "idnumber",
            message: "Enter the ID# of the product you would like to purchase.",
            type: "number"
        },
        {
            name: "howmany",
            message: "How many would you like to purchase",
            type: "number"
        }
      /* Pass your questions in here */
    ])
    .then(answers => {
        console.log(answers);
        let arrayfinder = answers.idnumber - 1;
        let chosenitem = allproducts[arrayfinder];
        let totalcost = (answers.howmany * chosenitem.price).toFixed(2);
        let newquantity = chosenitem.stock_quantity - answers.howmany;
        console.log(newquantity);
        let updatestring = 'UPDATE products SET stock_quantity='+newquantity+ ' WHERE item_id=' + answers.idnumber;
        if (chosenitem.stock_quantity >= answers.howmany){
            console.log("You've purchased " + answers.howmany + " " + chosenitem.product_name);
            console.log("It cost you: $" + totalcost);
            
            connection.query(updatestring, function (error, results, fields) {
                if (error) throw error;
                
        });
        inquirerquestions();
    }
        else{
            console.log("Sorry not enough available!");
            inquirerquestions();
        }
    
    })

  }