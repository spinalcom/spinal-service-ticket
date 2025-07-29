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
exports.ServiceTicket = void 0;
const GraphService_1 = require("./GraphService");
const createTicketContext_1 = require("./Context/createTicketContext");
const getTicketContexts_1 = require("./Context/getTicketContexts");
const updateTicketContexts_1 = require("./Context/updateTicketContexts");
const createTicketProcess_1 = require("./Process/createTicketProcess");
const getAllTicketProcess_1 = require("./Process/getAllTicketProcess");
const createStepToProcess_1 = require("./Step/createStepToProcess");
const removeStepFromProcess_1 = require("./Step/removeStepFromProcess");
const addStepNodeToProcess_1 = require("./Step/addStepNodeToProcess");
const getStepNodesFromProcess_1 = require("./Step/getStepNodesFromProcess");
const getFirstStepNode_1 = require("./Step/getFirstStepNode");
const getNextStepNode_1 = require("./Step/getNextStepNode");
const getPreviousStepNode_1 = require("./Step/getPreviousStepNode");
const getSuperiorsStepNodes_1 = require("./Step/getSuperiorsStepNodes");
const getInferiorsStepNodes_1 = require("./Step/getInferiorsStepNodes");
const insertStepNode_1 = require("./Step/insertStepNode");
const addTicket_1 = require("./Ticket/addTicket");
const getTicketsFromNode_1 = require("./Ticket/getTicketsFromNode");
const getAlarmsFromNode_1 = require("./Ticket/getAlarmsFromNode");
const getTicketsFromStep_1 = require("./Ticket/getTicketsFromStep");
const getProcessFromTicket_1 = require("./Ticket/getProcessFromTicket");
const moveTicketNode_1 = require("./Ticket/moveTicketNode");
const moveTicketToStep_1 = require("./Ticket/moveTicketToStep");
const moveTicketToNextStep_1 = require("./Ticket/moveTicketToNextStep");
const moveTicketToPreviousStep_1 = require("./Ticket/moveTicketToPreviousStep");
const archiveTickets_1 = require("./Ticket/archiveTickets");
const unarchiveTicket_1 = require("./Ticket/unarchiveTicket");
const getTicketContextId_1 = require("./Ticket/getTicketContextId");
const changeTicketProcess_1 = require("./Ticket/changeTicketProcess");
const changeTicketNodeTarget_1 = require("./Ticket/changeTicketNodeTarget");
const addLogToTicketNode_1 = require("./Logs/addLogToTicketNode");
const createTicketLog_1 = require("./Logs/createTicketLog");
const getTicketLogs_1 = require("./Logs/getTicketLogs");
const addCommonIncident_1 = require("./CommonIncident/addCommonIncident");
const getCommonIncident_1 = require("./CommonIncident/getCommonIncident");
const getTicketsFromArchive_1 = require("./Archive/getTicketsFromArchive");
const deleteTicketFromArchive_1 = require("./Archive/deleteTicketFromArchive");
const updateArchivePartData_1 = require("./Archive/updateArchivePartData");
const archiveTicketFromProcess_1 = require("./Archive/archiveTicketFromProcess");
const archiveTicketFromSpatial_1 = require("./Archive/archiveTicketFromSpatial");
class ServiceTicket {
    constructor() { }
    //////////////////////////////////////////////////////////
    //                      CONTEXTS                        //
    //////////////////////////////////////////////////////////
    createContext(contextName, steps = new Array(), contextSubType = 'Ticket') {
        return (0, createTicketContext_1.createTicketContext)(contextName, steps, contextSubType);
    }
    getContexts(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield (0, getTicketContexts_1.getTicketContexts)(name);
            return Array.isArray(contexts)
                ? contexts.map((el) => el.info.get())
                : contexts;
        });
    }
    updateContexts(contextId, newInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const contextNode = (0, GraphService_1.graphServiceGetRealNode)(contextId);
            return (0, updateTicketContexts_1.updateTicketContexts)(contextNode, newInfo);
        });
    }
    //////////////////////////////////////////////////////////
    //                      PROCESS                         //
    //////////////////////////////////////////////////////////
    createProcess(process, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, createTicketProcess_1.createTicketProcess)(process, (0, GraphService_1.graphServiceGetRealNode)(contextId));
            (0, GraphService_1.graphServiceAddNode)(res);
            return res.info.id.get();
        });
    }
    getAllProcess(contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, getAllTicketProcess_1.getAllTicketProcess)((0, GraphService_1.graphServiceGetRealNode)(contextId));
            return res.map((node) => (0, GraphService_1.graphServiceGetRef)(node));
        });
    }
    //////////////////////////////////////////////////////////
    //                      STEPS                           //
    //////////////////////////////////////////////////////////
    addStep(processId, contextId, name, color, order) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, createStepToProcess_1.createStepToProcess)((0, GraphService_1.graphServiceGetRealNode)(processId), (0, GraphService_1.graphServiceGetRealNode)(contextId), name, color, order);
            (0, GraphService_1.graphServiceAddNode)(res);
            return res.info.id.get();
        });
    }
    removeStep(processId, contextId, stepId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, removeStepFromProcess_1.removeStepFromProcess)((0, GraphService_1.graphServiceGetRealNode)(processId), (0, GraphService_1.graphServiceGetRealNode)(contextId), (0, GraphService_1.graphServiceGetRealNode)(stepId));
            (0, GraphService_1.graphServiceAddNode)(res);
            return res.info.id.get();
        });
    }
    addStepById(stepId, processId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, addStepNodeToProcess_1.addStepNodeToProcess)((0, GraphService_1.graphServiceGetRealNode)(stepId), (0, GraphService_1.graphServiceGetRealNode)(processId), (0, GraphService_1.graphServiceGetRealNode)(contextId));
        });
    }
    getStepsFromProcess(processId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, getStepNodesFromProcess_1.getStepNodesFromProcess)((0, GraphService_1.graphServiceGetRealNode)(processId), (0, GraphService_1.graphServiceGetRealNode)(contextId));
            return data.map((step) => {
                return (0, GraphService_1.graphServiceGetRef)(step);
            });
        });
    }
    getFirstStep(processId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const step = yield (0, getFirstStepNode_1.getFirstStepNode)((0, GraphService_1.graphServiceGetRealNode)(processId), (0, GraphService_1.graphServiceGetRealNode)(contextId));
            (0, GraphService_1.graphServiceAddNode)(step);
            return step.info.id.get();
        });
    }
    getNextStep(processId, stepId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const step = yield (0, getNextStepNode_1.getNextStepNode)((0, GraphService_1.graphServiceGetRealNode)(processId), (0, GraphService_1.graphServiceGetRealNode)(stepId), (0, GraphService_1.graphServiceGetRealNode)(contextId));
            if (step) {
                return (0, GraphService_1.graphServiceGetRef)(step);
            }
        });
    }
    getPreviousStep(processId, stepId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const step = yield (0, getPreviousStepNode_1.getPreviousStepNode)((0, GraphService_1.graphServiceGetRealNode)(processId), (0, GraphService_1.graphServiceGetRealNode)(stepId), (0, GraphService_1.graphServiceGetRealNode)(contextId));
            if (step) {
                return (0, GraphService_1.graphServiceGetRef)(step);
            }
        });
    }
    getSuperiorsSteps(contextId, processId, stepOrder, equals = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const steps = yield (0, getSuperiorsStepNodes_1.getSuperiorsStepNodes)((0, GraphService_1.graphServiceGetRealNode)(contextId), (0, GraphService_1.graphServiceGetRealNode)(processId), stepOrder, equals);
            return steps.map((step) => (0, GraphService_1.graphServiceGetInfo)(step));
        });
    }
    getInferiorsSteps(contextId, processId, stepOrder, equals = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const steps = yield (0, getInferiorsStepNodes_1.getInferiorsStepNodes)((0, GraphService_1.graphServiceGetRealNode)(contextId), (0, GraphService_1.graphServiceGetRealNode)(processId), stepOrder, equals);
            return steps.map((step) => (0, GraphService_1.graphServiceGetInfo)(step));
        });
    }
    insertStep(contextId, processId, stepInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const stepNode = yield (0, insertStepNode_1.insertStepNode)((0, GraphService_1.graphServiceGetRealNode)(contextId), (0, GraphService_1.graphServiceGetRealNode)(processId), stepInfo);
            (0, GraphService_1.graphServiceAddNode)(stepNode);
            return stepNode.info.id.get();
        });
    }
    //////////////////////////////////////////////////////////
    //                      TICKETS                         //
    //////////////////////////////////////////////////////////
    addTicket(ticketInfo, processId, contextId, nodeId, ticketType = 'Ticket') {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketNode = yield (0, addTicket_1.addTicket)(ticketInfo, (0, GraphService_1.graphServiceGetRealNode)(processId), (0, GraphService_1.graphServiceGetRealNode)(contextId), (0, GraphService_1.graphServiceGetRealNode)(nodeId), ticketType);
            (0, GraphService_1.graphServiceAddNode)(ticketNode);
            return ticketNode.info.id.get();
        });
    }
    getTicketsFromNode(nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, getTicketsFromNode_1.getTicketsFromNode)((0, GraphService_1.graphServiceGetRealNode)(nodeId));
            return data.map((ticket) => {
                return (0, GraphService_1.graphServiceGetInfo)(ticket);
            });
        });
    }
    getAlarmsFromNode(nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, getAlarmsFromNode_1.getAlarmsFromNode)((0, GraphService_1.graphServiceGetRealNode)(nodeId));
            return data.map((alarm) => (0, GraphService_1.graphServiceGetInfo)(alarm));
        });
    }
    getTicketsFromStep(stepId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, getTicketsFromStep_1.getTicketsFromStep)((0, GraphService_1.graphServiceGetRealNode)(stepId));
            return data.map((ticket) => (0, GraphService_1.graphServiceGetRef)(ticket));
        });
    }
    getTicketProcess(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, getProcessFromTicket_1.getProcessFromTicket)((0, GraphService_1.graphServiceGetRealNode)(ticketId));
            (0, GraphService_1.graphServiceAddNode)(data);
            return data;
        });
    }
    moveTicket(ticketId, stepFromId, stepToId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, moveTicketNode_1.moveTicketNode)((0, GraphService_1.graphServiceGetRealNode)(ticketId), (0, GraphService_1.graphServiceGetRealNode)(stepFromId), (0, GraphService_1.graphServiceGetRealNode)(stepToId), (0, GraphService_1.graphServiceGetRealNode)(contextId));
        });
    }
    moveTicketToStep(ticketId, stepFromId, stepToId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, moveTicketToStep_1.moveTicketToStep)((0, GraphService_1.graphServiceGetRealNode)(ticketId), (0, GraphService_1.graphServiceGetRealNode)(stepFromId), (0, GraphService_1.graphServiceGetRealNode)(stepToId), (0, GraphService_1.graphServiceGetRealNode)(contextId));
        });
    }
    moveTicketToNextStep(contextId, processId, ticketId, userInfo = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, moveTicketToNextStep_1.moveTicketToNextStep)((0, GraphService_1.graphServiceGetRealNode)(contextId), (0, GraphService_1.graphServiceGetRealNode)(processId), (0, GraphService_1.graphServiceGetRealNode)(ticketId), userInfo);
            return (0, GraphService_1.graphServiceGetInfo)(data);
        });
    }
    moveTicketToPreviousStep(contextId, processId, ticketId, userInfo = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, moveTicketToPreviousStep_1.moveTicketToPreviousStep)((0, GraphService_1.graphServiceGetRealNode)(contextId), (0, GraphService_1.graphServiceGetRealNode)(processId), (0, GraphService_1.graphServiceGetRealNode)(ticketId), userInfo);
            return (0, GraphService_1.graphServiceGetInfo)(data);
        });
    }
    ArchiveTickets(contextId, processId, ticketId, userInfo = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, archiveTickets_1.archiveTickets)((0, GraphService_1.graphServiceGetRealNode)(contextId), (0, GraphService_1.graphServiceGetRealNode)(processId), (0, GraphService_1.graphServiceGetRealNode)(ticketId), userInfo);
            return (0, GraphService_1.graphServiceGetInfo)(data);
        });
    }
    unarchiveTicket(contextId, processId, ticketId, userInfo = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, unarchiveTicket_1.unarchiveTicket)((0, GraphService_1.graphServiceGetRealNode)(contextId), (0, GraphService_1.graphServiceGetRealNode)(processId), (0, GraphService_1.graphServiceGetRealNode)(ticketId), userInfo);
            return (0, GraphService_1.graphServiceGetInfo)(data);
        });
    }
    unlinkTicketToProcess(ticketId) { }
    getTicketContextId(ticketId) {
        return (0, getTicketContextId_1.getTicketContextId)((0, GraphService_1.graphServiceGetRealNode)(ticketId));
    }
    changeTicketProcess(ticketId, newProcessId, newContextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, changeTicketProcess_1.changeTicketProcess)((0, GraphService_1.graphServiceGetRealNode)(ticketId), (0, GraphService_1.graphServiceGetRealNode)(newProcessId), (0, GraphService_1.graphServiceGetRealNode)(newContextId));
            (0, GraphService_1.graphServiceAddNode)(data);
            return data.info.id.get();
        });
    }
    /**
     * Changes the target node of a ticket element.
     * e.g change the room linked to a ticket.
     * @param {string} ticketId
     * @param {string} newElementId
     * @return {*}
     * @memberof ServiceTicket
     */
    changeTicketElementNode(ticketId, newElementId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, changeTicketNodeTarget_1.changeTicketNodeTarget)((0, GraphService_1.graphServiceGetRealNode)(ticketId), (0, GraphService_1.graphServiceGetRealNode)(newElementId));
            (0, GraphService_1.graphServiceAddNode)(data);
            return data.info.id.get();
        });
    }
    //////////////////////////////////////////////////////////
    //                      LOGS                            //
    //////////////////////////////////////////////////////////
    addLogToTicket(ticketId, event, userInfo = {}, fromId, toId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, addLogToTicketNode_1.addLogToTicketNode)((0, GraphService_1.graphServiceGetRealNode)(ticketId), event, userInfo, fromId, toId);
                (0, GraphService_1.graphServiceAddNode)(data);
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    createLog(info) {
        const data = (0, createTicketLog_1.createTicketLog)(info);
        (0, GraphService_1.graphServiceAddNode)(data);
        return data.info.id.get();
    }
    getLogs(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, getTicketLogs_1.getTicketLogs)((0, GraphService_1.graphServiceGetRealNode)(ticketId));
        });
    }
    //////////////////////////////////////////////////////////
    //                      COMMON INCIDENT                 //
    //////////////////////////////////////////////////////////
    addCommonIncident(processId, sentence) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, addCommonIncident_1.addCommonIncident)((0, GraphService_1.graphServiceGetRealNode)(processId), sentence);
            (0, GraphService_1.graphServiceAddNode)(data);
            return data.info.id.get();
        });
    }
    getCommonIncident(processId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, getCommonIncident_1.getCommonIncident)((0, GraphService_1.graphServiceGetRealNode)(processId));
            return data.map((incident) => {
                return (0, GraphService_1.graphServiceGetInfo)(incident);
            });
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //                                              ARCHIVE                                         //
    //////////////////////////////////////////////////////////////////////////////////////////////////
    getTicketsFromArchive(processOrSpatialNode, begin, end) {
        return __awaiter(this, void 0, void 0, function* () {
            processOrSpatialNode =
                typeof processOrSpatialNode === 'string'
                    ? (0, GraphService_1.graphServiceGetRealNode)(processOrSpatialNode)
                    : processOrSpatialNode;
            return (0, getTicketsFromArchive_1.getTicketsFromArchive)(processOrSpatialNode, begin, end);
        });
    }
    deleteTicketFromArchive(processOrSpatialNode, begin, end) {
        return __awaiter(this, void 0, void 0, function* () {
            processOrSpatialNode =
                typeof processOrSpatialNode === 'string'
                    ? (0, GraphService_1.graphServiceGetRealNode)(processOrSpatialNode)
                    : processOrSpatialNode;
            if (!processOrSpatialNode)
                throw new Error("deleteTicketFromArchive process or spatial node ID given don't exist in graph service.");
            return (0, deleteTicketFromArchive_1.deleteTicketFromArchive)(processOrSpatialNode, begin, end);
        });
    }
    updateArchivePartData(archivePart, archiveTicketNode, timeStampAttr) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, updateArchivePartData_1.updateArchivePartData)(archivePart, archiveTicketNode, timeStampAttr);
        });
    }
    archiveTicketFromProcess(ticketNode, processNode, date, maxArchiveSize = 200) {
        ticketNode =
            typeof ticketNode === 'string'
                ? (0, GraphService_1.graphServiceGetRealNode)(ticketNode)
                : ticketNode;
        processNode =
            typeof processNode === 'string'
                ? (0, GraphService_1.graphServiceGetRealNode)(processNode)
                : processNode;
        if (!processNode) {
            throw new Error("archiveTicket process node ID given don't exist in graph service.");
        }
        return (0, archiveTicketFromProcess_1.archiveTicketFromProcess)(ticketNode, processNode, date, maxArchiveSize);
    }
    archiveTicketFromSpatial(ticketNode, spatialNode, date, maxArchiveSize = 200) {
        ticketNode =
            typeof ticketNode === 'string'
                ? (0, GraphService_1.graphServiceGetRealNode)(ticketNode)
                : ticketNode;
        spatialNode =
            typeof spatialNode === 'string'
                ? (0, GraphService_1.graphServiceGetRealNode)(spatialNode)
                : spatialNode;
        if (!spatialNode) {
            throw new Error("archiveTicket spatial node ID given don't exist in graph service.");
        }
        return (0, archiveTicketFromSpatial_1.archiveTicketFromSpatial)(ticketNode, spatialNode, date, maxArchiveSize);
    }
}
exports.ServiceTicket = ServiceTicket;
//# sourceMappingURL=ServiceTicket.js.map