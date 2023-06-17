CREATE PROCEDURE GetIncome
@profileId INT
AS
BEGIN
	SELECT amount,category,description,date,income_id FROM Income WHERE profile_id=@profileId ORDER BY date DESC;
END;
