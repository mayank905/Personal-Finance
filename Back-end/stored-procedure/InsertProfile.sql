USE [finance]
GO
/****** Object:  StoredProcedure [dbo].[InsertProfile]    Script Date: 22-06-2023 14:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[InsertProfile]
  @email NVARCHAR(255),
  @loggedin BIT
AS
BEGIN
  DECLARE @userId INT, @username NVARCHAR(255), @profileId INT, @category NVARCHAR(255);

  -- Retrieve userId and username based on email
  SELECT @userId = user_id, @username = username
  FROM [User]
  WHERE email = @email;

  -- Insert into Profile table
  IF NOT EXISTS(SELECT 1 FROM Profile where user_id=@userId)
  BEGIN
	  INSERT INTO Profile (user_id, profile_name, logged_in)
	  VALUES (@userId, @username, @loggedin);
  END
  
-- Insert into Budget table

  SELECT @profileId=profile_id,@category='Savings'
  FROM Profile 
  WHERE Profile.user_id=@userId;
  IF NOT EXISTS(SELECT 1 FROM Budget where category=@category)
  BEGIN
	  INSERT into Budget(profile_id,lock_priority,priority,category,amount,created_at,updated_at)
	  VALUES(@profileId,0,0,@category,0,GETDATE(),GETDATE());
  END
  
  -- Return profile_id

  SELECT Profile.profile_id from Profile WHERE Profile.user_id=@userId;
END;
