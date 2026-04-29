import prisma from '../src/lib/prisma';
import { LOCATION_OPTIONS } from '../src/models/locations';

const reporters = [
  { name: 'Alice Johnson', location: LOCATION_OPTIONS[0] },
  { name: 'Bob Martinez', location: LOCATION_OPTIONS[1] },
  { name: 'Carol White', location: LOCATION_OPTIONS[2] },
];

const editors = [{ name: 'David Lee' }, { name: 'Eva Chen' }, { name: 'Frank Brown' }];

async function main() {
  for (const reporter of reporters) {
    const exists = await prisma.reporter.findFirst({ where: { name: reporter.name } });
    if (!exists) {
      await prisma.reporter.create({ data: reporter });
      console.log(`Created reporter: ${reporter.name}`);
    } else {
      console.log(`Skipped reporter (exists): ${reporter.name}`);
    }
  }

  for (const editor of editors) {
    const exists = await prisma.editor.findFirst({ where: { name: editor.name } });
    if (!exists) {
      await prisma.editor.create({ data: editor });
      console.log(`Created editor: ${editor.name}`);
    } else {
      console.log(`Skipped editor (exists): ${editor.name}`);
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
