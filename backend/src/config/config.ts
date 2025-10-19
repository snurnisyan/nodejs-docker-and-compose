import { join } from 'path';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [join(__dirname, '/../**/*.entity.{js,ts}')],
    synchronize: true,
  },
  jwt: {
    key: process.env.JWT_KEY || 'jwt_secret',
    expires: process.env.JWT_EXPIRES_IN,
  },
});