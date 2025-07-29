"use strict";
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
exports.getTicketContexts = void 0;
const GraphService_1 = require("../GraphService");
const Constants_1 = require("../Constants");
function getTicketContexts(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const contexts = yield (0, GraphService_1.graphServiceGetContextWithType)(Constants_1.SERVICE_TYPE);
        if (name && name.trim().length > 0) {
            return contexts.find((el) => el.info.name.get() === name);
        }
        return contexts;
    });
}
exports.getTicketContexts = getTicketContexts;
//# sourceMappingURL=getTicketContexts.js.map