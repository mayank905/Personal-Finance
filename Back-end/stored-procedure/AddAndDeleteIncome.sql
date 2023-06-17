CREATE PROCEDURE AddAndDeleteIncome
	@profileId INT,
    @incomeToAddTable IncomeToAddTable READONLY,
    @incomeIdsToDeleteTable IncomeIdsToDeleteTable READONLY
AS
BEGIN
    BEGIN TRANSACTION;

    -- Add multiple rows
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

    -- Delete multiple rows
    IF EXISTS (SELECT 1 FROM @incomeIdsToDeleteTable)
	BEGIN
		DELETE FROM Income
		WHERE profile_id = @profileId
		  AND income_id IN (SELECT income_id FROM @incomeIdsToDeleteTable);
	END
    SELECT amount,category,description,date,income_id FROM Income WHERE profile_id=@profileId ORDER BY date DESC;
    COMMIT;
END;
