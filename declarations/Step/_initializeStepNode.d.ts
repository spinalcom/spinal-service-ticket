import type { SpinalNode, SpinalContext } from 'spinal-model-graph';
import type { TicketStepNode } from '../interfaces/ITicketStepNode';
export declare function _initializeStepNode(name: string, color: string, order: number, processNode: SpinalNode, contextNodeTicket: SpinalContext): Promise<TicketStepNode>;
