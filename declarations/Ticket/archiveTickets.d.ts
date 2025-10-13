import type { SpinalContext, SpinalNode } from 'spinal-model-graph';
import type { IUserInfo } from '../interfaces/IUserInfo';
import type { TicketStepNode } from '../interfaces/ITicketStepNode';
export declare function archiveTickets(contextNodeTicket: SpinalContext, processNode: SpinalNode, ticketNode: SpinalNode, userInfo?: IUserInfo): Promise<TicketStepNode>;
