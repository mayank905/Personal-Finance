CREATE PROCEDURE GetProfileByEmail
  @email NVARCHAR(255)
AS
BEGIN
  SELECT p.profile_id, p.profile_name, p.logged_in
  FROM Profile p
  INNER JOIN [User] u ON p.user_id = u.user_id
  WHERE u.email = @email;
END;
