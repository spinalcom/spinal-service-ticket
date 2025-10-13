export interface ITicketStep {
    name: string;
    color?: string;
    order: number;
}
import type { Model, Str, Val } from 'spinal-core-connectorjs';
/**
 * This interface represents a ticket step model from the context.info.steps
 * @export
 * @interface ITicketStepModel
 * @extends {Model}
 */
export interface ITicketStepModel extends Model {
    name: Str;
    color?: Str;
    order: Val;
}
