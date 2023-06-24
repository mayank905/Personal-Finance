CREATE PROCEDURE GetInformation
@profileId INT
AS
BEGIN
	SELECT amount,category,description,date,expense_id FROM Expense WHERE profile_id=@profileId ORDER BY date DESC;
	SELECT amount,category,description,date,income_id FROM Income WHERE profile_id=@profileId ORDER BY date DESC;
    SELECT goal_id,lock_priority, priority, category, target_amount, target_date, current_saving, status, created_at, updated_at FROM Goal WHERE profile_id=@profileId ORDER BY target_date ASC;
	SELECT lock_priority,priority,category,amount,budget_id FROM Budget WHERE profile_id=@profileId ORDER BY category ASC;
END;