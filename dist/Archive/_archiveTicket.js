"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._archiveTicket = void 0;
const moment = require("moment");
const spinal_model_graph_1 = require("spinal-model-graph");
const Constants_1 = require("../Constants");
const _getArchivePartNameDate_1 = require("./_getArchivePartNameDate");
function _archiveTicket(ticketNode, processOrSpatialNode, date, maxArchiveSize, archiveRelationName, archiveNodeType, parentTypes, timestampAttr) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // getOrCreateArchive
        const archiveTicketNode = yield getOrCreateArchive(processOrSpatialNode, archiveRelationName, archiveNodeType);
        // getOrCreateArchivePart with date
        const timestamp = moment(date).valueOf();
        const archivePartNode = yield getArchivePartFromArchive(archiveTicketNode, Constants_1.ARCHIVE_TICKET_PART_RELATION, Constants_1.ARCHIVE_TICKET_PART_TYPE, timestamp, maxArchiveSize);
        // add ticket to the part
        yield archivePartNode.addChild(ticketNode, Constants_1.ARCHIVE_TICKET_PART_TICKET_RELATION, Constants_1.ARCHIVE_TICKET_RELATION_TYPE);
        // update part info
        const start = archivePartNode.info.start.get();
        (_a = archivePartNode.info.start) === null || _a === void 0 ? void 0 : _a.set(start);
        (_b = archivePartNode.info.end) === null || _b === void 0 ? void 0 : _b.set(timestamp);
        archivePartNode.info.name.set((0, _getArchivePartNameDate_1._getArchivePartNameDate)(start, timestamp));
        // add archiveTimestamp to ticket node
        if (!ticketNode.info[timestampAttr])
            ticketNode.info.add_attr(timestampAttr, timestamp);
        else
            ticketNode.info[timestampAttr].set(timestamp);
        ticketNode.setIndirectModificationDate(Date.now());
        // remove parent step
        yield removeTicketFromParent(ticketNode, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, parentTypes);
    });
}
exports._archiveTicket = _archiveTicket;
function getOrCreateArchive(node, parentRelationName, childNodeType) {
    return __awaiter(this, void 0, void 0, function* () {
        const children = yield node.getChildren(parentRelationName);
        for (const child of children) {
            if (child.info.type.get() === childNodeType) {
                return child;
            }
        }
        const archive = new spinal_model_graph_1.SpinalNode(childNodeType, childNodeType);
        yield node.addChild(archive, parentRelationName, Constants_1.ARCHIVE_TICKET_RELATION_TYPE);
        return archive;
    });
}
function getArchivePartFromArchive(archive, parentRelationName, childNodeType, date, maxArchiveSize) {
    return __awaiter(this, void 0, void 0, function* () {
        const children = yield archive.getChildren(parentRelationName);
        const child = children[children.length - 1];
        if (child &&
            child.info.type.get() === childNodeType &&
            maxArchiveSize > child.getNbChildren()) {
            return child;
        }
        const name = (0, _getArchivePartNameDate_1._getArchivePartNameDate)(date, date);
        const archivePart = new spinal_model_graph_1.SpinalNode(name, childNodeType);
        const timestamp = moment(date).valueOf();
        archivePart.info.add_attr({
            start: timestamp,
            end: timestamp,
        });
        yield archive.addChild(archivePart, parentRelationName, Constants_1.ARCHIVE_TICKET_RELATION_TYPE);
        return archivePart;
    });
}
function removeTicketFromParent(ticketNode, relationName, parentTypes) {
    return __awaiter(this, void 0, void 0, function* () {
        const parents = yield ticketNode.getParents(relationName);
        const parentsFiltered = parents.filter((parent) => parentTypes.includes(parent.info.type.get()));
        const proms = parentsFiltered.map((parent) => {
            return parent
                .removeChild(ticketNode, relationName, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)
                .catch(() => console.log(`catch erreor remove child for ${ticketNode.info.name.get()}`));
        });
        yield Promise.all(proms);
    });
}
//# sourceMappingURL=_archiveTicket.js.map