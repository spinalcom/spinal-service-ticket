import type { SpinalNode, SpinalNodeInfoModel } from 'spinal-model-graph';
export interface ISpinalNodeSpecialized<T extends SpinalNodeInfoModel> extends SpinalNode {
    info: T;
}
