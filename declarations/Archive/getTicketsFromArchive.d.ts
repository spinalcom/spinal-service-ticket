import type { SpinalNode } from 'spinal-model-graph';
import * as moment from 'moment';
export declare function getTicketsFromArchive(processOrSpatialNode: SpinalNode, begin: moment.MomentInput, end: moment.MomentInput): Promise<SpinalNode<any>[]>;
export declare function getTicketsFromArchiveGen(processOrSpatialNode: SpinalNode, begin: moment.MomentInput, end: moment.MomentInput): AsyncGenerator<SpinalNode<any>, void, unknown>;
