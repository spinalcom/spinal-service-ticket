import type { SpinalProcess } from 'spinal-models-ticket';
import { type SpinalContext, SpinalNode } from 'spinal-model-graph';
export declare function createTicketProcess(processInfo: SpinalProcess | string, contextNodeTicket: SpinalContext): Promise<SpinalNode>;
