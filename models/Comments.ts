import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Posts } from './Posts';

@Table({
    tableName: 'Comments',
    timestamps: true,
})
export class Comments extends Model {
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
    declare deletedAt: Date;
    
    @ForeignKey(() => Posts)
    @Column({
        type: DataType.UUIDV4,
        allowNull: true
    })
    postId!: string;

    @BelongsTo(() => Posts, 'postId')
    post!: Posts;
}