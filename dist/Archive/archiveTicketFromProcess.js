"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.archiveTicketFromProcess = void 0;
const _archiveTicket_1 = require("./_archiveTicket");
const Constants_1 = require("../Constants");
function archiveTicketFromProcess(ticketNode, processNode, date, maxArchiveSize = 200) {
    return (0, _archiveTicket_1._archiveTicket)(ticketNode, processNode, date, maxArchiveSize, Constants_1.PROCESS_ARCHIVE_TICKET_RELATION, Constants_1.PROCESS_ARCHIVE_TICKET_TYPE, [Constants_1.STEP_TYPE], Constants_1.ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS);
}
exports.archiveTicketFromProcess = archiveTicketFromProcess;
//# sourceMappingURL=archiveTicketFromProcess.js.map