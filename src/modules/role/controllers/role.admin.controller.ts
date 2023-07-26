import { ApiTags } from '@nestjs/swagger';
import { RoleEntity } from '../entities/role.entity';
import {
    Body,
    ConflictException,
    Controller,
    Get,
    Patch,
    Post,
    Put,
} from '@nestjs/common';
import { PaginationService } from '../../../common/pagination/services/pagination.service';
import { RoleService } from '../services/role.service';
import { UserService } from '../../../modules/user/services/user.service';
import {
    RoleAdminActiveDoc,
    RoleAdminCreateDoc,
    RoleAdminGetDoc,
    RoleAdminInactiveDoc,
    RoleAdminListDoc,
    RoleAdminUpdateDoc,
} from '../docs/role.admin.doc';
import {
    Response,
    ResponsePaging,
} from '../../../common/response/decorators/response.decorator';
import { RoleListSerialization } from '../serializations/role.list.serialization';
import { AuthJwtAdminAccessProtected } from '../../../common/auth/decorators/auth.jwt.decorator';
import {
    PaginationQuery,
    PaginationQueryFilterInBoolean,
    PaginationQueryFilterInEnum,
} from '../../../common/pagination/decorators/pagination.decorator';
import {
    ROLE_DEFAULT_AVAILABLE_ORDER_BY,
    ROLE_DEFAULT_AVAILABLE_SEARCH,
    ROLE_DEFAULT_IS_ACTIVE,
    ROLE_DEFAULT_ORDER_BY,
    ROLE_DEFAULT_ORDER_DIRECTION,
    ROLE_DEFAULT_PER_PAGE,
    ROLE_DEFAULT_TYPE,
} from '../constants/role.list.constant';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { ENUM_ROLE_TYPE } from '../constants/role.enum.constant';
import {
    IResponse,
    IResponsePaging,
} from '../../../common/response/interfaces/response.interface';
import { RoleGetSerialization } from '../serializations/role.get.serialization';
import {
    RoleAdminGetGuard,
    RoleAdminUpdateActiveGuard,
    RoleAdminUpdateGuard,
    RoleAdminUpdateInactiveGuard,
} from '../decorators/role.admin.decorator';
import { PolicyAbilityProtected } from '../../../common/policy/decorators/policy.decorator';
import { RequestParamGuard } from '../../../common/request/decorators/request.decorator';
import { RoleRequestDTO } from '../dtos/role.request.dto';
import { GetRole } from '../decorators/role.decorator';
import { ResponseIdSerialization } from '../../../common/response/serializations/response.id.serialization';
import { RoleCreateDTO } from '../dtos/role.create.dto';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../constants/role.status-code.constant';
import { RoleUpdateDTO } from '../dtos/role.update.dto';

@ApiTags('modules.admin.role')
@Controller({ version: '1', path: '/role' })
export class RoleAdminController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly roleService: RoleService,
        private readonly userService: UserService
    ) {}

    @RoleAdminListDoc()
    @ResponsePaging('role.list', { serialization: RoleListSerialization })
    // @PolicyAbilityProtected({
    //     subject: ENUM_POLICY_SUBJECT.ROLE,
    //     action: [ENUM_POLICY_ACTION.READ],
    // })
    @AuthJwtAdminAccessProtected()
    @Get('/list')
    async list(
        @PaginationQuery(
            ROLE_DEFAULT_PER_PAGE,
            ROLE_DEFAULT_ORDER_BY,
            ROLE_DEFAULT_ORDER_DIRECTION,
            ROLE_DEFAULT_AVAILABLE_SEARCH,
            ROLE_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDTO,
        @PaginationQueryFilterInBoolean('isActive', ROLE_DEFAULT_IS_ACTIVE)
        isActive: Record<string, any>,
        @PaginationQueryFilterInEnum('type', ROLE_DEFAULT_TYPE, ENUM_ROLE_TYPE)
        type: Record<string, any>
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
            ...isActive,
            ...type,
        };

        const pagination = {
            _limit,
            _offset,
            _order,
        } as PaginationListDTO;

        const [apiKeys, total] = await this.roleService.findAllAndCount(
            find,
            pagination
        );
        const totalPage = this.paginationService.totalPage(total, _limit);

        return {
            _pagination: { totalPage, total },
            data: apiKeys,
        };
    }

    @RoleAdminGetDoc()
    @Response('role.get', { serialization: RoleGetSerialization })
    @RoleAdminGetGuard()
    // @PolicyAbilityProtected({
    //     subject: ENUM_POLICY_SUBJECT.ROLE,
    //     action: [ENUM_POLICY_ACTION.READ],
    // })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(RoleRequestDTO)
    @Get('get/:role')
    async get(@GetRole(true) role: RoleEntity): Promise<IResponse> {
        return { data: role };
    }

    @RoleAdminCreateDoc()
    @Response('role.create', { serialization: ResponseIdSerialization })
    // @PolicyAbilityProtected({
    //     subject: ENUM_POLICY_SUBJECT.ROLE,
    //     action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
    // })
    @AuthJwtAdminAccessProtected()
    @Post('/create')
    async create(
        @Body()
        { name, type }: RoleCreateDTO
    ): Promise<IResponse> {
        const exist: boolean = await this.roleService.existByName(name);
        if (exist) {
            throw new ConflictException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR,
                message: 'role.error.exist',
            });
        }

        const create = await this.roleService.create({
            name,
            type,
        });

        return {
            data: { id: create.id },
        };
    }

    @RoleAdminUpdateDoc()
    @Response('role.update', {
        serialization: ResponseIdSerialization,
    })
    @RoleAdminUpdateGuard()
    // @PolicyAbilityProtected({
    //     subject: ENUM_POLICY_SUBJECT.ROLE,
    //     action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    // })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(RoleRequestDTO)
    @Put('/update/:role')
    async update(
        @GetRole() role: RoleEntity,
        @Body()
        { description }: RoleUpdateDTO
    ): Promise<IResponse> {
        await this.roleService.update(role, { description });

        return {
            data: { _id: role.id },
        };
    }

    // @RoleAdminUpdateDoc()
    // @Response('role.updatePermission', {
    //     serialization: ResponseIdSerialization,
    // })
    // @RoleAdminUpdateGuard()
    // @PolicyAbilityProtected({
    //     subject: ENUM_POLICY_SUBJECT.ROLE,
    //     action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    // })
    // @AuthJwtAdminAccessProtected()
    // @RequestParamGuard(RoleRequestDTO)
    // @Put('/update/:role/permission')
    // async updatePermission(
    //     @GetRole() role: RoleDoc,
    //     @Body()
    //     { permissions, type }: RoleUpdatePermissionDTO
    // ): Promise<IResponse> {
    //     await this.roleService.updatePermissions(role, {
    //         permissions,
    //         type,
    //     });

    //     return {
    //         data: { _id: role._id },
    //     };
    // }

    // @RoleAdminDeleteDoc()
    // @Response('role.delete')
    // @RoleAdminDeleteGuard()
    // @PolicyAbilityProtected({
    //     subject: ENUM_POLICY_SUBJECT.ROLE,
    //     action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.DELETE],
    // })
    // @AuthJwtAdminAccessProtected()
    // @RequestParamGuard(RoleRequestDTO)
    // @Delete('/delete/:role')
    // async delete(@GetRole() role: RoleEntity): Promise<void> {
    //     const used: RoleEntity = await this.userService.findOne({
    //         id: role.id,
    //     });
    //     if (used) {
    //         throw new ConflictException({
    //             statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_USED_ERROR,
    //             message: 'role.error.used',
    //         });
    //     }

    //     await this.roleService.delete(role);

    //     return;
    // }

    @RoleAdminInactiveDoc()
    @Response('role.inactive')
    @RoleAdminUpdateInactiveGuard()
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(RoleRequestDTO)
    @Patch('/update/:role/inactive')
    async inactive(@GetRole() role: RoleEntity): Promise<void> {
        await this.roleService.inactive(role);
    }

    @RoleAdminActiveDoc()
    @Response('role.active')
    @RoleAdminUpdateActiveGuard()
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(RoleRequestDTO)
    @Patch('/update/:role/active')
    async active(@GetRole() role: RoleEntity): Promise<void> {
        await this.roleService.active(role);
    }
}
