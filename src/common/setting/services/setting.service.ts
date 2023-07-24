import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperNumberService } from '@common/helper/services/helper.number.service';
import { PaginationListDTO } from '@common/pagination/dtos/pagination.list.dto';
import { ENUM_SETTING_DATA_TYPE } from '@common/setting/constants/setting.enum.constant';
import { SettingCreateDTO } from '@common/setting/dtos/setting.create.dto';
import { SettingUpdateValueDTO } from '@common/setting/dtos/setting.update-value.dto';
import { ISettingService } from '@common/setting/interfaces/setting.service.interface';
import { SettingEntity } from '@modules/setting/entities/setting.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class SettingService implements ISettingService {
    private readonly mobileNumberCountryCodeAllowed: string[];
    private readonly passwordAttempt: boolean;
    private readonly maxPasswordAttempt: number;

    constructor(
        @InjectRepository(SettingEntity)
        private readonly settingRepo: Repository<SettingEntity>,
        private readonly configService: ConfigService,
        private readonly helperNumberService: HelperNumberService
    ) {
        this.mobileNumberCountryCodeAllowed = this.configService.get<string[]>(
            'user.mobileNumberCountryCodeAllowed'
        );
        this.passwordAttempt = this.configService.get<boolean>(
            'auth.password.attempt'
        );
        this.maxPasswordAttempt = this.configService.get<number>(
            'auth.password.maxAttempt'
        );
    }

    async findAll(find?: Record<string, any>): Promise<SettingEntity[]> {
        return this.settingRepo.find(find);
    }

    async findOneById(id: string): Promise<SettingEntity> {
        return this.settingRepo.findOneBy({ id });
    }

    async findOneByName(name: string): Promise<SettingEntity> {
        return this.settingRepo.findOneBy({ name });
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return this.settingRepo.count(find);
    }

    async create({
        name,
        description,
        type,
        value,
    }: SettingCreateDTO): Promise<SettingEntity> {
        const create: SettingEntity = new SettingEntity();
        create.name = name;
        create.description = description ?? undefined;
        create.value = value;
        create.type = type;

        return this.settingRepo.save(create);
    }

    async updateValue(
        setting: SettingEntity,
        { type, value }: SettingUpdateValueDTO
    ): Promise<SettingEntity> {
        setting.type = type;
        setting.value = value;

        return this.settingRepo.save(setting);
    }

    async delete(setting: SettingEntity): Promise<UpdateResult> {
        return this.settingRepo.softDelete(setting.id);
    }

    async getValue<T>(setting: SettingEntity): Promise<T> {
        if (
            setting.type === ENUM_SETTING_DATA_TYPE.BOOLEAN &&
            (setting.value === 'true' || setting.value === 'false')
        ) {
            return (setting.value === 'true') as any;
        } else if (
            setting.type === ENUM_SETTING_DATA_TYPE.NUMBER &&
            this.helperNumberService.check(setting.value)
        ) {
            return this.helperNumberService.create(setting.value) as any;
        } else if (setting.type === ENUM_SETTING_DATA_TYPE.ARRAY_OF_STRING) {
            return setting.value.split(',') as any;
        }

        return setting.value as any;
    }

    async checkValue(
        value: string,
        type: ENUM_SETTING_DATA_TYPE
    ): Promise<boolean> {
        if (
            type === ENUM_SETTING_DATA_TYPE.BOOLEAN &&
            (value === 'true' || value === 'false')
        ) {
            return true;
        } else if (
            type === ENUM_SETTING_DATA_TYPE.NUMBER &&
            this.helperNumberService.check(value)
        ) {
            return true;
        } else if (
            (type === ENUM_SETTING_DATA_TYPE.STRING ||
                type === ENUM_SETTING_DATA_TYPE.ARRAY_OF_STRING) &&
            typeof value === 'string'
        ) {
            return true;
        }

        return false;
    }

    async getMaintenance(): Promise<boolean> {
        const setting: SettingEntity = await this.settingRepo.findOneBy({
            name: 'maintenance',
        });

        return this.getValue<boolean>(setting);
    }

    async getMobileNumberCountryCodeAllowed(): Promise<string[]> {
        return this.mobileNumberCountryCodeAllowed;
    }

    async getPasswordAttempt(): Promise<boolean> {
        return this.passwordAttempt;
    }

    async getMaxPasswordAttempt(): Promise<number> {
        return this.maxPasswordAttempt;
    }

    async deleteMany(find: Record<string, any>) {
        return this.settingRepo.delete(find);
    }

    async findAllAndCount(
        find: Record<string, any>,
        pagination: PaginationListDTO
    ): Promise<[SettingEntity[], number]> {
        const { _limit, _offset, _order } = pagination;
        return await this.settingRepo.findAndCount({
            where: find,
            take: _limit,
            skip: _offset,
            order: _order,
        });
    }
}
