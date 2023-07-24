import { Constructor } from 'src/type';
import { BaseDTO } from '../base/dto/base.dto';
import { BaseEntity } from '../base/entity/base.entity';

export function UseDTO(
    dtoClass: Constructor<BaseDTO, [BaseEntity, unknown]>
): ClassDecorator {
    return (ctor) => {
        ctor.prototype.dtoClass = dtoClass;
    };
}
