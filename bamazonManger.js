const inquirer = require('inquirer'); 
const mysql = require("mysql");
let allproducts;
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
inquirerquestions();

});


function inquirerquestions(){
inquirer.prompt([
        {
            name: "choice",
            message: "How would you like to proceed:",
            type: "list",
            choices: ["View Products for sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"]
        }
    ])
    .then(answers => {
        console.log(answers.choice);
        let choiceOfPath = answers.choice
        let text;

        switch(choiceOfPath) {
          case "View Products for sale":
            viewProducts();
          break;
          case "View Low Inventory":
            lowInventory();
          break;
          case "Add to Inventory":
            addInventory();
          break;
          case "Add New Product":
            Newproduct();
          break;
        }

       
    });
}

function viewProducts(){
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
   
};
function lowInventory(){
    connection.query('SELECT * FROM bamazon.products;', function (error, results, fields) {

results.forEach(element => {
    if (element.stock_quantity <= 5){
        console.log("There are/is only "+ element.stock_quantity + " left of " +element.product_name);
    }
});

});

};
function addInventory(){
    
    let choices = [];
    let stockvar = [];
    connection.query('SELECT * FROM bamazon.products;', function(error, results, fields){
results.forEach(element =>{
    choices.push(element.product_name);
    stockvar.push(element.stock_quantity);
});

inquirer.prompt([
    {
        name: "choice",
        message: "choose the item you would like to add inventory for:",
        type: "list",
        choices: choices
    },
    {
        name: "howmany",
        message: "how many would you like you add?",
        type: "number"
    }
]).then(answers =>{
    console.log("You chose to add "+ answers.howmany + " to " + answers.choice+".");
    let specialnumber;
    for(let i = 0; i<=choices.length; i++){
     if (choices[i] === answers.choice){
         specialnumber = i;
     }
     };

    let originalquantity = stockvar[specialnumber];
    let newquantity = originalquantity + answers.howmany;
    let updatestring = 'UPDATE products SET stock_quantity='+newquantity+ ' WHERE product_name="' +answers.choice+'"';
   connection.query(updatestring, function(error, results, fields){
    if (error) throw error;

   })

    
    });    
});

};

function Newproduct(){
inquirer.prompt([
    {
        name: "itemName",
        message: "Enter name of product: ",
        type: "input"
    },
    {
        name: "departmentName",
        message: "Enter department name of item: ",
        type: "input",
    },
    {
      name: "price",
      message: "Enter price for one Item",
      type: "input"  
    },
    {
        name: "stock",
        message: "Enter stock of Item",
        type: "input"  
      }
]).then(answers =>{
    let neweststring = "INSERT INTO `products` (product_name, department_name, price, stock_quantity) VALUES ('" + answers.itemName + "', '"+answers.departmentName + "', '" + answers.price + "', '" + answers.stock +"');";
        
    connection.query(neweststring , function(error, results, fields){ 
        if (error) throw error;
    })

});
}