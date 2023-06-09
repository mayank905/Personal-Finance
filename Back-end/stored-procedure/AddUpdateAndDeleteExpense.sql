USE [finance]
GO
/****** Object:  StoredProcedure [dbo].[AddAndDeleteExpense]    Script Date: 21-06-2023 12:25:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AddUpdateAndDeleteExpense]
	@profileId INT,
    @expenseToAddTable ExpenseToAddTable READONLY,
    @expenseIdsToDeleteTable ExpenseIdsToDeleteTable READONLY,
	@expenseToUpdateTable ExpenseToUpdateTable READONLY
AS
BEGIN
    BEGIN TRANSACTION;

    -- Add multiple rows
	IF EXISTS (SELECT 1 FROM @expenseToAddTable)
	BEGIN
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
	END

    -- Delete multiple rows
	IF EXISTS (SELECT 1 FROM @expenseIdsToDeleteTable)
	BEGIN
		DELETE FROM Expense
		WHERE profile_id = @profileId
		  AND expense_id IN (SELECT expense_id FROM @expenseIdsToDeleteTable);
		
	END

	IF EXISTS (SELECT 1 FROM @expenseToUpdateTable)
	BEGIN

		UPDATE Expense
		SET description = upd.description,
		category = upd.category,
        amount = upd.amount,
		updated_at = GETDATE(),
        date = upd.date
		FROM Expense e
		JOIN @expenseToUpdateTable upd ON e.expense_id=upd.expenseId;
	END
	MERGE Budget AS t2
	USING (
    	SELECT category, SUM(amount) AS totalAmount
    	FROM Expense
		WHERE profile_id = @profileId
    	GROUP BY category
	) AS t1 ON t1.category = t2.category
	WHEN MATCHED THEN
    	UPDATE SET t2.amount = t1.totalAmount,
		t2.updated_at = GETDATE()
	WHEN NOT MATCHED BY TARGET THEN
    	INSERT (profile_id,lock_priority,priority,category, amount, created_at, updated_at)
    	VALUES (@profileId,0,0,t1.category, t1.totalAmount, GETDATE(), GETDATE())
	WHEN NOT MATCHED BY SOURCE
	AND t2.category <> 'Savings'
	 THEN DELETE;


	SELECT amount,category,description,date,expense_id FROM Expense WHERE profile_id=@profileId ORDER BY date DESC;
	SELECT lock_priority,priority,category,amount,budget_id FROM Budget WHERE profile_id=@profileId ORDER BY category ASC;
    COMMIT;
END;
