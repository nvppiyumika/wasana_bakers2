USE [wasana_bakers]

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddProduct` (IN `p_name` VARCHAR(255), IN `p_category` ENUM('Cake','Bread','Pastry','Dessert','Sweets'), IN `p_price` DECIMAL(10,2), IN `p_image` MEDIUMBLOB, IN `p_availability` ENUM('in_stock','out_of_stock'))   BEGIN
    INSERT INTO products (name, category, price, image, availability)
    VALUES (p_name, p_category, p_price, p_image, p_availability);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ProcessCheckout` (IN `p_user_id` INT, IN `p_subtotal` DECIMAL(10,2), IN `p_shipping` DECIMAL(10,2), IN `p_total` DECIMAL(10,2))   BEGIN
    DECLARE new_order_id INT;
    
    -- Insert into orders
    INSERT INTO orders (user_id, subtotal, shipping, total, created_at, status)
    VALUES (p_user_id, p_subtotal, p_shipping, p_total, NOW(), 'pending');
    
    -- Get the last inserted order ID
    SET new_order_id = LAST_INSERT_ID();
    
    -- Insert cart items into order_items
    INSERT INTO order_items (order_id, product_id, quantity, price)
    SELECT new_order_id, c.product_id, c.quantity, p.price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = p_user_id;
    
    -- Insert into order_log
    INSERT INTO order_log (order_id, user_id, subtotal, shipping, total, created_at, status)
    VALUES (new_order_id, p_user_id, p_subtotal, p_shipping, p_total, NOW(), 'pending');
    
    -- Clear the user's cart
    DELETE FROM cart WHERE user_id = p_user_id;
END$$

--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `CalculateCartTotal` (`p_user_id` INT) RETURNS DECIMAL(10,2) DETERMINISTIC BEGIN
    DECLARE total DECIMAL(10, 2);
    SELECT SUM(p.price * c.quantity)
    INTO total
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = p_user_id;
    RETURN IFNULL(total, 0.00);
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `FormatPrice` (`p_price` DECIMAL(10,2)) RETURNS VARCHAR(20) CHARSET utf8mb4 COLLATE utf8mb4_general_ci DETERMINISTIC BEGIN
    RETURN CONCAT('LKR ', FORMAT(p_price, 2));
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'admin1', 'admin1@wasanabakers.com', '$2y$10$MAjXjkXCWL3MYhfJhLv7CuFRFwvv4h.NXyK6KFHacfP5sdX3bJO42', '2025-05-21 16:23:30');

-- --------------------------------------------------------

--
-- Stand-in structure for view `availableproducts`
-- (See below for the actual view)
--
CREATE TABLE `availableproducts` (
`id` int(11)
,`name` varchar(100)
,`category` enum('Cake','Bread','Pastry','Dessert','Sweets')
,`price` decimal(10,2)
,`availability` enum('in_stock','out_of_stock')
,`image` varchar(28)
);

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('Manager','Staff','Baker') NOT NULL,
  `hire_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `email`, `role`, `hire_date`, `created_at`) VALUES
(3, 'Kamal Santha', 'kamal@gmail.com', 'Manager', '2025-05-21', '2025-05-22 22:20:17');

--
-- Triggers `employees`
--
DELIMITER $$
CREATE TRIGGER `after_employee_insert` AFTER INSERT ON `employees` FOR EACH ROW BEGIN
    INSERT INTO employee_audit (employee_id, action, name, email, role, hire_date)
    VALUES (NEW.id, 'INSERT', NEW.name, NEW.email, NEW.role, NEW.hire_date);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_employee_update` AFTER UPDATE ON `employees` FOR EACH ROW BEGIN
    INSERT INTO employee_audit (employee_id, action, name, email, role, hire_date)
    VALUES (OLD.id, 'UPDATE', OLD.name, OLD.email, OLD.role, OLD.hire_date);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `employee_audit`
--

CREATE TABLE `employee_audit` (
  `audit_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `change_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_audit`
--

INSERT INTO `employee_audit` (`audit_id`, `employee_id`, `action`, `name`, `email`, `role`, `hire_date`, `change_date`) VALUES
(1, 1, 'INSERT', 'Kamal Santha', 'kamal@gmail.com', 'Manager', '2025-05-19', '2025-05-22 14:14:57'),
(2, 1, 'UPDATE', 'Kamal Santha', 'kamal@gmail.com', 'Manager', '2025-05-19', '2025-05-22 14:17:05'),
(3, 2, 'INSERT', 'Mahinda Rajapaksha', 'mahinda@gmail.com', 'Baker', '2025-05-21', '2025-05-22 22:02:05'),
(4, 3, 'INSERT', 'Kamal Santha', 'kamal@gmail.com', 'Manager', '2025-05-21', '2025-05-22 22:20:17');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'unread'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `name`, `email`, `message`, `created_at`, `status`) VALUES
(4, 'Pasindu Piyumika', 'pasindupiyumika4@gmail.com', 'hi', '2025-05-22 16:05:21', 'read'),
(5, 'Nimal Santha', 'nimal@gmail.com', 'hi wasana bakers', '2025-05-22 21:59:33', 'read');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('Pending','Completed','Cancelled') DEFAULT 'Pending',
  `subtotal` decimal(10,2) NOT NULL,
  `shipping` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `status`, `subtotal`, `shipping`, `total`, `created_at`) VALUES
(7, 1, 'Pending', 300.00, 500.00, 800.00, '2025-05-22 15:18:29'),
(8, 1, 'Completed', 2000.00, 500.00, 2500.00, '2025-05-22 15:19:05'),
(9, 1, 'Completed', 5600.00, 500.00, 6100.00, '2025-05-22 17:50:04'),
(10, 4, 'Pending', 1500.00, 500.00, 2000.00, '2025-05-22 17:53:04'),
(11, 1, 'Pending', 1950.00, 500.00, 2450.00, '2025-05-22 21:06:43'),
(12, 5, 'Completed', 4700.00, 500.00, 5200.00, '2025-05-22 21:59:46');

-- --------------------------------------------------------

--
-- Stand-in structure for view `ordersummary`
-- (See below for the actual view)
--
CREATE TABLE `ordersummary` (
`id` int(11)
,`user_id` int(11)
,`first_name` varchar(50)
,`last_name` varchar(50)
,`status` enum('Pending','Completed','Cancelled')
,`subtotal` decimal(10,2)
,`shipping` decimal(10,2)
,`total` decimal(10,2)
,`created_at` timestamp
,`items` mediumtext
);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(18, 8, 6, 2, 1000.00),
(22, 10, 7, 1, 1200.00),
(25, 11, 10, 1, 950.00),
(26, 11, 11, 1, 1000.00),
(28, 12, 1, 2, 1000.00),
(29, 12, 4, 3, 900.00);

-- --------------------------------------------------------

--
-- Table structure for table `order_log`
--

CREATE TABLE `order_log` (
  `log_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `shipping` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_log`
--

INSERT INTO `order_log` (`log_id`, `order_id`, `user_id`, `subtotal`, `shipping`, `total`, `created_at`, `status`) VALUES
(1, 9, 1, 5600.00, 500.00, 6100.00, '2025-05-22 23:20:04', 'pending'),
(3, 11, 1, 1950.00, 500.00, 2450.00, '2025-05-23 02:36:43', 'pending'),
(5, 8, 1, 2000.00, 500.00, 2500.00, '2025-05-22 20:49:05', 'completed'),
(6, 10, 4, 1500.00, 500.00, 2000.00, '2025-05-22 23:23:04', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` enum('Cake','Bread','Pastry','Dessert','Sweets') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` mediumblob DEFAULT NULL,
  `availability` enum('in_stock','out_of_stock') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(1, 'Chocolate Cake (1kg)', 'Cake', 1000.00, NULL , 'in_stock', '2025-05-21 16:23:30');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(4, 'Butter Cake (1kg)', 'Cake', 900.00, NULL , 'in_stock', '2025-05-21 17:00:35');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(6, 'Coconut Cake/Pol Cake (1kg)', 'Cake', 1000.00, NULL , 'in_stock', '2025-05-22 05:41:12');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(7, 'Ribbon Cake (1kg)', 'Cake', 1100.00, NULL , 'in_stock', '2025-05-22 05:41:59');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(10, 'Fruit Cake (1kg)', 'Cake', 950.00, NULL , 'in_stock', '2025-05-22 20:37:33');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(11, 'Butter Layer Cake (1kg)', 'Cake', 1000.00, NULL , 'in_stock', '2025-05-22 21:05:52');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(12, 'Dodol (1kg)', 'Sweets', 900.00, NULL, 'in_stock', '2025-05-22 21:09:57');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(13, 'Apple Cake (1 Piece)', 'Cake', 100.00, NULL , 'in_stock', '2025-05-22 21:14:25');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(14, 'Sandwich Bread', 'Bread', 200.00, NULL , 'in_stock', '2025-05-22 21:16:53');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(15, 'Roast Paan (Bread)', 'Bread', 60.00, NULL , 'in_stock', '2025-05-22 21:18:33');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(16, 'Fish Bun', 'Pastry', 70.00, NULL , 'in_stock', '2025-05-22 21:21:02');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(17, 'Fish Pastry', 'Pastry', 80.00, NULL , 'in_stock', '2025-05-22 21:23:08');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(18, 'Egg Rollls', 'Pastry', 120.00, NULL , 'in_stock', '2025-05-22 21:25:02');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(19, 'Fish Rolls', 'Pastry', 100.00, NULL , 'in_stock', '2025-05-22 21:25:20');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(20, 'Peni Walalu (1 Piece)', 'Sweets', 50.00, NULL , 'in_stock', '2025-05-22 21:26:14');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(21, 'Watalappan (500g)', 'Dessert', 900.00, NULL , 'in_stock', '2025-05-22 21:31:39');
INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `availability`, `created_at`) VALUES
(22, 'Caramel Pudding (500g)', 'Dessert', 800.00, NULL , 'out_of_stock', '2025-05-22 21:34:03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `address`, `phone`, `email`, `password`, `created_at`) VALUES
(1, 'Pasindu', 'Piyumika', 'No.50, Arunagama, Poruwadanda.', '0705511304', 'pasindupiyumika4@gmail.com', '$2y$10$oBPyPJjetcnuWWNL5uThleKu.CzERAtrJpLf9npHCg.EmdCHK7qjW', '2025-05-21 16:54:55'),
(4, 'kamala', 'hasan', 'india', '0774896321', 'kamala@gmail.com', '$2y$10$nl161aK1XlapzAPBRPWm4udl5UUREOeRfsX7ryLkapZS9tH0gc/cu', '2025-05-22 17:52:10'),
(5, 'nimal', 'santha', 'horana', '0771231478', 'nimal@gmail.com', '$2y$10$TPz6I0G1AmhniV6SskcMiO42CXvfY2isYdmrDWnVLB7s1HF5.4kz.', '2025-05-22 21:58:33'),
(6, 'Pasinduu', 'Piyumikaa', 'No.50, Arunagama, Poruwadanda.', '0705511304', 'pasindupiyumika41@gmail.com', '$2y$10$uVJZt2Qd2Mg6uSumfkJ/CuwcNgbPqrEKAvqxYjyv.Vk11mXsWkL5O', '2025-05-22 22:32:24');

-- --------------------------------------------------------

--
-- Structure for view `availableproducts`
--
DROP TABLE IF EXISTS `availableproducts`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `availableproducts`  AS SELECT `products`.`id` AS `id`, `products`.`name` AS `name`, `products`.`category` AS `category`, `products`.`price` AS `price`, `products`.`availability` AS `availability`, concat('get-image.php?id=',`products`.`id`) AS `image` FROM `products` WHERE `products`.`availability` = 'in_stock' ;

-- --------------------------------------------------------

--
-- Structure for view `ordersummary`
--
DROP TABLE IF EXISTS `ordersummary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `ordersummary`  AS SELECT `o`.`id` AS `id`, `o`.`user_id` AS `user_id`, `u`.`first_name` AS `first_name`, `u`.`last_name` AS `last_name`, `o`.`status` AS `status`, `o`.`subtotal` AS `subtotal`, `o`.`shipping` AS `shipping`, `o`.`total` AS `total`, `o`.`created_at` AS `created_at`, group_concat(concat(`p`.`name`,' x',`oi`.`quantity`) separator ', ') AS `items` FROM (((`orders` `o` join `users` `u` on(`o`.`user_id` = `u`.`id`)) join `order_items` `oi` on(`o`.`id` = `oi`.`order_id`)) join `products` `p` on(`oi`.`product_id` = `p`.`id`)) GROUP BY `o`.`id` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `employee_audit`
--
ALTER TABLE `employee_audit`
  ADD PRIMARY KEY (`audit_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_ibfk_1` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `order_log`
--
ALTER TABLE `order_log`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `employee_audit`
--
ALTER TABLE `employee_audit`
  MODIFY `audit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `order_log`
--
ALTER TABLE `order_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `order_log`
--
ALTER TABLE `order_log`
  ADD CONSTRAINT `order_log_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_log_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
