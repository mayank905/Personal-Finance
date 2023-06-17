CREATE PROCEDURE GetProfileById
  @Id INT
AS
BEGIN
  SELECT p.profile_id, p.profile_name, p.logged_in
  FROM Profile p
  WHERE p.profile_id = @Id;
END;