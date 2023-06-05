CREATE PROCEDURE CreateUser
  @username NVARCHAR(255),
  @password NVARCHAR(255),
  @email NVARCHAR(255)
AS
BEGIN
  INSERT INTO [User] (username, password, email, created_at, updated_at)
  VALUES (@username, @password, @email, GETDATE(), GETDATE());
END;