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
import { attributeService } from 'spinal-env-viewer-plugin-documentation-service';

export async function getTicketInfo(
  ticketNode: SpinalNode
): Promise<Record<string, string>>;
export async function getTicketInfo<T extends readonly string[]>(
  ticketNode: SpinalNode,
  attributesToGet: T
): Promise<{ [V in T[number]]: string }>;
export async function getTicketInfo<T extends readonly string[]>(
  ticketNode: SpinalNode,
  attributesToGet?: T
) {
  if (Array.isArray(attributesToGet) && attributesToGet.length > 0) {
    const data = await attributeService.getAttrBySchema(ticketNode, {
      default: attributesToGet,
    } as const);
    return data.default;
  }
  const category = await attributeService.getCategoryByName(
    ticketNode,
    'default'
  );
  if (!category) return;
  const attributes = await attributeService.getAttributesByCategory(
    ticketNode,
    category
  );
  const data: Record<string, string> = {};
  for (const attr of attributes) {
    const label = attr.label.get();
    const value = attr.value.get();
    if (label && value) data[label] = value;
  }
  return data;
}
