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
import * as moment from 'moment';
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
} from '../Constants';

export async function getTicketsFromArchive(
  processOrSpatialNode: SpinalNode,
  begin: moment.MomentInput,
  end: moment.MomentInput
) {
  const res: SpinalNode[] = [];
  for await (const ticket of getTicketsFromArchiveGen(
    processOrSpatialNode,
    begin,
    end
  )) {
    res.push(ticket);
  }
  return res;
}

export async function* getTicketsFromArchiveGen(
  processOrSpatialNode: SpinalNode,
  begin: moment.MomentInput,
  end: moment.MomentInput
): AsyncGenerator<SpinalNode<any>, void, unknown> {
  const tsBegin = moment(begin).valueOf();
  const tsEnd = moment(end).valueOf();
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
    for (const ticket of tickets) {
      if (
        ticket.info[timeStampAttr]?.get() >= tsBegin &&
        ticket.info[timeStampAttr]?.get() <= tsEnd
      ) {
        yield ticket;
      }
    }
  }
}
