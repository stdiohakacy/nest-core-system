import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export interface IBaseEntity {
    id: string;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    deletedBy?: string;
}

export abstract class BaseEntity implements IBaseEntity
{
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: true })
    updatedAt?: Date;

    @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @Column({ name: 'createdBy', type: 'uuid', nullable: true })
    createdBy?: string;

    @Column({ name: 'updatedBy', type: 'uuid', nullable: true })
    updatedBy?: string;

    @Column({ name: 'deletedBy', type: 'uuid', nullable: true })
    deletedBy?: string;
}
