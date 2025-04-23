import knex from 'knex';
import { v7 as uuid } from 'uuid';

const databaseClient = knex({
  client: 'pg',
  connection: {
    host: process.env['DATABASE_HOST'] as string,
    port: 5432,
    user: process.env['DATABASE_USERNAME'] as string,
    password: process.env['DATABASE_PASSWORD'] as string,
    database: process.env['DATABASE_NAME'] as string,
  },
  pool: {
    min: 1,
    max: 10,
  },
  useNullAsDefault: true,
});

const categories = [
  {
    name: 'AI/ML',
    slug: 'ai-ml',
  },
  {
    name: 'JS',
    slug: 'js',
  },
  {
    name: 'HTML',
    slug: 'html',
  },
  {
    name: 'PHP',
    slug: 'php',
  },
  {
    name: 'Ruby',
    slug: 'ruby',
  },
  {
    name: 'Python',
    slug: 'python',
  },
  {
    name: 'Java',
    slug: 'java',
  },
  {
    name: '.Net',
    slug: 'net',
  },
  {
    name: 'Scala',
    slug: 'scala',
  },
  {
    name: 'C',
    slug: 'c',
  },
  {
    name: 'Mobile',
    slug: 'mobile',
  },
  {
    name: 'Testing',
    slug: 'testing',
  },
  {
    name: 'DevOps',
    slug: 'devops',
  },
  {
    name: 'Admin',
    slug: 'admin',
  },
  {
    name: 'UX/UI',
    slug: 'ux-ui',
  },
  {
    name: 'PM',
    slug: 'pm',
  },
  {
    name: 'Game',
    slug: 'game',
  },
  {
    name: 'Analytics',
    slug: 'analytics',
  },
  {
    name: 'Data',
    slug: 'data',
  },
  {
    name: 'Security',
    slug: 'security',
  },
  {
    name: 'Go',
    slug: 'go',
  },
  {
    name: 'Support',
    slug: 'support',
  },
  {
    name: 'ERP',
    slug: 'erp',
  },
  {
    name: 'Architecture',
    slug: 'architecture',
  },
  {
    name: 'Other',
    slug: 'other',
  },
];

const categoriesTable = 'categories';

async function insertCategories(): Promise<void> {
  await databaseClient(categoriesTable).insert(
    categories.map((category) => ({
      id: uuid(),
      name: category.name,
      slug: category.slug,
    })),
  );

  console.log('All categories have been saved successfully.');
}

try {
  await insertCategories();
} catch (error) {
  console.error('Error inserting categories:', error);
} finally {
  await databaseClient.destroy();
}
