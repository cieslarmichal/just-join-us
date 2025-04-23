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

const skills = [
  {
    name: 'JavaScript',
    slug: 'javascript',
  },
  {
    name: 'TypeScript',
    slug: 'typescript',
  },
  {
    name: 'React',
    slug: 'react',
  },
  {
    name: 'Node',
    slug: 'node',
  },
  {
    name: 'Angular',
    slug: 'angular',
  },
  {
    name: 'Vue',
    slug: 'vue',
  },
  {
    name: 'HTML',
    slug: 'html',
  },
  {
    name: 'CSS',
    slug: 'css',
  },
  {
    name: 'PHP',
    slug: 'php',
  },
  {
    name: 'Java',
    slug: 'java',
  },
  {
    name: 'Python',
    slug: 'python',
  },
  {
    name: 'Ruby',
    slug: 'ruby',
  },
  {
    name: 'C#',
    slug: 'c-sharp',
  },
  {
    name: 'C++',
    slug: 'c-plus-plus',
  },
  {
    name: 'C',
    slug: 'c',
  },
  {
    name: 'Go',
    slug: 'go',
  },
  {
    name: 'Swift',
    slug: 'swift',
  },
  {
    name: 'Kotlin',
    slug: 'kotlin',
  },
  {
    name: 'Rust',
    slug: 'rust',
  },
  {
    name: 'Scala',
    slug: 'scala',
  },
  {
    name: 'Dart',
    slug: 'dart',
  },
  {
    name: 'Elixir',
    slug: 'elixir',
  },
  {
    name: 'Haskell',
    slug: 'haskell',
  },
  {
    name: 'SQL',
    slug: 'sql',
  },
  {
    name: 'NoSQL',
    slug: 'nosql',
  },
  {
    name: 'MongoDB',
    slug: 'mongodb',
  },
  {
    name: 'RabbitMQ',
    slug: 'rabbitmq',
  },
  {
    name: 'Kafka',
    slug: 'kafka',
  },
  {
    name: 'PostgreSQL',
    slug: 'postgresql',
  },
  {
    name: 'MySQL',
    slug: 'mysql',
  },
  {
    name: 'Redis',
    slug: 'redis',
  },
  {
    name: 'Elasticsearch',
    slug: 'elasticsearch',
  },
  {
    name: 'Docker',
    slug: 'docker',
  },
  {
    name: 'Kubernetes',
    slug: 'kubernetes',
  },
  {
    name: 'AWS',
    slug: 'aws',
  },
  {
    name: 'Azure',
    slug: 'azure',
  },
  {
    name: 'GCP',
    slug: 'gcp',
  },
  {
    name: 'DevOps',
    slug: 'devops',
  },
  {
    name: 'CI/CD',
    slug: 'ci-cd',
  },
  {
    name: 'Agile',
    slug: 'agile',
  },
  {
    name: 'Scrum',
    slug: 'scrum',
  },
  {
    name: 'Kanban',
    slug: 'kanban',
  },
  {
    name: 'REST API',
    slug: 'rest-api',
  },
  {
    name: 'GraphQL',
    slug: 'graphql',
  },
  {
    name: 'Microservices',
    slug: 'microservices',
  },
  {
    name: 'Serverless',
    slug: 'serverless',
  },
  {
    name: 'Blockchain',
    slug: 'blockchain',
  },
  {
    name: 'Machine Learning',
    slug: 'machine-learning',
  },
  {
    name: 'Django',
    slug: 'django',
  },
  {
    name: 'Flask',
    slug: 'flask',
  },
  {
    name: 'Spring',
    slug: 'spring',
  },
  {
    name: 'Laravel',
    slug: 'laravel',
  },
  {
    name: 'Symfony',
    slug: 'symfony',
  },
  {
    name: 'Ruby on Rails',
    slug: 'ruby-on-rails',
  },
  {
    name: 'Express',
    slug: 'express',
  },
  {
    name: 'FastAPI',
    slug: 'fastapi',
  },
  {
    name: 'NestJS',
    slug: 'nestjs',
  },
  {
    name: 'Next.js',
    slug: 'next-js',
  },
  {
    name: 'Tailwind CSS',
    slug: 'tailwind-css',
  },
  {
    name: 'Bootstrap',
    slug: 'bootstrap',
  },
];

const skillsTable = 'skills';

async function insertSkills(): Promise<void> {
  await databaseClient(skillsTable).insert(
    skills.map((category) => ({
      id: uuid(),
      name: category.name,
      slug: category.slug,
    })),
  );

  console.log('All skills have been saved successfully.');
}

try {
  await insertSkills();
} catch (error) {
  console.error('Error inserting skills:', error);
} finally {
  await databaseClient.destroy();
}
