# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.22)
# Database: userstudymanager
# Generation Time: 2015-02-13 06:14:50 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table auth
# ------------------------------------------------------------

DROP TABLE IF EXISTS `auth`;

CREATE TABLE `auth` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `roleId` int(11) unsigned NOT NULL,
  `token` char(36) NOT NULL DEFAULT '',
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user` (`userId`),
  KEY `role_auth_rel` (`roleId`),
  CONSTRAINT `role_auth_rel` FOREIGN KEY (`roleId`) REFERENCES `users` (`role`) ON DELETE CASCADE,
  CONSTRAINT `user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `auth` WRITE;
/*!40000 ALTER TABLE `auth` DISABLE KEYS */;

INSERT INTO `auth` (`id`, `userId`, `roleId`, `token`, `timestamp`)
VALUES
	(34,17,2,'8f7d8c90-a711-11e4-a0fe-1ba90f83a3f8','2015-01-28 18:17:39');

/*!40000 ALTER TABLE `auth` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table labels
# ------------------------------------------------------------

DROP TABLE IF EXISTS `labels`;

CREATE TABLE `labels` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `labels` WRITE;
/*!40000 ALTER TABLE `labels` DISABLE KEYS */;

INSERT INTO `labels` (`id`, `title`)
VALUES
	(7,'label 7'),
	(8,'label 8'),
	(9,'label 9'),
	(10,'title');

/*!40000 ALTER TABLE `labels` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table news
# ------------------------------------------------------------

DROP TABLE IF EXISTS `news`;

CREATE TABLE `news` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL DEFAULT '',
  `date` date NOT NULL,
  `description` text NOT NULL,
  `link` varchar(64) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;

INSERT INTO `news` (`id`, `title`, `date`, `description`, `link`)
VALUES
	(2,'News 2','2004-10-31','news description 2','http://www.newslink2.abc');

/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table roles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(11) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;

INSERT INTO `roles` (`id`, `name`)
VALUES
	(1,'admin'),
	(2,'tutor'),
	(3,'executor'),
	(4,'participant');

/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table studies_labels_rel
# ------------------------------------------------------------

DROP TABLE IF EXISTS `studies_labels_rel`;

CREATE TABLE `studies_labels_rel` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `studyId` int(11) unsigned NOT NULL,
  `labelId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `label_rel` (`labelId`),
  KEY `study_rel` (`studyId`),
  CONSTRAINT `label_rel` FOREIGN KEY (`labelId`) REFERENCES `labels` (`id`) ON DELETE CASCADE,
  CONSTRAINT `study_rel` FOREIGN KEY (`studyId`) REFERENCES `userstudies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `studies_labels_rel` WRITE;
/*!40000 ALTER TABLE `studies_labels_rel` DISABLE KEYS */;

INSERT INTO `studies_labels_rel` (`id`, `studyId`, `labelId`)
VALUES
	(19,35,8),
	(20,1,7),
	(22,10,8),
	(23,37,8),
	(24,38,8),
	(35,49,8);

/*!40000 ALTER TABLE `studies_labels_rel` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table studies_news_rel
# ------------------------------------------------------------

DROP TABLE IF EXISTS `studies_news_rel`;

CREATE TABLE `studies_news_rel` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `studyId` int(11) unsigned NOT NULL,
  `newsId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `studies_news_rel` WRITE;
/*!40000 ALTER TABLE `studies_news_rel` DISABLE KEYS */;

INSERT INTO `studies_news_rel` (`id`, `studyId`, `newsId`)
VALUES
	(9,35,2),
	(11,10,2),
	(12,37,2),
	(13,38,2),
	(24,49,2);

/*!40000 ALTER TABLE `studies_news_rel` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table studies_requires_rel
# ------------------------------------------------------------

DROP TABLE IF EXISTS `studies_requires_rel`;

CREATE TABLE `studies_requires_rel` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `studyId` int(10) unsigned NOT NULL,
  `requiresId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `study_main1_rel` (`studyId`),
  KEY `study_required_rel` (`requiresId`),
  CONSTRAINT `study_required_rel` FOREIGN KEY (`requiresId`) REFERENCES `userstudies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `studies_requires_rel` WRITE;
/*!40000 ALTER TABLE `studies_requires_rel` DISABLE KEYS */;

INSERT INTO `studies_requires_rel` (`id`, `studyId`, `requiresId`)
VALUES
	(13,20,6),
	(16,25,1),
	(23,4,1),
	(24,4,6),
	(75,49,1),
	(76,49,20),
	(77,26,49),
	(79,47,1),
	(80,47,6),
	(81,47,20),
	(82,37,10),
	(83,37,10);

/*!40000 ALTER TABLE `studies_requires_rel` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table studies_users_rel
# ------------------------------------------------------------

DROP TABLE IF EXISTS `studies_users_rel`;

CREATE TABLE `studies_users_rel` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `studyId` int(11) unsigned NOT NULL,
  `userId` int(11) unsigned NOT NULL,
  `registered` tinyint(1) NOT NULL DEFAULT '0',
  `confirmed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `study_user_rel` (`studyId`),
  KEY `user_study_rel` (`userId`),
  CONSTRAINT `user_usterstudy_rel` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `userstudy_rel` FOREIGN KEY (`studyId`) REFERENCES `userstudies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `studies_users_rel` WRITE;
/*!40000 ALTER TABLE `studies_users_rel` DISABLE KEYS */;

INSERT INTO `studies_users_rel` (`id`, `studyId`, `userId`, `registered`, `confirmed`)
VALUES
	(1,1,2,1,1),
	(2,6,2,1,1),
	(3,6,3,1,1),
	(4,4,1,1,0),
	(5,4,2,1,0),
	(6,4,4,1,0),
	(8,10,1,1,1),
	(10,15,1,1,1),
	(21,10,3,1,1),
	(22,10,5,1,1),
	(23,1,4,1,1),
	(24,1,6,1,1),
	(25,1,7,1,1),
	(26,6,4,1,1),
	(27,1,1,1,0),
	(28,37,1,1,0);

/*!40000 ALTER TABLE `studies_users_rel` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table template_fields
# ------------------------------------------------------------

DROP TABLE IF EXISTS `template_fields`;

CREATE TABLE `template_fields` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `templateId` int(11) unsigned NOT NULL,
  `title` varchar(64) NOT NULL DEFAULT '',
  `value` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `template_fields_rel` (`templateId`),
  CONSTRAINT `template_fields_rel` FOREIGN KEY (`templateId`) REFERENCES `templates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `template_fields` WRITE;
/*!40000 ALTER TABLE `template_fields` DISABLE KEYS */;

INSERT INTO `template_fields` (`id`, `templateId`, `title`, `value`)
VALUES
	(6,4,'field2 titl','field2 descr'),
	(15,7,'field1 title12','field1 descr222'),
	(16,7,'field2 title12','field2 descr12'),
	(28,9,'field1 title','field1 descr'),
	(29,9,'field2 title','field2 descr'),
	(30,10,'field1 title','field1 descr'),
	(31,10,'field2 title','field2 descr'),
	(32,11,'field1 title','field1 descr'),
	(33,11,'field2 title','field2 descr'),
	(40,12,'field1a title','field1 descr'),
	(41,12,'field2b title','field2 descr'),
	(42,12,'field3c title','field3 descr'),
	(43,12,'field4d title','field4 descr'),
	(44,12,'field5e title','field5 descr'),
	(45,2,'field1 titl','field1 descr'),
	(46,2,'2asd','sad2');

/*!40000 ALTER TABLE `template_fields` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table templates
# ------------------------------------------------------------

DROP TABLE IF EXISTS `templates`;

CREATE TABLE `templates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(32) NOT NULL DEFAULT 'Title',
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;

INSERT INTO `templates` (`id`, `title`)
VALUES
	(2,'template title1'),
	(4,'template title3'),
	(7,'template title5'),
	(9,'template title51'),
	(10,'template title511'),
	(11,'template title51111'),
	(12,'This is the story of a girl');

/*!40000 ALTER TABLE `templates` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL DEFAULT '',
  `password` char(60) NOT NULL DEFAULT '',
  `role` int(11) unsigned NOT NULL,
  `lmuStaff` tinyint(1) NOT NULL DEFAULT '0',
  `mmi` int(11) NOT NULL DEFAULT '0',
  `firstname` varchar(11) DEFAULT NULL,
  `lastname` varchar(11) DEFAULT NULL,
  `visible` tinyint(1) NOT NULL DEFAULT '1',
  `collectsMMI` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `role` (`role`),
  CONSTRAINT `role` FOREIGN KEY (`role`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `username`, `password`, `role`, `lmuStaff`, `mmi`, `firstname`, `lastname`, `visible`, `collectsMMI`)
VALUES
	(1,'user1@studykeeper.com','$2a$10$i/sIqsX/iAEpUynQbTvobuVFs8Q47DP49x9TV90szBXqsb5T.c1s2',2,1,1,'first1','last1',1,0),
	(2,'user2@studykeeper.com','$2a$10$WW6/10tkOSrgT1RWvWAwReRjX0qs3ze7nNj0fM8OxGUKdixFWD2Sa',4,1,1,'first2','last2',1,0),
	(3,'user3@studykeeper.com','$2a$10$RLw5xP6MZfE4ljS5kWSDqOf.7jAmjpZyIla/vumfXeNqqsIFhttIy',4,0,0,'first3','last3',1,0),
	(4,'user4@studykeeper.com','$2a$10$8mynVkH84.j4NBgGjgkBfe7e1bc0j.Uz38/A6NjX4O1v8AlzkqA8G',4,0,0,'first4','last4',1,0),
	(5,'user5@studykeeper.com','$2a$10$7FbsARL2k37APYCXr63GY./375clb84pJTjtkd2T61CVJM99m0Etu',4,1,0,'first5','last5',1,0),
	(6,'user6@studykeeper.com','$2a$10$4B36wpor/iI5IosNvwqvQukRbb5Q4eHcji9IllUyWjzz4xMVzygTa',2,1,1,'first6','last6',1,0),
	(7,'user7@studykeeper.com','$2a$10$DSUB4MkLTaOsdpJOEbDoYerUyCKhykrF6YzYtqfJFKFdhI2nOxCpy',3,1,1,'first7','last7',1,0),
	(8,'user8@studykeeper.com','$2a$10$9ZM5MKNTUv3wOJ7W248/o.I9YzHAXAcvjR4uCz3ylBy1PPfntoOQC',3,1,1,'first8','last8',1,0),
	(9,'deleted','$2a$10$1OAhvIxLLpkpZoK2VllsPO7/xFMjVBUlzip4ZJO4WTStmgrfzaQNi',2,0,1,'deleted','deleted',0,0),
	(11,'username2@studykeeper.com','$2a$10$MK2Gm/jpwHZLmxbDSD7ujOOoRwp9jf2Mt.je9UpWepKvhjnrS6OIW',2,0,1,'firstname','lastname',1,0),
	(12,'deleted12','$2a$10$DiSivfOt52S6Ulq.BjBkVuewxZmcpL7PvPrlGfMI1Lt8WT04vJkDO',4,0,0,'deleted','deleted',0,0),
	(13,'deleted13','$2a$10$kfNQB3JQXgXsKnLlJHVScuBMUiH3kLwspkiAlQnz1EazZI8Ze69M.',4,0,0,'deleted','deleted',0,0),
	(14,'deleted14','$2a$10$HCO1wg9LemXox/DRAiVxneYvZsADXs1mRaTDb0KckU3cnHG.KW3ea',4,0,0,'deleted','deleted',0,0),
	(15,'deleted15','$2a$10$bXr.CKrow1ntWvKEHJvK4eslDd7BP6mRf4Ucc6HMeUO7/kYchcgmC',4,0,0,'deleted','deleted',0,0),
	(16,'deleted16','$2a$10$Gs4x/0xTmYZig/jW2UzHduG/dHnVaG646jDG8r7Q4fh6Dh6JfZVKa',2,0,1,'deleted','deleted',0,0),
	(17,'deleted17','$2a$10$6gbPgizd42PWWvKeSSqYE.VwTACOhzypQEdP2TkPG7XMJ4KQmIwAy',4,0,0,'deleted','deleted',0,0),
	(18,'user9@studykeeper.com','$2a$10$VTs5QBG8Thm24GdDFQbkaO8227rqIXlSG7JdxlpAzUGpS8LvC0AdW',2,0,0,'user8@study','user8@study',1,0),
	(19,'username2222@studykeeper.com','$2a$10$9.x0aPUSHhR9zd0AH6.PBe/xywrODiPM8ThrueMtvBXOBuTsCpOJa',2,0,1,'firstname','lastname',1,0),
	(20,'username2222222@studykeeper.com','$2a$10$qI/SmxbuSkb.KEd23CAsd.AnX3.UNcI02f0g9N9xJofFqPuLzC53a',2,0,1,'firstname','lastname',1,0),
	(21,'username22222@studykeeper.com','$2a$10$i87I.9c.zOWIPy3XBzUW5eO2cZ0wEWtnMf3Wz5VafTZTnv3YQeM.O',2,0,1,'firstname','lastname',1,0),
	(22,'edits@studykeeper.com','$2a$10$azvnVMnglzn5trt7/0dnSulEuhjVO/rpqYm5tuynKpjjpKzhkPeTe',4,0,10,'firstnamea','lastnameb',1,0),
	(24,'edit@studykeeper.com','$2a$10$Kg/Xup39dBxJBgRH7mmF6.PtV8tC4aia3m/h9T78RsQS2mcUt32BC',4,0,10,'firstnamea','lastnameb',1,0),
	(25,'user12@studykeeper.com','$2a$10$zOCfdXNsfAfXdsflitGOEOhsTRLVnY5O204yTJ2qjDheJ/DXXEZ/m',4,0,10,'firstnamea','lastnameb',1,0),
	(26,'david.krsssonmueller@gmail.com','$2a$10$gv6J8EnUBfWikm7kwARa9utRH/P9gWsUlo5k76MWDtDp0tZFhbYOy',4,0,0,'firstname','lastname',1,0),
	(27,'test@test.com','$2a$10$WOBz8B1GWmIg4/DVTeIEaud9Lq4yD4.jADF5QlEAr4.6WbKa.pZ8C',4,0,0,'test','test',1,0),
	(38,'david.kronmueller@gmail.com','$2a$10$JM2B/cBh2Qi73CzfRwQ/Z.2TP0m3U9vGQbyDefDoMeetgjzeO2Wc2',4,0,0,'test','test',1,1);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users_confirm
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_confirm`;

CREATE TABLE `users_confirm` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `confirmed` tinyint(1) NOT NULL DEFAULT '0',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `hash` char(36) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `confirmUser` (`userId`),
  CONSTRAINT `confirmUser` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users_confirm` WRITE;
/*!40000 ALTER TABLE `users_confirm` DISABLE KEYS */;

INSERT INTO `users_confirm` (`id`, `userId`, `confirmed`, `timestamp`, `hash`)
VALUES
	(2,1,1,'2015-02-12 15:51:19','546d6280-b29a-11e4-935e-6372f87303ee'),
	(5,38,1,'2015-02-12 18:32:04','e4bcb880-b2dc-11e4-82fc-a9fa7111f138');

/*!40000 ALTER TABLE `users_confirm` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users_pw_recovery
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_pw_recovery`;

CREATE TABLE `users_pw_recovery` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `hash` char(36) NOT NULL DEFAULT '',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `users_pw` (`userId`),
  CONSTRAINT `users_pw` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table userstudies
# ------------------------------------------------------------

DROP TABLE IF EXISTS `userstudies`;

CREATE TABLE `userstudies` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tutorId` int(11) unsigned NOT NULL,
  `executorId` int(11) unsigned NOT NULL,
  `creatorId` int(11) unsigned NOT NULL,
  `templateId` int(11) unsigned DEFAULT NULL,
  `fromDate` date NOT NULL,
  `untilDate` date NOT NULL,
  `title` varchar(32) NOT NULL DEFAULT '',
  `description` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `paper` varchar(255) DEFAULT NULL,
  `space` int(11) unsigned NOT NULL,
  `mmi` tinyint(1) unsigned DEFAULT NULL,
  `compensation` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `location` varchar(64) NOT NULL DEFAULT '',
  `visible` tinyint(1) NOT NULL DEFAULT '1',
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `closed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`),
  KEY `tutor_userstudy_rel` (`tutorId`),
  KEY `executor_userstudy_rel` (`executorId`),
  KEY `creator_user_rel` (`creatorId`),
  KEY `template_userstudy_rel` (`templateId`),
  CONSTRAINT `creator_user_rel` FOREIGN KEY (`creatorId`) REFERENCES `users` (`id`),
  CONSTRAINT `executer_userstudy_rel` FOREIGN KEY (`executorId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `template_userstudy_rel` FOREIGN KEY (`templateId`) REFERENCES `templates` (`id`),
  CONSTRAINT `tutor_userstudy_rel` FOREIGN KEY (`tutorId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `userstudies` WRITE;
/*!40000 ALTER TABLE `userstudies` DISABLE KEYS */;

INSERT INTO `userstudies` (`id`, `tutorId`, `executorId`, `creatorId`, `templateId`, `fromDate`, `untilDate`, `title`, `description`, `link`, `paper`, `space`, `mmi`, `compensation`, `location`, `visible`, `published`, `closed`)
VALUES
	(1,6,7,1,2,'2014-12-12','2014-12-12','Userstudy Title 1','userstudy description 1','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,1,0),
	(4,6,7,1,NULL,'2014-12-12','2014-12-12','Userstudy Title 44','userstudy description 44','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,1,1),
	(6,1,7,2,4,'2014-12-12','2014-12-12','Userstudy Title 6','Userstudy 6 description','','',30,3,20,'location3',1,1,1),
	(10,6,7,1,NULL,'2014-12-12','2014-12-12','userstudy title x','userstudy description x','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'location x',1,1,1),
	(15,6,1,2,4,'2014-12-12','2014-12-28','Userstudy Title 15','Userstudy description 15','','',50,5,5,'location5',1,1,0),
	(20,6,1,1,NULL,'2014-12-12','2014-12-12','Userstudy Title 20','userstudy description 20','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,1,1),
	(25,6,7,1,NULL,'2014-12-12','2014-12-12','Userstudy Title 25','userstudy description 25','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,1,0),
	(27,6,7,1,NULL,'2014-12-12','2014-12-12','Userstudy Title 27','userstudy description 27','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,1,0),
	(28,6,7,1,NULL,'2014-12-12','2014-12-12','Userstudy Title 28','userstudy description 28','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,1,0),
	(35,6,7,1,NULL,'2014-12-12','2014-12-12','Userstudy Title 35','userstudy description 35','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,1,0),
	(37,6,7,1,NULL,'2014-12-12','2014-12-12','userstudy title xzyy','userstudy description x','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'location x',1,1,0),
	(38,6,7,1,NULL,'2014-12-12','2014-12-12','userstudy title xzyy1','userstudy description x','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'location x',1,1,0),
	(47,6,7,1,2,'2014-12-12','2014-12-12','userstudy title xaasd','userstudy description x','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'location secret',1,1,0),
	(49,6,7,1,2,'2014-12-12','2014-12-12','userstudy tita','userstudy description x','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'location secret',0,1,0);

/*!40000 ALTER TABLE `userstudies` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
