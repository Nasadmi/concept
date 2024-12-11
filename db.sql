-- DEVELOPMENT BASE SQL DATABASE

CREATE DATABASE IF NOT EXISTS `concept`;

USE `concept`;

CREATE TABLE IF NOT EXISTS `user` (
  id char(36) primary key default uuid(),
  username varchar(255) not null,
  email varchar(500) unique not null,
  password varchar(500) not null
);

CREATE TABLE IF NOT EXISTS `markmap` (
  id int(12) primary key auto_increment,
  name varchar(255) not null,
  code text not null,
  public decimal(1,0) not null,
  stars bigint(20) unsigned
);