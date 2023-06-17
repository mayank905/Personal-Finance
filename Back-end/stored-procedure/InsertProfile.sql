CREATE PROCEDURE InsertProfile
  @email NVARCHAR(255),
  @loggedin BIT
AS
BEGIN
  DECLARE @userId INT, @username NVARCHAR(255);

  -- Retrieve userId and username based on email
  SELECT @userId = user_id, @username = username
  FROM [User]
  WHERE email = @email;

  -- Insert into Profile table
  INSERT INTO Profile (user_id, profile_name, logged_in)
  VALUES (@userId, @username, @loggedin);

  -- Return profile_id
  SELECT Profile.profile_id from Profile WHERE Profile.user_id=@userId;
END;
