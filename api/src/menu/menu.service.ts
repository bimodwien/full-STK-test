import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMenuDto) {
    if (data.parentId === 0) data.parentId = null;
    if (data.parentId) {
      const exists = await this.prisma.menu.findUnique({
        where: { id: data.parentId },
      });
      if (!exists) throw new NotFoundException('Parent menu not found');
    }

    return this.prisma.menu.create({
      data,
      include: { children: true, parent: true },
    });
  }

  async findAll() {
    const menus = await this.prisma.menu.findMany({
      orderBy: { id: 'asc' },
    });

    const buildTree = (parentId: number | null) => {
      return menus
        .filter((m) => m.parentId === parentId)
        .map((m) => ({
          ...m,
          children: buildTree(m.id),
        }));
    };

    return buildTree(null);
  }

  async findOne(id: number) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: { children: true },
    });
    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }

  async update(id: number, data: UpdateMenuDto) {
    return this.prisma.menu.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.prisma.menu.deleteMany({ where: { parentId: id } });
    return this.prisma.menu.delete({ where: { id } });
  }
}
