/*
 *  Copyright 2019 SpinalCom - www.spinalcom.com
 *
 *  This file is part of SpinalCore.
 *
 *  Please read all of the following terms and conditions
 *  of the Free Software license Agreement ("Agreement")
 *  carefully.
 *
 *  This Agreement is a legally binding contract between
 *  the Licensee (as defined below) and SpinalCom that
 *  sets forth the terms and conditions that govern your
 *  use of the Program. By installing and/or using the
 *  Program, you agree to abide by all the terms and
 *  conditions stated or referenced herein.
 *
 *  If you do not agree to abide by these terms and
 *  conditions, do not demonstrate your acceptance and do
 *  not install or use the Program.
 *  You should have received a copy of the license along
 *  with this file. If not, see
 *  <http://resources.spinalcom.com/licenses.pdf>.
 */

import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import {
  PROCESS_TYPE,
  SERVICE_ARCHIVE_TYPE,
  SERVICE_NAME,
  SERVICE_TYPE,
  SPINAL_TICKET_SERVICE_ARCHIVE_NAME,
  SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME,
  SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_RELATION_NAME,
  SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_NAME,
  SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME,
  SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
  SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE,
} from './Constants';
import {
  CANNOT_ADD_STEP_TO_PROCESS,
  CANNOT_CREATE_CONTEXT_INTERNAL_ERROR,
  CANNOT_CREATE_PROCESS_INTERNAL_ERROR, DEFAULT_SENTECE_SECTION_ALREADY_EXIST,
  PROCESS_ID_DOES_NOT_EXIST,
  PROCESS_NAME_ALREADY_USED,
  STEP_ID_DOES_NOT_EXIST,
  TICKET_ID_DOES_NOT_EXIST,
} from './Errors';
import { TicketInterface } from 'spinal-models-ticket/declarations/SpinalTicket';
import { SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_RELATION_TYPE } from '../declarations/Constants';

export class ServiceTicket {

  public contextId: string;
  private context: any;
  private processNames: Set<string>;
  private processes: Set<string>;
  private initialized: boolean;
  private steps: Set<string>;
  private tickets: Set<string>;
  private processByStep: Map<string, string>;
  private stepByProcess: Map<string, string[]>;
  private ticketByStep: Map<string, string[]>;

  constructor() {

  }

  public init() {
    this.context = SpinalGraphService.getContext(SERVICE_NAME);
    if (typeof this.context !== 'undefined') {

      this.initVar(this.context.info.id.get())
        .catch((e) => {
          throw  new Error(e);
        });
    } else {
      this.createContext()
        .catch((e) => {
          throw new Error(e);
        });
    }
  }

  public addDefaultSentence(processId: string, sentence: string): Promise<boolean | string> {
    if (!this.processes.has(processId)) {
      return Promise.reject(PROCESS_ID_DOES_NOT_EXIST);
    }
    const sentenceId: string = SpinalGraphService.createNode({ name: sentence });
    return  SpinalGraphService
      .addChildInContext(
        processId, sentenceId, this.contextId,
        SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_RELATION_NAME,
        SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_RELATION_TYPE)
      .then(() => {
        return Promise.resolve(true);
      });
  }

  public addStep(stepId: string, processId: string): Promise<boolean | Error> {
    if (!this.processes.has(processId)) {
      return Promise.reject(Error(PROCESS_ID_DOES_NOT_EXIST));
    }
    if (!this.steps.has(stepId)) {
      return Promise.reject(Error(STEP_ID_DOES_NOT_EXIST));
    }

    return SpinalGraphService
      .addChildInContext(processId, stepId, this.contextId,
                         SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
                         SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE)
      .then(() => {
        this.addStepToProcess(stepId, processId);

        return Promise.resolve(true);
      })
      .catch((e) => {
        return Promise.reject(Error(CANNOT_ADD_STEP_TO_PROCESS + e));
      });
  }

  public addTicket(ticketId: string, stepId: string): Promise<boolean | Error> {

    if (!this.steps.has(stepId)) {
      return Promise.reject(Error(STEP_ID_DOES_NOT_EXIST));
    }
    if (!this.tickets.has(ticketId)) {
      return Promise.reject(Error(TICKET_ID_DOES_NOT_EXIST));
    }

    return SpinalGraphService
      .addChildInContext(stepId, ticketId,
                         this.contextId, SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
                         SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)
      .then(() => {
        this.addTicketToStep(ticketId, stepId);
        return Promise.resolve(true);
      })
      .catch((e) => {
        return Promise.reject(Error(CANNOT_ADD_STEP_TO_PROCESS + e));
      });
  }

  public createProcess(name: string): Promise<string | Error> {
    if (this.processNames.has(name)) {
      return Promise.reject(Error(PROCESS_NAME_ALREADY_USED));
    }

    const processId = SpinalGraphService.createNode({ name, PROCESS_TYPE });
    return SpinalGraphService.addChildInContext(
      this.contextId,
      processId,
      this.contextId,
      SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME,
      SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE,
    ).then(() => {
      this.processNames.add(name);
      this.processes.add(processId);
      return Promise.resolve(processId);
    })
      .catch((e) => {
        console.error(e);
        return Promise.reject(Error(CANNOT_CREATE_PROCESS_INTERNAL_ERROR));
      });
  }

  public createStep(name: string, color: string): string {
    const stepId = SpinalGraphService.createNode({ name, color });
    this.steps.add(stepId);
    return stepId;
  }

  public createTicket(info: TicketInterface) {
    const ticketId = SpinalGraphService.createNode({ name: info.name }, info);
    this.tickets.add(ticketId);
    return ticketId;
  }

  public createArchives(): Promise<boolean | Error> {
    const archives = SpinalGraphService
      .getChildren(this.contextId, [SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME]);
    if (archives.leght > 0) {
      return;
    }
    const archiveId = SpinalGraphService.createNode(
      {
        name: SPINAL_TICKET_SERVICE_ARCHIVE_NAME,
        type: SERVICE_ARCHIVE_TYPE,
      });

    return SpinalGraphService
      .addChild(this.contextId,
                archiveId,
                SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME,
                SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_TYPE,
      )
      .then((res) => {
        return Promise.resolve(true);
      })
      .catch((e) => {
        return Promise.reject(Error(e));
      });
  }

  public getContext(): Promise<string> {
    if (typeof this.contextId !== 'undefined') {
      return Promise.resolve(this.contextId);
    }

    return this.createContext()
      .then(() => {
        return Promise.resolve(this.contextId);
      });
  }

  public getAllProcess(): Set<string> {
    return this.processes;
  }

  public getAllTickets(): Set<string> {
    return this.tickets;
  }

  public getStepsFromProcess(processId: string): string[] {
    return this.stepByProcess.get(processId);
  }

  public getTicketsFromStep(stepId: string): string[] {
    return this.ticketByStep.get(stepId);
  }

  private initVar(contextId: string): Promise<void> {
    this.processes = new Set();
    this.processNames = new Set();
    this.steps = new Set();
    this.tickets = new Set();
    this.stepByProcess = new Map();
    this.ticketByStep = new Map();
    this.contextId = contextId;

    return SpinalGraphService.getChildren(contextId, SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME)
      .then(
        (children) => {
          for (let i = 0; i < children.length; i = i + 1) {
            const child = children[i];
            this.processNames.add(child.info.name.get());
            this.processes.add(child);
          }
          this.initialized = true;
        },
      )
      .catch((e) => {
      });
  }

  private addStepToProcess(stepId: string, processId: string): boolean {
    let steps = [];
    if (!this.steps.has(stepId) || !this.processes.has(processId)) {
      return false;
    }

    this.processByStep.set(stepId, processId);

    if (this.stepByProcess.has(processId)) {
      steps = this.stepByProcess.get(processId);

      if (steps.indexOf(stepId) !== -1) {
        return false;
      }

      steps.push(stepId);
      this.stepByProcess.set(processId, steps);
      return true;
    }

    this.stepByProcess.set(processId, [stepId]);
    return true;
  }

  private addTicketToStep(ticketId, stepId): boolean {
    let tickets = [];
    if (!this.tickets.has(ticketId) || !this.steps.has(stepId)) {
      return false;
    }

    if (this.ticketByStep.has(stepId)) {
      tickets = this.ticketByStep.get(stepId);
      if (tickets.indexOf(stepId) !== -1) {
        return false;
      }
      tickets.push(stepId);
      this.ticketByStep.set(stepId, tickets);
      return true;
    }

    this.ticketByStep.set(stepId, [ticketId]);
    return true;
  }

  private createContext(): Promise<any | Error> {
    return SpinalGraphService.addContext(SERVICE_NAME, SERVICE_TYPE, undefined)
      .then((context) => {
        this.context = context;
        this.contextId = context.info.id.get();
        this.initVar(context.info.id.get());
        return Promise.resolve(context);
      })
      .catch((e) => {
        console.error(e);
        return Promise.reject(Error(CANNOT_CREATE_CONTEXT_INTERNAL_ERROR));
      });
  }

  private addSentenceSection(processId: string): Promise<boolean | string> {
    if (!this.processes.has(processId)) {
      throw new Error(PROCESS_ID_DOES_NOT_EXIST);
    }
    return SpinalGraphService
      .getChildren(processId,
                   [SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_NAME])
      .then((children) => {
        if (children.length > 0) {
          return Promise.reject(DEFAULT_SENTECE_SECTION_ALREADY_EXIST);
        }

        const sentenceId = SpinalGraphService.createNode({
          name: 'Default Sentence.',
        });

        return SpinalGraphService
          .addChildInContext(
            processId, sentenceId,
            this.contextId,
            SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_NAME,
            SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_TYPE)
          .then(() => {
            return Promise.resolve(true);
          })
          .catch((e) => {
            return Promise.reject(e);
          });
      });
  }



}
