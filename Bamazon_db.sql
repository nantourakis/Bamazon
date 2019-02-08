DROP DATABASE IF EXISTS bamazon_db;

USE bamazon_db;

CREATE TABLE products(
ID INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
product_name VARCHAR(30),
department_name VARCHAR(30),
price INTEGER,
stock_quantity INTEGER);

INSERT INTO products (ID, product_name, department_name, price, stock_quantity) 
VALUES ("1" "Nintendo Switch", "electronics", 250, 21),
  ("2", "Milk", "grocery", 3, 21),
  ("3", "PS4", "electronics", 300, 50),
  ("4", "Whey Protein", "grocery", 25, 7),
  ("5", "iPad", "electronics", 100, 4),
  ("6", "Bicycle", "sporting goods", 125, 5),
  ("7", "Soccer Ball", "sporting goods", 20, 48),
  ("8", "Sofa", "furniture", 350, 7),
  ("9", "Recliner", "furniture", 200, 33),
  ("10", "Rush Hour 2", "dvds", 11, 6),
  ("11", "Fight Club", "dvds", 11, 8);
 
SELECT * FROM products;