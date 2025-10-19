const {
    PORT, JWT_KEY, JWT_EXPIRES_IN,
    POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PGDATA,
} = process.env;

module.exports = {
    apps: [
        {
            name: 'backend',
            script: 'dist/main.js',
            autorestart: true,
            env: {
                NODE_ENV: 'production',
                PORT: PORT || 3000,
                JWT_KEY: JWT_KEY,
                JWT_EXPIRES_IN: JWT_EXPIRES_IN,
                POSTGRES_DB: POSTGRES_DB,
                POSTGRES_HOST: POSTGRES_HOST,
                POSTGRES_PORT: POSTGRES_PORT,
                POSTGRES_USER: POSTGRES_USER,
                POSTGRES_PASSWORD: POSTGRES_PASSWORD,
                POSTGRES_PGDATA: POSTGRES_PGDATA,
            },
        },
    ],
};
