-- DropForeignKey
ALTER TABLE `tarea` DROP FOREIGN KEY `Tarea_categoriaId_fkey`;

-- AlterTable
ALTER TABLE `tarea` MODIFY `categoriaId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Tarea` ADD CONSTRAINT `Tarea_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
