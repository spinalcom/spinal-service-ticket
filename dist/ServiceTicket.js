"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const Constants_1 = require("./Constants");
const Errors_1 = require("./Errors");
const Constants_2 = require("../declarations/Constants");
class ServiceTicket {
    constructor() {
    }
    init() {
        this.context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(Constants_1.SERVICE_NAME);
        if (typeof this.context !== 'undefined') {
            this.initVar(this.context.info.id.get())
                .catch((e) => {
                throw new Error(e);
            });
        }
        else {
            this.createContext()
                .catch((e) => {
                throw new Error(e);
            });
        }
    }
    addDefaultSentence(processId, sentence) {
        if (!this.processes.has(processId)) {
            return Promise.reject(Errors_1.PROCESS_ID_DOES_NOT_EXIST);
        }
        const sentenceId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({ name: sentence });
        return spinal_env_viewer_graph_service_1.SpinalGraphService
            .addChildInContext(processId, sentenceId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_RELATION_NAME, Constants_2.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_RELATION_TYPE)
            .then(() => {
            return Promise.resolve(true);
        });
    }
    addStep(stepId, processId) {
        if (!this.processes.has(processId)) {
            return Promise.reject(Error(Errors_1.PROCESS_ID_DOES_NOT_EXIST));
        }
        if (!this.steps.has(stepId)) {
            return Promise.reject(Error(Errors_1.STEP_ID_DOES_NOT_EXIST));
        }
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
    addTicket(ticketId, stepId) {
        if (!this.steps.has(stepId)) {
            return Promise.reject(Error(Errors_1.STEP_ID_DOES_NOT_EXIST));
        }
        if (!this.tickets.has(ticketId)) {
            return Promise.reject(Error(Errors_1.TICKET_ID_DOES_NOT_EXIST));
        }
        return spinal_env_viewer_graph_service_1.SpinalGraphService
            .addChildInContext(stepId, ticketId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)
            .then(() => {
            this.addTicketToStep(ticketId, stepId);
            return Promise.resolve(true);
        })
            .catch((e) => {
            return Promise.reject(Error(Errors_1.CANNOT_ADD_STEP_TO_PROCESS + e));
        });
    }
    createProcess(name) {
        if (this.processNames.has(name)) {
            return Promise.reject(Error(Errors_1.PROCESS_NAME_ALREADY_USED));
        }
        const processId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({ name, PROCESS_TYPE: Constants_1.PROCESS_TYPE });
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(this.contextId, processId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE).then(() => {
            this.processNames.add(name);
            this.processes.add(processId);
            return Promise.resolve(processId);
        })
            .catch((e) => {
            console.error(e);
            return Promise.reject(Error(Errors_1.CANNOT_CREATE_PROCESS_INTERNAL_ERROR));
        });
    }
    createStep(name, color) {
        const stepId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({ name, color });
        this.steps.add(stepId);
        return stepId;
    }
    createTicket(info) {
        const ticketId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({ name: info.name }, info);
        this.tickets.add(ticketId);
        return ticketId;
    }
    createArchives() {
        const archives = spinal_env_viewer_graph_service_1.SpinalGraphService
            .getChildren(this.contextId, [Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME]);
        if (archives.leght > 0) {
            return;
        }
        const archiveId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
            name: Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_NAME,
            type: Constants_1.SERVICE_ARCHIVE_TYPE,
        });
        return spinal_env_viewer_graph_service_1.SpinalGraphService
            .addChild(this.contextId, archiveId, Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_TYPE)
            .then((res) => {
            return Promise.resolve(true);
        })
            .catch((e) => {
            return Promise.reject(Error(e));
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
    getAllTickets() {
        return this.tickets;
    }
    getStepsFromProcess(processId) {
        return this.stepByProcess.get(processId);
    }
    getTicketsFromStep(stepId) {
        return this.ticketByStep.get(stepId);
    }
    initVar(contextId) {
        this.processes = new Set();
        this.processNames = new Set();
        this.steps = new Set();
        this.tickets = new Set();
        this.stepByProcess = new Map();
        this.ticketByStep = new Map();
        this.contextId = contextId;
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(contextId, Constants_1.SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME)
            .then((children) => {
            for (let i = 0; i < children.length; i = i + 1) {
                const child = children[i];
                this.processNames.add(child.info.name.get());
                this.processes.add(child);
            }
            this.initialized = true;
        })
            .catch((e) => {
        });
    }
    addStepToProcess(stepId, processId) {
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
    addTicketToStep(ticketId, stepId) {
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
    createContext() {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(Constants_1.SERVICE_NAME, Constants_1.SERVICE_TYPE, undefined)
            .then((context) => {
            this.context = context;
            this.contextId = context.info.id.get();
            this.initVar(context.info.id.get());
            return Promise.resolve(context);
        })
            .catch((e) => {
            console.error(e);
            return Promise.reject(Error(Errors_1.CANNOT_CREATE_CONTEXT_INTERNAL_ERROR));
        });
    }
    addSentenceSection(processId) {
        if (!this.processes.has(processId)) {
            throw new Error(Errors_1.PROCESS_ID_DOES_NOT_EXIST);
        }
        return spinal_env_viewer_graph_service_1.SpinalGraphService
            .getChildren(processId, [Constants_1.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_NAME])
            .then((children) => {
            if (children.length > 0) {
                return Promise.reject(Errors_1.DEFAULT_SENTECE_SECTION_ALREADY_EXIST);
            }
            const sentenceId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                name: 'Default Sentence.',
            });
            return spinal_env_viewer_graph_service_1.SpinalGraphService
                .addChildInContext(processId, sentenceId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_TYPE)
                .then(() => {
                return Promise.resolve(true);
            })
                .catch((e) => {
                return Promise.reject(e);
            });
        });
    }
}
exports.ServiceTicket = ServiceTicket;
//# sourceMappingURL=ServiceTicket.js.map