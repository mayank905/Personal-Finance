CREATE PROCEDURE GetInformation
@profileId INT
AS
BEGIN
	SELECT amount,category,description,date,expense_id FROM Expense WHERE profile_id=@profileId ORDER BY date DESC;
	SELECT amount,category,description,date,income_id FROM Income WHERE profile_id=@profileId ORDER BY date DESC;
END;