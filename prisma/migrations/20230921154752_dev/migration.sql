/*
  Warnings:

  - You are about to drop the column `pinCode` on the `Location` table. All the data in the column will be lost.
  - Added the required column `PINID` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Location` DROP FOREIGN KEY `Location_pinCode_fkey`;

-- AlterTable
ALTER TABLE `Location` DROP COLUMN `pinCode`,
    ADD COLUMN `PINID` VARCHAR(6) NOT NULL;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_PINID_fkey` FOREIGN KEY (`PINID`) REFERENCES `Pin`(`COLOR_CODE`) ON DELETE RESTRICT ON UPDATE CASCADE;
