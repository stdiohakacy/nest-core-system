import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { instanceToPlain } from 'class-transformer';
import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Put,
    UploadedFile,
} from '@nestjs/common';
import { AuthService } from '../../../common/auth/services/auth.service';
import { PaginationService } from '../../../common/pagination/services/pagination.service';
import { UserService } from '../services/user.service';
import { RoleService } from '../../../modules/role/services/role.service';
import {
    UserAdminActiveDoc,
    UserAdminBlockedDoc,
    UserAdminCreateDoc,
    UserAdminDeleteDoc,
    UserAdminExportDoc,
    UserAdminGetDoc,
    UserAdminImportDoc,
    UserAdminInactiveDoc,
    UserAdminListDoc,
    UserAdminUpdateDoc,
} from '../docs/user.admin.doc';
import {
    Response,
    ResponseFile,
    ResponsePaging,
} from '../../../common/response/decorators/response.decorator';
import { UserListSerialization } from '../serializations/user.list.serialization';
import { PolicyAbilityProtected } from '../../../common/policy/decorators/policy.decorator';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_SUBJECT,
} from '../../../common/policy/constants/policy.enum.constant';
import { AuthJwtAdminAccessProtected } from '../../../common/auth/decorators/auth.jwt.decorator';
import {
    PaginationQuery,
    PaginationQueryFilterEqualObjectId,
    PaginationQueryFilterInBoolean,
} from '../../../common/pagination/decorators/pagination.decorator';
import {
    USER_DEFAULT_AVAILABLE_ORDER_BY,
    USER_DEFAULT_AVAILABLE_SEARCH,
    USER_DEFAULT_BLOCKED,
    USER_DEFAULT_INACTIVE_PERMANENT,
    USER_DEFAULT_IS_ACTIVE,
    USER_DEFAULT_ORDER_BY,
    USER_DEFAULT_ORDER_DIRECTION,
    USER_DEFAULT_PER_PAGE,
} from '../constants/user.list.constant';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import {
    IResponse,
    IResponsePaging,
} from '../../../common/response/interfaces/response.interface';
import { UserGetSerialization } from '../serializations/user.get.serialization';
import {
    UserAdminDeleteGuard,
    UserAdminGetGuard,
    UserAdminUpdateActiveGuard,
    UserAdminUpdateBlockedGuard,
    UserAdminUpdateGuard,
    UserAdminUpdateInactiveGuard,
} from '../decorators/user.admin.decorator';
import { RequestParamGuard } from '../../../common/request/decorators/request.decorator';
import { UserRequestDTO } from '../dtos/user.request.dto';
import { GetUser } from '../decorators/user.decorator';
import { ResponseIdSerialization } from '../../../common/response/serializations/response.id.serialization';
import { UserCreateDTO } from '../dtos/user.create.dto';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code.constant';
import { IAuthPassword } from '../../../common/auth/interfaces/auth.interface';
import { ENUM_USER_SIGN_UP_FROM } from '../constants/user.enum.constant';
import { UserUpdateNameDTO } from '../dtos/user.update-name.dto';
import { UploadFileSingle } from '../../../common/file/decorators/file.decorator';
import { FileRequiredPipe } from '../../../common/file/pipes/file.required.pipe';
import { FileSizeExcelPipe } from '../../../common/file/pipes/file.size.pipe';
import { FileTypeExcelPipe } from '../../../common/file/pipes/file.type.pipe';
import { FileExtractPipe } from '../../../common/file/pipes/file.extract.pipe';
import { FileValidationPipe } from '../../../common/file/pipes/file.validation.pipe';
import { UserImportDTO } from '../dtos/user.import.dto';
import { IFileExtract } from '../../../common/file/interfaces/file.interface';
import { ENUM_HELPER_FILE_TYPE } from '../../../common/helper/constants/helper.enum.constant';

@ApiTags('modules.admin.user')
@Controller({ version: '1', path: '/user' })
export class UserAdminController {
    constructor(
        private readonly authService: AuthService,
        private readonly paginationService: PaginationService,
        private readonly userService: UserService,
        private readonly roleService: RoleService
    ) {}

    @UserAdminListDoc()
    @ResponsePaging('user.list', {
        serialization: UserListSerialization,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @AuthJwtAdminAccessProtected()
    @Get('/list')
    async list(
        @PaginationQuery(
            USER_DEFAULT_PER_PAGE,
            USER_DEFAULT_ORDER_BY,
            USER_DEFAULT_ORDER_DIRECTION,
            USER_DEFAULT_AVAILABLE_SEARCH,
            USER_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDTO,
        @PaginationQueryFilterInBoolean('isActive', USER_DEFAULT_IS_ACTIVE)
        isActive: Record<string, any>,
        @PaginationQueryFilterInBoolean('blocked', USER_DEFAULT_BLOCKED)
        blocked: Record<string, any>,
        @PaginationQueryFilterInBoolean(
            'inactivePermanent',
            USER_DEFAULT_INACTIVE_PERMANENT
        )
        inactivePermanent: Record<string, any>,
        @PaginationQueryFilterEqualObjectId('role')
        role: Record<string, any>
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
            ...isActive,
            ...blocked,
            ...inactivePermanent,
            ...role,
        };

        const pagination = {
            _limit,
            _offset,
            _order,
        } as PaginationListDTO;

        const [users, total] = await this.userService.findAllAndCount(
            find,
            pagination
        );
        const totalPage = this.paginationService.totalPage(total, _limit);

        return {
            _pagination: { total, totalPage },
            data: users,
        };
    }

    @UserAdminGetDoc()
    @Response('user.get', { serialization: UserGetSerialization })
    @UserAdminGetGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDTO)
    @Get('/get/:user')
    async get(@GetUser() user: UserEntity): Promise<IResponse> {
        const userEntity = await this.userService.findOneById(user.id);
        return instanceToPlain({ data: userEntity });
    }

    @UserAdminCreateDoc()
    @Response('user.create', {
        serialization: ResponseIdSerialization,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
    })
    @AuthJwtAdminAccessProtected()
    @Post('/create')
    async create(
        @Body()
        { email, mobileNumber, ...body }: UserCreateDTO
    ): Promise<IResponse> {
        const promises: Promise<any>[] = [
            // this.roleService.findOneById(role),
            this.userService.existByEmail(email),
        ];

        if (mobileNumber) {
            promises.push(this.userService.existByMobileNumber(mobileNumber));
        }

        const [emailExist, mobileNumberExist] = await Promise.all(promises);

        // if (!checkRole) {
        //     throw new NotFoundException({
        //         statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
        //         message: 'role.error.notFound',
        //     });
        // } else
        if (emailExist) {
            throw new ConflictException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
                message: 'user.error.emailExist',
            });
        } else if (mobileNumberExist) {
            throw new ConflictException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
                message: 'user.error.mobileNumberExist',
            });
        }

        const password: IAuthPassword = await this.authService.createPassword(
            body.password
        );

        const userCreated = await this.userService.create(
            {
                email,
                mobileNumber,
                signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
                ...body,
            },
            password
        );

        return {
            data: { id: userCreated },
        };
    }

    @UserAdminUpdateDoc()
    @Response('user.update', {
        serialization: ResponseIdSerialization,
    })
    @UserAdminUpdateGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDTO)
    @Put('/update/:user')
    async update(
        @GetUser() user: UserEntity,
        @Body()
        body: UserUpdateNameDTO
    ): Promise<IResponse> {
        await this.userService.updateName(user, body);

        return {
            data: { id: user.id },
        };
    }

    @UserAdminInactiveDoc()
    @Response('user.inactive')
    @UserAdminUpdateInactiveGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDTO)
    @Patch('/update/:user/inactive')
    async inactive(@GetUser() user: UserEntity): Promise<void> {
        await this.userService.inactive(user);
    }

    @UserAdminActiveDoc()
    @Response('user.active')
    @UserAdminUpdateActiveGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDTO)
    @Patch('/update/:user/active')
    async active(@GetUser() user: UserEntity): Promise<void> {
        await this.userService.active(user);
    }

    @UserAdminBlockedDoc()
    @Response('user.blocked')
    @UserAdminUpdateBlockedGuard()
    // @PolicyAbilityProtected({
    //     subject: ENUM_POLICY_SUBJECT.USER,
    //     action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    // })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDTO)
    @Patch('/update/:user/blocked')
    async blocked(@GetUser() user: UserEntity): Promise<void> {
        await this.userService.blocked(user);
    }

    @UserAdminDeleteDoc()
    @Response('user.delete')
    @UserAdminDeleteGuard()
    // @PolicyAbilityProtected({
    //     subject: ENUM_POLICY_SUBJECT.USER,
    //     action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.DELETE],
    // })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDTO)
    @Delete('/delete/:user')
    async delete(@GetUser() user: UserEntity): Promise<void> {
        await this.userService.delete(user.id);
    }

    @UserAdminImportDoc()
    @Response('user.import')
    @UploadFileSingle('file')
    // @PolicyAbilityProtected({
    //     subject: ENUM_POLICY_SUBJECT.USER,
    //     action: [
    //         ENUM_POLICY_ACTION.READ,
    //         ENUM_POLICY_ACTION.CREATE,
    //         ENUM_POLICY_ACTION.IMPORT,
    //     ],
    // })
    @AuthJwtAdminAccessProtected()
    @Post('/import')
    async import(
        @UploadedFile(
            FileRequiredPipe,
            FileSizeExcelPipe,
            FileTypeExcelPipe,
            FileExtractPipe,
            new FileValidationPipe<UserImportDTO>(UserImportDTO)
        )
        file: IFileExtract<UserImportDTO>
    ): Promise<void> {
        // const role: RoleDoc = await this.roleService.findOneByName('user');

        const passwordString: string =
            await this.authService.createPasswordRandom();
        const password: IAuthPassword = await this.authService.createPassword(
            passwordString
        );

        await this.userService.import(file.dto, password);
    }

    @UserAdminExportDoc()
    @ResponseFile({
        serialization: UserListSerialization,
        fileType: ENUM_HELPER_FILE_TYPE.CSV,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.EXPORT],
    })
    @AuthJwtAdminAccessProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/export')
    async export(): Promise<IResponse> {
        const users: UserEntity[] = await this.userService.findAll({});

        return { data: users };
    }
}
