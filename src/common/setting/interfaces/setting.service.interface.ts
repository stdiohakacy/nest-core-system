import { SettingEntity } from '../../../modules/setting/entities/setting.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SettingCreateDTO } from '../dtos/setting.create.dto';
import { SettingUpdateValueDTO } from '../dtos/setting.update-value.dto';
import { ENUM_SETTING_DATA_TYPE } from '../constants/setting.enum.constant';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';

export interface ISettingService {
    findAll(find?: Record<string, any>): Promise<SettingEntity[]>;
    findOneById(id: string): Promise<SettingEntity>;
    findOneByName(name: string): Promise<SettingEntity>;
    getTotal(find?: Record<string, any>): Promise<number>;
    create({
        name,
        description,
        type,
        value,
    }: SettingCreateDTO): Promise<SettingEntity>;
    updateValue(
        setting: SettingEntity,
        { type, value }: SettingUpdateValueDTO
    ): Promise<SettingEntity>;
    delete(setting: SettingEntity): Promise<UpdateResult>;
    getValue<T>(setting: SettingEntity): Promise<T>;
    checkValue(value: string, type: ENUM_SETTING_DATA_TYPE): Promise<boolean>;
    getMaintenance(): Promise<boolean>;
    getMobileNumberCountryCodeAllowed(): Promise<string[]>;
    getPasswordAttempt(): Promise<boolean>;
    getMaxPasswordAttempt(): Promise<number>;
    deleteMany(find: Record<string, any>): Promise<DeleteResult>;
    findAllAndCount(
        find: Record<string, any>,
        pagination: PaginationListDTO
    ): Promise<[SettingEntity[], number]>;
}
