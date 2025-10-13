import type { SpinalContext, SpinalNode } from 'spinal-model-graph';
import type { TicketStepNode } from '../interfaces/ITicketStepNode';
export declare function getPreviousStepNode(processNode: SpinalNode, stepNode: SpinalNode, contextNodeTicket: SpinalContext): Promise<TicketStepNode | undefined>;
