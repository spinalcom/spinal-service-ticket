import * as moment from 'moment';
import { SpinalNode } from 'spinal-model-graph';
export declare function _archiveTicket(ticketNode: SpinalNode, processOrSpatialNode: SpinalNode, date: moment.MomentInput, maxArchiveSize: number, archiveRelationName: string, archiveNodeType: string, parentTypes: string[], timestampAttr: string): Promise<void>;
