import type { SpinalNode } from 'spinal-model-graph';
export declare function getTicketInfo(ticketNode: SpinalNode): Promise<Record<string, string>>;
export declare function getTicketInfo<T extends readonly string[]>(ticketNode: SpinalNode, attributesToGet: T): Promise<{
    [V in T[number]]: string;
}>;
