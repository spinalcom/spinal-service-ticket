import type { SpinalContext, SpinalNode } from 'spinal-model-graph';
import type { TicketStepNode } from '../interfaces/ITicketStepNode';
export declare function getNextStepNode(processNode: SpinalNode, stepNode: SpinalNode, contextNodeTicket: SpinalContext): Promise<TicketStepNode | undefined>;
export declare function getNextStepNodeByStepId(processNode: SpinalNode, stepId: string, contextNodeTicket: SpinalContext): Promise<TicketStepNode | undefined>;
