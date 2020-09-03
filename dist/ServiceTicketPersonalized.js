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
const spinal_env_viewer_plugin_documentation_service_1 = require("spinal-env-viewer-plugin-documentation-service");
class ServiceTicketPersonalized {
    constructor() { }
    //////////////////////////////////////////////////////////
    //                      CONTEXTS                        //
    //////////////////////////////////////////////////////////
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
    //////////////////////////////////////////////////////////
    //                      PROCESS                         //
    //////////////////////////////////////////////////////////
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
    getAllProcess(contextId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildrenInContext(contextId, contextId);
    }
    //////////////////////////////////////////////////////////
    //                      STEPS                           //
    //////////////////////////////////////////////////////////
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
    getStepsFromProcess(processId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.findNode(processId)
            .then(node => {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(node.id.get(), [Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME]);
        });
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
    getNextStep(processId, stepId) {
        return __awaiter(this, void 0, void 0, function* () {
            const steps = yield this.getStepsFromProcess(processId);
            if (steps) {
                const step = steps.find(el => el.id.get() === stepId);
                if (step) {
                    const nextOrder = parseInt(step.order.get()) + 1;
                    return steps.find(el => el.order.get() == nextOrder);
                }
            }
        });
    }
    getPreviousStep(processId, stepId) {
        return __awaiter(this, void 0, void 0, function* () {
            const steps = yield this.getStepsFromProcess(processId);
            if (steps) {
                const step = steps.find(el => el.id.get() === stepId);
                if (step) {
                    const nextOrder = parseInt(step.order.get()) - 1;
                    return steps.find(el => el.order.get() == nextOrder);
                }
            }
        });
    }
    //////////////////////////////////////////////////////////
    //                      TICKETS                         //
    //////////////////////////////////////////////////////////
    addTicket(ticketInfo, processId, contextId, nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketId = yield this.createTicket(ticketInfo);
            const stepId = yield this.getFirstStep(processId, contextId);
            return spinal_env_viewer_graph_service_1.SpinalGraphService
                .addChildInContext(stepId, ticketId, contextId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)
                .then(() => __awaiter(this, void 0, void 0, function* () {
                yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(nodeId, ticketId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
                yield this.modifyTicketStepId(ticketId, stepId);
                const userInfo = ticketInfo.user ? ticketInfo.user : {};
                yield this.addLogToTicket(ticketId, Constants_1.LOGS_EVENTS.creation, userInfo, stepId);
                return ticketId;
            }));
            return Promise.resolve(Error('CANNOT_ADD_TO_USER'));
        });
    }
    getTicketsFromNode(nodeId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME]).then(children => children.map(el => el.get()));
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
            // return SpinalGraphService.addChild(ticketId, ,
            //     SPINAL_TICKET_SERVICE_LOG_RELATION_NAME,
            //     SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE,
            // ).then(() => {
            return spinal_env_viewer_graph_service_1.SpinalGraphService
                .moveChildInContext(stepFromId, stepToId, ticketId, contextId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
            // }).then(() => { return; });
        });
    }
    moveTicketToNextStep(contextId, processId, ticketId, userInfo = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(ticketId);
            if (ticketInfo) {
                const stepId = ticketInfo.stepId.get();
                const nextStep = yield this.getNextStep(processId, stepId);
                if (nextStep) {
                    return this.moveTicket(ticketId, stepId, nextStep.id.get(), contextId).then(() => __awaiter(this, void 0, void 0, function* () {
                        yield this.addLogToTicket(ticketId, Constants_1.LOGS_EVENTS.moveToNext, userInfo, stepId, nextStep.id.get());
                    }));
                }
            }
        });
    }
    moveTicketToPreviousStep(contextId, processId, ticketId, userInfo = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(ticketId);
            if (ticketInfo) {
                const stepId = ticketInfo.stepId.get();
                const previousStep = yield this.getPreviousStep(processId, stepId);
                if (previousStep) {
                    return this.moveTicket(ticketId, stepId, previousStep.id.get(), contextId).then(() => __awaiter(this, void 0, void 0, function* () {
                        yield this.addLogToTicket(ticketId, Constants_1.LOGS_EVENTS.moveToPrevious, userInfo, stepId, previousStep.id.get());
                    }));
                }
            }
        });
    }
    //////////////////////////////////////////////////////////
    //                      LOGS                            //
    //////////////////////////////////////////////////////////
    addLogToTicket(ticketId, event, userInfo = {}, fromId, toId) {
        let info = {
            ticketId,
            event: event,
            user: userInfo,
            steps: []
        };
        if (fromId)
            info.steps.push(fromId);
        if (toId)
            info.steps.push(toId);
        const logId = this.createLog(info);
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(ticketId, logId, Constants_1.SPINAL_TICKET_SERVICE_LOG_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE);
    }
    createLog(info) {
        const logId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
            name: "log",
            type: Constants_1.SERVICE_LOG_TYPE,
        }, new SpinalLogTicket_1.SpinalLogTicket(info));
        return logId;
    }
    getLogs(ticketId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(ticketId, [Constants_1.SPINAL_TICKET_SERVICE_LOG_RELATION_NAME]).then(logs => {
            const promises = logs.map(el => el.element.load());
            return Promise.all(promises).then(elements => {
                return elements.map(el => el.get());
            });
        });
    }
    //////////////////////////////////////////////////////////
    //                      COMMON INCIDENT                 //
    //////////////////////////////////////////////////////////
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
    createAttirbute(ticketId) {
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(ticketId);
        const categoryName = "default";
        return spinal_env_viewer_plugin_documentation_service_1.serviceDocumentation.addCategoryAttribute(node, categoryName).then((attributeCategory) => {
            const promises = [];
            if (node) {
                const attributes = node.info._attribute_names;
                for (const element of attributes) {
                    promises.push(spinal_env_viewer_plugin_documentation_service_1.serviceDocumentation.addAttributeByCategory(node, attributeCategory, element, node.info[element]));
                }
                return Promise.all(promises);
            }
        });
    }
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
        ;
        return this.createAttirbute(ticketId).then(() => ticketId);
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