-- DROP TABLE customers;
CREATE TABLE customers (
  customer_id INT NOT NULL,
  customer_name VARCHAR(200) NOT NULL,
  industry VARCHAR(200) NOT NULL,
  market_cap VARCHAR(200) NOT NULL,
  PRIMARY KEY (customer_id)
);

INSERT INTO customers
    (customer_id, customer_name, industry, market_cap)
VALUES
    (1,"Amazon", "Retail", "$820B"),
    (2,"Wells Fargo", "Financial", "$225B"),
    (3,"Tesla", "Automotive", "$60B");

