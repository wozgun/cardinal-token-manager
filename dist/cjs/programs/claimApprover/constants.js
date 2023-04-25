"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimApproverProgram = exports.defaultPaymentManagerId = exports.CLAIM_APPROVER_IDL = exports.CLAIM_APPROVER_SEED = exports.CLAIM_APPROVER_ADDRESS = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@cardinal/common");
const payment_manager_1 = require("@cardinal/payment-manager");
const pda_1 = require("@cardinal/payment-manager/dist/cjs/pda");
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const CLAIM_APPROVER_TYPES = tslib_1.__importStar(require("../../idl/cardinal_paid_claim_approver"));
exports.CLAIM_APPROVER_ADDRESS = new web3_js_1.PublicKey("ASARc3C85tapTVLHLfDMdzxiNCjJDM4C7ZmEZNJ5g9FV");
exports.CLAIM_APPROVER_SEED = "paid-claim-approver";
exports.CLAIM_APPROVER_IDL = CLAIM_APPROVER_TYPES.IDL;
exports.defaultPaymentManagerId = (0, pda_1.findPaymentManagerAddress)(payment_manager_1.DEFAULT_PAYMENT_MANAGER_NAME);
const claimApproverProgram = (connection, wallet, confirmOptions) => {
    return new anchor_1.Program(exports.CLAIM_APPROVER_IDL, exports.CLAIM_APPROVER_ADDRESS, new anchor_1.AnchorProvider(connection, wallet !== null && wallet !== void 0 ? wallet : (0, common_1.emptyWallet)(web3_js_1.Keypair.generate().publicKey), confirmOptions !== null && confirmOptions !== void 0 ? confirmOptions : {}));
};
exports.claimApproverProgram = claimApproverProgram;
//# sourceMappingURL=constants.js.map