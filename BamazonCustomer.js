var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require('colors');

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "XXXXXXXXX",
  database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPrompt();
  });

  function startPrompt() {
        
    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Welcome to Bamazon! Would you like to take a look at our amazing deals?",
        default: true

    }]).then(function(user) {
        if (user.confirm === true) {
            inventory();
        } else {
            console.log("Have a great day, we hope to see you soon!");
        }
    });
}

//=================================Inventory===============================

function inventory() {

    // show table
    var table = new Table({
        head: ['ID'.yellow.bold.underline, 'Item'.cyan.bold, 'Department'.cyan.bold, 'Price'.cyan.bold, 'Stock'.cyan.bold],
        colWidths: [10, 30, 30, 30, 30]
    });

    listInventory();

    // push items to table array
    function listInventory() {

        //Variable creation 

        connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {

                var ID = res[i].ID,
                    product_name = res[i].product_name,
                    department_name = res[i].department_name,
                    price = res[i].price,
                    stock_quantity = res[i].stock_quantity;

              table.push(
                  [ID, product_name, department_name, price, stock_quantity]
            );
          }
            console.log("");
            console.log("======================================================".america.bold + "  Welcome to Bamazon! ".yellow.bold + "======================================================".america.bold);
            console.log("");
            console.log(table.toString());
            console.log("");
            purchasingPrompt();
        });
    }
}

//Inquirer user purchase

function purchasingPrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "continue",
        message: "Would you like to purchase an item?",
        default: true

    }]).then(function(user) {
        if (user.continue === true) {
            selectionPrompt();
        } else {
            console.log("Thanks for your time, please come back soon!");
        }
    });
}

//Item selection 

function selectionPrompt() {

    inquirer.prompt([{

            type: "input",
            name: "inputId",
            message: "Please enter the ID number of the item you would like to purchase.",
        },
        {
            type: "input",
            name: "inputNumber",
            message: "How many units of this item would you like to purchase?",

        }
    ]).then(function(userPurchase) {

        //connect to database to find stock_quantity in database. If user quantity input is greater than stock, decline purchase.

        connection.query("SELECT * FROM products WHERE ID=?", userPurchase.inputId, function(err, res) {
            for (var i = 0; i < res.length; i++) {

                if (userPurchase.inputNumber > res[i].stock_quantity) {

                    console.log("===================================================");
                    console.log("Sorry! Not enough in stock. Please try again later.");
                    console.log("===================================================");
                    startPrompt();

                } else {
                    //list item information for user for confirm prompt
                    console.log("===================================");
                    console.log("Awesome! We can fulfull your order.");
                    console.log("===================================");
                    console.log("You've selected:");
                    console.log("----------------");
                    console.log("Item: " + res[i].product_name);
                    console.log("Department: " + res[i].department_name);
                    console.log("Price: " + res[i].price);
                    console.log("Quantity: " + userPurchase.inputNumber);
                    console.log("----------------");
                    console.log("Total: " + res[i].price * userPurchase.inputNumber);
                    console.log("===================================");

                    var newStock = (res[i].stock_quantity - userPurchase.inputNumber);
                    var purchaseId = (userPurchase.inputId);
            
                    confirmPrompt(newStock, purchaseId);
                }
            }
        });
    });
}

//Confirm Purchase

function confirmPrompt(newStock, purchaseId) {

    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "Are you sure you would like to purchase this item and quantity?",
        default: true

    }]).then(function(userConfirm) {
        if (userConfirm.confirmPurchase === true) {

            //if user confirms purchase, update mysql database with new stock quantity by subtracting user quantity purchased.

            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
            }, {
                ID: purchaseId
            }], function(err, res) {});

            console.log("=================================");
            console.log("Transaction completed. Thanks for shopping with us!");
            console.log("=================================");
            startPrompt();
        } else {
            console.log("=================================");
            console.log("No worries, thanks for looking!");
            console.log("=================================");
            startPrompt();
        }
    });
}
