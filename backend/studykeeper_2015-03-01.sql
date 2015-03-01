# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.22)
# Database: studykeeper
# Generation Time: 2015-03-01 13:36:09 +0000
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
  CONSTRAINT `user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `auth` WRITE;
/*!40000 ALTER TABLE `auth` DISABLE KEYS */;

INSERT INTO `auth` (`id`, `userId`, `roleId`, `token`, `timestamp`)
VALUES
	(100,3,2,'932ba750-b6f2-11e4-977c-6385d5abd00a','2015-02-17 23:16:19'),
	(101,3,2,'08407e30-b6f3-11e4-977c-6385d5abd00a','2015-02-17 23:21:44'),
	(111,4,2,'90cba5c0-b78b-11e4-94f5-1f91ad06c959','2015-02-18 17:35:19'),
	(117,1,1,'71910360-c016-11e4-a530-29e87e1a047e','2015-03-01 14:28:40');

/*!40000 ALTER TABLE `auth` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table labels
# ------------------------------------------------------------

DROP TABLE IF EXISTS `labels`;

CREATE TABLE `labels` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `labels` WRITE;
/*!40000 ALTER TABLE `labels` DISABLE KEYS */;

INSERT INTO `labels` (`id`, `title`)
VALUES
	(6,'Label 4'),
	(1,'Label1'),
	(2,'Label2'),
	(3,'Label3'),
	(7,'Test');

/*!40000 ALTER TABLE `labels` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table news
# ------------------------------------------------------------

DROP TABLE IF EXISTS `news`;

CREATE TABLE `news` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `date` date NOT NULL,
  `description` text NOT NULL,
  `link` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;

INSERT INTO `news` (`id`, `title`, `date`, `description`, `link`)
VALUES
	(1,'News 1','2015-02-15','This news has the date 15.02.2015','http://www.lmu.de'),
	(2,'News 2','2015-12-17','This news has the date 17.12.2015','http://www.medien.ifi.lmu.de'),
	(11,'test','2015-02-03','test','http://www.google.de');

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
	(1,'tutor'),
	(2,'executor'),
	(3,'participant');

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
	(27,1,2),
	(28,1,1),
	(36,24,7),
	(39,23,1),
	(40,26,1);

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
	(28,1,1),
	(34,24,2),
	(37,23,1),
	(38,26,1);

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
	(9,21,1),
	(10,22,1),
	(11,22,2),
	(14,4,3),
	(21,23,1);

/*!40000 ALTER TABLE `studies_requires_rel` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table studies_template_values
# ------------------------------------------------------------

DROP TABLE IF EXISTS `studies_template_values`;

CREATE TABLE `studies_template_values` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `studyId` int(11) unsigned NOT NULL,
  `templateId` int(11) unsigned NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `templatevalue_studies` (`studyId`),
  KEY `templatevalues_template` (`templateId`),
  CONSTRAINT `templatevalue_studies` FOREIGN KEY (`studyId`) REFERENCES `userstudies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `templatevalues_template` FOREIGN KEY (`templateId`) REFERENCES `templates` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `studies_template_values` WRITE;
/*!40000 ALTER TABLE `studies_template_values` DISABLE KEYS */;

INSERT INTO `studies_template_values` (`id`, `studyId`, `templateId`, `value`)
VALUES
	(87,21,1,''),
	(88,21,1,''),
	(89,22,1,''),
	(90,22,1,''),
	(121,1,2,'Value1234'),
	(122,1,2,'value2234'),
	(123,1,2,'test'),
	(124,1,2,''),
	(133,24,19,'Super'),
	(134,24,19,'Duper'),
	(141,2,17,'Wert1nyan'),
	(142,2,17,'Wert2nyan'),
	(147,23,19,'Amar'),
	(148,23,19,'asd'),
	(149,25,19,''),
	(150,25,19,''),
	(151,26,19,''),
	(152,26,19,''),
	(157,27,2,'feld'),
	(158,27,2,'feld2'),
	(159,27,2,''),
	(160,27,2,'');

/*!40000 ALTER TABLE `studies_template_values` ENABLE KEYS */;
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
	(82,1,8,1,1),
	(83,1,9,1,1),
	(84,1,4,1,1),
	(85,1,5,1,1),
	(94,24,3,1,1),
	(95,24,8,1,1),
	(96,24,9,1,1),
	(97,24,4,1,1),
	(98,24,5,1,1),
	(99,24,7,1,1),
	(103,2,7,1,0),
	(108,23,10,1,0),
	(109,23,7,1,0);

/*!40000 ALTER TABLE `studies_users_rel` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table template_fields
# ------------------------------------------------------------

DROP TABLE IF EXISTS `template_fields`;

CREATE TABLE `template_fields` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `templateId` int(11) unsigned NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `template_fields_rel` (`templateId`),
  CONSTRAINT `template_fields_rel` FOREIGN KEY (`templateId`) REFERENCES `templates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `template_fields` WRITE;
/*!40000 ALTER TABLE `template_fields` DISABLE KEYS */;

INSERT INTO `template_fields` (`id`, `templateId`, `title`)
VALUES
	(1,1,'Felde Nummer1'),
	(2,1,'Feld Nummer2'),
	(3,2,'Feld 1 Template 2'),
	(4,2,'Feld 2 Template 2'),
	(5,2,'Feld 3 Template 2'),
	(6,2,'Feldinhalt 4 Template 2'),
	(7,3,'Feld 1 Template 3'),
	(22,17,'Feld1'),
	(23,17,'Feld2 '),
	(26,18,'Feld 1'),
	(27,18,'Feld 2k'),
	(28,18,'Fedl 3'),
	(34,4,'Feld 1 Template 4'),
	(35,4,'Abc'),
	(36,19,'dumperEins'),
	(37,19,'sowasZwei');

/*!40000 ALTER TABLE `template_fields` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table templates
# ------------------------------------------------------------

DROP TABLE IF EXISTS `templates`;

CREATE TABLE `templates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT 'Title',
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;

INSERT INTO `templates` (`id`, `title`)
VALUES
	(19,'SuperDuper'),
	(1,'Template 1'),
	(2,'Template 2'),
	(3,'Template 3'),
	(4,'Template 4'),
	(17,'Template 5'),
	(18,'Template 6 ');

/*!40000 ALTER TABLE `templates` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` char(60) NOT NULL DEFAULT '',
  `role` int(11) unsigned NOT NULL,
  `lmuStaff` tinyint(1) NOT NULL DEFAULT '0',
  `mmi` float NOT NULL DEFAULT '0',
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
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
	(1,'tutor@campus.lmu.de','$2a$10$KUtrUWkmNYShDimkKjo3XODvQNUj6fqvkdsMN4Dcyhu8f8Fhjhc3y',1,1,0,'Test','Tutor',1,0),
	(3,'executor@campus.lmu.de','$2a$10$i/sIqsX/iAEpUynQbTvobuVFs8Q47DP49x9TV90szBXqsb5T.c1s2',2,1,2,'Test','Executor',1,1),
	(4,'executor2@campus.lmu.de','$2a$10$fnD1rqDxsgIuz9iUfMGBfeKEERL88fqF.uvJjcdgI8puUVH.uMKYu',2,1,2,'Test','Executor2',1,0),
	(5,'tutor2@cip.ifi.lmu.de','$2a$10$i/sIqsX/iAEpUynQbTvobuVFs8Q47DP49x9TV90szBXqsb5T.c1s2',1,1,1,'Test','Tutor2',1,0),
	(7,'participant1@cip.ifi.lmu.de','$2a$10$i/sIqsX/iAEpUynQbTvobuVFs8Q47DP49x9TV90szBXqsb5T.c1s2',1,1,4.5,'IfiStudent','Test',1,1),
	(8,'participant2@campus.lmu.de','$2a$10$i/sIqsX/iAEpUynQbTvobuVFs8Q47DP49x9TV90szBXqsb5T.c1s2',3,1,1,'LmuStudent','Test',1,1),
	(9,'participant3@whatever.com','$2a$10$i/sIqsX/iAEpUynQbTvobuVFs8Q47DP49x9TV90szBXqsb5T.c1s2',3,0,0,'ExtParticip','Test',1,0),
	(10,'participant4@whatever.com','$2a$10$i/sIqsX/iAEpUynQbTvobuVFs8Q47DP49x9TV90szBXqsb5T.c1s2',3,0,0,'ExtParticip2','Test',1,0),
	(11,'unconfirmed@campus.lmu.de','$2a$10$i/sIqsX/iAEpUynQbTvobuVFs8Q47DP49x9TV90szBXqsb5T.c1s2',3,1,1,'unconfirmed','Test',1,1),
	(12,'deleted12','$2a$10$SMN6536bm2EA.4lHlrghrOkK5yJtgqS0Nce4tIspmmoduRn6YolhW',3,0,0,'deleted','deleted',0,0),
	(13,'deleted13','$2a$10$ocvmkGBXF0dEMLzu.XUUeO76SMDAHimpjihJWvmqC5lbudrpI/hzC',3,0,0,'deleted','deleted',0,0),
	(17,'amadeus.schell17@gmail.com','$2a$10$NECkyFEG5MQpjj7JJcP70uLJtTNEzBYmGC163SiZz4AyWGNKN/yHK',3,0,0,'Ama','Schell',1,0),
	(20,'david.kronmueller@gmail.com','$2a$10$EsK6UzBoZugzk2VCRfCBVuz7DmSvzAj8okCfzv5gqsV1EsxRfGfi2',3,0,0,'David','Kronmueller',1,0);

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
	(4,1,1,'2015-02-15 14:06:04','123'),
	(5,3,1,'2015-02-15 14:16:25',''),
	(6,4,1,'2015-02-15 14:16:29',''),
	(7,5,1,'2015-02-15 14:16:32',''),
	(9,7,1,'2015-02-15 14:16:41',''),
	(10,8,1,'2015-02-15 14:16:44',''),
	(11,9,1,'2015-02-15 14:16:56',''),
	(12,10,1,'2015-02-15 14:17:02',''),
	(13,12,0,'2015-02-15 16:16:54','acab1c70-b525-11e4-b59a-b9807bf1f21c'),
	(14,13,0,'2015-02-15 16:39:59','e62214b0-b528-11e4-be6c-5d3b38b74993'),
	(18,17,0,'2015-02-17 23:37:20','8843e070-b6f5-11e4-8124-4d69a4a29ed5'),
	(21,20,0,'2015-02-18 00:26:48','7145a140-b6fc-11e4-b43f-29cecdaae0c3');

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
  `title` varchar(255) NOT NULL DEFAULT '',
  `description` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `space` int(11) unsigned NOT NULL,
  `mmi` float unsigned DEFAULT NULL,
  `compensation` varchar(255) NOT NULL DEFAULT '0',
  `location` varchar(255) NOT NULL DEFAULT '',
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

INSERT INTO `userstudies` (`id`, `tutorId`, `executorId`, `creatorId`, `templateId`, `fromDate`, `untilDate`, `title`, `description`, `link`, `space`, `mmi`, `compensation`, `location`, `visible`, `published`, `closed`)
VALUES
	(1,1,3,1,2,'2015-02-04','2015-02-28','Studie 1',' Die Beschreibung','http://www.linklinklinl.de',10,0,'0','der Ort',1,1,1),
	(2,1,4,1,17,'2015-02-01','2015-02-01','Studie 2 nyan','Die Beschreibung nyan','http://www.amaistdoofnyan.com',1,1,'5','der Ort nyan',1,1,0),
	(3,5,5,1,1,'2015-02-15','2015-02-15','Studie 3','Diese Nutzerstudie wird vom dem Tutor der sie erstellt hat auch ausgefuehrt','http://diewebseitevomtutor.de',0,0,'0','Tutors2 Office',1,1,0),
	(21,1,4,1,1,'2015-02-17','2015-02-18','Studie Req Studie 1','Loc','http://www.test.test',1,1,'5','Hier',1,1,0),
	(22,1,4,1,1,'2015-02-17','2015-02-18','Studie Req Studie 1 und 2','Loc','http://www.test.test',1,1,'5','Hier',1,1,0),
	(23,1,3,1,19,'2015-02-28','2015-02-28','Ama','Ama','http://www.Ama.Ama',1,3.5,'35','Ama',1,0,0),
	(24,1,3,1,19,'2015-02-17','2015-02-21','Geplante Studie','Geplante Beschreibung','http://www.linkzurgeplantenStudie.com',13,1,'10','Geplanter Ort',1,1,1),
	(25,1,1,1,19,'2015-02-28','2015-02-28','Test','Beschreibung','http://www.link.link',0,0,'0','hier',1,0,0),
	(26,1,1,1,19,'2015-02-27','2015-02-27','hier','hier','http://www.absd.de',0,0,'0','hier',1,0,0),
	(27,1,3,1,2,'2015-03-12','2015-03-28','TEsttest','Beschr','http://www.abc.de',0,0,'30','Ort',1,0,0);

/*!40000 ALTER TABLE `userstudies` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
