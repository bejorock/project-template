const { entities } = require("./dist");

module.exports = [
  {
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "root",
    password: "password",
    database: "alwildan",
    entities: entities,
    migrations: ["migration/*.js"],
    cli: {
      migrationsDir: "migration",
    },
    synchronize: false,
  },
];
