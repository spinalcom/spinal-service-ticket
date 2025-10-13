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

import * as moment from 'moment';
import type { SpinalNode } from 'spinal-model-graph';
import { ISpinalNodeArchivePart } from '../interfaces/ISpinalNodePart';
import { _getAchivePartsFromArchive } from './_getAchivePartsFromArchive';
import { _getArchive } from './_getArchive';
import {
  PROCESS_TYPE,
  ARCHIVE_TICKET_PART_TICKET_RELATION,
  ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS,
  ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL,
  PROCESS_ARCHIVE_TICKET_RELATION,
  PROCESS_ARCHIVE_TICKET_TYPE,
  SPATIAL_ARCHIVE_TICKET_RELATION,
  SPATIAL_ARCHIVE_TICKET_TYPE,
  ARCHIVE_TICKET_RELATION_TYPE,
} from '../Constants';
import { _getArchivePartNameDate } from './_getArchivePartNameDate';

export async function deleteTicketFromArchive(
  processOrSpatialNode: SpinalNode,
  begin: number,
  end: number
) {
  if (!processOrSpatialNode)
    throw new Error(
      "deleteTicketFromArchive process or spatial node ID given don't exist in graph service."
    );
  const isProcess = processOrSpatialNode.info.type.get() === PROCESS_TYPE;
  const timeStampAttr = isProcess
    ? ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS
    : ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL;
  const relationName = isProcess
    ? PROCESS_ARCHIVE_TICKET_RELATION
    : SPATIAL_ARCHIVE_TICKET_RELATION;
  const archiveTicketType = isProcess
    ? PROCESS_ARCHIVE_TICKET_TYPE
    : SPATIAL_ARCHIVE_TICKET_TYPE;

  const tsBegin = moment(begin).valueOf();
  const tsEnd = moment(end).valueOf();
  const archiveTicketNode = await _getArchive(
    processOrSpatialNode,
    relationName,
    archiveTicketType
  );
  const archiveParts = await _getAchivePartsFromArchive(archiveTicketNode);
  for (const archivePart of archiveParts) {
    if (
      archivePart.info.end.get() < tsBegin ||
      archivePart.info.start.get() > tsEnd
    )
      continue;
    const tickets = await archivePart.getChildren(
      ARCHIVE_TICKET_PART_TICKET_RELATION
    );
    const ticketsToRm = tickets.filter(
      (ticket) =>
        ticket.info[timeStampAttr]?.get() >= tsBegin &&
        ticket.info[timeStampAttr]?.get() <= tsEnd
    );
    try {
      await archivePart.removeChildren(
        ticketsToRm,
        ARCHIVE_TICKET_PART_TICKET_RELATION,
        ARCHIVE_TICKET_RELATION_TYPE
      );
    } catch (error) {}
    ticketsToRm.forEach((ticket) =>
      ticket.setIndirectModificationDate(Date.now())
    );
    await updateArchivePartData(archivePart, archiveTicketNode, timeStampAttr);
  }
}

async function updateArchivePartData(
  archivePart: ISpinalNodeArchivePart,
  archiveTicketNode: SpinalNode,
  timeStampAttr: string
) {
  const tickets = await archivePart.getChildren(
    ARCHIVE_TICKET_PART_TICKET_RELATION
  );

  if (tickets.length === 0) {
    await archiveTicketNode.removeChild(
      archivePart,
      ARCHIVE_TICKET_PART_TICKET_RELATION,
      ARCHIVE_TICKET_RELATION_TYPE
    );
  } else {
    const start = tickets[0]?.info[timeStampAttr]?.get();
    const end = tickets[tickets.length - 1]?.info[timeStampAttr]?.get();
    archivePart.info.start.set(start);
    archivePart.info.end.set(end);
    archivePart.info.name.set(_getArchivePartNameDate(start, end));
  }
}
