const knexConfig = {
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'test',
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  },
};

export default knexConfig;