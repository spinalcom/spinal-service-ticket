/*
 * Copyright 2025 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Software license Agreement ("Agreement")
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
import type { SpinalNode } from 'spinal-model-graph';
import { _getAchivePartsFromArchive } from './_getAchivePartsFromArchive';
import { _getArchivePartNameDate } from './_getArchivePartNameDate';
import { _archiveTicket } from './_archiveTicket';
import { _getArchive } from './_getArchive';
import {
  ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS,
  PROCESS_ARCHIVE_TICKET_RELATION,
  PROCESS_ARCHIVE_TICKET_TYPE,
  STEP_TYPE,
} from '../Constants';

export function archiveTicketFromProcess(
  ticketNode: SpinalNode,
  processNode: SpinalNode,
  date: moment.MomentInput,
  maxArchiveSize = 200
) {
  return _archiveTicket(
    ticketNode,
    processNode,
    date,
    maxArchiveSize,
    PROCESS_ARCHIVE_TICKET_RELATION,
    PROCESS_ARCHIVE_TICKET_TYPE,
    [STEP_TYPE],
    ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS
  );
}
