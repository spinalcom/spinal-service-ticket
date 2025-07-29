import type { SpinalContext, SpinalNode } from 'spinal-model-graph';
import type { TicketStepNode } from '../interfaces/ITicketStepNode';
export declare function getFirstStepNode(processNode: SpinalNode, contextNodeTicket: SpinalContext): Promise<TicketStepNode>;
