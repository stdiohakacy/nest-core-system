import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { DirectMessageEntity } from './entities/direct-message.entity';
import { GroupMessageEntity } from './entities/group-message.entity';
import { GroupEntity } from './entities/group.entity';
import { UserGroupEntity } from './entities/user-group.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            DirectMessageEntity,
            GroupMessageEntity,
            GroupEntity,
            UserGroupEntity,
        ]),
    ],
    exports: [],
    providers: [],
})
export class ChatModule {}
