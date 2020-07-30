/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

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


import { SpinalGraphService } from "spinal-env-viewer-graph-service";

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
import { Lst, Ptr } from 'spinal-core-connectorjs_type';
import { promises } from 'dns';

export class ServiceTicketPersonalized {

    constructor() { }

    public createContext(contextName: string, steps: Array<any> = new Array()): Promise<any | Error> {
        return SpinalGraphService.addContext(contextName, SERVICE_TYPE, undefined)
            .then((context) => {
                // this.context = context;
                // this.initVar();
                const stepsModel = new Lst(steps);
                context.info.add_attr("steps", new Ptr(stepsModel));
                return context;

            })
            .catch((e) => {
                return Promise.reject(Error(CANNOT_CREATE_CONTEXT_INTERNAL_ERROR));
            });
    }

    public getContexts(): any[] {
        const contexts = SpinalGraphService.getContextWithType(SERVICE_TYPE);
        return contexts.map(el => el.info.get());
    }

    public createProcess(process: SpinalProcess, contextId: string): Promise<string> {
        process.type = PROCESS_TYPE;
        const processId = SpinalGraphService.createNode(process, undefined);
        return SpinalGraphService.addChildInContext(
            contextId,
            processId,
            contextId,
            SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME,
            SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE,
        ).then(async () => {
            const steps = await this.getContextSteps(contextId);

            const promises = steps.map(step => this.addStep(step.name, step.color, step.order, processId, contextId));

            await Promise.all(promises);

            return processId;
        })
            .catch((e) => {
                console.error(e);
                return Promise.reject(Error(CANNOT_CREATE_PROCESS_INTERNAL_ERROR));
            });
    }

    public async addStep(name: string, color: string, order: number, processId: string, contextId: string): Promise<boolean | Error> {

        const stepId = await this.createStep(name, color, order, processId);

        return SpinalGraphService
            .addChildInContext(processId, stepId, contextId,
                SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
                SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE)
            .then(() => {
                return this.modifyStepProcessId(stepId, processId);
            })
            .catch((e) => {
                return Promise.reject(Error(CANNOT_ADD_STEP_TO_PROCESS + e));
            });
    }

    public addStepById(stepId: string, processId: string, contextId: string): Promise<boolean | Error> {

        return SpinalGraphService
            .addChildInContext(processId, stepId, contextId,
                SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
                SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE)
            .then(() => {
                return this.modifyStepProcessId(stepId, processId);
            })
            .catch((e) => {
                return Promise.reject(Error(CANNOT_ADD_STEP_TO_PROCESS + e));
            });
    }

    public async addTicket(ticketInfo: TicketInterface, processId: string, contextId: string, nodeId: string): Promise<boolean | Error> {
        const ticketId = this.createTicket(ticketInfo);
        const stepId = await this.getFirstStep(processId, contextId);

        return SpinalGraphService
            .addChildInContext(stepId, ticketId,
                contextId, SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
                SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)
            .then(async () => {
                await SpinalGraphService.addChild(nodeId, ticketId, SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
                    SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)

                return this.modifyTicketStepId(ticketId, stepId);
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

    // public async addTicketToProcessWithUser(ticketId: string,
    //     processId: string,
    //     contextId: string,
    //     userId: string)
    //     : Promise<boolean | Error> {

    //     const process = await SpinalGraphService.getNodeAsync(processId);
    //     try {
    //         const user = SpinalServiceUser.getUser(userId);
    //         const addedToUser = await SpinalServiceUser
    //             .addNode(userId, ticketId, USER_RELATION_NAME, USER_RELATION_TYPE);
    //         if (addedToUser) {
    //             return this.addTicket(ticketId, process.defaultStepId.get(), contextId);
    //         }
    //         return Promise.resolve(Error('CANNOT_ADD_TO_USER'));
    //     } catch (e) {
    //         return Promise.resolve(Error(e.message));
    //     }

    // }

    // public async addTicketToProcess(ticketId: string, processId: string, contextId: string): Promise<boolean | Error> {
    //     const process = await SpinalGraphService.getNodeAsync(processId);
    //     return this.addTicket(ticketId, process.defaultStepId.get(), contextId);
    // }




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

    public async createArchives(contextId: string): Promise<boolean | Error> {
        const archives = await SpinalGraphService
            .getChildren(contextId, [SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME]);
        if (archives.length > 0) {
            return;
        }
        const archiveId = SpinalGraphService.createNode({
            name: SPINAL_TICKET_SERVICE_ARCHIVE_NAME,
            type: SERVICE_ARCHIVE_TYPE,
        }, undefined);

        return SpinalGraphService
            .addChild(contextId,
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

    public getAllProcess(contextId: string) {
        return SpinalGraphService.getChildrenInContext(contextId, contextId)
        // .then(
        //     (children) => {
        //         return children.map(child => child.id.get())
        //     },
        // )
        // .catch((e) => {
        //     console.error(e);
        // });
    }

    public async getFirstStep(processId: string, contextId: string): Promise<string> {
        const steps = await this.getStepsFromProcess(processId);

        let first = steps.find(el => el.order.get() == 0);
        if (first) return first.id.get();

        let stepId = await this.createStep("declared", "#ff0000", 0);
        await this.addStepById(stepId, processId, contextId);

        return stepId;
    }

    public getStepsFromProcess(processId: string): Promise<any> {
        return SpinalGraphService.findNode(processId)
            .then(node => {
                return SpinalGraphService.getChildren(node.id.get(),
                    [SPINAL_TICKET_SERVICE_STEP_RELATION_NAME]);
            });
    }

    public getTicketsFromStep(stepId: string) {
        return SpinalGraphService.findNode(stepId)
            .then(node => {
                return SpinalGraphService.getChildren(node.id.get(), [SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME]);
            });
    }

    public async moveTicket(ticketId: string, stepFromId: string, stepToId: string, contextId: string): Promise<void> {
        if (typeof ticketId === 'undefined'
            || typeof stepFromId === 'undefined'
            || typeof stepToId === 'undefined') {
            return;
        }
        const step = await SpinalGraphService.getNodeAsync(stepToId);
        SpinalGraphService.modifyNode(ticketId, <any>{
            stepId: stepToId
        });
        return SpinalGraphService.addChild(ticketId, this.createLog({
            ticketId,
            steps: [stepFromId, stepToId],
            date: Date.now(),
        }),
            SPINAL_TICKET_SERVICE_LOG_RELATION_NAME,
            SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE,
        ).then(() => {
            return SpinalGraphService
                .moveChildInContext(
                    stepFromId, stepToId, ticketId, contextId,
                    <any>SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
                    SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE,
                );
        }).then(() => { return; });
    }

    public addCommonIncident(processId: string, sentence: string): Promise<boolean | string> {
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
                        .addChild(
                            sectionId, sentenceId,
                            SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME,
                            SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE)
                        .then(() => {
                            return sentenceId;
                        });
                }

                return this.addSentenceSection(processId).then((bool) => {
                    if (bool) {
                        return this.addCommonIncident(processId, sentence);
                    }
                });

            });
    }

    public async getCommonIncident(processId: string): Promise<any> {
        const children = await SpinalGraphService.getChildren(processId, [SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME]);
        if (children && children.length > 0) {
            const sectionId = children[0].id.get();
            const sentences = await SpinalGraphService.getChildren(sectionId, [SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME]);
            return sentences.map(el => el.get());
        }

        return [];
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    //                                              PRIVATE                                         //
    //////////////////////////////////////////////////////////////////////////////////////////////////

    private modifyStepProcessId(stepId: string, processId: string): boolean {


        return SpinalGraphService.modifyNode(stepId, <any>{ processId });

        // if (this.stepByProcess.has(processId)) {
        //   steps = this.stepByProcess.get(processId);

        //   if (steps.indexOf(stepId) !== -1) {
        //     return false;
        //   }

        //   steps.push(stepId);
        //   this.stepByProcess.set(processId, steps);
        //   return true;
        // }

        // this.stepByProcess.set(processId, [stepId]);
        // return true;
    }

    private async modifyTicketStepId(ticketId, stepId): Promise<boolean> {
        const step = await SpinalGraphService.getNodeAsync(stepId);
        return SpinalGraphService.modifyNode(ticketId, <any>{ stepId });
    }

    private createTicket(elementInfo: TicketInterface, infoNode?: any): string {
        let infoNodeRef = infoNode;
        if (!infoNodeRef) { infoNodeRef = elementInfo; }

        infoNodeRef.type = SPINAL_TICKET_SERVICE_TICKET_TYPE;
        const ticket = new SpinalTicket(elementInfo);
        const ticketId = SpinalGraphService.createNode(
            infoNodeRef,
            ticket);
        // this.tickets.add(ticketId);
        return ticketId;
    }

    private createStep(name: string, color: string, order: number, processId?: string): string {
        // this.stepOrderIsValid(processId, order);

        const stepId = SpinalGraphService.createNode({
            name,
            color,
            order,
            type: SPINAL_TICKET_SERVICE_STEP_TYPE,
        }, undefined);

        // this.steps.add(stepId);
        return stepId;
    }

    private getContextSteps(contextId: string): Promise<any> {
        const realNode = SpinalGraphService.getRealNode(contextId);
        if (realNode && realNode.info.steps) {
            return new Promise((resolve, reject) => {
                realNode.info.steps.load(stepsLst => {
                    const steps = stepsLst.get();
                    resolve(steps);
                })

            });
        }

        return Promise.resolve([]);
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
                    .addChild(
                        processId, sentenceId,
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


    // private async stepOrderIsValid(processId: string, order: number = -1) {
    //     const processes = await this.getStepsFromProcess(processId);

    //         if (order >= -1) {
    //             order = processes.length;
    //         }


    // }



}