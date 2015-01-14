# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.22)
# Database: userstudymanager
# Generation Time: 2015-01-14 21:43:54 +0000
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
  `token` char(36) NOT NULL DEFAULT '',
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user` (`userId`),
  CONSTRAINT `user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `auth` WRITE;
/*!40000 ALTER TABLE `auth` DISABLE KEYS */;

INSERT INTO `auth` (`id`, `userId`, `token`, `timestamp`)
VALUES
	(1,2,'12d89a20-8a1c-11e4-a439-47252cded888','2014-12-22 21:49:51'),
	(2,3,'35163540-9677-11e4-b06d-9f4f0a58c97f','2015-01-07 15:12:26'),
	(3,4,'2d11cd50-967c-11e4-bf9a-03c949edcdd5','2015-01-07 15:48:00'),
	(4,5,'ae975b60-9681-11e4-8987-9b17fa8dd622','2015-01-07 16:27:25'),
	(21,7,'effd0a60-9824-11e4-a5b8-4ff20639907a','2015-01-09 18:28:34'),
	(22,8,'f73c0d30-9824-11e4-a5b8-4ff20639907a','2015-01-09 18:28:46'),
	(88,6,'baac7db0-9b6b-11e4-bebe-bbaad9ac8444','2015-01-13 22:32:52'),
	(89,6,'37e78310-9b6c-11e4-bebe-bbaad9ac8444','2015-01-13 22:36:22'),
	(90,6,'6f4566b0-9b6c-11e4-bebe-bbaad9ac8444','2015-01-13 22:37:55'),
	(91,6,'8f8d9a40-9b6d-11e4-be1a-6759bcee050a','2015-01-13 22:45:59'),
	(92,1,'c0de4c70-9bfe-11e4-99d4-1b05eb8b4a2e','2015-01-14 16:05:19');

/*!40000 ALTER TABLE `auth` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table fieldtypes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `fieldtypes`;

CREATE TABLE `fieldtypes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `fieldtypes` WRITE;
/*!40000 ALTER TABLE `fieldtypes` DISABLE KEYS */;

INSERT INTO `fieldtypes` (`id`, `type`)
VALUES
	(1,'text'),
	(2,'options');

/*!40000 ALTER TABLE `fieldtypes` ENABLE KEYS */;
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
	(9,'ama ist doof'),
	(5,'label3'),
	(7,'label5'),
	(8,'title');

/*!40000 ALTER TABLE `labels` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mmi
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mmi`;

CREATE TABLE `mmi` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `points` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `mmi_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table news
# ------------------------------------------------------------

DROP TABLE IF EXISTS `news`;

CREATE TABLE `news` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL DEFAULT '',
  `date` date NOT NULL,
  `description` varchar(1000) NOT NULL DEFAULT '',
  `link` varchar(64) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;

INSERT INTO `news` (`id`, `title`, `date`, `description`, `link`)
VALUES
	(1,'News 1','2014-12-12','1 This news is very interesting. Come on, take a look!','http://www.newslink1.com'),
	(2,'News 2','2004-11-20','2 This news is very interesting. Come on, take a look!','http://www.newslink2.com'),
	(3,'News 3','2004-11-20','3 This news is very interesting. Come on, take a look!','http://www.newslink3.com'),
	(4,'News 4','2004-11-20','4 This news is very interesting. Come on, take a look!','http://www.newslink4.com'),
	(5,'News 5','2014-12-12','5 This news is very interesting. Come on, take a look!','http://www.newslink5.com');

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
	(7,1,5),
	(11,6,7),
	(19,35,8);

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
	(9,35,2);

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
	(3,10,1),
	(4,10,6),
	(13,20,6),
	(14,20,10),
	(15,23,6),
	(16,23,10),
	(19,25,6),
	(20,25,10),
	(23,4,1),
	(24,4,6),
	(25,27,1),
	(26,27,6),
	(27,28,1),
	(28,28,6),
	(47,35,1),
	(48,35,6);

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
	(1,6,1,1,1),
	(2,6,2,1,1),
	(3,6,3,1,1),
	(4,4,1,1,0),
	(5,4,2,1,0),
	(6,4,4,1,0),
	(8,10,1,1,1),
	(9,10,1,1,1),
	(10,15,1,1,0);

/*!40000 ALTER TABLE `studies_users_rel` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table template_fields
# ------------------------------------------------------------

DROP TABLE IF EXISTS `template_fields`;

CREATE TABLE `template_fields` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `templateId` int(11) unsigned NOT NULL,
  `fieldtypeId` int(11) unsigned NOT NULL,
  `title` varchar(11) NOT NULL DEFAULT '',
  `description` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fieldtype_rel` (`fieldtypeId`),
  KEY `template_rel` (`templateId`),
  CONSTRAINT `fieldtype_rel` FOREIGN KEY (`fieldtypeId`) REFERENCES `fieldtypes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `template_rel` FOREIGN KEY (`templateId`) REFERENCES `templates` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `template_fields` WRITE;
/*!40000 ALTER TABLE `template_fields` DISABLE KEYS */;

INSERT INTO `template_fields` (`id`, `templateId`, `fieldtypeId`, `title`, `description`)
VALUES
	(5,4,1,'field1 titl','field1 descr'),
	(6,4,1,'field2 titl','field2 descr');

/*!40000 ALTER TABLE `template_fields` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table templates
# ------------------------------------------------------------

DROP TABLE IF EXISTS `templates`;

CREATE TABLE `templates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(32) NOT NULL DEFAULT 'Title',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;

INSERT INTO `templates` (`id`, `title`)
VALUES
	(2,'removed'),
	(3,'removed'),
	(4,'template title3'),
	(5,'template title4');

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
  `mmi` tinyint(1) NOT NULL DEFAULT '0',
  `firstname` varchar(11) DEFAULT NULL,
  `lastname` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `role` (`role`),
  CONSTRAINT `role` FOREIGN KEY (`role`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `username`, `password`, `role`, `lmuStaff`, `mmi`, `firstname`, `lastname`)
VALUES
	(1,'user1@studykeeper.com','$2a$10$gC/KVfwor5qe/E8K4RrxRuuKrvmcCIDmAgOh9mtzVB6BRg5N5pJNq',4,1,1,'first1','last1'),
	(2,'user2@studykeeper.com','$2a$10$WW6/10tkOSrgT1RWvWAwReRjX0qs3ze7nNj0fM8OxGUKdixFWD2Sa',4,1,1,'first2','last2'),
	(3,'user3@studykeeper.com','$2a$10$RLw5xP6MZfE4ljS5kWSDqOf.7jAmjpZyIla/vumfXeNqqsIFhttIy',4,0,0,'first3','last3'),
	(4,'user4@studykeeper.com','$2a$10$8mynVkH84.j4NBgGjgkBfe7e1bc0j.Uz38/A6NjX4O1v8AlzkqA8G',4,0,0,'first4','last4'),
	(5,'user5@studykeeper.com','$2a$10$7FbsARL2k37APYCXr63GY./375clb84pJTjtkd2T61CVJM99m0Etu',4,1,0,'first5','last5'),
	(6,'user6@studykeeper.com','$2a$10$4B36wpor/iI5IosNvwqvQukRbb5Q4eHcji9IllUyWjzz4xMVzygTa',2,1,1,'first6','last6'),
	(7,'user7@studykeeper.com','$2a$10$DSUB4MkLTaOsdpJOEbDoYerUyCKhykrF6YzYtqfJFKFdhI2nOxCpy',3,1,1,'first7','last7'),
	(8,'user8@studykeeper.com','$2a$10$9ZM5MKNTUv3wOJ7W248/o.I9YzHAXAcvjR4uCz3ylBy1PPfntoOQC',3,1,1,'first8','last8');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table userstudies
# ------------------------------------------------------------

DROP TABLE IF EXISTS `userstudies`;

CREATE TABLE `userstudies` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tutorId` int(11) unsigned NOT NULL,
  `executorId` int(11) unsigned NOT NULL,
  `creatorId` int(11) unsigned NOT NULL,
  `fromDate` date NOT NULL,
  `untilDate` date NOT NULL,
  `title` varchar(32) NOT NULL DEFAULT '',
  `description` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `paper` varchar(255) DEFAULT NULL,
  `space` int(11) unsigned NOT NULL,
  `mmi` tinyint(1) unsigned DEFAULT NULL,
  `compensation` tinyint(2) unsigned DEFAULT NULL,
  `location` varchar(64) NOT NULL DEFAULT '',
  `visible` tinyint(1) NOT NULL DEFAULT '1',
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `closed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`),
  KEY `tutor_userstudy_rel` (`tutorId`),
  KEY `executor_userstudy_rel` (`executorId`),
  KEY `creator_user_rel` (`creatorId`),
  CONSTRAINT `creator_user_rel` FOREIGN KEY (`creatorId`) REFERENCES `users` (`id`),
  CONSTRAINT `executer_userstudy_rel` FOREIGN KEY (`executorId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `tutor_userstudy_rel` FOREIGN KEY (`tutorId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `userstudies` WRITE;
/*!40000 ALTER TABLE `userstudies` DISABLE KEYS */;

INSERT INTO `userstudies` (`id`, `tutorId`, `executorId`, `creatorId`, `fromDate`, `untilDate`, `title`, `description`, `link`, `paper`, `space`, `mmi`, `compensation`, `location`, `visible`, `published`, `closed`)
VALUES
	(1,6,7,1,'2014-12-12','2014-12-12','bowWow32','userstudy description wowow','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,1,0),
	(4,6,7,1,'2014-12-12','2014-12-12','requiredtes','userstudy description wowow','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,1,1),
	(6,6,7,2,'2014-12-12','2014-12-12','Userstudy Title 3','Userstudy 3 description','http://link3.com','http://paper3.com',30,3,255,'location3',1,1,1),
	(10,1,1,2,'2014-12-12','2014-12-24','Userstudy Title 4','Userstudy 4 description','http://link4.com','http://paper4.com',40,4,255,'location4',1,1,1),
	(15,1,1,2,'2014-12-12','2014-12-28','Userstudy Title 5','Userstudy description 5','http://link5.com','http://paper5.com',50,5,5,'location5',1,1,0),
	(20,6,7,1,'2014-12-12','2014-12-12','bowWow','userstudy description wowow','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,0,0),
	(25,6,7,1,'2014-12-12','2014-12-12','bowWow3','userstudy description wowow','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,0,0),
	(27,6,7,1,'2014-12-12','2014-12-12','requiredtest','userstudy description wowow','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,0,0),
	(28,6,7,1,'2014-12-12','2014-12-12','requiredtestss','userstudy description wowow','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,0,0),
	(35,6,7,1,'2014-12-12','2014-12-12','alltestssss','userstudy description wowow','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,0,0);

/*!40000 ALTER TABLE `userstudies` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
