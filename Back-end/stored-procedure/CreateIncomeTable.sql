CREATE PROCEDURE CreateIncomeTable
AS
BEGIN
  CREATE TABLE Income (
    income_id INT PRIMARY KEY IDENTITY(1,1),
    profile_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category NVARCHAR(255) NOT NULL,
    description NVARCHAR(255),
    date DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES Profile(profile_id)
  );
END;