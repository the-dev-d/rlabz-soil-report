/*
  Warnings:

  - You are about to drop the `Marks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pinCode` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Location` ADD COLUMN `pinCode` VARCHAR(6) NOT NULL;

-- DropTable
DROP TABLE `Marks`;

-- CreateTable
CREATE TABLE `Pin` (
    `COLOR_CODE` VARCHAR(6) NOT NULL,
    `MARK` VARCHAR(30) NOT NULL,
    `PIN` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`COLOR_CODE`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_pinCode_fkey` FOREIGN KEY (`pinCode`) REFERENCES `Pin`(`COLOR_CODE`) ON DELETE RESTRICT ON UPDATE CASCADE;
