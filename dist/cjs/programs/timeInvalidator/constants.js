"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIME_INVALIDATOR_IDL = exports.TIME_INVALIDATOR_SEED = exports.TIME_INVALIDATOR_ADDRESS = void 0;
const tslib_1 = require("tslib");
const web3_js_1 = require("@solana/web3.js");
const TIME_INVALIDATOR_TYPES = tslib_1.__importStar(require("../../idl/cardinal_time_invalidator"));
exports.TIME_INVALIDATOR_ADDRESS = new web3_js_1.PublicKey("t3JAC837E6YLkJSdz3UZLUZVhLBShZh727c9TRbwUKK");
exports.TIME_INVALIDATOR_SEED = "time-invalidator";
exports.TIME_INVALIDATOR_IDL = TIME_INVALIDATOR_TYPES.IDL;
//# sourceMappingURL=constants.js.map