import type { SpinalNode } from 'spinal-model-graph';
/**
 * Changes the target node of a ticket element.
 * e.g change the room linked to a ticket.
 * @export
 * @param {SpinalNode} ticketNode
 * @param {SpinalNode} targetNode
 * @return {*} the ticket node
 */
export declare function changeTicketNodeTarget(ticketNode: SpinalNode, targetNode: SpinalNode): Promise<SpinalNode<any>>;
