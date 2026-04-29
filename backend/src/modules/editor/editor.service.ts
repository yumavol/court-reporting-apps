import prisma from '@/lib/prisma';

export class EditorService {
  async findAll() {
    return prisma.editor.findMany();
  }
}
