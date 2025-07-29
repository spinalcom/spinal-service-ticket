import type { TicketInterface } from 'spinal-models-ticket';
import { SpinalNode } from 'spinal-model-graph';
export declare function addTicket(ticketInfo: TicketInterface, processNode: SpinalNode, contextNodeTicket: SpinalNode, targetNode: SpinalNode, ticketType?: string): Promise<SpinalNode<any>>;
