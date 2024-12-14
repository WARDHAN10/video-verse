import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { VideoStore } from './video_store.entity';

@Table({ tableName: 'video_edit_store' })
export class VideoEditStore extends Model<VideoEditStore> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => VideoStore)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
     onDelete: 'CASCADE' 
  })
  originalVideoId: number;

  @BelongsTo(() => VideoStore)
  originalVideo: VideoStore;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  editedVideoPath: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  operation: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  startTime: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  endTime: number;

  @Column({
    type: DataType.DATE,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
  })
  updated_at: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  created_by: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  updated_by: string;
}
