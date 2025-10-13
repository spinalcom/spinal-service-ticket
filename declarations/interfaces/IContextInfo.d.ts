import type { ITicketStep } from './ITicketStep';
export interface IContextInfo {
    name: string;
    id?: string;
    type?: string;
    steps?: ITicketStep[];
}
