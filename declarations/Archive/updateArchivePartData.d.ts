import type { SpinalNode } from 'spinal-model-graph';
import { ISpinalNodeArchivePart } from '../interfaces/ISpinalNodePart';
export declare function updateArchivePartData(archivePart: ISpinalNodeArchivePart, archiveTicketNode: SpinalNode, timeStampAttr: string): Promise<void>;
