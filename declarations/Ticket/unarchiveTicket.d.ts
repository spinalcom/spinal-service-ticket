import type { SpinalContext, SpinalNode } from 'spinal-model-graph';
import type { IUserInfo } from '../interfaces/IUserInfo';
export declare function unarchiveTicket(contextNodeTicket: SpinalContext, processNode: SpinalNode, ticketNode: SpinalNode, userInfo?: IUserInfo): Promise<import("..").TicketStepNode>;
