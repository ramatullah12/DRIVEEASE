-- =======================================================================
-- DRIVEEASE - DATABASE SCHEMA & SEEDER
-- Sistem Informasi Rental Kendaraan & Manajemen Armada Terpadu
-- Engine: MySQL 8.0+ / MariaDB 10.4+
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- =======================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `additional_services`;
DROP TABLE IF EXISTS `maintenance`;
DROP TABLE IF EXISTS `vehicle_inspections`;
DROP TABLE IF EXISTS `vehicle_returns`;
DROP TABLE IF EXISTS `vehicle_handover`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `booking_details`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `vehicles`;
DROP TABLE IF EXISTS `vehicle_categories`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. TABEL: users (Otentikasi & Akun Pengguna)
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'customer', 'staff') NOT NULL DEFAULT 'customer',
  `phone` VARCHAR(25) NULL,
  `avatar` VARCHAR(255) NULL,
  `remember_token` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABEL: customers (Data Identitas & Profil Pelanggan)
CREATE TABLE `customers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `nik` VARCHAR(20) NOT NULL UNIQUE,
  `sim_number` VARCHAR(30) NOT NULL,
  `address` TEXT NOT NULL,
  `phone` VARCHAR(25) NOT NULL,
  `emergency_contact` VARCHAR(25) NULL,
  `verified_status` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  `verified_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_customers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABEL: vehicle_categories (Kategori Armada)
CREATE TABLE `vehicle_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `icon` VARCHAR(50) NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABEL: vehicles (Inventaris Armada Kendaraan)
CREATE TABLE `vehicles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `brand` VARCHAR(80) NOT NULL,
  `model_type` VARCHAR(100) NOT NULL,
  `category_id` BIGINT UNSIGNED NOT NULL,
  `license_plate` VARCHAR(20) NOT NULL UNIQUE,
  `year` YEAR NOT NULL,
  `transmission` ENUM('automatic', 'manual') NOT NULL DEFAULT 'automatic',
  `passenger_capacity` INT NOT NULL DEFAULT 5,
  `price_per_day` DECIMAL(12, 2) NOT NULL,
  `fuel_type` ENUM('bensin', 'diesel', 'listrik', 'hybrid') NOT NULL DEFAULT 'bensin',
  `description` TEXT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `status` ENUM('available', 'rented', 'maintenance', 'reserved') NOT NULL DEFAULT 'available',
  `mileage` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_vehicles_category` FOREIGN KEY (`category_id`) REFERENCES `vehicle_categories` (`id`) ON DELETE RESTRICT,
  INDEX `idx_vehicles_status` (`status`),
  INDEX `idx_vehicles_plate` (`license_plate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABEL: bookings (Pemesanan & Reservasi Sewa)
CREATE TABLE `bookings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_code` VARCHAR(50) NOT NULL UNIQUE,
  `customer_id` BIGINT UNSIGNED NOT NULL,
  `vehicle_id` BIGINT UNSIGNED NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `total_days` INT NOT NULL DEFAULT 1,
  `daily_rate` DECIMAL(12, 2) NOT NULL,
  `subtotal` DECIMAL(12, 2) NOT NULL,
  `down_payment_required` DECIMAL(12, 2) NOT NULL,
  `deposit_amount` DECIMAL(12, 2) NOT NULL DEFAULT 500000.00,
  `total_amount` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `payment_status` ENUM('unpaid', 'partial', 'paid', 'refunded') NOT NULL DEFAULT 'unpaid',
  `notes` TEXT NULL,
  `rejection_reason` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_bookings_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bookings_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE RESTRICT,
  INDEX `idx_bookings_dates` (`vehicle_id`, `start_date`, `end_date`),
  INDEX `idx_bookings_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABEL: booking_details (Detail Item & Ekstra Layanan Booking)
CREATE TABLE `booking_details` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` BIGINT UNSIGNED NOT NULL,
  `item_name` VARCHAR(150) NOT NULL,
  `item_type` ENUM('vehicle_rent', 'driver_fee', 'insurance', 'accessory', 'discount') NOT NULL DEFAULT 'vehicle_rent',
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(12, 2) NOT NULL,
  `subtotal` DECIMAL(12, 2) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_booking_details_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TABEL: payments (Transaksi Pembayaran & Mutasi)
CREATE TABLE `payments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` BIGINT UNSIGNED NOT NULL,
  `transaction_ref` VARCHAR(100) NOT NULL UNIQUE,
  `amount` DECIMAL(12, 2) NOT NULL,
  `payment_type` ENUM('down_payment', 'settlement', 'full_payment', 'penalty') NOT NULL DEFAULT 'down_payment',
  `payment_method` ENUM('bank_transfer', 'qris', 'credit_card', 'cash') NOT NULL DEFAULT 'bank_transfer',
  `payment_status` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  `bank_name` VARCHAR(100) NULL,
  `proof_url` VARCHAR(255) NULL,
  `verified_at` TIMESTAMP NULL,
  `verified_by` VARCHAR(150) NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  INDEX `idx_payments_ref` (`transaction_ref`),
  INDEX `idx_payments_status` (`payment_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. TABEL: vehicle_handover (Serah Terima Kendaraan / Ambil Unit)
CREATE TABLE `vehicle_handover` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `staff_id` BIGINT UNSIGNED NOT NULL,
  `handover_date` DATETIME NOT NULL,
  `start_mileage` INT NOT NULL,
  `fuel_level` INT NOT NULL DEFAULT 100,
  `body_clean` TINYINT(1) NOT NULL DEFAULT 1,
  `interior_clean` TINYINT(1) NOT NULL DEFAULT 1,
  `tires_condition` TINYINT(1) NOT NULL DEFAULT 1,
  `spare_tire` TINYINT(1) NOT NULL DEFAULT 1,
  `tools_complete` TINYINT(1) NOT NULL DEFAULT 1,
  `stnk_present` TINYINT(1) NOT NULL DEFAULT 1,
  `condition_notes` TEXT NULL,
  `photo_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_handover_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_handover_staff` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. TABEL: vehicle_returns (Pencatatan Pengembalian Mobil)
CREATE TABLE `vehicle_returns` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `staff_id` BIGINT UNSIGNED NOT NULL,
  `scheduled_return_date` DATETIME NOT NULL,
  `actual_return_date` DATETIME NOT NULL,
  `end_mileage` INT NOT NULL,
  `fuel_level` INT NOT NULL,
  `late_hours` INT NOT NULL DEFAULT 0,
  `late_fee` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `fuel_charge` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `damage_fee` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total_penalty` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `damage_notes` TEXT NULL,
  `status` ENUM('inspected', 'settled', 'needs_maintenance') NOT NULL DEFAULT 'settled',
  `photo_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_returns_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_returns_staff` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. TABEL: vehicle_inspections (Checklist Detail Pemeriksaan Fisik)
CREATE TABLE `vehicle_inspections` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `vehicle_id` BIGINT UNSIGNED NOT NULL,
  `staff_id` BIGINT UNSIGNED NOT NULL,
  `inspection_type` ENUM('pre_rental', 'post_rental', 'periodic') NOT NULL,
  `inspection_date` DATETIME NOT NULL,
  `brake_condition` ENUM('good', 'fair', 'needs_repair') NOT NULL DEFAULT 'good',
  `engine_oil_level` ENUM('optimal', 'low', 'needs_change') NOT NULL DEFAULT 'optimal',
  `body_scratches_count` INT NOT NULL DEFAULT 0,
  `findings` TEXT NULL,
  `passed` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_inspections_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_inspections_staff` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. TABEL: maintenance (Jadwal & Riwayat Perawatan Bengkel)
CREATE TABLE `maintenance` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `vehicle_id` BIGINT UNSIGNED NOT NULL,
  `service_date` DATE NOT NULL,
  `service_type` ENUM('periodic', 'repair', 'tire', 'oil_change', 'emergency') NOT NULL DEFAULT 'periodic',
  `cost` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `workshop_name` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('scheduled', 'in_progress', 'completed') NOT NULL DEFAULT 'scheduled',
  `odometer_at_service` INT NOT NULL,
  `next_service_mileage` INT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_maintenance_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE,
  INDEX `idx_maintenance_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. TABEL: additional_services (Layanan Tambahan Driver/Asuransi)
CREATE TABLE `additional_services` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `price_per_day` DECIMAL(12, 2) NOT NULL,
  `description` TEXT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================================================================
-- INITIAL SEED DATA (DATA AWAL SISTEM)
-- =======================================================================

-- Users (Password default hash bcrypt: 'password123')
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `avatar`) VALUES
(1, 'Administrator DriveEase', 'admin@driveease.com', '$2y$12$e6N1w0gC8t0n5u3Z9K7aEOoVd2u8e8k9r0k5t1g2y3u4i5o6p7q8r', 'admin', '081234567890', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'),
(2, 'Rudi Pratama (Petugas)', 'petugas@driveease.com', '$2y$12$e6N1w0gC8t0n5u3Z9K7aEOoVd2u8e8k9r0k5t1g2y3u4i5o6p7q8r', 'staff', '082198765432', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'),
(3, 'Budi Santoso (Customer)', 'customer@driveease.com', '$2y$12$e6N1w0gC8t0n5u3Z9K7aEOoVd2u8e8k9r0k5t1g2y3u4i5o6p7q8r', 'customer', '081377889900', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150');

-- Customers Profile
INSERT INTO `customers` (`id`, `user_id`, `nik`, `sim_number`, `address`, `phone`, `verified_status`) VALUES
(1, 3, '3171012345670001', '9901-2345-6789', 'Jl. Kebon Jeruk No. 12, Jakarta Barat', '081377889900', 'verified');

-- Categories
INSERT INTO `vehicle_categories` (`id`, `name`, `slug`, `description`) VALUES
(1, 'SUV', 'suv', 'Sport Utility Vehicle tangguh segala medan'),
(2, 'MPV Family', 'mpv', 'Multi-Purpose Vehicle lapang untuk keluarga'),
(3, 'City Car', 'city-car', 'Mobil perkotaan lincah & hemat bensin'),
(4, 'Sedan Premium', 'sedan', 'Sedan mewah eksekutif perjalanan bisnis'),
(5, 'Minivan / Van', 'van', 'Kapasitas maksimal rombongan hingga 14 kursi');

-- Vehicles
INSERT INTO `vehicles` (`id`, `name`, `brand`, `model_type`, `category_id`, `license_plate`, `year`, `transmission`, `passenger_capacity`, `price_per_day`, `fuel_type`, `description`, `image_url`, `status`, `mileage`) VALUES
(1, 'Toyota Fortuner GR Sport', 'Toyota', '2.8 VRZ GR-S 4x4', 1, 'B 1982 EAZ', 2024, 'automatic', 7, 850000.00, 'diesel', 'SUV bertenaga 2.800cc turbo diesel interior kulit.', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000', 'available', 18450),
(2, 'Mitsubishi Pajero Sport', 'Mitsubishi', 'Dakar Ultimate 4x2 AT', 1, 'B 2341 DRS', 2023, 'automatic', 7, 800000.00, 'diesel', 'Mesin MIVEC Turbo bertenaga sunroof Rockford Fosgate.', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1000', 'available', 24300),
(3, 'Toyota Innova Zenix Hybrid', 'Toyota', '2.0 V HV Modelista', 2, 'B 1567 KZN', 2024, 'automatic', 7, 700000.00, 'hybrid', 'MPV hybrid senyap konsumsi BBM 20 km/liter.', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1000', 'available', 12100),
(4, 'Honda CR-V Turbo', 'Honda', '1.5 Turbo Prestige', 1, 'B 8899 CRV', 2023, 'automatic', 7, 750000.00, 'bensin', 'Medium SUV bertenaga 190 PS Honda SENSING.', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1000', 'available', 31200),
(5, 'Honda Brio RS Urbanite', 'Honda', '1.2 RS CVT', 3, 'B 2209 BRI', 2023, 'automatic', 5, 350000.00, 'bensin', 'City car lincah irit perkotaan.', 'https://images.unsplash.com/photo-1590362891988-f778047831d0?auto=format&fit=crop&q=80&w=1000', 'available', 28900),
(6, 'Toyota Camry 2.5 V', 'Toyota', '2.5 V A/T VIP', 4, 'B 1 VIP', 2023, 'automatic', 5, 1200000.00, 'bensin', 'Sedan mewah standar eksekutif kedutaan.', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=1000', 'available', 16000);

-- Additional Services
INSERT INTO `additional_services` (`name`, `code`, `price_per_day`, `description`) VALUES
('Jasa Driver Profesional', 'SRV-DRIVER', 150000.00, 'Pengemudi berpengalaman & ramah 12 jam kerja'),
('Asuransi Comprehensive All-Risk', 'SRV-INSURANCE', 50000.00, 'Bebas biaya klaim risiko kerusakan insidental'),
('Child Car Seat Balita', 'SRV-CHILDSEAT', 35000.00, 'Kursi khusus keselamatan anak balita');

