import type { SpinalNode } from 'spinal-model-graph';
export declare function archiveTicketFromSpatial(ticketNode: SpinalNode, spatialNode: SpinalNode, date: moment.MomentInput, maxArchiveSize?: number): Promise<void>;
