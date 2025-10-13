import type { Str, Val } from 'spinal-core-connectorjs';
import type { SpinalNodeInfoModel } from 'spinal-model-graph';
import type { ISpinalNodeSpecialized } from './ISpinalNodeSpecialized';
export interface ITicketStepNodeInfo extends SpinalNodeInfoModel {
    color: Str;
    order: Val;
    processId?: Str;
}
export type TicketStepNode = ISpinalNodeSpecialized<ITicketStepNodeInfo>;
