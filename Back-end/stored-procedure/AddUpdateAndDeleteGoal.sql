CREATE PROCEDURE AddUpdateAndDeleteGoal
	@profileId INT,
    @goalToAddTable GoalToAddTable READONLY,
    @goalIdsToDeleteTable GoalIdsToDeleteTable READONLY,
	@goalToUpdateTable GoalToUpdateTable READONLY
AS
BEGIN
    BEGIN TRANSACTION;

    -- Add multiple rows
	IF EXISTS (SELECT 1 FROM @goalToAddTable)
	BEGIN
		INSERT INTO Goal(profile_id, lock_priority, priority, category, target_amount, target_date, current_saving, status, created_at, updated_at)
		SELECT
			@profileId,
			lock,
			priority,
			category,
			targetAmount,
			targetDate,
			currentSaving,
			status,
			GETDATE(),
			GETDATE()
		FROM @goalToAddTable;
	END

    -- Delete multiple rows
    IF EXISTS (SELECT 1 FROM @goalIdsToDeleteTable)
	BEGIN
		DELETE FROM Goal
		WHERE profile_id = @profileId
		  AND goal_id IN (SELECT goal_id FROM @goalIdsToDeleteTable);
	END

	IF EXISTS (SELECT 1 FROM @goalToUpdateTable)
	BEGIN
		UPDATE Goal
		SET lock_priority = upd.lock,
		priority = upd.priority,
		category = upd.category,
        target_amount = upd.targetAmount,
        target_date = upd.targetDate,
		current_saving = upd.currentSaving,
		updated_at = GETDATE(),
		status = upd.status
		FROM Goal g
		JOIN @goalToUpdateTable upd ON g.goal_id = upd.goalId;
	END
    SELECT goal_id,lock_priority, priority, category, target_amount, target_date, current_saving, status, created_at, updated_at FROM Goal WHERE profile_id=@profileId ORDER BY target_date ASC;
    COMMIT;
END;
