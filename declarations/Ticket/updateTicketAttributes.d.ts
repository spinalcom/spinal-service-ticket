import type { SpinalNode } from 'spinal-model-graph';
export declare function updateTicketAttributes(ticketNode: SpinalNode, 
/**
 * The attributes to set on the ticket, usually the value is a string but it will flatten if it's an object
 * @example
 * {
 *   "priority": "high",
 *   "status": "open",
 *   "customField": {
 *     "status": "blabla",
 *     "field2": "value2"
 *   }
 * }
 * This will result in:
 * {
 *   "priority": "high",
 *   "status": "open",
 *   "field2": "value2"
 * }
 * @param attrToSet - The attributes to set on the ticket
 */
attrToSet: Record<string, any>): Promise<void>;
