module.exports = {
  type: 'postgres',
  url: process.env.TYPEORM_DATABASE,
  ssl: false,
  entities: [
    process.env.TYPEORM_ENTITIES
  ],
  migrations: [
    process.env.TYPEORM_MIGRATIONS
  ],
  cli: {
    migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
  },
};
