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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const OLD_CONSTANTS = require("./old_constants");
__export(require("./old_constants"));
exports.TICKET_CONTEXT_TYPE = OLD_CONSTANTS.SERVICE_NAME;
/////////////////////////////////////////
/////////////// TICKET ///////////////////
exports.TICKET_RELATION_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE; // STEP_TO_TICKET_RELATION_TYPE
exports.TICKET_RELATION_NAME = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME; // STEP_TO_TICKET_RELATION_NAME
exports.TIKET_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_TICKET_TYPE;
/////////////////////////////////////////
/////////////// PROCESS /////////////////
exports.PROCESS_RELATION_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE; // CONTEXT_TO_PROCESS_RELATION_TYPE
exports.PROCESS_RELATION_NAME = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME; //CONTEXT_TO_PROCESS_RELATION_NAME
exports._PROCESS_TYPE = 'SpinalServiceTicketProcess';
//////////////////////////////////////
/////////////// STEP /////////////////
exports.STEP_RELATION_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE; // PROCESS_TO_STEP_RELATION_TYPE
exports.STEP_RELATION_NAME = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME; // PROCESS_TO_STEP_RELATION_NAME
exports.STEP_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_STEP_TYPE;
exports._ARCHIVED_STEP = OLD_CONSTANTS.ARCHIVED_STEP;
exports._DEFAULT_STEPS = OLD_CONSTANTS.DEFAULT_STEPS;
/////////////////////////////////////////
/////////////// CATEGORY ////////////////
exports.INCIDENT_SECTION_RELATION_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE;
exports.INCIDENT_SECTION_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE;
exports.INCIDENT_SECTION_RELATION_NAME = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME;
exports.INCIDENT_RELATION_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE;
exports.INCIDENT_RELATION_NAME = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME;
exports.INCIDENT_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_TYPE;
exports._DEFAULT_INCIDENTS_NAME = OLD_CONSTANTS.DEFAULT_INCIDENTS_NAME;
exports.LOG_RELATION_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE;
exports.LOG_RELATION_NAME = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_LOG_RELATION_NAME;
exports.LOG_TYPE = OLD_CONSTANTS.SERVICE_LOG_TYPE;
exports.LOGS_EVENTS_STEPS = OLD_CONSTANTS.LOGS_EVENTS;
exports._TICKET_PRIORITIES = OLD_CONSTANTS.TICKET_PRIORITIES;
//# sourceMappingURL=Constants.js.map