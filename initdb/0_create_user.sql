CREATE USER 'dummy_user'@'%' IDENTIFIED WITH mysql_native_password BY 'dummy_password';
CREATE DATABASE belle;
GRANT ALL PRIVILEGES ON belle.* TO 'dummy_user'@'%';
