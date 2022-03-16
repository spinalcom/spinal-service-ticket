import { SpinalStep } from 'spinal-models-ticket/declarations/SpinalStep';
import * as OLD_CONSTANTS from './old_constants';
export * from "./old_constants";
export declare const TICKET_CONTEXT_TYPE: string;
export declare const TICKET_RELATION_TYPE: string;
export declare const TICKET_RELATION_NAME: string;
export declare const TIKET_TYPE: string;
export declare const PROCESS_RELATION_TYPE: string;
export declare const PROCESS_RELATION_NAME: string;
export declare const _PROCESS_TYPE: string;
export declare const STEP_RELATION_TYPE: string;
export declare const STEP_RELATION_NAME: string;
export declare const STEP_TYPE: string;
export declare const ARCHIVED_STEP: {
    name: string;
    order: number;
    color: string;
};
export declare const DEFAULT_STEPS: SpinalStep[];
export declare const _ARCHIVED_STEP: {
    name: string;
    order: number;
    color: string;
};
export declare const _DEFAULT_STEPS: SpinalStep[];
export declare const INCIDENT_SECTION_RELATION_TYPE: string;
export declare const INCIDENT_SECTION_TYPE: string;
export declare const INCIDENT_SECTION_RELATION_NAME: string;
export declare const INCIDENT_RELATION_TYPE: string;
export declare const INCIDENT_RELATION_NAME: string;
export declare const INCIDENT_TYPE: string;
export declare const _DEFAULT_INCIDENTS_NAME: string;
export declare const LOG_RELATION_TYPE: string;
export declare const LOG_RELATION_NAME: string;
export declare const LOG_TYPE: string;
export declare const LOGS_EVENTS_STEPS: typeof OLD_CONSTANTS.LOGS_EVENTS;
export declare const _TICKET_PRIORITIES: {
    [key: string]: number;
};
