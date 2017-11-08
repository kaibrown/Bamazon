var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
 // Your username
  user: "root",
// Your password
  password: "root",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  showTable();
});

var showTable = function () {
  console.log("Welcome to Bamazon...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    //  run the selection function
    selection();
    
  }); 
}

var selection = function (){
    // preparing to ask the customer what item they want
   inquirer
      .prompt([
    {
      name: "itemchoice",
      type: "input",
      message: "what is the item id # of the product you want to buy?",
    },{
    name: "quantity",
    type: "input",
    message: "how many of that would you like to buy?",
    }
    ])
      .then(function(answer) {
    //  put user choice in a variable
      var userChoice = answer.itemchoice;
      var amount = answer.quantity
    // message to the client
      console.log("You want " + amount + " of item # " + userChoice + " ...let me see if your request is available...");
      
    // do a connection query to check for availability 
    connection.query(
      "SELECT * FROM products WHERE item_id =" + userChoice ,function(err, res){
      
         if (amount >= res[0].stock_quantity){
           console.log ("Oh no...insufficient inventory\n      Keep shopping..");
           setTimeout(showTable, 4000);
        } else {
           console.log ("Hooray ! " + amount + " of the " + res[0].product_name + " is/are available");
           //give customer the price 
           console.log("The price of your total purchase is $ "+ res[0].price * amount);
        }
    })

  })

    // connection.query(
    //   ""
    // )

 }    
