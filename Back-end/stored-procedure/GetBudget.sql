CREATE PROCEDURE GetBudget
@profileId INT
AS
BEGIN
	SELECT lock_priority,priority,category,amount,budget_id FROM Budget WHERE profile_id=@profileId ORDER BY category ASC;
END;
