import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_EMAIL = 'admin';
const DEMO_PASSWORD = 'admin';

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    create: {
      email: DEMO_EMAIL,
      login: 'admin',
      passwordHash,
    },
    update: {
      login: 'admin',
      passwordHash,
    },
  });

  await prisma.task.deleteMany({
    where: {
      todolist: {
        userId: user.id,
      },
    },
  });

  await prisma.todolist.deleteMany({
    where: { userId: user.id },
  });

  const workList = await prisma.todolist.create({
    data: {
      title: 'Work',
      order: 0,
      userId: user.id,
    },
  });

  const personalList = await prisma.todolist.create({
    data: {
      title: 'Personal',
      order: 1,
      userId: user.id,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Prepare sprint plan',
        description: 'Review backlog and estimate tasks',
        status: 0,
        priority: 2,
        order: 0,
        todoListId: workList.id,
      },
      {
        title: 'Finish API integration',
        description: 'Connect frontend to local backend',
        status: 1,
        priority: 3,
        order: 1,
        todoListId: workList.id,
      },
      {
        title: 'Buy groceries',
        description: null,
        status: 0,
        priority: 0,
        order: 0,
        todoListId: personalList.id,
      },
      {
        title: 'Read 20 pages',
        description: null,
        status: 2,
        priority: 1,
        order: 1,
        todoListId: personalList.id,
      },
    ],
  });

  console.log('Seed complete');
  console.log(`Demo credentials: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
