"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.archiveTicketFromSpatial = void 0;
const _archiveTicket_1 = require("./_archiveTicket");
const Constants_1 = require("../Constants");
function archiveTicketFromSpatial(ticketNode, spatialNode, date, maxArchiveSize = 200) {
    return (0, _archiveTicket_1._archiveTicket)(ticketNode, spatialNode, date, maxArchiveSize, Constants_1.SPATIAL_ARCHIVE_TICKET_RELATION, Constants_1.SPATIAL_ARCHIVE_TICKET_TYPE, Constants_1.GEO_TYPES, Constants_1.ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL);
}
exports.archiveTicketFromSpatial = archiveTicketFromSpatial;
//# sourceMappingURL=archiveTicketFromSpatial.js.map