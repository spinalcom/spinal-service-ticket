import type { SpinalContext } from 'spinal-model-graph';
import type { ITicketStep } from '../interfaces/ITicketStep';
export declare function createTicketContext(contextName: string, steps?: ITicketStep[], contextSubType?: string): Promise<SpinalContext>;
