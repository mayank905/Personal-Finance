CREATE PROCEDURE CreateProfileTable
AS
BEGIN
  CREATE TABLE Profile (
    profile_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    profile_name NVARCHAR(255),
	  logged_in BIT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES [User](user_id)
  );
END;
