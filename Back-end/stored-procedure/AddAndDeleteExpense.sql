CREATE PROCEDURE AddAndDeleteExpense
	@profileId INT,
    @expenseToAddTable ExpenseToAddTable READONLY,
    @expenseIdsToDeleteTable ExpenseIdsToDeleteTable READONLY
AS
BEGIN
    BEGIN TRANSACTION;

    -- Add multiple rows
    INSERT INTO Expense (profile_id, amount, category, description, date, created_at, updated_at)
    SELECT
	    @profileId,
        amount,
        category,
        description,
        date,
        GETDATE(),
        GETDATE()
    FROM @expenseToAddTable;

    -- Delete multiple rows
    IF EXISTS (SELECT 1 FROM @expenseIdsToDeleteTable)
	BEGIN
		DELETE FROM Expense
		WHERE profile_id = @profileId
		  AND expense_id IN (SELECT expense_id FROM @expenseIdsToDeleteTable);
	END
    SELECT amount,category,description,date,expense_id FROM Expense WHERE profile_id=@profileId ORDER BY date DESC;
    COMMIT;
END;
