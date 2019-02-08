var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Chicken11!",
  database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    
  });

 

 function listProducts(){
    //prints the items for sale and their details
    connection.query('SELECT * FROM products', function(err, res){
      if(err) throw err;
    
      console.log('~**********~ Welcome to Bamazon ~**********~')
      console.log('')
    
      for(var i = 0; i<res.length;i++){
        console.log("ID: " + res[i].ID + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name 
        + " | " + "Price: " + res[i].price + " | " + "Stock Quantity: " + res[i].stock_quantity);
        console.log('--------------------------------------------------------------------------------------------------')
      }
      askCustomer();
      });
    }
    
    function askCustomer() { 
        inquirer.prompt([{
        name: "ID",
        type: "input",
        message: "What is the item ID you would like to buy?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        name: "Quantity",
        type: "input",
        message: "How many of this item would you like to buy?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }])
}
listProducts(); 

  
    