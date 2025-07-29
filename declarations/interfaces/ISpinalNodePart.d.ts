import type { Val } from 'spinal-core-connectorjs';
import type { SpinalNodeInfoModel } from 'spinal-model-graph';
import type { ISpinalNodeSpecialized } from './ISpinalNodeSpecialized';
export interface ISpinalNodeArchivePartInfo extends SpinalNodeInfoModel {
    start: Val;
    end: Val;
}
export type ISpinalNodeArchivePart = ISpinalNodeSpecialized<ISpinalNodeArchivePartInfo>;
