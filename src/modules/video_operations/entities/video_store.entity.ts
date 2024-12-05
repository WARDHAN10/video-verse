import { AllowNull, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'video_store' })
export class VideoStore extends Model<VideoStore> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  filePath: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    allowNull: false, // Size in bytes
  })
  size: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    allowNull: false, // Duration in seconds
  })
  duration: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expiryTime: Date | null;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  created_by: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  updated_by: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updated_at: Date;
}
