CREATE TYPE BudgetToUpdateTable AS TABLE (
		lock BIT,
		priority DECIMAL(10,2),
		budgetId DECIMAL(10,2)
    )