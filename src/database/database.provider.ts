import { Sequelize } from 'sequelize-typescript';
import { VideoEditStore } from 'src/modules/video_operations/entities/video_edit_store.entity';
import { VideoStore } from 'src/modules/video_operations/entities/video_store.entity';
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

      sequelize.addModels([VideoEditStore,VideoStore]);

      await sequelize.sync({ alter: true }).catch((err) => console.error('Database sync error:', err));

      return sequelize;
    },
  },
];
