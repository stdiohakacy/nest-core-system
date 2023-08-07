// logger.config.ts

import { Injectable } from '@nestjs/common';
import { createLogger, format } from 'winston';
import { LogstashTransport } from 'winston-logstash-transport';

@Injectable()
export class LogstashService {
  private logger;

  constructor() {
    this.logger = createLogger({
      level: 'info', // Set your desired log level
      format: format.combine(format.timestamp(), format.json()), // Use JSON format for the logs with timestamp
      defaultMeta: { service: 'nest-core-app' }, // Add default meta fields to all logs
      transports: [
        new LogstashTransport({
          host: 'localhost', // Replace with the hostname or IP address of your Logstash instance
          port: 5044, // Replace with the Logstash port
          ssl_enable: false, // Set to true if using SSL
          max_connect_retries: -1, // Retry connection indefinitely
        }),
      ],
    });
  }

  logInfo(message: string, additionalData?: Record<string, any>) {
    this.logger.info(message, additionalData);
  }

  logError(message: string, additionalData?: Record<string, any>) {
    this.logger.error(message, additionalData);
  }
}