import { TicketInterface } from 'spinal-models-ticket/declarations/SpinalTicket';
export declare class ServiceTicket {
    context: any;
    contextId: string;
    processNames: Set<string>;
    processes: Set<string>;
    initialized: boolean;
    steps: Set<string>;
    tickets: Set<string>;
    stepByProcess: Map<string, string[]>;
    ticketByStep: Map<string, string[]>;
    constructor();
    init(): void;
    addStep(stepId: string, processId: string): Promise<boolean | Error>;
    addTicket(ticketId: string, stepId: string): Promise<boolean | Error>;
    createProcess(name: string): Promise<string | Error>;
    createStep(name: string, color: string): string;
    createTicket(info: TicketInterface): any;
    createArchives(): Promise<boolean | Error>;
    getContext(): Promise<string>;
    getAllProcess(): Set<string>;
    getAllTickets(): Set<string>;
    getStepsFromProcess(processId: string): string[];
    getTicketsFromStep(stepId: string): string[];
    private initVar;
    private addStepToProcess;
    private addTicketToStep;
    private createContext;
}
