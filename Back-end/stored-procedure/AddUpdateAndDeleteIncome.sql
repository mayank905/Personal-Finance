USE [finance]
GO
/****** Object:  StoredProcedure [dbo].[AddAndDeleteIncome]    Script Date: 21-06-2023 08:24:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AddUpdateAndDeleteIncome]
	@profileId INT,
    @incomeToAddTable IncomeToAddTable READONLY,
    @incomeIdsToDeleteTable IncomeIdsToDeleteTable READONLY,
	@incomeToUpdateTable IncomeToUpdateTable READONLY
AS
BEGIN
    BEGIN TRANSACTION;

	IF EXISTS (SELECT 1 FROM @incomeToAddTable)
	BEGIN
		INSERT INTO Income (profile_id, amount, category, description, date, created_at, updated_at)
		SELECT
			@profileId,
			amount,
			category,
			description,
			date,
			GETDATE(),
			GETDATE()
		FROM @incomeToAddTable;
	END


    IF EXISTS (SELECT 1 FROM @incomeIdsToDeleteTable)
	BEGIN
		DELETE FROM Income
		WHERE profile_id = @profileId
		  AND income_id IN (SELECT income_id FROM @incomeIdsToDeleteTable);
	END

	IF EXISTS (SELECT 1 FROM @incomeToUpdateTable)
	BEGIN
		UPDATE Income
		SET description = upd.description,
		category = upd.category,
        amount = upd.amount,
		updated_at = GETDATE(),
        date = upd.date
		FROM Income i
		JOIN @incomeToUpdateTable upd ON i.income_id=upd.incomeId;
	END
    SELECT amount,category,description,date,income_id FROM Income WHERE profile_id=@profileId ORDER BY date DESC;
    COMMIT;
END;
