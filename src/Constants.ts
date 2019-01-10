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

import { SPINAL_RELATION_TYPE } from 'spinal-env-viewer-graph-service';

export const SERVICE_NAME: string = 'TicketService';
export const SERVICE_TYPE: string = 'SpinalSystemServiceTicket';

/////////////////////////////////////////
/////////////// TICKET ///////////////////
export const SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_TYPE: string = SPINAL_RELATION_TYPE;
export const SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE: string = SPINAL_RELATION_TYPE;
export const SPINAL_TICKET_SERVICE_TICKET_ARCHIVE_RELATION_TYPE: string = SPINAL_RELATION_TYPE;
export const SPINAL_TICKET_SERVICE_TICKET_SECTION: string = 'SpinalSystemServiceHasTicket';
export const SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME: string = 'SpinalSystemServiceTicketHasTicket';
export const SPINAL_TICKET_SERVICE_TICKET_SECTION_NAME: string = 'Tickets';
export const SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_NAME: string = 'SpinalSystemServiceHasTicket';
export const SPINAL_TICKET_SERVICE_TICKET_ARCHIVE_RELATION_NAME: string = 'SpinalSystemServiceArchiveHasTicket';
export const SPINAL_TICKET_SERVICE_TICKET_TYPE: string = 'SpinalSystemServiceTicketTypeTicket';


/////////////////////////////////////////
/////////////// PROCESS /////////////////
export const SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE: string = SPINAL_RELATION_TYPE;
export const SPINAL_TICKET_SERVICE_PROCESS_ARCHIVE_RELATION_TYPE: string = SPINAL_RELATION_TYPE;
export const SPINAL_TICKET_SERVICE_PROCESS_ARCHIVE_NAME: string = 'Spinal_Service_Ticket_Archive_Archive_Process';
export const SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME: string = 'SpinalSystemServiceTicketHasProcess';
export const SPINAL_TICKET_SERVICE_PROCESS_ARCHIVE_RELATION_NAME: string = 'SpinalSystemServiceArchiveHasProcess';
export const PROCESS_TYPE: string = 'SpinalServiceTicketProcess';
export const SPINAL_TICKET_SERVICE_PROCESS_TYPE: string = 'SpinalSystemServiceTicketTypeProcess';
export const PROCESS_HAS_TICKET_RELATION_NAME: string = 'SpinalSystemService_ProcessHasTicket';
export const PROCESS_HAS_TICKET_RELATION_TYPE: string = SPINAL_RELATION_TYPE;


/////////////////////////////////////////
/////////////// STEP /////////////////
export const SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE: string = SPINAL_RELATION_TYPE;
export const SPINAL_TICKET_SERVICE_STEP_ARCHIVE_RELATION_TYPE: string = SPINAL_RELATION_TYPE;
export const SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_TYPE: string = SPINAL_RELATION_TYPE;
export const SPINAL_TICKET_SERVICE_STEP_TYPE: string = 'SpinalSystemServiceTicketTypeStep';
export const SPINAL_TICKET_SERVICE_STEP_ARCHIVE_RELATION_NAME: string = 'SpinalSystemServiceArchiveHasStep';
export const SPINAL_TICKET_SERVICE_STEP_ARCHIVE_NAME: string = 'Spinal_Service_Ticket_Archive_Archive_Step';
export const SPINAL_TICKET_SERVICE_STEP_RELATION_NAME: string = 'SpinalSystemServiceTicketHasStep';

export const DEFAULT_STEPS: { name: string, color: string }[] = [
  {name: 'Declared', color: '#ff0019'},
  {name: 'Opened', color: '#ff4700'},
  {name: 'Solved', color: '#09ff10'},
];

/////////////////////////////////////////
/////////////// SENTENCE /////////////////
export const SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_TYPE: string = SPINAL_RELATION_TYPE;
export const SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_RELATION_TYPE: string = SPINAL_RELATION_TYPE;
export const SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_TYPE: string = 'DEFAULT_SENTENCE_SECTION_TYPE';
export const SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_RELATION_NAME: string = 'Spinal_Service_Ticket_Process_has_default_sentence';
export const SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_NAME: string = 'Spinal_Service_Ticket_Process_has_default_sentence_section';
export const SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_TYPE: string = 'DEFAULT_SENTENCE_TYPE';

/////////////////////////////////////////
/////////////// ARCHIVE /////////////////
export const SPINAL_TICKET_SERVICE_ARCHIVE_NAME: string = 'Spinal_Service_Ticket_Archive';
export const SPINAL_TICKET_SERVICE_TICKET_ARCHIVE_NAME: string = 'Spinal_Service_Ticket_Archive_Archive_Ticket';
export const SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME: string = 'SpinalSystemServiceTicketHasArchive';
export const SERVICE_ARCHIVE_TYPE: string = 'SpinalSystemServiceTicketArchive';
