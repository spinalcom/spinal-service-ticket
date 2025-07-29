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
import { SpinalNode } from 'spinal-model-graph';
import { _getAchivePartsFromArchive } from './_getAchivePartsFromArchive';
import { _getArchive } from './_getArchive';
import {
  ARCHIVE_TICKET_PART_RELATION,
  ARCHIVE_TICKET_PART_TICKET_RELATION,
  ARCHIVE_TICKET_PART_TYPE,
  ARCHIVE_TICKET_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE,
} from '../Constants';
import { _getArchivePartNameDate } from './_getArchivePartNameDate';
import { ISpinalNodeArchivePart } from '../interfaces/ISpinalNodePart';

export async function _archiveTicket(
  ticketNode: SpinalNode,
  processOrSpatialNode: SpinalNode,
  date: moment.MomentInput,
  maxArchiveSize: number,
  archiveRelationName: string,
  archiveNodeType: string,
  parentTypes: string[],
  timestampAttr: string
) {
  // getOrCreateArchive
  const archiveTicketNode = await getOrCreateArchive(
    processOrSpatialNode,
    archiveRelationName,
    archiveNodeType
  );

  // getOrCreateArchivePart with date
  const timestamp = moment(date).valueOf();
  const archivePartNode = await getArchivePartFromArchive(
    archiveTicketNode,
    ARCHIVE_TICKET_PART_RELATION,
    ARCHIVE_TICKET_PART_TYPE,
    timestamp,
    maxArchiveSize
  );

  // add ticket to the part
  await archivePartNode.addChild(
    ticketNode,
    ARCHIVE_TICKET_PART_TICKET_RELATION,
    ARCHIVE_TICKET_RELATION_TYPE
  );
  // update part info
  const start = archivePartNode.info.start.get();
  archivePartNode.info.start?.set(start);
  archivePartNode.info.end?.set(timestamp);
  archivePartNode.info.name.set(_getArchivePartNameDate(start, timestamp));
  // add archiveTimestamp to ticket node
  if (!ticketNode.info[timestampAttr])
    ticketNode.info.add_attr(timestampAttr, timestamp);
  else ticketNode.info[timestampAttr].set(timestamp);
  ticketNode.setIndirectModificationDate(Date.now());

  // remove parent step
  await removeTicketFromParent(
    ticketNode,
    SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
    parentTypes
  );
}

async function getOrCreateArchive(
  node: SpinalNode,
  parentRelationName: string,
  childNodeType: string
) {
  const children = await node.getChildren(parentRelationName);
  for (const child of children) {
    if (child.info.type.get() === childNodeType) {
      return child;
    }
  }
  const archive = new SpinalNode(childNodeType, childNodeType);
  await node.addChild(
    archive,
    parentRelationName,
    ARCHIVE_TICKET_RELATION_TYPE
  );
  return archive;
}

async function getArchivePartFromArchive(
  archive: SpinalNode,
  parentRelationName: string,
  childNodeType: string,
  date: moment.MomentInput,
  maxArchiveSize: number
): Promise<ISpinalNodeArchivePart> {
  const children = await archive.getChildren(parentRelationName);
  const child = <ISpinalNodeArchivePart>children[children.length - 1];
  if (
    child &&
    child.info.type.get() === childNodeType &&
    maxArchiveSize > child.getNbChildren()
  ) {
    return child;
  }
  const name = _getArchivePartNameDate(date, date);
  const archivePart = new SpinalNode(name, childNodeType);
  const timestamp = moment(date).valueOf();
  archivePart.info.add_attr({
    start: timestamp,
    end: timestamp,
  });
  await archive.addChild(
    archivePart,
    parentRelationName,
    ARCHIVE_TICKET_RELATION_TYPE
  );
  return <ISpinalNodeArchivePart>archivePart;
}

async function removeTicketFromParent(
  ticketNode: SpinalNode,
  relationName: string,
  parentTypes: string[]
) {
  const parents = await ticketNode.getParents(relationName);
  const parentsFiltered = parents.filter((parent) =>
    parentTypes.includes(parent.info.type.get())
  );
  const proms = parentsFiltered.map((parent) => {
    return parent
      .removeChild(
        ticketNode,
        relationName,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
      )
      .catch(() =>
        console.log(
          `catch erreor remove child for ${ticketNode.info.name.get()}`
        )
      );
  });
  await Promise.all(proms);
}
