// migrations/YYYYMMDDHHMMSS-create-video-edits.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('video_edit_store', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      original_video_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'video_store',
          key: 'id',
        },
      },
      edited_video_path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      operation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      start_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      end_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      updated_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('video_edit_store');
  },
};
