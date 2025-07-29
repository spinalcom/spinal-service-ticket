import type { SpinalNode, SpinalContext } from 'spinal-model-graph';
import type { ITicketStep } from '../interfaces/ITicketStep';
import type { TicketStepNode } from '../interfaces/ITicketStepNode';
export declare function insertStepNode(contextNodeTicket: SpinalContext, processNode: SpinalNode, stepInfo: ITicketStep): Promise<TicketStepNode>;
