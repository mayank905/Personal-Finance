CREATE TYPE IncomeToUpdateTable AS TABLE (
		    amount DECIMAL(10, 2),
        category NVARCHAR(255),
        description NVARCHAR(255),
        date DATETIME,
		    incomeId DECIMAL(10,2)
    )