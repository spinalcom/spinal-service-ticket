"use strict";
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
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const Constants_1 = require("./Constants");
const Errors_1 = require("./Errors");
const SpinalLogTicket_1 = require("spinal-models-ticket/dist/SpinalLogTicket");
const SpinalTicket_1 = require("spinal-models-ticket/dist/SpinalTicket");
const spinal_service_user_1 = require("spinal-service-user");
class ServiceTicket {
    constructor() {
        this.initialized = false;
    }
    isInitialized() {
        return this.initialized;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield spinal_env_viewer_graph_service_1.SpinalGraphService.waitForInitialization();
            this.context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(Constants_1.SERVICE_NAME);
            if (typeof this.context === 'undefined') {
                const context = yield this.createContext();
                this.contextId = context.info.id.get();
            }
            else {
                this.contextId = this.context.info.id.get();
            }
            return this.initVar();
        });
    }
    getProcessByName(name) {
        return this.processNames.get(name);
    }
    addCategory(processId, sentence) {
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
                    .addChildInContext(sectionId, sentenceId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE)
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
    addSubCategory(categoryId, sentence) {
        const sentenceId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
            name: sentence,
            type: Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_TYPE,
        }, undefined);
        return spinal_env_viewer_graph_service_1.SpinalGraphService
            .addChildInContext(categoryId, sentenceId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SUB_SECTION_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SUB_SECTION_RELATION_TYPE)
            .then(() => {
            return Promise.resolve(true);
        });
    }
    addStep(stepId, processId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService
            .addChildInContext(processId, stepId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE)
            .then(() => {
            this.addStepToProcess(stepId, processId);
            return Promise.resolve(true);
        })
            .catch((e) => {
            return Promise.reject(Error(Errors_1.CANNOT_ADD_STEP_TO_PROCESS + e));
        });
    }
    addLocationToTicket(ticketId, bimId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(bimId, ticketId, Constants_1.SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TARGET_RELATION_TYPE).then(() => {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(ticketId, bimId, Constants_1.SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TARGET_RELATION_TYPE);
        });
    }
    addTicketToProcessWithUser(ticketId, processId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const process = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getNodeAsync(processId);
            try {
                const user = spinal_service_user_1.SpinalServiceUser.getUser(userId);
                const addedToUser = yield spinal_service_user_1.SpinalServiceUser
                    .addNode(userId, ticketId, Constants_1.USER_RELATION_NAME, Constants_1.USER_RELATION_TYPE);
                if (addedToUser) {
                    return this.addTicket(ticketId, process.defaultStepId.get());
                }
                return Promise.resolve(Error('CANNOT_ADD_TO_USER'));
            }
            catch (e) {
                return Promise.resolve(Error(e.message));
            }
        });
    }
    addTicketToProcess(ticketId, processId) {
        return __awaiter(this, void 0, void 0, function* () {
            const process = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getNodeAsync(processId);
            return this.addTicket(ticketId, process.defaultStepId.get());
        });
    }
    addTicket(ticketId, stepId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService
            .addChildInContext(stepId, ticketId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)
            .then(() => {
            return this.addTicketToStep(ticketId, stepId);
        })
            .catch((e) => {
            return Promise.reject(Error(Errors_1.CANNOT_ADD_STEP_TO_PROCESS + e));
        });
    }
    createProcess(process) {
        process.type = Constants_1.PROCESS_TYPE;
        const processId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(process, undefined);
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(this.contextId, processId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE).then(() => {
            this.processNames.set(process.name, processId);
            this.processes.add(processId);
            return processId;
            // return this.initProcess(processId).then(() => {
            //   return Promise.resolve(processId);
            // });
        })
            .catch((e) => {
            console.error(e);
            return Promise.reject(Error(Errors_1.CANNOT_CREATE_PROCESS_INTERNAL_ERROR));
        });
    }
    createStep(name, color) {
        const stepId = spinal_env_viewer_graph_service_1.SpinalGraphService
            .createNode({
            name,
            color,
            type: Constants_1.SPINAL_TICKET_SERVICE_STEP_TYPE,
        }, undefined);
        this.steps.add(stepId);
        return stepId;
    }
    createTicket(elementInfo, infoNode) {
        let infoNodeRef = infoNode;
        if (infoNodeRef) {
            infoNodeRef = elementInfo;
        }
        infoNodeRef.type = Constants_1.SPINAL_TICKET_SERVICE_TICKET_TYPE;
        const ticket = new SpinalTicket_1.SpinalTicket(elementInfo);
        const ticketId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(infoNodeRef, ticket);
        this.tickets.add(ticketId);
        return ticketId;
    }
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
    createArchives() {
        return __awaiter(this, void 0, void 0, function* () {
            const archives = yield spinal_env_viewer_graph_service_1.SpinalGraphService
                .getChildren(this.contextId, [Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME]);
            if (archives.length > 0) {
                return;
            }
            const archiveId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                name: Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_NAME,
                type: Constants_1.SERVICE_ARCHIVE_TYPE,
            }, undefined);
            return spinal_env_viewer_graph_service_1.SpinalGraphService
                .addChild(this.contextId, archiveId, Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_TYPE)
                .then((res) => {
                return (true);
            })
                .catch((e) => {
                return Promise.reject(Error(e));
            });
        });
    }
    getContext() {
        if (typeof this.contextId !== 'undefined') {
            return Promise.resolve(this.contextId);
        }
        return this.createContext()
            .then(() => {
            return Promise.resolve(this.contextId);
        });
    }
    getAllProcess() {
        return this.processes;
    }
    getAllProcessAsync() {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildrenInContext(this.contextId, this.contextId)
            .then((children) => {
            for (const [name, childId] of this.processNames) {
                if (!(children.some((child) => child.name.get() === name))) {
                    this.processNames.delete(name);
                    this.processes.delete(childId);
                }
            }
            for (let i = 0; i < children.length; i = i + 1) {
                const child = children[i];
                this.processNames.set(child.name.get(), child.id.get());
                this.processes.add(child.id.get());
            }
            return this.processes;
        })
            .catch((e) => {
            console.error(e);
        });
    }
    getAllTickets() {
        return this.tickets;
    }
    getStepsFromProcess(processId) {
        return this.stepByProcess.get(processId);
    }
    getStepsFromProcessAsync(processId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.findNode(processId)
            .then(node => {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(node.id.get(), [Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME]);
        });
    }
    getTicketsFromStepAsync(stepId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.findNode(stepId)
            .then(node => {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(node.id.get(), [Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME]);
        });
    }
    getTicketsFromStep(stepId) {
        return this.ticketByStep.get(stepId);
    }
    getCategoriesFromProcess(processId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sections = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(processId, [Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME]);
            if (sections.length > 0) {
                const sectionId = sections[0].id.get();
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(sectionId, [])
                    .then((children) => {
                    const res = [];
                    for (let i = 0; i < children.length; i++) {
                        res.push(this.getCategories(children[i].id.get(), []));
                    }
                    return Promise.all(res);
                });
            }
            return [];
        });
    }
    moveTicket(ticketId, stepFromId, stepToId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ticketId === 'undefined'
                || typeof stepFromId === 'undefined'
                || typeof stepToId === 'undefined') {
                return;
            }
            const step = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getNodeAsync(stepToId);
            spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode(ticketId, {
                stepId: stepToId,
                color: step['color'],
            });
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(ticketId, this.createLog({
                ticketId,
                steps: [stepFromId, stepToId],
                date: Date.now(),
            }), Constants_1.SPINAL_TICKET_SERVICE_LOG_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE).then(() => {
                return spinal_env_viewer_graph_service_1.SpinalGraphService
                    .moveChildInContext(stepFromId, stepToId, ticketId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
            }).then(() => { return; });
        });
    }
    getCategories(id, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getNode(id);
            const category = {
                id,
                name: node.name.get(),
                children: [],
                value: node.name.get(),
            };
            if ((typeof node === 'undefined')
                || (node.hasOwnProperty('childrenIds') && node.childrenIds.length === 0)) {
                res.push(category);
                return Promise.resolve(res);
            }
            const children = yield spinal_env_viewer_graph_service_1.SpinalGraphService
                .getChildren(id, [
                Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME,
                Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SUB_SECTION_RELATION_NAME,
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
        });
    }
    initVar() {
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
    retrieveStep() {
        const promises = [];
        for (const processId of this.processes) {
            promises.push(spinal_env_viewer_graph_service_1.SpinalGraphService
                .getChildren(processId, [Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME]));
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
    addStepToProcess(stepId, processId) {
        let steps = [];
        this.processByStep.set(stepId, processId);
        spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode(stepId, { processId });
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
    addTicketToStep(ticketId, stepId) {
        return __awaiter(this, void 0, void 0, function* () {
            let tickets = [];
            const step = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getNodeAsync(stepId);
            spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode(ticketId, { stepId, color: step['color'] });
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
        });
    }
    createContext() {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(Constants_1.SERVICE_NAME, Constants_1.SERVICE_TYPE, undefined)
            .then((context) => {
            this.context = context;
            this.initVar();
            return context;
        })
            .catch((e) => {
            return Promise.reject(Error(Errors_1.CANNOT_CREATE_CONTEXT_INTERNAL_ERROR));
        });
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
                .addChildInContext(processId, sentenceId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE)
                .then((e) => {
                return Promise.resolve(true);
            })
                .catch((e) => {
                return Promise.reject(e);
            });
        });
    }
    initProcess(processId) {
        const steps = this.createDefaultSteps();
        const promises = [];
        spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode(processId, {
            defaultStepId: steps[0],
            finalStepId: steps[2],
        });
        for (const stepId of steps) {
            promises.push(this.addStep(stepId, processId));
        }
        return Promise.all(promises);
    }
    createDefaultSteps() {
        const steps = [];
        for (let i = 0; i < Constants_1.DEFAULT_STEPS.length; i = i + 1) {
            const step = Constants_1.DEFAULT_STEPS[i];
            steps.push(this.createStep(step.name, step.color));
        }
        return steps;
    }
}
exports.ServiceTicket = ServiceTicket;
//# sourceMappingURL=ServiceTicket.js.map