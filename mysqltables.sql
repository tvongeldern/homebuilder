CREATE TABLE `items` (
  `itemKey` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(35) DEFAULT NULL,
  `itemImageUrl` varchar(250) DEFAULT NULL,
  `itemBudget` int(5) DEFAULT NULL,
  `itemCost` int(5) DEFAULT NULL,
  PRIMARY KEY (`itemKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `projects` (
  `projectKey` int(11) NOT NULL AUTO_INCREMENT,
  `projectName` varchar(35) DEFAULT NULL,
  `projectAdmin` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`projectKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `rooms` (
  `roomKey` int(11) NOT NULL AUTO_INCREMENT,
  `roomName` varchar(35) DEFAULT NULL,
  `project` varchar(35) DEFAULT NULL,
  PRIMARY KEY (`roomKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
