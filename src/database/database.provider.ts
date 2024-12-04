import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './database.config';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      let config: any;

      switch (process.env.NODE_ENV) {
        case 'local':
          config = databaseConfig.local;
          break;
        default:
          config = databaseConfig.local; 
      }

      const sequelize = new Sequelize(config);

      sequelize.addModels([]);

      await sequelize.sync({ alter: true }).catch((err) => console.error('Database sync error:', err));

      return sequelize;
    },
  },
];
