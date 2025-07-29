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
import { SpinalNode } from 'spinal-model-graph';
import {
  DEFAULT_INCIDENTS_NAME,
  SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME,
  SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME,
  SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE,
  SPINAL_TICKET_SERVICE_INCIDENT_TYPE,
} from '../Constants';

export async function addCommonIncident(
  processNode: SpinalNode,
  sentence: string
): Promise<SpinalNode> {
  const children = await processNode.getChildren(
    SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME
  );
  if (children.length > 0) {
    const sectionNode = children[0];
    const sentenceNode = new SpinalNode(
      sentence,
      SPINAL_TICKET_SERVICE_INCIDENT_TYPE
    );
    await sectionNode.addChild(
      sentenceNode,
      SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME,
      SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE
    );

    return sentenceNode;
  }
  const success = await addSentenceSection(processNode);
  if (success) {
    return addCommonIncident(processNode, sentence);
  }
}

async function addSentenceSection(processNode: SpinalNode): Promise<boolean> {
  const sentenceNode = new SpinalNode(
    DEFAULT_INCIDENTS_NAME,
    SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE
  );
  try {
    sentenceNode.info.add_attr('processId', processNode.info.id.get());
    await processNode.addChild(
      sentenceNode,
      SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME,
      SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE
    );
    return true;
  } catch (error) {
    return false;
  }
}
