CREATE TABLE `items` (
  `itemName` varchar(35) DEFAULT NULL,
  `itemImageUrl` varchar(250) DEFAULT NULL,
  `itemBudget` int(5) DEFAULT NULL,
  `itemCost` int(5) DEFAULT NULL,
  `itemRoom` varchar(50) DEFAULT NULL,
  `itemProject` varchar(50) DEFAULT NULL,
  `itemBuyer` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `projects` (
  `projectName` varchar(35) DEFAULT NULL,
  `projectAdmin` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `rooms` (
  `roomName` varchar(35) DEFAULT NULL,
  `project` varchar(35) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
