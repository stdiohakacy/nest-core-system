export enum ENUM_RBAC_ROLE_TYPE {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    USER = 'user',
}

export enum ENUM_RBAC_PERMISSION_TYPE {
    USER_CREATE = 'user:create',
    USER_DELETE = 'user:delete',
    USER_LIST = 'user:list',
    USER_GET = 'user:get',
    USER_UPDATE = 'user:update',
    USER_IMPORT = 'user:import',
    USER_EXPORT = 'user:export',
}
