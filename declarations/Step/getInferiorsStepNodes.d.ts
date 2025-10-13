import type { SpinalContext, SpinalNode } from 'spinal-model-graph';
import type { TicketStepNode } from '../interfaces/ITicketStepNode';
export declare function getInferiorsStepNodes(contextNodeTicket: SpinalContext, processNode: SpinalNode, stepOrder: number, equals?: Boolean): Promise<TicketStepNode[]>;
