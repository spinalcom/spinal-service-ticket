import type { SpinalNode } from 'spinal-model-graph';
import type { IUserInfo } from '../interfaces/IUserInfo';
import { LOGS_EVENTS } from '../Constants';
export declare function addLogToTicketNode(ticketNode: SpinalNode, event: LOGS_EVENTS, userInfo?: IUserInfo, fromId?: string, toId?: string): Promise<SpinalNode<any>>;
