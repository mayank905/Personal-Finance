CREATE PROCEDURE CreateBudgetTable
AS
BEGIN
  CREATE TABLE Budget (
    budget_id INT PRIMARY KEY IDENTITY(1,1),
    profile_id INT NOT NULL,
    lock_priority BIT NOT NULL, 
	  priority INT NOT NULL,
    category NVARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES Profile(profile_id)
  );
END;