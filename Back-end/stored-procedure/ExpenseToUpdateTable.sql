CREATE TYPE ExpenseToUpdateTable AS TABLE (
		amount DECIMAL(10, 2),
        category NVARCHAR(255),
        description NVARCHAR(255),
        date DATETIME,
		expenseId DECIMAL(10,2)
    )