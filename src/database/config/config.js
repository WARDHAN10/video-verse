module.exports = {
    development: {
        dialect: process.env.DB_DIALECT,
        storage: process.env.DB_STORAGE_PATH,
        logging: false,
    },
};
