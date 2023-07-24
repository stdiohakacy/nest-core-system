import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BaseDTO } from '../dto/base.dto';
import { Constructor } from 'src/type';

export interface IBaseEntity<DTO extends BaseDTO, O = never> {
    id: string;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    deletedBy?: string;

    toDTO(options?: O): DTO;
}

export abstract class BaseEntity<DTO extends BaseDTO = BaseDTO, O = never>
    implements IBaseEntity<DTO, O>
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

    private dtoClass?: Constructor<DTO, [BaseEntity, O?]>;

    toDTO(options?: O): DTO {
        const dtoClass = this.dtoClass;

        if (!dtoClass) {
            throw new Error(
                `You need to use @UseDto on class (${this.constructor.name}) be able to call toDTO function`
            );
        }

        return new dtoClass(this, options);
    }
}
