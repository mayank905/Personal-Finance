CREATE PROCEDURE GetGoal
@profileId INT
AS
BEGIN
    SELECT goal_id,lock_priority, priority, category, target_amount, target_date, current_saving, status, created_at, updated_at FROM Goal WHERE profile_id=@profileId ORDER BY target_date ASC;
END;
