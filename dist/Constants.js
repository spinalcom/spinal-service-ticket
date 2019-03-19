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
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
exports.SERVICE_NAME = 'Ticket Service';
exports.SERVICE_TYPE = 'SpinalSystemServiceTicket';
/////////////////////////////////////////
/////////////// TICKET ///////////////////
exports.SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
exports.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
exports.SPINAL_TICKET_SERVICE_TICKET_ARCHIVE_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
exports.SPINAL_TICKET_SERVICE_TICKET_SECTION = 'SpinalSystemServiceHasTicket';
exports.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME = 'SpinalSystemServiceTicketHasTicket';
exports.SPINAL_TICKET_SERVICE_TICKET_SECTION_NAME = 'Tickets';
exports.SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_NAME = 'SpinalSystemServiceHasTicket';
exports.SPINAL_TICKET_SERVICE_TICKET_ARCHIVE_RELATION_NAME = 'SpinalSystemServiceArchiveHasTicket';
exports.SPINAL_TICKET_SERVICE_TICKET_TYPE = 'SpinalSystemServiceTicketTypeTicket';
/////////////////////////////////////////
/////////////// PROCESS /////////////////
exports.SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
exports.SPINAL_TICKET_SERVICE_PROCESS_ARCHIVE_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
exports.SPINAL_TICKET_SERVICE_PROCESS_ARCHIVE_NAME = 'Spinal_Service_Ticket_Archive_Archive_Process';
exports.SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME = 'SpinalSystemServiceTicketHasProcess';
exports.SPINAL_TICKET_SERVICE_PROCESS_ARCHIVE_RELATION_NAME = 'SpinalSystemServiceArchiveHasProcess';
exports.PROCESS_TYPE = 'SpinalServiceTicketProcess';
exports.SPINAL_TICKET_SERVICE_PROCESS_TYPE = 'SpinalSystemServiceTicketTypeProcess';
exports.PROCESS_HAS_TICKET_RELATION_NAME = 'SpinalSystemService_ProcessHasTicket';
exports.PROCESS_HAS_TICKET_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
//////////////////////////////////////
/////////////// STEP /////////////////
exports.SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
exports.SPINAL_TICKET_SERVICE_STEP_ARCHIVE_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
exports.SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
exports.SPINAL_TICKET_SERVICE_STEP_TYPE = 'SpinalSystemServiceTicketTypeStep';
exports.SPINAL_TICKET_SERVICE_STEP_ARCHIVE_RELATION_NAME = 'SpinalSystemServiceArchiveHasStep';
exports.SPINAL_TICKET_SERVICE_STEP_ARCHIVE_NAME = 'Spinal_Service_Ticket_Archive_Archive_Step';
exports.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME = 'SpinalSystemServiceTicketHasStep';
exports.DEFAULT_STEPS = [
    { name: 'Déclaré', color: '#ff0019' },
    { name: 'Ouvert', color: '#fff112' },
    { name: 'Résolu', color: '#10ff1d' },
];
/////////////////////////////////////////
/////////////// CATEGORY ////////////////
exports.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
exports.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
exports.SPINAL_TICKET_SERVICE_INCIDENT_SUB_SECTION_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
exports.SPINAL_TICKET_SERVICE_INCIDENT_SUB_SECTION_RELATION_NAME = 'Spinal_Service_Ticket_Process_has_sub_category';
exports.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE = 'DEFAULT_INCIDENT_TYPE';
exports.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME = 'Spinal_Service_Ticket_Process_has_category';
exports.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME = 'Spinal_Service_Ticket_Process_has_categories_section';
exports.SPINAL_TICKET_SERVICE_INCIDENT_TYPE = 'INCIDENT_TYPE';
exports.DEFAULT_INCIDENTS_NAME = 'Incidents commun';
/////////////////////////////////////////
/////////////// ARCHIVE /////////////////
exports.SPINAL_TICKET_SERVICE_ARCHIVE_NAME = 'Spinal_Service_Ticket_Archive';
exports.SPINAL_TICKET_SERVICE_TICKET_ARCHIVE_NAME = 'Spinal_Service_Ticket_Archive_Archive_Ticket';
exports.SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME = 'SpinalSystemServiceTicketHasArchive';
exports.SERVICE_ARCHIVE_TYPE = 'SpinalSystemServiceTicketArchive';
/////////////////////////////////////////
/////////////// LOG /////////////////
exports.SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
exports.SPINAL_TICKET_SERVICE_LOG_RELATION_NAME = 'SpinalSystemServiceTicketHasLog';
exports.SERVICE_LOG_TYPE = 'SpinalSystemServiceTicketLog';
/////////////////////////////////////////
/////////////// Target /////////////////
exports.SPINAL_TICKET_SERVICE_TARGET_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
exports.SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME = 'SpinalSystemServiceTicketHasLocation';
/////////////////////////////////////////
/////////////// USER ////////////////////
exports.USER_RELATION_NAME = 'userHasDeclaredTicket';
exports.USER_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_TYPE;
/////////////////////////////////////////
/////////////// ticket ////////////////////
// tickethasReferentiel
//# sourceMappingURL=Constants.js.map