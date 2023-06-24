CREATE TYPE GoalToUpdateTable AS TABLE (
		lock BIT,
		priority DECIMAL(10,2),
        category NVARCHAR(255),
		targetAmount DECIMAL(10, 2),
		targetDate DATETIME,
		currentSaving DECIMAL(10,2),
		status DECIMAL(10,2),
		goalId DECIMAL(10,2)
    )