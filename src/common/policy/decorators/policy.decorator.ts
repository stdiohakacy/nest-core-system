import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { POLICY_RULE_META_KEY } from '@common/policy/constants/policy.constant';
import { PolicyGuard } from '@common/policy/guards/policy.ability.guard';
import { IPolicyRule } from '@common/policy/interfaces/policy.interface';

export function PolicyAbilityProtected(
    ...handlers: IPolicyRule[]
): MethodDecorator {
    return applyDecorators(
        UseGuards(PolicyGuard),
        SetMetadata(POLICY_RULE_META_KEY, handlers)
    );
}
