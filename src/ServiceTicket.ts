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
    LOGS_EVENTS,
    TICKET_PRIORITIES, ARCHIVED_STEP
} from './Constants';


import { SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";

import {
    CANNOT_ADD_STEP_TO_PROCESS,
    CANNOT_CREATE_CONTEXT_INTERNAL_ERROR,
    CANNOT_CREATE_PROCESS_INTERNAL_ERROR,
    DEFAULT_SENTENCE_SECTION_ALREADY_EXIST,
    PROCESS_ID_DOES_NOT_EXIST,
    PROCESS_NAME_ALREADY_USED,
    STEP_ID_DOES_NOT_EXIST,
    STEP_ORDER_NOT_VALID,
    TICKET_ID_DOES_NOT_EXIST,
    TICKET_SECTION_ALREADY_EXIST,
} from './Errors';


// import {
//     TicketInterface,
// } from 'spinal-models-ticket/declarations/';
// import { SpinalProcess } from 'spinal-models-ticket/SpinalProcess';
// import { SpinalLogTicket } from 'spinal-models-ticket/dist/SpinalLogTicket';

// import {SpinalTicket} from 'spinal-models-ticket'
// import { SpinalTicket } from 'spinal-models-ticket/dist/SpinalTicket';


// import { SpinalServiceUser } from 'spinal-service-user';

//SpinalLogTicket, SpinalProcess, SpinalTicket, SpinalLogTicketInterface, TicketInterface

import { SpinalLogTicket, SpinalLogTicketInterface } from "spinal-models-ticket/dist/SpinalLogTicket";
import { SpinalTicket, TicketInterface } from 'spinal-models-ticket/dist/SpinalTicket';
import { SpinalProcess } from "spinal-models-ticket/dist/SpinalProcess";

import { Lst, Ptr } from 'spinal-core-connectorjs_type';
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import * as moment from "moment";


export class ServiceTicket {

    constructor() { }

    //////////////////////////////////////////////////////////
    //                      CONTEXTS                        //
    //////////////////////////////////////////////////////////

    public createContext(contextName: string, steps: Array<{ name: string, color?: string, order: number }> = new Array()): Promise<any | Error> {

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

    public getContexts(name?: string): any | any[] {
        const contexts = SpinalGraphService.getContextWithType(SERVICE_TYPE);
        if (name && name.trim().length > 0) {
            const found: any = contexts.filter(el => el.getName().get() === name);
            return found ? found.info.get() : undefined;
        }
        return contexts.map(el => el.info.get());
    }

    public async updateContexts(contextId: string, newInfo: { name: string, steps: Array<{ name: string, color?: string, order: number }> }): Promise<any | Error> {
        if (newInfo.name && newInfo.name.trim().length === 0) throw new Error("Context name must have at less 1 character");

        const contextNode = SpinalGraphService.getRealNode(contextId);

        if (contextNode) {
            if (newInfo.name && newInfo.name.trim().length > 0) contextNode.info.name.set(newInfo.name);

            if (!newInfo.steps || newInfo.steps.length > 0) return;

            const oldSteps = await this.getContextSteps(contextId);
            const stepsSorted = this.sortStepByOrder(newInfo.steps);

        }





    }

    //////////////////////////////////////////////////////////
    //                      PROCESS                         //
    //////////////////////////////////////////////////////////

    public createProcess(process: SpinalProcess | string, contextId: string): Promise<string> {
        if (typeof process === "string") process = { name: process };

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

            const promises = steps.map(step => this.createStepNode(step.name, step.color, step.order, processId, contextId));

            await Promise.all([...promises, this.createArchivedStep(processId, contextId)]);

            return processId;
        })
            .catch((e) => {
                console.error(e);
                return Promise.reject(Error(CANNOT_CREATE_PROCESS_INTERNAL_ERROR));
            });
    }

    public getAllProcess(contextId: string) {
        return SpinalGraphService.getChildrenInContext(contextId, contextId);
    }

    //////////////////////////////////////////////////////////
    //                      STEPS                           //
    //////////////////////////////////////////////////////////

    public async addStep(processId: string, contextId: string, name: string, color: string, order: number,): Promise<any | Error> {
        if (order < 0) return Promise.reject(Error(STEP_ORDER_NOT_VALID));

        return this.getStepsFromProcess(processId, contextId).then((steps) => {
            const max = Math.max.apply(Math, steps.map(el => el.order.get()));
            if (order != 0 && !order) order = max + 1;
            if (order > max && max - order > 1) return Promise.reject(Error(STEP_ORDER_NOT_VALID));

            if (order >= 0 && order <= max) {
                return this.insertStep(contextId, processId, { name, color, order });
            } else {
                return this.createStepNode(name, color, order, processId, contextId);
            }
        })
    }

    public async removeStep(processId: string, contextId: string, stepId: string) {
        const stepInfo = SpinalGraphService.getInfo(stepId).get()
        return this.getSuperiorsSteps(contextId, processId, stepInfo.order, true).then(async (steps) => {
            SpinalGraphService.removeFromGraph(stepId);

            for (const step of steps) {
                const realNode = SpinalGraphService.getRealNode(step.id);
                realNode.info.order.set(step.order - 1);
            }

            return stepId;
        })


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

    public getStepsFromProcess(processId: string, contextId: string): Promise<any> {
        return SpinalGraphService.findInContext(processId, contextId, (node) => node.getType().get() === SPINAL_TICKET_SERVICE_STEP_TYPE)
        // .then(nodes => {
        //     return SpinalGraphService.getChildren(node.id.get(),
        //         [SPINAL_TICKET_SERVICE_STEP_RELATION_NAME]);
        // });
    }

    public async getFirstStep(processId: string, contextId: string): Promise<string> {
        const steps = await this.getStepsFromProcess(processId, contextId);

        let first = steps.find(el => el.order.get() == 0);
        if (first) return first.id.get();

        let stepId = await this.createStep("declared", "#ff0000", 0);
        await this.addStepById(stepId, processId, contextId);

        return stepId;
    }

    public async getNextStep(processId: string, stepId: string, contextId: string): Promise<any> {
        const steps = await this.getStepsFromProcess(processId, contextId);
        if (steps) {
            const step = steps.find(el => el.id.get() === stepId);
            if (step && step.order.get() !== -1) {
                const nextOrder = parseInt(step.order.get()) + 1;
                return steps.find(el => el.order.get() == nextOrder);
            }
        }
    }

    public async getPreviousStep(processId: string, stepId: string, contextId: string): Promise<any> {
        const steps = await this.getStepsFromProcess(processId, contextId);
        if (steps) {
            const step = steps.find(el => el.id.get() === stepId);
            if (step && step.order.get() > 0) {
                const nextOrder = parseInt(step.order.get()) - 1;
                return steps.find(el => el.order.get() == nextOrder);
            }
        }
    }

    public async getSuperiorsSteps(contextId: string, processId: string, stepOrder: number, equals: Boolean = false) {
        return this.getStepsFromProcess(processId, contextId).then((steps) => {
            return steps.filter(step => {
                const order = step.order.get();
                if (equals && order === stepOrder) return true;
                return order > stepOrder;
            }).map(el => el.get())
        })
    }

    public async getInferiorsSteps(contextId: string, processId: string, stepOrder: number, equals: Boolean = false) {
        return this.getStepsFromProcess(processId, contextId).then((steps) => {
            return steps.filter(step => {
                const order = step.order.get();
                if (equals && order === stepOrder) return true;
                return order < stepOrder;
            }).map(el => el.get())
        })
    }

    public async insertStep(contextId: string, processId: string, stepInfo: { name: string, color?: string, order: number }) {
        return this.getSuperiorsSteps(contextId, processId, stepInfo.order, true).then(async (steps) => {
            const stepId = await this.createStepNode(stepInfo.name, stepInfo.color, stepInfo.order, processId, contextId);

            for (const step of steps) {
                const realNode = SpinalGraphService.getRealNode(step.id);
                realNode.info.order.set(step.order + 1);
            }

            return stepId;
        })
    }


    //////////////////////////////////////////////////////////
    //                      TICKETS                         //
    //////////////////////////////////////////////////////////


    public async addTicket(ticketInfo: TicketInterface, processId: string, contextId: string, nodeId: string): Promise<string | Error> {
        const ticketId = await this.createTicket(ticketInfo);
        const stepId = await this.getFirstStep(processId, contextId);

        return SpinalGraphService
            .addChildInContext(stepId, ticketId,
                contextId, SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
                SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)
            .then(async () => {
                await SpinalGraphService.addChild(nodeId, ticketId, SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
                    SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);

                await this.modifyTicketStepId(ticketId, stepId);

                const userInfo = ticketInfo.user ? ticketInfo.user : {}
                await this.addLogToTicket(ticketId, LOGS_EVENTS.creation, userInfo, stepId)
                return ticketId;
            })

        return Promise.resolve(Error('CANNOT_ADD_TO_USER'));

    }


    public getTicketsFromNode(nodeId: string) {
        return SpinalGraphService.getChildren(nodeId, [SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME]).then(children => children.map(el => el.get()))
    }

    public getTicketsFromStep(stepId: string): Promise<any> {
        return SpinalGraphService.findNode(stepId)
            .then(node => {
                return SpinalGraphService.getChildren(node.id.get(), [SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME]);
            });
    }

    public async moveTicket(ticketId: string, stepFromId: string, stepToId: string, contextId: string): Promise<any> {
        if (typeof ticketId === 'undefined'
            || typeof stepFromId === 'undefined'
            || typeof stepToId === 'undefined') {
            return;
        }
        const step = await SpinalGraphService.getNodeAsync(stepToId);
        await SpinalGraphService.modifyNode(ticketId, <any>{
            stepId: stepToId
        });

        return SpinalGraphService
            .moveChildInContext(
                stepFromId, stepToId, ticketId, contextId,
                <any>SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
                SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)
    }

    public async moveTicketToNextStep(contextId: string, processId: string, ticketId: string, userInfo: Object = {}): Promise<void> {
        const ticketInfo = SpinalGraphService.getInfo(ticketId);
        if (ticketInfo) {
            const stepId = ticketInfo.stepId.get()
            const nextStep = await this.getNextStep(processId, stepId, contextId);
            if (nextStep) {
                return this.moveTicket(ticketId, stepId, nextStep.id.get(), contextId).then(async () => {

                    await this.addLogToTicket(ticketId, LOGS_EVENTS.moveToNext, userInfo, stepId, nextStep.id.get())
                    return nextStep.get();
                });
            }
        }
    }

    public async moveTicketToPreviousStep(contextId: string, processId: string, ticketId: string, userInfo: object = {}): Promise<void> {
        const ticketInfo = SpinalGraphService.getInfo(ticketId);
        if (ticketInfo) {
            const stepId = ticketInfo.stepId.get()
            const previousStep = await this.getPreviousStep(processId, stepId, contextId);
            if (previousStep) {
                return this.moveTicket(ticketId, stepId, previousStep.id.get(), contextId).then(async () => {

                    await this.addLogToTicket(ticketId, LOGS_EVENTS.moveToPrevious, userInfo, stepId, previousStep.id.get());
                    return previousStep.get();
                });
            }
        }
    }

    public async ArchiveTickets(contextId: string, processId: string, ticketId: string, userInfo: Object = {}): Promise<any> {
        const archiveId = await this.createArchivedStep(processId, contextId);
        const ticketInfo = SpinalGraphService.getInfo(ticketId);

        if (ticketInfo && archiveId) {
            const fromId = ticketInfo.stepId.get()
            await this.moveTicket(ticketId, fromId, archiveId, contextId);
            await this.addLogToTicket(ticketId, LOGS_EVENTS.archived, userInfo, fromId, archiveId);
            return SpinalGraphService.getInfo(archiveId).get();
        }
    }

    public async unarchiveTicket(contextId: string, processId: string, ticketId: string, userInfo: Object = {}): Promise<any> {
        const ticketInfo = SpinalGraphService.getInfo(ticketId);
        const firstStep = await this.getFirstStep(processId, contextId);

        if (ticketInfo && firstStep) {
            const fromId = ticketInfo.stepId.get()
            await this.moveTicket(ticketId, fromId, firstStep, contextId);
            await this.addLogToTicket(ticketId, LOGS_EVENTS.unarchive, userInfo, fromId, firstStep);
            return SpinalGraphService.getInfo(firstStep).get();
        }

    }

    public unlinkTicketToProcess(ticketId: string) {

    }

    public getTicketContextId(ticketId: string): string {
        const realNode = SpinalGraphService.getRealNode(ticketId);
        if (realNode) {
            return realNode.contextIds._attribute_names.find(id => {
                const node = SpinalGraphService.getRealNode(id);
                if (!node) return false;
                return node.getType().get() === SERVICE_TYPE;
            })
        }
    }

    public async changeTicketProcess(ticketId: string, newProcessId: string, newContextId?: string) {
        let ticketInfo = SpinalGraphService.getInfo(ticketId);
        let oldContextId = this.getTicketContextId(ticketId);
        const contextId = newContextId || oldContextId;

        const stepId = await this.getFirstStep(newProcessId, contextId);
        const oldStepId = ticketInfo.stepId.get();

        if (contextId === oldContextId) {
            await SpinalGraphService.moveChildInContext(oldStepId, stepId, ticketId, contextId, SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)
        } else {
            await this.removeFromContextId(ticketId, oldStepId, oldContextId);
            await SpinalGraphService.addChildInContext(stepId, ticketId, contextId, SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)
        }

        await this.modifyTicketStepId(ticketId, stepId);
        const userInfo = ticketInfo && ticketInfo.user ? ticketInfo.user.get() : {};
        await this.addLogToTicket(ticketId, LOGS_EVENTS.creation, userInfo, stepId);

        return ticketId;


    }

    //////////////////////////////////////////////////////////
    //                      LOGS                            //
    //////////////////////////////////////////////////////////


    public addLogToTicket(ticketId: string, event: number, userInfo: Object = {}, fromId?: string, toId?: string): any {

        let info = {
            ticketId: ticketId,
            event: event,
            user: userInfo,
            steps: []
        };

        if (fromId) info.steps.push(fromId)
        if (toId) info.steps.push(toId)

        const logId = this.createLog(info);

        return SpinalGraphService.addChild(
            ticketId,
            logId,
            SPINAL_TICKET_SERVICE_LOG_RELATION_NAME,
            SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE,
        )

    }

    public createLog(info: SpinalLogTicketInterface): string {
        const logId = SpinalGraphService.createNode(
            {
                name: "log",// info.ticketId,
                type: SERVICE_LOG_TYPE,
            },
            new SpinalLogTicket(info));

        return logId;
    }

    public getLogs(ticketId: string): Promise<SpinalLogTicket[]> {
        return SpinalGraphService.getChildren(ticketId, [SPINAL_TICKET_SERVICE_LOG_RELATION_NAME]).then(logs => {
            const promises = logs.map(el => el.element.load());
            return Promise.all(promises).then(elements => {
                return elements.map(el => el.get())
            })
        });
    }


    //////////////////////////////////////////////////////////
    //                      COMMON INCIDENT                 //
    //////////////////////////////////////////////////////////

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


    private createAttribute(ticketId: string): Promise<any> {
        const node = SpinalGraphService.getRealNode(ticketId);
        const categoryName: string = "default";

        return serviceDocumentation.addCategoryAttribute(node, categoryName).then((attributeCategory) => {
            const promises = []
            if (node) {
                const attributes = ["name", "priority", "user", "creationDate"];


                for (const element of attributes) {
                    promises.push(serviceDocumentation.addAttributeByCategory(node, attributeCategory, element, this.getObjData(element, node.info[element])))
                }
                return Promise.all(promises)
            }
        })


    }

    private modifyStepProcessId(stepId: string, processId: string): boolean {
        return SpinalGraphService.modifyNode(stepId, <any>{ processId });
    }

    private async modifyTicketStepId(ticketId, stepId): Promise<boolean> {
        const step = await SpinalGraphService.getNodeAsync(stepId);
        return SpinalGraphService.modifyNode(ticketId, <any>{ stepId });
    }

    private createTicket(elementInfo: TicketInterface, infoNode?: any): Promise<string> {
        let infoNodeRef = infoNode;
        if (!infoNodeRef) { infoNodeRef = elementInfo; }

        infoNodeRef.type = SPINAL_TICKET_SERVICE_TICKET_TYPE;
        const ticket = new SpinalTicket(elementInfo);
        const ticketId = SpinalGraphService.createNode(infoNodeRef, ticket);
        // this.tickets.add(ticketId);
        ;
        return this.createAttribute(ticketId).then(() => ticketId)
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

    private getObjData(key, valueModel): any {

        switch (key) {
            case "name":
                return valueModel;

            case "priority":
                const found = Object.keys(TICKET_PRIORITIES).find(el => TICKET_PRIORITIES[el] == valueModel.get())
                return found ? found : "-";

            case "user":
                return valueModel && valueModel.name ? valueModel.name.get() : "unknown";

            case "creationDate":
                return moment(valueModel.get()).format('MMMM Do YYYY, h:mm:ss a');
        }

    }

    private createArchivedStep(processId: string, contextId: string): Promise<any> {
        return this.getStepsFromProcess(processId, contextId).then((result) => {
            const found = result.find(el => el.name.get() === ARCHIVED_STEP.name && el.order.get() === ARCHIVED_STEP.order);
            if (found) return found.id.get();

            return this.createStepNode(ARCHIVED_STEP.name, ARCHIVED_STEP.color, ARCHIVED_STEP.order, processId, contextId);
        })
    }

    private async createStepNode(name: string, color: string, order: number, processId: string, contextId: string): Promise<any> {
        const stepId = await this.createStep(name, color, order, processId);

        return SpinalGraphService
            .addChildInContext(processId, stepId, contextId,
                SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
                SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE)
            .then(async () => {
                await this.modifyStepProcessId(stepId, processId);
                return stepId;
            })
            .catch((e) => {
                return Promise.reject(Error(CANNOT_ADD_STEP_TO_PROCESS + e));
            });
    }

    private sortStepByOrder(steps: Array<{ name: string, order: number, color?: string, }>): Array<{ name: string, order: number, color?: string, }> {
        const stepsSorted = [...steps].sort((a, b) => a.order - b.order);

        for (let index = 0; index < stepsSorted.length; index++) {
            stepsSorted[index].order = index;
        }

        return stepsSorted;
    }

    private async removeFromContextId(ticketId: string, oldStepId: string, oldContextId: string): Promise<boolean> {
        return SpinalGraphService.removeChild(oldStepId, ticketId, SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE).then((result) => {
            const realNode = SpinalGraphService.getRealNode(ticketId);
            try {
                realNode.contextIds.delete(oldContextId);
                return true;
            } catch (error) {
                return false;
            }
        })

    }
}