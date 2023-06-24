USE [finance]
GO
/****** Object:  StoredProcedure [dbo].[AddAndDeleteExpense]    Script Date: 21-06-2023 12:25:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UpdateBudget]
	@profileId INT,
    @budgetToUpdateTable BudgetToUpdateTable READONLY
AS
BEGIN
    BEGIN TRANSACTION;

    -- Add multiple rows
	IF EXISTS (SELECT 1 FROM @budgetToUpdateTable)
	BEGIN
		UPDATE Budget
		SET lock_priority = upd.lock,
		priority = upd.priority,
		updated_at = GETDATE()
		FROM Budget b
		JOIN @budgetToUpdateTable upd ON b.budget_id=upd.budgetId;
	END
	SELECT lock_priority,priority,category,amount,budget_id FROM Budget WHERE profile_id=@profileId ORDER BY category ASC;
    COMMIT;
END;