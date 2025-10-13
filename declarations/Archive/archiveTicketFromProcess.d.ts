import type { SpinalNode } from 'spinal-model-graph';
export declare function archiveTicketFromProcess(ticketNode: SpinalNode, processNode: SpinalNode, date: moment.MomentInput, maxArchiveSize?: number): Promise<void>;
