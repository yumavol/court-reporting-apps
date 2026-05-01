import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import prisma from '../src/lib/prisma';
import { LOCATION_OPTIONS } from '../src/models/locations';

const reporters = [
  { name: 'Alice Johnson', location: LOCATION_OPTIONS[0], available: true },
  { name: 'Bob Martinez', location: LOCATION_OPTIONS[1], available: true },
  { name: 'Carol White', location: LOCATION_OPTIONS[2], available: false },
  { name: 'James Nguyen', location: LOCATION_OPTIONS[3], available: true },
  { name: 'Sofia Patel', location: LOCATION_OPTIONS[4], available: false },
  { name: 'Marcus Thompson', location: LOCATION_OPTIONS[5], available: true },
  { name: 'Linda Park', location: LOCATION_OPTIONS[6], available: true },
  { name: 'Derek Okafor', location: LOCATION_OPTIONS[7], available: false },
  { name: 'Rachel Kim', location: LOCATION_OPTIONS[8], available: true },
  { name: 'Tom Vasquez', location: LOCATION_OPTIONS[9], available: true },
];

const editors = [
  { name: 'David Lee' },
  { name: 'Eva Chen' },
  { name: 'Frank Brown' },
  { name: 'Grace Obi' },
  { name: 'Henry Mills' },
  { name: 'Isla Torres' },
];

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
