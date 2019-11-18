/*
 * Copyright 2019 SpinalCom - www.spinalcom.com
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
  DEFAULT_INCIDENTS_NAME,
  DEFAULT_STEPS,
  PROCESS_HAS_TICKET_RELATION_NAME,
  PROCESS_HAS_TICKET_RELATION_TYPE,
  PROCESS_TYPE,
  SERVICE_ARCHIVE_TYPE,
  SERVICE_LOG_TYPE,
  SERVICE_NAME,
  SERVICE_TYPE,
  SPINAL_TICKET_SERVICE_ARCHIVE_NAME,
  SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME,
  SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME,
  SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME,
  SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE,
  SPINAL_TICKET_SERVICE_INCIDENT_SUB_SECTION_RELATION_NAME,
  SPINAL_TICKET_SERVICE_INCIDENT_SUB_SECTION_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_INCIDENT_TYPE,
  SPINAL_TICKET_SERVICE_LOG_RELATION_NAME,
  SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME,
  SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
  SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_STEP_TYPE,
  SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME,
  SPINAL_TICKET_SERVICE_TARGET_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_TICKET_SECTION,
  SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_NAME,
  SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_TICKET_TYPE,
  USER_RELATION_NAME,
  USER_RELATION_TYPE,
} from './Constants';

import {
  CANNOT_ADD_STEP_TO_PROCESS,
  CANNOT_CREATE_CONTEXT_INTERNAL_ERROR,
  CANNOT_CREATE_PROCESS_INTERNAL_ERROR,
  DEFAULT_SENTENCE_SECTION_ALREADY_EXIST,
  PROCESS_ID_DOES_NOT_EXIST,
  PROCESS_NAME_ALREADY_USED,
  STEP_ID_DOES_NOT_EXIST,
  TICKET_ID_DOES_NOT_EXIST,
  TICKET_SECTION_ALREADY_EXIST,
} from './Errors';

import {
  TicketInterface,
} from 'spinal-models-ticket/declarations/SpinalTicket';
import { SpinalProcess } from 'spinal-models-ticket/declarations/SpinalProcess';
import { SpinalLogTicket } from 'spinal-models-ticket/dist/SpinalLogTicket';
import { SpinalTicket } from 'spinal-models-ticket/dist/SpinalTicket';
import { SpinalServiceUser } from 'spinal-service-user';

export class ServiceTicket {

  public contextId: string;
  public initialized: boolean;

  private context: any;
  private processNames: Map<string, string>;
  private processes: Set<string>;
  private steps: Set<string>;
  private tickets: Set<string>;
  private processByStep: Map<string, string>;
  private stepByProcess: Map<string, string[]>;
  private ticketByStep: Map<string, string[]>;

  constructor() {
    this.initialized = false;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public async init(): Promise<void> {
    await SpinalGraphService.waitForInitialization();
    this.context = SpinalGraphService.getContext(SERVICE_NAME);
    if (typeof this.context === 'undefined') {
      const context = await this.createContext()
      this.contextId = context.info.id.get();
    } else {
      this.contextId = this.context.info.id.get();
    }
    return this.initVar();
  }

  public getProcessByName(name: string): string {
    return this.processNames.get(name);
  }

  public addCategory(processId: string, sentence: string): Promise<boolean | string> {
    return SpinalGraphService
      .getChildren(processId,
        [SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME])
      .then((children) => {
        if (children.length > 0) {
          const sectionId: string = children[0].id.get();
          const sentenceId: string = SpinalGraphService.createNode({
            name: sentence,
            type: SPINAL_TICKET_SERVICE_INCIDENT_TYPE,
          }, undefined);

          return SpinalGraphService
            .addChildInContext(
              sectionId, sentenceId, this.contextId,
              SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME,
              SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE)
            .then(() => {
              return Promise.resolve(true);
            });
        }

        return this.addSentenceSection(processId).then((bool) => {
          if (bool) {
            return this.addCategory(processId, sentence);
          }
        });

      });
  }

  public addSubCategory(categoryId: string, sentence: string): Promise<boolean | string> {
    const sentenceId: string = SpinalGraphService.createNode({
      name: sentence,
      type: SPINAL_TICKET_SERVICE_INCIDENT_TYPE,
    }, undefined);

    return SpinalGraphService
      .addChildInContext(
        categoryId, sentenceId, this.contextId,
        SPINAL_TICKET_SERVICE_INCIDENT_SUB_SECTION_RELATION_NAME,
        SPINAL_TICKET_SERVICE_INCIDENT_SUB_SECTION_RELATION_TYPE)
      .then(() => {
        return Promise.resolve(true);
      });
  }

  public addStep(stepId: string, processId: string): Promise<boolean | Error> {

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

  public addLocationToTicket(ticketId: string, bimId: string) {
    return SpinalGraphService.addChild(
      bimId,
      ticketId,
      SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME,
      SPINAL_TICKET_SERVICE_TARGET_RELATION_TYPE,
    ).then(() => {
      return SpinalGraphService.addChild(
        ticketId,
        bimId,
        SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME,
        SPINAL_TICKET_SERVICE_TARGET_RELATION_TYPE,
      );
    });

  }

  public async addTicketToProcessWithUser(ticketId: string,
    processId: string,
    userId: string)
    : Promise<boolean | Error> {

    const process = await SpinalGraphService.getNodeAsync(processId);
    try {
      const user = SpinalServiceUser.getUser(userId);
      const addedToUser = await SpinalServiceUser
        .addNode(userId, ticketId, USER_RELATION_NAME, USER_RELATION_TYPE);
      if (addedToUser) {
        return this.addTicket(ticketId, process.defaultStepId.get());
      }
      return Promise.resolve(Error('CANNOT_ADD_TO_USER'));
    } catch (e) {
      return Promise.resolve(Error(e.message));
    }

  }

  public async addTicketToProcess(ticketId: string, processId: string): Promise<boolean | Error> {
    const process = await SpinalGraphService.getNodeAsync(processId);
    return this.addTicket(ticketId, process.defaultStepId.get());
  }

  public addTicket(ticketId: string, stepId: string): Promise<boolean | Error> {
    return SpinalGraphService
      .addChildInContext(stepId, ticketId,
        this.contextId, SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)
      .then(() => {
        return this.addTicketToStep(ticketId, stepId);
      })
      .catch((e) => {
        return Promise.reject(Error(CANNOT_ADD_STEP_TO_PROCESS + e));
      });
  }

  public createProcess(process: SpinalProcess): Promise<string | Error> {
    process.type = PROCESS_TYPE;
    const processId = SpinalGraphService.createNode(process, undefined);
    return SpinalGraphService.addChildInContext(
      this.contextId,
      processId,
      this.contextId,
      SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME,
      SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE,
    ).then(() => {
      this.processNames.set(process.name, processId);
      this.processes.add(processId);
      return this.initProcess(processId).then(() => {
        return Promise.resolve(processId);
      });
    })
      .catch((e) => {
        console.error(e);
        return Promise.reject(Error(CANNOT_CREATE_PROCESS_INTERNAL_ERROR));
      });
  }

  public createStep(name: string, color: string): string {
    const stepId = SpinalGraphService
      .createNode(
        {
          name,
          color,
          type: SPINAL_TICKET_SERVICE_STEP_TYPE,
        }, undefined);
    this.steps.add(stepId);
    return stepId;
  }

  public createTicket(info: TicketInterface): string {
    info.type = SPINAL_TICKET_SERVICE_TICKET_TYPE;
    const ticket = new SpinalTicket(info);
    const ticketId = SpinalGraphService.createNode(
      info,
      ticket);
    this.tickets.add(ticketId);
    return ticketId;
  }

  public createLog(info: SpinalLogTicket): string {
    const logId = SpinalGraphService.createNode(
      {
        name: info.ticketId,
        type: SERVICE_LOG_TYPE,
      },
      new SpinalLogTicket(info));
    return logId;
  }

  public async getTicketForUser(userId: string): Promise<any> {
    let children = [];
    try {
      children = await SpinalGraphService
        .getChildren(userId, [USER_RELATION_NAME]);
      return children;
    } catch (e) {
      console.error(e);
      SpinalGraphService.findNode(userId)
        .then(nodeRef => {
          return SpinalGraphService
            .getChildren(userId, [USER_RELATION_NAME]);
        });

    }
  }

  public async createArchives(): Promise<boolean | Error> {
    const archives = await SpinalGraphService
      .getChildren(this.contextId, [SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME]);
    if (archives.length > 0) {
      return;
    }
    const archiveId = SpinalGraphService.createNode(
      {
        name: SPINAL_TICKET_SERVICE_ARCHIVE_NAME,
        type: SERVICE_ARCHIVE_TYPE,
      }, undefined);

    return SpinalGraphService
      .addChild(this.contextId,
        archiveId,
        SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME,
        SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_TYPE,
      )
      .then((res) => {
        return (true);
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

  public getAllProcessAsync() {
    return SpinalGraphService.getChildrenInContext(this.contextId, this.contextId)
      .then(
        (children) => {
          for (const [name, childId] of this.processNames) {
            if (!(children.some((child) => child.name.get() === name))) {
              this.processNames.delete(name)
              this.processes.delete(childId)
            }
          }

          for (let i = 0; i < children.length; i = i + 1) {
            const child = children[i];
            this.processNames.set(child.name.get(), child.id.get());
            this.processes.add(child.id.get());
          }
          return this.processes;
        },
      )
      .catch((e) => {
        console.error(e);
      });
  }

  public getAllTickets(): Set<string> {
    return this.tickets;
  }

  public getStepsFromProcess(processId: string): string[] {
    return this.stepByProcess.get(processId);
  }

  public getStepsFromProcessAsync(processId: string): Promise<any> {
    return SpinalGraphService.findNode(processId)
      .then(node => {
        return SpinalGraphService.getChildren(node.id.get(), [SPINAL_TICKET_SERVICE_STEP_RELATION_NAME]);
      });
  }

  public getTicketsFromStepAsync(stepId: string) {
    return SpinalGraphService.findNode(stepId)
      .then(node => {
        return SpinalGraphService.getChildren(node.id.get(), [SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME]);
      });
  }

  public getTicketsFromStep(stepId: string): string[] {

    return this.ticketByStep.get(stepId);
  }

  public async getCategoriesFromProcess(processId: string): Promise<{ id: string, children: string[] }[]> {
    const sections = await SpinalGraphService.getChildren(processId, [SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME])
    if (sections.length > 0) {
      const sectionId: string = sections[0].id.get();
      return SpinalGraphService.getChildren(sectionId, [])
        .then(
          (children) => {
            const res = [];
            for (let i = 0; i < children.length; i++) {
              res.push(this.getCategories(children[i].id.get(), []));
            }
            return Promise.all(res);
          },
        );
    }
    return [];
  }

  public async moveTicket(ticketId: string, stepFromId: string, stepToId: string): Promise<void> {
    if (typeof ticketId === 'undefined'
      || typeof stepFromId === 'undefined'
      || typeof stepToId === 'undefined') {
      return;
    }
    const step = await SpinalGraphService.getNodeAsync(stepToId);
    SpinalGraphService.modifyNode(ticketId, <any>{
      stepId: stepToId,
      color: step['color'],
    });
    SpinalGraphService
      .addChild(
        ticketId,
        this.createLog({
          ticketId,
          steps: [stepFromId, stepToId],
          date: Date.now(),
        }),
        SPINAL_TICKET_SERVICE_LOG_RELATION_NAME,
        SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE,
      );
    SpinalGraphService
      .moveChildInContext(
        stepFromId, stepToId, ticketId, this.contextId,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE,
      );

  }

  private async getCategories(id: string, res: { id: string, children: string[] }[]): Promise<{ id: string, children: string[] }[]> {

    const node = await SpinalGraphService.getNodeAsync(id);
    const category = {
      id,
      name: node.name.get(),
      children: [],
      value: node.name.get(),
    };

    if (
      (typeof node === 'undefined')
      || (node.hasOwnProperty('childrenIds') && node.childrenIds.length === 0)
    ) {
      res.push(category);
      return Promise.resolve(res);
    }

    const children = await SpinalGraphService
      .getChildren(
        id,
        [
          SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME,
          SPINAL_TICKET_SERVICE_INCIDENT_SUB_SECTION_RELATION_NAME,
        ]);

    if (typeof children === 'undefined' || children.length === 0) {
      res.push(category);
      return Promise.resolve(res);
    }

    const promises = [];

    for (let i = 0; i < children.length; i = i + 1) {
      promises.push(this.getCategories(children[i].id.get(), []));
    }

    return Promise.all(promises)
      .then((promisesRes) => {
        for (const children of promisesRes) {
          category.children.push(...children);
        }
        res.push(category);
        return Promise.resolve(res);
      });
  }

  private initVar(): void {
    this.processes = new Set();
    this.processNames = new Map();
    this.steps = new Set();
    this.tickets = new Set();
    this.stepByProcess = new Map();
    this.ticketByStep = new Map();
    this.processByStep = new Map();
    /* SpinalGraphService.getChildrenInContext(this.contextId, this.contextId)
      .then(
        (children) => {

          for (let i = 0; i < children.length; i = i + 1) {
            const child = children[i];
            this.processNames.set(child.name.get(), child.id.get());
            this.processes.add(child.id.get());
          }

          this.initialized = true;
          return this.retrieveStep();
        },
      )
      .catch((e) => {
      });*/
  }

  private retrieveStep(): Promise<void> {
    const promises: Promise<any[]>[] = [];
    for (const processId of this.processes) {
      promises.push(SpinalGraphService
        .getChildren(processId,
          [SPINAL_TICKET_SERVICE_STEP_RELATION_NAME]));
    }
    return Promise.all(promises)
      .then((res) => {
        for (const children of res) {
          for (const child of children) {
            this.steps.add(child.id.get());
            this.addStepToProcess(child.id.get(), child.processId.get());
            this.processByStep.set(child.id.get(), child.processId.get());
          }
        }
      }).catch((e) => {
        console.error(e);
      });
  }

  private addStepToProcess(stepId: string, processId: string): boolean {
    let steps = [];

    this.processByStep.set(stepId, processId);
    SpinalGraphService.modifyNode(stepId, <any>{ processId });

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

  private async addTicketToStep(ticketId, stepId): Promise<boolean> {
    let tickets = [];
    const step = await SpinalGraphService.getNodeAsync(stepId);
    SpinalGraphService.modifyNode(ticketId, <any>{ stepId, color: step['color'] });
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
        this.initVar();
        return context;
      })
      .catch((e) => {
        return Promise.reject(Error(CANNOT_CREATE_CONTEXT_INTERNAL_ERROR));
      });
  }

  private addSentenceSection(processId: string): Promise<boolean | string> {
    return SpinalGraphService
      .getChildren(processId,
        [SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME])
      .then((children) => {
        if (children.length > 0) {
          return Promise.reject(DEFAULT_SENTENCE_SECTION_ALREADY_EXIST);
        }

        const sentenceId = SpinalGraphService.createNode({
          processId,
          name: DEFAULT_INCIDENTS_NAME,
          type: SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE,
        }, undefined);

        return SpinalGraphService
          .addChildInContext(
            processId, sentenceId,
            this.contextId,
            SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME,
            SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE)
          .then((e) => {
            return Promise.resolve(true);
          })
          .catch((e) => {
            return Promise.reject(e);
          });
      });
  }

  private initProcess(processId: string): Promise<(boolean | Error)[]> {
    const steps: string[] = this.createDefaultSteps();
    const promises: Promise<boolean | Error>[] = [];

    SpinalGraphService.modifyNode(processId, <any>{
      defaultStepId: steps[0],
      finalStepId: steps[2],
    });

    for (const stepId of steps) {
      promises.push(this.addStep(stepId, processId));
    }

    return Promise.all(promises);
  }

  private createDefaultSteps(): string[] {
    const steps = [];
    for (let i = 0; i < DEFAULT_STEPS.length; i = i + 1) {
      const step = DEFAULT_STEPS[i];
      steps.push(this.createStep(step.name, step.color));
    }
    return steps;
  }

}
