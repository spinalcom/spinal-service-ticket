import type { SpinalContext, SpinalNode } from 'spinal-model-graph';
import type { TicketStepNode } from '../interfaces/ITicketStepNode';
export declare function createStepToProcess(processNode: SpinalNode, contextNodeTicket: SpinalContext, name: string, color: string, order?: number): Promise<TicketStepNode>;
