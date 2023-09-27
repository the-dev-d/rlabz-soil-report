/*
  Warnings:

  - A unique constraint covering the columns `[PLACE_NAME]` on the table `Place` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Place_PLACE_NAME_key` ON `Place`(`PLACE_NAME`);
