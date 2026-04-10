import { Table, Column, Model, DataType, PrimaryKey, HasMany } from 'sequelize-typescript';
import { Comments } from './Comments';

@Table({
    tableName: 'Posts',
    timestamps: true,
})
export class Posts extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    username!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    content!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare updatedAt: Date; 
    
    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare deleteAt: Date;

    @HasMany(() => Comments)
    comments!: Comments[];
}