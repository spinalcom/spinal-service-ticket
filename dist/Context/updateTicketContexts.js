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
exports.updateTicketContexts = void 0;
function updateTicketContexts(contextNode, newInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        if (newInfo.name && newInfo.name.trim().length === 0)
            throw new Error('Context name must have at less 1 character');
        if (contextNode) {
            if (newInfo.name && newInfo.name.trim().length > 0)
                contextNode.info.name.set(newInfo.name);
        }
    });
}
exports.updateTicketContexts = updateTicketContexts;
//# sourceMappingURL=updateTicketContexts.js.map