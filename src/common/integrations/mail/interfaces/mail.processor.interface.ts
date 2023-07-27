import { Job } from 'bull';

export interface IMailProcessor {
    sendAccountActivation(job: Job);
}
