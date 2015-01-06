# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.22)
# Database: userstudymanager
# Generation Time: 2015-01-06 21:43:53 +0000
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



# Dump of table templates
# ------------------------------------------------------------

DROP TABLE IF EXISTS `templates`;

CREATE TABLE `templates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(32) NOT NULL DEFAULT 'Title',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL DEFAULT '',
  `password` char(60) NOT NULL DEFAULT '',
  `role` int(11) unsigned NOT NULL,
  `lmuStaff` tinyint(1) NOT NULL DEFAULT '0',
  `surname` varchar(11) DEFAULT NULL,
  `lastname` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `role` (`role`),
  CONSTRAINT `role` FOREIGN KEY (`role`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



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
  CONSTRAINT `study_user_rel` FOREIGN KEY (`studyId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_study_rel` FOREIGN KEY (`userId`) REFERENCES `userstudies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



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
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`),
  KEY `tutor_userstudy_rel` (`tutorId`),
  KEY `executor_userstudy_rel` (`executorId`),
  CONSTRAINT `executer_userstudy_rel` FOREIGN KEY (`executorId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `tutor_userstudy_rel` FOREIGN KEY (`tutorId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
