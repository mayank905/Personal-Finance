CREATE PROCEDURE GetExpense
@profileId INT
AS
BEGIN
	SELECT amount,category,description,date,expense_id FROM Expense WHERE profile_id=@profileId ORDER BY date DESC;
END;
