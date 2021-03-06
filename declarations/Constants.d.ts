import { SpinalStep } from 'spinal-models-ticket/declarations/SpinalStep';
export declare const SERVICE_NAME: string;
export declare const SERVICE_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_TICKET_ARCHIVE_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_TICKET_SECTION: string;
export declare const SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME: string;
export declare const SPINAL_TICKET_SERVICE_TICKET_SECTION_NAME: string;
export declare const SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_NAME: string;
export declare const SPINAL_TICKET_SERVICE_TICKET_ARCHIVE_RELATION_NAME: string;
export declare const SPINAL_TICKET_SERVICE_TICKET_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_PROCESS_ARCHIVE_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_PROCESS_ARCHIVE_NAME: string;
export declare const SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME: string;
export declare const SPINAL_TICKET_SERVICE_PROCESS_ARCHIVE_RELATION_NAME: string;
export declare const PROCESS_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_PROCESS_TYPE: string;
export declare const PROCESS_HAS_TICKET_RELATION_NAME: string;
export declare const PROCESS_HAS_TICKET_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_STEP_ARCHIVE_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_STEP_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_STEP_ARCHIVE_RELATION_NAME: string;
export declare const SPINAL_TICKET_SERVICE_STEP_ARCHIVE_NAME: string;
export declare const SPINAL_TICKET_SERVICE_STEP_RELATION_NAME: string;
export declare const DEFAULT_STEPS: SpinalStep[];
export declare const ARCHIVED_STEP: {
    name: string;
    order: number;
    color: string;
};
export declare const SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_INCIDENT_SUB_SECTION_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_INCIDENT_SUB_SECTION_RELATION_NAME: string;
export declare const SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME: string;
export declare const SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME: string;
export declare const SPINAL_TICKET_SERVICE_INCIDENT_TYPE: string;
export declare const DEFAULT_INCIDENTS_NAME: string;
export declare const SPINAL_TICKET_SERVICE_ARCHIVE_NAME: string;
export declare const SPINAL_TICKET_SERVICE_TICKET_ARCHIVE_NAME: string;
export declare const SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME: string;
export declare const SERVICE_ARCHIVE_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_LOG_RELATION_NAME: string;
export declare const SERVICE_LOG_TYPE: string;
export declare enum LOGS_EVENTS {
    creation = 1,
    moveToNext = 2,
    moveToPrevious = 3,
    archived = 4,
    unarchive = 5,
    move = 6
}
export declare const SPINAL_TICKET_SERVICE_TARGET_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME: string;
export declare const USER_RELATION_NAME: string;
export declare const USER_RELATION_TYPE: string;
export declare const TICKET_PRIORITIES: {
    [key: string]: number;
};
