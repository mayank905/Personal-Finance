CREATE PROCEDURE GetUserByEmail
  @email NVARCHAR(255)
AS
BEGIN
  SELECT * FROM [User] WHERE email = @email;
END;