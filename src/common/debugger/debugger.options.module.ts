import { Module } from '@nestjs/common';
import { DebuggerOptionService } from '@common/debugger/services/debugger.options.service';

@Module({
    providers: [DebuggerOptionService],
    exports: [DebuggerOptionService],
    imports: [],
})
export class DebuggerOptionsModule {}
