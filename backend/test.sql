# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.22)
# Database: studykeeper
# Generation Time: 2015-03-29 23:27:13 +0000
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
  CONSTRAINT `role_auth` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `auth` WRITE;
/*!40000 ALTER TABLE `auth` DISABLE KEYS */;

INSERT INTO `auth` (`id`, `userId`, `roleId`, `token`, `timestamp`)
VALUES
	(2,1,1,'cbc09d20-d577-11e4-8bec-59bda93b6e55','2015-03-28 19:26:43');

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
	(3,'Feld-Studie'),
	(10,'Mobile-Studie'),
	(11,'NewTest'),
	(1,'Online-Studie');

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
	(15,'Studykeeper ist online!','2015-03-09','Studykeeper hat es nun doch noch geschafft!','http://www.medien.lmu.de'),
	(16,'Die ersten Studien sind endlich da.','2015-03-31','Ab sofort sind Studien online und die Anmeldung ist offen.','http://www.mimuc.de'),
	(17,'Bald ist es soweit!','2015-03-23','Amadeus und David müssen Ihre Bachelor Arbeiten abgeben','http://www.mimuc.de'),
	(18,'Der Tag der Präsentation!','2015-03-24','Der Adrenalinspiegel ist hoch!','http://www.mimuc.de');

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
	(97,21,3),
	(98,21,10),
	(99,31,1),
	(102,1,1),
	(103,2,3),
	(104,2,10),
	(107,37,3),
	(108,23,10);

/*!40000 ALTER TABLE `studies_labels_rel` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table studies_news_rel
# ------------------------------------------------------------

DROP TABLE IF EXISTS `studies_news_rel`;

CREATE TABLE `studies_news_rel` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `studyId` int(11) unsigned NOT NULL,
  `newsId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `news_rel` (`newsId`),
  KEY `study_news_rel` (`studyId`),
  CONSTRAINT `news_rel` FOREIGN KEY (`newsId`) REFERENCES `news` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `study_news_rel` FOREIGN KEY (`studyId`) REFERENCES `userstudies` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `studies_news_rel` WRITE;
/*!40000 ALTER TABLE `studies_news_rel` DISABLE KEYS */;

INSERT INTO `studies_news_rel` (`id`, `studyId`, `newsId`)
VALUES
	(75,21,18),
	(76,1,16),
	(79,37,18),
	(80,23,18);

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
  CONSTRAINT `study_required_orig` FOREIGN KEY (`studyId`) REFERENCES `userstudies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `study_required_rel` FOREIGN KEY (`requiresId`) REFERENCES `userstudies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `studies_requires_rel` WRITE;
/*!40000 ALTER TABLE `studies_requires_rel` DISABLE KEYS */;

INSERT INTO `studies_requires_rel` (`id`, `studyId`, `requiresId`)
VALUES
	(1,23,1),
	(2,23,2),
	(3,38,24),
	(4,38,22);

/*!40000 ALTER TABLE `studies_requires_rel` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table studies_template_values
# ------------------------------------------------------------

DROP TABLE IF EXISTS `studies_template_values`;

CREATE TABLE `studies_template_values` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `studyId` int(11) unsigned NOT NULL,
  `templateId` int(11) unsigned NOT NULL,
  `fieldId` int(11) unsigned NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `templatevalue_studies` (`studyId`),
  KEY `templatevalues_template` (`templateId`),
  KEY `templatevalue_field` (`fieldId`),
  CONSTRAINT `templatevalue_field` FOREIGN KEY (`fieldId`) REFERENCES `template_fields` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `templatevalue_studies` FOREIGN KEY (`studyId`) REFERENCES `userstudies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `templatevalues_template` FOREIGN KEY (`templateId`) REFERENCES `templates` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `studies_template_values` WRITE;
/*!40000 ALTER TABLE `studies_template_values` DISABLE KEYS */;

INSERT INTO `studies_template_values` (`id`, `studyId`, `templateId`, `fieldId`, `value`)
VALUES
	(279,3,1,1,'Im 2. Stock'),
	(280,3,1,2,'30 Minuten'),
	(302,21,4,34,'Smartphone'),
	(303,21,4,35,'Android'),
	(304,31,4,34,'Nichts'),
	(305,31,4,35,'Smartphone Erfahrung'),
	(308,1,2,3,'1 Stunde'),
	(309,1,2,4,'www.mimuc.de'),
	(310,1,2,5,'Erfahrung mit Windows 10'),
	(311,2,4,34,'Smartphone'),
	(312,2,4,35,'Android Kentnisse'),
	(319,37,4,34,'Smartphone'),
	(320,37,4,35,'Keine'),
	(321,23,4,34,'Iphone'),
	(322,23,4,35,'Keine'),
	(323,38,4,34,''),
	(324,38,4,35,'');

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
	(169,28,3,1,0),
	(170,28,7,1,0),
	(201,3,20,1,0),
	(202,3,17,1,0),
	(203,3,1,1,0),
	(204,3,3,1,0),
	(205,3,4,1,0),
	(206,3,7,1,0),
	(221,24,1,1,0),
	(223,22,1,1,0),
	(224,21,3,1,0),
	(226,24,5,1,0),
	(227,21,10,1,0),
	(234,1,7,1,0),
	(235,1,9,1,0),
	(236,1,8,1,0),
	(237,1,10,1,0),
	(238,1,17,1,0),
	(239,1,20,1,0),
	(240,1,5,1,0),
	(241,2,3,1,0),
	(242,2,4,1,0),
	(243,2,7,1,0),
	(244,2,9,1,0),
	(245,2,8,1,0),
	(246,2,10,1,0),
	(247,2,5,1,0),
	(249,21,1,1,0),
	(253,37,4,1,1),
	(254,37,3,1,1),
	(255,37,1,1,1);

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
	(1,1,'Wegbeschreibung'),
	(2,1,'Dauer'),
	(3,2,'Dauer'),
	(4,2,'URL'),
	(5,2,'Vorraussetzungen'),
	(34,4,'Mitzubringen'),
	(35,4,'Vorraussetzung');

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
	(4,'Mobile Studie'),
	(2,'Online Studie'),
	(1,'Standart Template');

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
	(1,'david.kronmueller@campus.lmu.de','$2a$10$KUtrUWkmNYShDimkKjo3XODvQNUj6fqvkdsMN4Dcyhu8f8Fhjhc3y',1,1,2,'David','Kronmueller',1,0),
	(3,'jan.delay@campus.lmu.de','$2a$10$i/sIqsX/iAEpUynQbTvobuVFs8Q47DP49x9TV90szBXqsb5T.c1s2',2,1,4.5,'Jan','Delay',1,1),
	(4,'dennis.lisk@campus.lmu.de','$2a$10$fnD1rqDxsgIuz9iUfMGBfeKEERL88fqF.uvJjcdgI8puUVH.uMKYu',2,1,2,'Dennis','Lisk',1,0),
	(5,'amadeus.schell@cip.ifi.lmu.de','$2a$10$i/sIqsX/iAEpUynQbTvobuVFs8Q47DP49x9TV90szBXqsb5T.c1s2',1,1,0,'Amadeus','Schell',1,0),
	(7,'martin.laciny@cip.ifi.lmu.de','$2a$10$YIFp5koNoFKTAWg3SB1wgO1KoxVT/NTPXlQOS.gUolxWw.yXRGN4u',3,1,2,'Marten','Laciny',1,1),
	(8,'felix.brummer@campus.lmu.de','$2a$10$i/sIqsX/iAEpUynQbTvobuVFs8Q47DP49x9TV90szBXqsb5T.c1s2',3,1,1,'Felix','Brummer',1,1),
	(9,'max.herre@campus.lmu.de','$2a$10$i/sIqsX/iAEpUynQbTvobuVFs8Q47DP49x9TV90szBXqsb5T.c1s2',3,1,0,'Max','Herre',1,1),
	(10,'amadeus.schell@campus.lmu.de','$2a$10$i/sIqsX/iAEpUynQbTvobuVFs8Q47DP49x9TV90szBXqsb5T.c1s2',3,1,1.5,'Amadeus','Schell',1,1),
	(11,'unconfirmed@campus.lmu.de','$2a$10$i/sIqsX/iAEpUynQbTvobuVFs8Q47DP49x9TV90szBXqsb5T.c1s2',3,1,0,'unconfirmed','user',1,1),
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
	(4,1,1,'2015-03-23 18:22:13',''),
	(5,3,1,'2015-03-23 18:22:14',''),
	(6,4,1,'2015-03-23 18:22:14',''),
	(7,5,1,'2015-03-23 18:22:15',''),
	(9,7,1,'2015-03-23 18:22:16',''),
	(10,8,1,'2015-03-23 18:22:18',''),
	(11,9,1,'2015-03-23 18:22:20',''),
	(12,10,1,'2015-03-23 18:22:21',''),
	(18,17,1,'2015-03-23 18:22:23',''),
	(21,20,1,'2015-03-23 18:22:27',''),
	(22,11,0,'2015-03-23 18:22:25','7145a140-b6fc-11e4-b43f-29cecdaae0c3');

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
	(1,1,3,1,2,'2015-02-04','2015-02-28','Abgeschlossene Online Studie','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a sodales purus. Ut ante risus, lacinia ut dictum quis, bibendum eget orci. Phasellus luctus eleifend lorem, ut interdum velit gravida feugiat. Vivamus finibus ultrices tellus imperdiet laoreet. Morbi mattis vel elit sed porta. Morbi at enim id lectus dignissim efficitur quis eu enim. Quisque turpis erat, pulvinar non ultricies porttitor, gravida in lectus. Mauris consectetur a justo eget pellentesque. Integer id egestas dolor. Suspendisse molestie molestie sem ut cursus. Mauris quis hendrerit nisl, ut maximus turpis.Dies ist die Beschreibung für die Studie Context-sensitive Modalities for Interaction with Large Screens','http://www.medien.ifi.lmu.de/lehre/ws1415/dsm/',20,1,'5€ Zalando Gutschein','Amalienstraße 17, Raum A 105',1,1,1),
	(2,1,4,1,4,'2015-02-01','2015-02-01','Abgeschlossene Mobile Studie','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a sodales purus. Ut ante risus, lacinia ut dictum quis, bibendum eget orci. Phasellus luctus eleifend lorem, ut interdum velit gravida feugiat. Vivamus finibus ultrices tellus imperdiet laoreet. Morbi mattis vel elit sed porta. Morbi at enim id lectus dignissim efficitur quis eu enim. Quisque turpis erat, pulvinar non ultricies porttitor, gravida in lectus. Mauris consectetur a justo eget pellentesque. Integer id egestas dolor. Suspendisse molestie molestie sem ut cursus. Mauris quis hendrerit nisl, ut maximus ','http://www.medien.ifi.lmu.de/lehre/ws1415/dsm/',20,1,'5€ Amazon Gutschein','Oettingenstr. 67, Raum 001',1,1,1),
	(3,1,4,1,1,'2015-02-15','2015-02-15','Abgeschlossene Standart Studie','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a sodales purus. Ut ante risus, lacinia ut dictum quis, bibendum eget orci. Phasellus luctus eleifend lorem, ut interdum velit gravida feugiat. Vivamus finibus ultrices tellus imperdiet laoreet. Morbi mattis vel elit sed porta. Morbi at enim id lectus dignissim efficitur quis eu enim. Quisque turpis erat, pulvinar non ultricies porttitor, gravida in lectus. Mauris consectetur a justo eget pellentesque. Integer id egestas dolor. Suspendisse molestie molestie sem ut cursus. Mauris quis hendrerit nisl, ut maximus turpis.','http://www.medien.ifi.lmu.de/lehre/ws1415/dsm/',10,2,'5€ Amazon Gutschein','Amalienstraße 17, Raum A 201',1,1,1),
	(21,5,5,5,4,'2015-04-01','2015-04-02','Mobile Studie 2','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a sodales purus. Ut ante risus, lacinia ut dictum quis, bibendum eget orci. Phasellus luctus eleifend lorem, ut interdum velit gravida feugiat. Vivamus finibus ultrices tellus imperdiet laoreet. Morbi mattis vel elit sed porta. Morbi at enim id lectus dignissim efficitur quis eu enim. Quisque turpis erat, pulvinar non ultricies porttitor, gravida in lectus. Mauris consectetur a justo eget pellentesque. Integer id egestas dolor. Suspendisse molestie molestie sem ut cursus. Mauris quis hendrerit nisl, ut maximus turpis.','http://www.medien.ifi.lmu.de/lehre/ws1415/dsm/',15,1,'5€ Amazon Gutschein','Amalienstraße 17, Raum 300',1,1,0),
	(22,5,4,1,1,'2015-03-17','2015-04-05','Studie mit Vorraussetzung','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a sodales purus. Ut ante risus, lacinia ut dictum quis, bibendum eget orci. Phasellus luctus eleifend lorem, ut interdum velit gravida feugiat. Vivamus finibus ultrices tellus imperdiet laoreet. Morbi mattis vel elit sed porta. Morbi at enim id lectus dignissim efficitur quis eu enim. Quisque turpis erat, pulvinar non ultricies porttitor, gravida in lectus. Mauris consectetur a justo eget pellentesque. Integer id egestas dolor. Suspendisse molestie molestie sem ut cursus. Mauris quis hendrerit nisl, ut maximus turpis.','http://www.medien.ifi.lmu.de/lehre/ws1415/dsm/',12,1,'5€ Amazon Gutschein','Theresienstraße 39, Raum 007',1,1,0),
	(23,1,3,5,4,'2015-04-01','2015-04-06','Mobile Studie 3','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a sodales purus. Ut ante risus, lacinia ut dictum quis, bibendum eget orci. Phasellus luctus eleifend lorem, ut interdum velit gravida feugiat. Vivamus finibus ultrices tellus imperdiet laoreet. Morbi mattis vel elit sed porta. Morbi at enim id lectus dignissim efficitur quis eu enim. Quisque turpis erat, pulvinar non ultricies porttitor, gravida in lectus. Mauris consectetur a justo eget pellentesque. Integer id egestas dolor. Suspendisse molestie molestie sem ut cursus. Mauris quis hendrerit nisl, ut maximus turpis.','http://www.medien.ifi.lmu.de/lehre/ws1415/dsm/',20,0.5,'5€ Amazon Gutschein','Amalienstraße 17, Rückgebäude 2. Stock',1,1,0),
	(24,1,3,1,1,'2015-04-01','2015-04-10','Standart Studie 2','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a sodales purus. Ut ante risus, lacinia ut dictum quis, bibendum eget orci. Phasellus luctus eleifend lorem, ut interdum velit gravida feugiat. Vivamus finibus ultrices tellus imperdiet laoreet. Morbi mattis vel elit sed porta. Morbi at enim id lectus dignissim efficitur quis eu enim. Quisque turpis erat, pulvinar non ultricies porttitor, gravida in lectus. Mauris consectetur a justo eget pellentesque. Integer id egestas dolor. Suspendisse molestie molestie sem ut cursus. Mauris quis hendrerit nisl, ut maximus turpis.','http://www.medien.ifi.lmu.de/lehre/ws1415/dsm/',10,0.5,'10€ Amazon Gutschein','Theresienstraße 39, Raum 302',1,1,0),
	(28,5,4,5,1,'2015-04-10','2015-04-12','Standart Studie 3 (Nicht Veröffentlicht)','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a sodales purus. Ut ante risus, lacinia ut dictum quis, bibendum eget orci. Phasellus luctus eleifend lorem, ut interdum velit gravida feugiat. Vivamus finibus ultrices tellus imperdiet laoreet. Morbi mattis vel elit sed porta. Morbi at enim id lectus dignissim efficitur quis eu enim. Quisque turpis erat, pulvinar non ultricies porttitor, gravida in lectus. Mauris consectetur a justo eget pellentesque. Integer id egestas dolor. Suspendisse molestie molestie sem ut cursus. Mauris quis hendrerit nisl, ut maximus turpis.','http://www.medien.ifi.lmu.de/lehre/ws1415/dsm/',10,1,'5€ Amazon Gutschein','Amalienstraße 17, Raum A 105',1,0,0),
	(31,5,4,5,4,'2015-04-10','2015-04-14','Online Studie 2 (Nicht Veröffentlicht)','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a sodales purus. Ut ante risus, lacinia ut dictum quis, bibendum eget orci. Phasellus luctus eleifend lorem, ut interdum velit gravida feugiat. Vivamus finibus ultrices tellus imperdiet laoreet. Morbi mattis vel elit sed porta. Morbi at enim id lectus dignissim efficitur quis eu enim. Quisque turpis erat, pulvinar non ultricies porttitor, gravida in lectus. Mauris consectetur a justo eget pellentesque. Integer id egestas dolor. Suspendisse molestie molestie sem ut cursus. Mauris quis hendrerit nisl, ut maximus turpis.','http://www.medien.ifi.lmu.de/lehre/ws1415/dsm/',20,1,'5€ Amazon Gutschein','Oettingenstr. 67, Raum 222',1,0,0),
	(37,5,1,5,4,'2015-03-10','2015-03-26','Teststudie','Keine','http://www.google.de',20,2,'Keine','Muenchen',1,1,1),
	(38,1,1,1,4,'2015-03-19','2015-03-30','test','sda','http://www.abc.de',0,0,'12','das',1,0,0);

/*!40000 ALTER TABLE `userstudies` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
