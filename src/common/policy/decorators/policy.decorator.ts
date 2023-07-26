import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { IPolicyRule } from '../interfaces/policy.interface';
import { PolicyGuard } from '../guards/policy.ability.guard';
import { POLICY_RULE_META_KEY } from '../constants/policy.constant';

export function PolicyAbilityProtected(
    ...handlers: IPolicyRule[]
): MethodDecorator {
    return applyDecorators(
        UseGuards(PolicyGuard),
        SetMetadata(POLICY_RULE_META_KEY, handlers)
    );
}
