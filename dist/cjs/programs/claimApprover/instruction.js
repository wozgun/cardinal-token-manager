"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.pay = exports.init = void 0;
const anchor_1 = require("@project-serum/anchor");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const paymentManager_1 = require("../paymentManager");
const pda_1 = require("../paymentManager/pda");
const tokenManager_1 = require("../tokenManager");
const pda_2 = require("../tokenManager/pda");
const constants_1 = require("./constants");
const pda_3 = require("./pda");
const init = async (connection, wallet, tokenManagerId, params, payer = wallet.publicKey) => {
    const provider = new anchor_1.AnchorProvider(connection, wallet, {});
    const claimApproverProgram = new anchor_1.Program(constants_1.CLAIM_APPROVER_IDL, constants_1.CLAIM_APPROVER_ADDRESS, provider);
    const [claimApproverId, _claimApproverBump] = await (0, pda_3.findClaimApproverAddress)(tokenManagerId);
    const [defaultPaymentManagerId] = await (0, pda_1.findPaymentManagerAddress)(paymentManager_1.DEFAULT_PAYMENT_MANAGER_NAME);
    return [
        claimApproverProgram.instruction.init({
            paymentMint: params.paymentMint,
            paymentAmount: new anchor_1.BN(params.paymentAmount),
            collector: params.collector || tokenManager_1.CRANK_KEY,
            paymentManager: params.paymentManager || defaultPaymentManagerId,
        }, {
            accounts: {
                tokenManager: tokenManagerId,
                claimApprover: claimApproverId,
                issuer: wallet.publicKey,
                payer: payer,
                systemProgram: web3_js_1.SystemProgram.programId,
            },
        }),
        claimApproverId,
    ];
};
exports.init = init;
const pay = async (connection, wallet, tokenManagerId, payerTokenAccountId, paymentManager, paymentAccounts) => {
    const provider = new anchor_1.AnchorProvider(connection, wallet, {});
    const claimApproverProgram = new anchor_1.Program(constants_1.CLAIM_APPROVER_IDL, constants_1.CLAIM_APPROVER_ADDRESS, provider);
    const [claimReceiptId, _claimReceiptBump] = await (0, pda_2.findClaimReceiptId)(tokenManagerId, wallet.publicKey);
    const [claimApproverId] = await (0, pda_3.findClaimApproverAddress)(tokenManagerId);
    const [paymentTokenAccountId, feeCollectorTokenAccount, remainingAccounts] = paymentAccounts;
    return claimApproverProgram.instruction.pay({
        accounts: {
            tokenManager: tokenManagerId,
            paymentTokenAccount: paymentTokenAccountId,
            feeCollectorTokenAccount: feeCollectorTokenAccount,
            paymentManager: paymentManager,
            claimApprover: claimApproverId,
            payer: wallet.publicKey,
            payerTokenAccount: payerTokenAccountId,
            claimReceipt: claimReceiptId,
            cardinalTokenManager: tokenManager_1.TOKEN_MANAGER_ADDRESS,
            cardinalPaymentManager: paymentManager_1.PAYMENT_MANAGER_ADDRESS,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
        },
        remainingAccounts,
    });
};
exports.pay = pay;
const close = (connection, wallet, claimApproverId, tokenManagerId, collector) => {
    const provider = new anchor_1.AnchorProvider(connection, wallet, {});
    const claimApproverProgram = new anchor_1.Program(constants_1.CLAIM_APPROVER_IDL, constants_1.CLAIM_APPROVER_ADDRESS, provider);
    return claimApproverProgram.instruction.close({
        accounts: {
            tokenManager: tokenManagerId,
            claimApprover: claimApproverId,
            collector: collector || tokenManager_1.CRANK_KEY,
            closer: wallet.publicKey,
        },
    });
};
exports.close = close;
//# sourceMappingURL=instruction.js.map