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
exports.createTicketContext = void 0;
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
const GraphService_1 = require("../GraphService");
const Constants_1 = require("../Constants");
const Errors_1 = require("../Errors");
function createTicketContext(contextName, steps = new Array(), contextSubType = 'Ticket') {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = yield (0, GraphService_1.graphServiceAddContext)(contextName, Constants_1.SERVICE_TYPE);
            const stepsModel = new spinal_core_connectorjs_1.Lst(steps);
            context.info.add_attr('steps', new spinal_core_connectorjs_1.Ptr(stepsModel));
            if (Constants_1.TICKET_CONTEXT_SUBTYPE_LIST.includes(contextSubType)) {
                context.info.add_attr('subType', contextSubType);
            }
            return context;
        }
        catch (error) {
            throw new Error(Errors_1.CANNOT_CREATE_CONTEXT_INTERNAL_ERROR);
        }
    });
}
exports.createTicketContext = createTicketContext;
//# sourceMappingURL=createTicketContext.js.map