# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.22)
# Database: userstudymanager
# Generation Time: 2015-01-09 18:53:28 +0000
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
	(20,6,'e4e4c500-9824-11e4-a5b8-4ff20639907a','2015-01-09 18:28:15'),
	(21,7,'effd0a60-9824-11e4-a5b8-4ff20639907a','2015-01-09 18:28:34'),
	(22,8,'f73c0d30-9824-11e4-a5b8-4ff20639907a','2015-01-09 18:28:46'),
	(24,1,'8284e5b0-982f-11e4-b042-ef86a3010442','2015-01-09 19:44:15'),
	(25,1,'8a8abaf0-982f-11e4-b042-ef86a3010442','2015-01-09 19:44:28');

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
	(1,'bowWow'),
	(3,'label'),
	(4,'label1');

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



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
  `labelId` int(11) unsigned NOT NULL,
  `studyId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `label_rel` (`labelId`),
  KEY `study_rel` (`studyId`),
  CONSTRAINT `label_rel` FOREIGN KEY (`labelId`) REFERENCES `labels` (`id`),
  CONSTRAINT `study_rel` FOREIGN KEY (`studyId`) REFERENCES `userstudies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `studies_labels_rel` WRITE;
/*!40000 ALTER TABLE `studies_labels_rel` DISABLE KEYS */;

INSERT INTO `studies_labels_rel` (`id`, `labelId`, `studyId`)
VALUES
	(1,3,1),
	(2,1,1),
	(6,1,4),
	(7,3,1);

/*!40000 ALTER TABLE `studies_labels_rel` ENABLE KEYS */;
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
  `surname` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `role` (`role`),
  CONSTRAINT `role` FOREIGN KEY (`role`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `username`, `password`, `role`, `lmuStaff`, `mmi`, `firstname`, `surname`)
VALUES
	(1,'david@david.com','$2a$10$gC/KVfwor5qe/E8K4RrxRuuKrvmcCIDmAgOh9mtzVB6BRg5N5pJNq',4,0,0,'first','sur'),
	(2,'david2@david.com','$2a$10$WW6/10tkOSrgT1RWvWAwReRjX0qs3ze7nNj0fM8OxGUKdixFWD2Sa',4,0,0,'first','sur'),
	(3,'email@email.com','$2a$10$RLw5xP6MZfE4ljS5kWSDqOf.7jAmjpZyIla/vumfXeNqqsIFhttIy',4,0,0,'firstname','lastname'),
	(4,'email2@email.com','$2a$10$8mynVkH84.j4NBgGjgkBfe7e1bc0j.Uz38/A6NjX4O1v8AlzkqA8G',4,0,0,'firstname','lastname'),
	(5,'ttest@gmail.com','$2a$10$7FbsARL2k37APYCXr63GY./375clb84pJTjtkd2T61CVJM99m0Etu',4,0,0,'dsad','sdafasd'),
	(6,'tutor@tutor.com','$2a$10$4B36wpor/iI5IosNvwqvQukRbb5Q4eHcji9IllUyWjzz4xMVzygTa',2,0,1,'tutorfirst','tutorlast'),
	(7,'execut@execut.com','$2a$10$DSUB4MkLTaOsdpJOEbDoYerUyCKhykrF6YzYtqfJFKFdhI2nOxCpy',3,0,1,'execfirst','execlast'),
	(8,'executer@executer.com','$2a$10$9ZM5MKNTUv3wOJ7W248/o.I9YzHAXAcvjR4uCz3ylBy1PPfntoOQC',3,0,1,'execferirst','execerlast');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users_studies_rel
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_studies_rel`;

CREATE TABLE `users_studies_rel` (
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

LOCK TABLES `users_studies_rel` WRITE;
/*!40000 ALTER TABLE `users_studies_rel` DISABLE KEYS */;

INSERT INTO `users_studies_rel` (`id`, `studyId`, `userId`, `registered`, `confirmed`)
VALUES
	(1,6,1,1,1),
	(2,6,2,1,1),
	(3,6,3,1,1),
	(4,4,1,1,0),
	(5,4,2,1,0),
	(6,4,4,1,0);

/*!40000 ALTER TABLE `users_studies_rel` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table userstudies
# ------------------------------------------------------------

DROP TABLE IF EXISTS `userstudies`;

CREATE TABLE `userstudies` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tutorId` int(11) unsigned NOT NULL,
  `executorId` int(11) unsigned NOT NULL,
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
  `creator` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`),
  KEY `tutor_userstudy_rel` (`tutorId`),
  KEY `executor_userstudy_rel` (`executorId`),
  KEY `creator_user_rel` (`creator`),
  CONSTRAINT `creator_user_rel` FOREIGN KEY (`creator`) REFERENCES `users` (`id`),
  CONSTRAINT `executer_userstudy_rel` FOREIGN KEY (`executorId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `tutor_userstudy_rel` FOREIGN KEY (`tutorId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `userstudies` WRITE;
/*!40000 ALTER TABLE `userstudies` DISABLE KEYS */;

INSERT INTO `userstudies` (`id`, `tutorId`, `executorId`, `fromDate`, `untilDate`, `title`, `description`, `link`, `paper`, `space`, `mmi`, `compensation`, `location`, `visible`, `published`, `closed`, `creator`)
VALUES
	(1,6,7,'2014-12-12','2014-12-13','userstudyTitle','userstudy description','http://www.doodlelink.com','http://www.linktopaper.com',0,1,22,'userstudy location',1,0,0,1),
	(4,6,7,'2014-12-12','2014-12-12','userstudyTitle123','userstudy description','http://www.doodlelink.com','http://www.linktopaper.com',0,1,22,'userstudy location',1,1,0,1),
	(6,6,7,'2014-12-12','2014-12-12','bowWow','userstudy description wowow','http://www.doodlelink.com','http://www.linktopaper.com',20,1,22,'san francisco',1,1,1,1);

/*!40000 ALTER TABLE `userstudies` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
