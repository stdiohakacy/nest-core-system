import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ProductCreateDTO } from '../dtos/product.create.dto';
import { ProductRepository } from '../repositories/product.repository';
import { ProductEntity } from '../entities/product.entity';
import { RabbitMQService } from '../../../common/message-queue/rmq/services/rabbitmq.service';
import { ESCoreIndexService } from '../../../common/integrations/search/elasticsearch/services/elasticsearch.core.index.service';
import { PRODUCT_ES_INDEX_NAME } from '../constants/product.constant';
import { ENUM_BASE_OPERATION_TYPE } from '../../../common/base/constants/base.enum.operation.constant';
import { RMQ_ES_SYNC_QUEUE_NAME } from '../../../common/message-queue/rmq/constants/rmq.constant';
import { ENUM_RMQ_EXCHANGE_TYPE } from '../../../common/message-queue/rmq/constants/rmq.enum.constant';

export class ProductCreateCommand implements ICommand {
    constructor(public readonly payload: ProductCreateDTO) {}
}

@CommandHandler(ProductCreateCommand)
export class ProductCreateHandler
    implements ICommandHandler<ProductCreateCommand>
{
    constructor(
        private readonly productRepo: ProductRepository,
        private readonly rmqService: RabbitMQService,
        private readonly esCoreIdxService: ESCoreIndexService
    ) {}
    async execute({ payload }: ProductCreateCommand) {
        const { name, description, inStock, price } = payload;

        const productEntity = new ProductEntity();
        productEntity.name = name;
        productEntity.description = description;
        productEntity.inStock = inStock;
        productEntity.price = price;

        const productCreated = await this.productRepo.create(productEntity);
        const exchangeName = `${PRODUCT_ES_INDEX_NAME}.${ENUM_BASE_OPERATION_TYPE.INSERT}`;
        const routingKey = `${PRODUCT_ES_INDEX_NAME}.${ENUM_BASE_OPERATION_TYPE.INSERT}`;
        RMQ_ES_SYNC_QUEUE_NAME;

        const message = {
            entity: PRODUCT_ES_INDEX_NAME,
            data: productCreated,
            operation: ENUM_BASE_OPERATION_TYPE.INSERT,
        };

        await this.rmqService.publishToExchange(
            exchangeName,
            routingKey,
            JSON.stringify(message)
        );

        await this.rmqService.assertExchange(
            exchangeName,
            ENUM_RMQ_EXCHANGE_TYPE.DIRECT,
            { durable: true }
        );
        await this.rmqService.assertQueue(RMQ_ES_SYNC_QUEUE_NAME, {
            durable: true,
        });
        await this.rmqService.bindQueue(
            RMQ_ES_SYNC_QUEUE_NAME,
            exchangeName,
            routingKey
        );
        await this.rmqService.consumeMessage(
            RMQ_ES_SYNC_QUEUE_NAME,
            async (message) => {
                const parsedMessage = JSON.parse(message.toString());
                const { entity, operation, data } = parsedMessage;

                if (operation === ENUM_BASE_OPERATION_TYPE.INSERT) {
                    await this.esCoreIdxService.indexDocument(
                        entity,
                        data.id,
                        data
                    );
                }
            }
        );

        return productCreated;
    }
}
