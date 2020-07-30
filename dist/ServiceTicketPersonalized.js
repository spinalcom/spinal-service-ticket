"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const Errors_1 = require("./Errors");
const SpinalLogTicket_1 = require("spinal-models-ticket/dist/SpinalLogTicket");
const SpinalTicket_1 = require("spinal-models-ticket/dist/SpinalTicket");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
class ServiceTicketPersonalized {
    constructor() { }
    createContext(contextName, steps = new Array()) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(contextName, Constants_1.SERVICE_TYPE, undefined)
            .then((context) => {
            // this.context = context;
            // this.initVar();
            const stepsModel = new spinal_core_connectorjs_type_1.Lst(steps);
            context.info.add_attr("steps", new spinal_core_connectorjs_type_1.Ptr(stepsModel));
            return context;
        })
            .catch((e) => {
            return Promise.reject(Error(Errors_1.CANNOT_CREATE_CONTEXT_INTERNAL_ERROR));
        });
    }
    getContexts() {
        const contexts = spinal_env_viewer_graph_service_1.SpinalGraphService.getContextWithType(Constants_1.SERVICE_TYPE);
        return contexts.map(el => el.info.get());
    }
    createProcess(process, contextId) {
        process.type = Constants_1.PROCESS_TYPE;
        const processId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(process, undefined);
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(contextId, processId, contextId, Constants_1.SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE).then(() => __awaiter(this, void 0, void 0, function* () {
            const steps = yield this.getContextSteps(contextId);
            const promises = steps.map(step => this.addStep(step.name, step.color, step.order, processId, contextId));
            yield Promise.all(promises);
            return processId;
        }))
            .catch((e) => {
            console.error(e);
            return Promise.reject(Error(Errors_1.CANNOT_CREATE_PROCESS_INTERNAL_ERROR));
        });
    }
    addStep(name, color, order, processId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const stepId = yield this.createStep(name, color, order, processId);
            return spinal_env_viewer_graph_service_1.SpinalGraphService
                .addChildInContext(processId, stepId, contextId, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE)
                .then(() => {
                return this.modifyStepProcessId(stepId, processId);
            })
                .catch((e) => {
                return Promise.reject(Error(Errors_1.CANNOT_ADD_STEP_TO_PROCESS + e));
            });
        });
    }
    addStepById(stepId, processId, contextId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService
            .addChildInContext(processId, stepId, contextId, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE)
            .then(() => {
            return this.modifyStepProcessId(stepId, processId);
        })
            .catch((e) => {
            return Promise.reject(Error(Errors_1.CANNOT_ADD_STEP_TO_PROCESS + e));
        });
    }
    addTicket(ticketInfo, processId, contextId, nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketId = this.createTicket(ticketInfo);
            const stepId = yield this.getFirstStep(processId, contextId);
            return spinal_env_viewer_graph_service_1.SpinalGraphService
                .addChildInContext(stepId, ticketId, contextId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)
                .then(() => __awaiter(this, void 0, void 0, function* () {
                yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(nodeId, ticketId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
                return this.modifyTicketStepId(ticketId, stepId);
            }))
                .catch((e) => {
                return Promise.reject(Error(Errors_1.CANNOT_ADD_STEP_TO_PROCESS + e));
            });
        });
    }
    addLocationToTicket(ticketId, bimId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(bimId, ticketId, Constants_1.SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TARGET_RELATION_TYPE).then(() => {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(ticketId, bimId, Constants_1.SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TARGET_RELATION_TYPE);
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
    createLog(info) {
        const logId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
            name: info.ticketId,
            type: Constants_1.SERVICE_LOG_TYPE,
        }, new SpinalLogTicket_1.SpinalLogTicket(info));
        return logId;
    }
    getTicketForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let children = [];
            try {
                children = yield spinal_env_viewer_graph_service_1.SpinalGraphService
                    .getChildren(userId, [Constants_1.USER_RELATION_NAME]);
                return children;
            }
            catch (e) {
                console.error(e);
                spinal_env_viewer_graph_service_1.SpinalGraphService.findNode(userId)
                    .then(nodeRef => {
                    return spinal_env_viewer_graph_service_1.SpinalGraphService
                        .getChildren(userId, [Constants_1.USER_RELATION_NAME]);
                });
            }
        });
    }
    createArchives(contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const archives = yield spinal_env_viewer_graph_service_1.SpinalGraphService
                .getChildren(contextId, [Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME]);
            if (archives.length > 0) {
                return;
            }
            const archiveId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                name: Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_NAME,
                type: Constants_1.SERVICE_ARCHIVE_TYPE,
            }, undefined);
            return spinal_env_viewer_graph_service_1.SpinalGraphService
                .addChild(contextId, archiveId, Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_TYPE)
                .then((res) => {
                return (true);
            })
                .catch((e) => {
                return Promise.reject(Error(e));
            });
        });
    }
    getAllProcess(contextId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildrenInContext(contextId, contextId);
        // .then(
        //     (children) => {
        //         return children.map(child => child.id.get())
        //     },
        // )
        // .catch((e) => {
        //     console.error(e);
        // });
    }
    getFirstStep(processId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const steps = yield this.getStepsFromProcess(processId);
            let first = steps.find(el => el.order.get() == 0);
            if (first)
                return first.id.get();
            let stepId = yield this.createStep("declared", "#ff0000", 0);
            yield this.addStepById(stepId, processId, contextId);
            return stepId;
        });
    }
    getStepsFromProcess(processId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.findNode(processId)
            .then(node => {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(node.id.get(), [Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME]);
        });
    }
    getTicketsFromStep(stepId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.findNode(stepId)
            .then(node => {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(node.id.get(), [Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME]);
        });
    }
    moveTicket(ticketId, stepFromId, stepToId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ticketId === 'undefined'
                || typeof stepFromId === 'undefined'
                || typeof stepToId === 'undefined') {
                return;
            }
            const step = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getNodeAsync(stepToId);
            spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode(ticketId, {
                stepId: stepToId
            });
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(ticketId, this.createLog({
                ticketId,
                steps: [stepFromId, stepToId],
                date: Date.now(),
            }), Constants_1.SPINAL_TICKET_SERVICE_LOG_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE).then(() => {
                return spinal_env_viewer_graph_service_1.SpinalGraphService
                    .moveChildInContext(stepFromId, stepToId, ticketId, contextId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
            }).then(() => { return; });
        });
    }
    addCommonIncident(processId, sentence) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService
            .getChildren(processId, [Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME])
            .then((children) => {
            if (children.length > 0) {
                const sectionId = children[0].id.get();
                const sentenceId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                    name: sentence,
                    type: Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_TYPE,
                }, undefined);
                return spinal_env_viewer_graph_service_1.SpinalGraphService
                    .addChild(sectionId, sentenceId, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE)
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
    getCommonIncident(processId) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(processId, [Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME]);
            if (children && children.length > 0) {
                const sectionId = children[0].id.get();
                const sentences = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(sectionId, [Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME]);
                return sentences.map(el => el.get());
            }
            return [];
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //                                              PRIVATE                                         //
    //////////////////////////////////////////////////////////////////////////////////////////////////
    modifyStepProcessId(stepId, processId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode(stepId, { processId });
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
    modifyTicketStepId(ticketId, stepId) {
        return __awaiter(this, void 0, void 0, function* () {
            const step = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getNodeAsync(stepId);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode(ticketId, { stepId });
        });
    }
    createTicket(elementInfo, infoNode) {
        let infoNodeRef = infoNode;
        if (!infoNodeRef) {
            infoNodeRef = elementInfo;
        }
        infoNodeRef.type = Constants_1.SPINAL_TICKET_SERVICE_TICKET_TYPE;
        const ticket = new SpinalTicket_1.SpinalTicket(elementInfo);
        const ticketId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(infoNodeRef, ticket);
        // this.tickets.add(ticketId);
        return ticketId;
    }
    createStep(name, color, order, processId) {
        // this.stepOrderIsValid(processId, order);
        const stepId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
            name,
            color,
            order,
            type: Constants_1.SPINAL_TICKET_SERVICE_STEP_TYPE,
        }, undefined);
        // this.steps.add(stepId);
        return stepId;
    }
    getContextSteps(contextId) {
        const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(contextId);
        if (realNode && realNode.info.steps) {
            return new Promise((resolve, reject) => {
                realNode.info.steps.load(stepsLst => {
                    const steps = stepsLst.get();
                    resolve(steps);
                });
            });
        }
        return Promise.resolve([]);
    }
    addSentenceSection(processId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService
            .getChildren(processId, [Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME])
            .then((children) => {
            if (children.length > 0) {
                return Promise.reject(Errors_1.DEFAULT_SENTENCE_SECTION_ALREADY_EXIST);
            }
            const sentenceId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                processId,
                name: Constants_1.DEFAULT_INCIDENTS_NAME,
                type: Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE,
            }, undefined);
            return spinal_env_viewer_graph_service_1.SpinalGraphService
                .addChild(processId, sentenceId, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE)
                .then((e) => {
                return Promise.resolve(true);
            })
                .catch((e) => {
                return Promise.reject(e);
            });
        });
    }
}
exports.ServiceTicketPersonalized = ServiceTicketPersonalized;
//# sourceMappingURL=ServiceTicketPersonalized.js.map