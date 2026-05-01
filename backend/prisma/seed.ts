import prisma from '../src/lib/prisma';
import { LOCATION_OPTIONS } from '../src/models/locations';

const reporters = [
  { name: 'Alice Johnson', location: LOCATION_OPTIONS[0], available: true },
  { name: 'Budi Santoso', location: LOCATION_OPTIONS[0], available: false },
  { name: 'Bob Martinez', location: LOCATION_OPTIONS[1], available: true },
  { name: 'Sari Dewi', location: LOCATION_OPTIONS[1], available: true },
  { name: 'Carol White', location: LOCATION_OPTIONS[2], available: false },
  { name: 'Agus Prasetyo', location: LOCATION_OPTIONS[2], available: true },
  { name: 'James Nguyen', location: LOCATION_OPTIONS[3], available: true },
  { name: 'Rina Kusuma', location: LOCATION_OPTIONS[3], available: false },
  { name: 'Sofia Patel', location: LOCATION_OPTIONS[4], available: false },
  { name: 'Wahyu Hidayat', location: LOCATION_OPTIONS[4], available: true },
  { name: 'Marcus Thompson', location: LOCATION_OPTIONS[5], available: true },
  { name: 'Nurul Fitri', location: LOCATION_OPTIONS[5], available: true },
  { name: 'Linda Park', location: LOCATION_OPTIONS[6], available: true },
  { name: 'Dimas Aditya', location: LOCATION_OPTIONS[6], available: false },
  { name: 'Derek Okafor', location: LOCATION_OPTIONS[7], available: false },
  { name: 'Yanti Rahayu', location: LOCATION_OPTIONS[7], available: true },
  { name: 'Rachel Kim', location: LOCATION_OPTIONS[8], available: true },
  { name: 'Hendra Wijaya', location: LOCATION_OPTIONS[8], available: true },
  { name: 'Tom Vasquez', location: LOCATION_OPTIONS[9], available: true },
  { name: 'Putri Lestari', location: LOCATION_OPTIONS[9], available: false },
];

const editors = [
  { name: 'David Lee' },
  { name: 'Fajar Nugroho' },
  { name: 'Eva Chen' },
  { name: 'Mega Wulandari' },
  { name: 'Frank Brown' },
  { name: 'Rizky Firmansyah' },
  { name: 'Grace Obi' },
  { name: 'Ayu Permatasari' },
  { name: 'Henry Mills' },
  { name: 'Bagas Setiawan' },
  { name: 'Isla Torres' },
  { name: 'Devi Anggraini' },
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
