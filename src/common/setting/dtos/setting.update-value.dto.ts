import { OmitType } from '@nestjs/swagger';
import { SettingCreateDTO } from './setting.create.dto';

export class SettingUpdateValueDTO extends OmitType(SettingCreateDTO, [
    'name',
    'description',
] as const) {}
