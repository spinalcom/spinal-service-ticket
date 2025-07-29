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
exports.deleteTicketFromArchive = void 0;
const moment = require("moment");
const _getAchivePartsFromArchive_1 = require("./_getAchivePartsFromArchive");
const _getArchive_1 = require("./_getArchive");
const Constants_1 = require("../Constants");
const _getArchivePartNameDate_1 = require("./_getArchivePartNameDate");
function deleteTicketFromArchive(processOrSpatialNode, begin, end) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!processOrSpatialNode)
            throw new Error("deleteTicketFromArchive process or spatial node ID given don't exist in graph service.");
        const isProcess = processOrSpatialNode.info.type.get() === Constants_1.PROCESS_TYPE;
        const timeStampAttr = isProcess
            ? Constants_1.ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS
            : Constants_1.ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL;
        const relationName = isProcess
            ? Constants_1.PROCESS_ARCHIVE_TICKET_RELATION
            : Constants_1.SPATIAL_ARCHIVE_TICKET_RELATION;
        const archiveTicketType = isProcess
            ? Constants_1.PROCESS_ARCHIVE_TICKET_TYPE
            : Constants_1.SPATIAL_ARCHIVE_TICKET_TYPE;
        const tsBegin = moment(begin).valueOf();
        const tsEnd = moment(end).valueOf();
        const archiveTicketNode = yield (0, _getArchive_1._getArchive)(processOrSpatialNode, relationName, archiveTicketType);
        const archiveParts = yield (0, _getAchivePartsFromArchive_1._getAchivePartsFromArchive)(archiveTicketNode);
        for (const archivePart of archiveParts) {
            if (archivePart.info.end.get() < tsBegin ||
                archivePart.info.start.get() > tsEnd)
                continue;
            const tickets = yield archivePart.getChildren(Constants_1.ARCHIVE_TICKET_PART_TICKET_RELATION);
            const ticketsToRm = tickets.filter((ticket) => {
                var _a, _b;
                return ((_a = ticket.info[timeStampAttr]) === null || _a === void 0 ? void 0 : _a.get()) >= tsBegin &&
                    ((_b = ticket.info[timeStampAttr]) === null || _b === void 0 ? void 0 : _b.get()) <= tsEnd;
            });
            try {
                yield archivePart.removeChildren(ticketsToRm, Constants_1.ARCHIVE_TICKET_PART_TICKET_RELATION, Constants_1.ARCHIVE_TICKET_RELATION_TYPE);
            }
            catch (error) { }
            ticketsToRm.forEach((ticket) => ticket.setIndirectModificationDate(Date.now()));
            yield updateArchivePartData(archivePart, archiveTicketNode, timeStampAttr);
        }
    });
}
exports.deleteTicketFromArchive = deleteTicketFromArchive;
function updateArchivePartData(archivePart, archiveTicketNode, timeStampAttr) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const tickets = yield archivePart.getChildren(Constants_1.ARCHIVE_TICKET_PART_TICKET_RELATION);
        if (tickets.length === 0) {
            yield archiveTicketNode.removeChild(archivePart, Constants_1.ARCHIVE_TICKET_PART_TICKET_RELATION, Constants_1.ARCHIVE_TICKET_RELATION_TYPE);
        }
        else {
            const start = (_b = (_a = tickets[0]) === null || _a === void 0 ? void 0 : _a.info[timeStampAttr]) === null || _b === void 0 ? void 0 : _b.get();
            const end = (_d = (_c = tickets[tickets.length - 1]) === null || _c === void 0 ? void 0 : _c.info[timeStampAttr]) === null || _d === void 0 ? void 0 : _d.get();
            archivePart.info.start.set(start);
            archivePart.info.end.set(end);
            archivePart.info.name.set((0, _getArchivePartNameDate_1._getArchivePartNameDate)(start, end));
        }
    });
}
//# sourceMappingURL=deleteTicketFromArchive.js.map