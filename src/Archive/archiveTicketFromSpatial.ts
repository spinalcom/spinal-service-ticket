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
  SPATIAL_ARCHIVE_TICKET_RELATION,
  SPATIAL_ARCHIVE_TICKET_TYPE,
  GEO_TYPES,
  ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL,
} from '../Constants';

export function archiveTicketFromSpatial(
  ticketNode: SpinalNode,
  spatialNode: SpinalNode,
  date: moment.MomentInput,
  maxArchiveSize = 200
) {
  return _archiveTicket(
    ticketNode,
    spatialNode,
    date,
    maxArchiveSize,
    SPATIAL_ARCHIVE_TICKET_RELATION,
    SPATIAL_ARCHIVE_TICKET_TYPE,
    GEO_TYPES,
    ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL
  );
}
