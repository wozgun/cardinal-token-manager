"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.extendUsages = exports.invalidate = exports.incrementUsages = exports.init = void 0;
const anchor_1 = require("@project-serum/anchor");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const paymentManager_1 = require("../paymentManager");
const pda_1 = require("../paymentManager/pda");
const tokenManager_1 = require("../tokenManager");
const utils_1 = require("../tokenManager/utils");
const constants_1 = require("./constants");
const pda_2 = require("./pda");
const init = async (connection, wallet, tokenManagerId, params, payer = wallet.publicKey) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const provider = new anchor_1.AnchorProvider(connection, wallet, {});
    const useInvalidatorProgram = new anchor_1.Program(constants_1.USE_INVALIDATOR_IDL, constants_1.USE_INVALIDATOR_ADDRESS, provider);
    const [useInvalidatorId, _useInvalidatorBump] = await (0, pda_2.findUseInvalidatorAddress)(tokenManagerId);
    const [defaultPaymentManagerId] = await (0, pda_1.findPaymentManagerAddress)(paymentManager_1.DEFAULT_PAYMENT_MANAGER_NAME);
    return [
        useInvalidatorProgram.instruction.init({
            collector: params.collector || tokenManager_1.CRANK_KEY,
            paymentManager: params.paymentManager || defaultPaymentManagerId,
            totalUsages: params.totalUsages ? new anchor_1.BN(params.totalUsages) : null,
            maxUsages: ((_a = params.extension) === null || _a === void 0 ? void 0 : _a.maxUsages)
                ? new anchor_1.BN((_b = params.extension) === null || _b === void 0 ? void 0 : _b.maxUsages)
                : null,
            useAuthority: params.useAuthority || null,
            extensionPaymentAmount: ((_c = params.extension) === null || _c === void 0 ? void 0 : _c.extensionPaymentAmount)
                ? new anchor_1.BN((_d = params.extension) === null || _d === void 0 ? void 0 : _d.extensionPaymentAmount)
                : null,
            extensionPaymentMint: ((_e = params.extension) === null || _e === void 0 ? void 0 : _e.extensionPaymentMint) || null,
            extensionUsages: ((_f = params.extension) === null || _f === void 0 ? void 0 : _f.extensionUsages)
                ? new anchor_1.BN((_g = params.extension) === null || _g === void 0 ? void 0 : _g.extensionUsages)
                : null,
        }, {
            accounts: {
                tokenManager: tokenManagerId,
                useInvalidator: useInvalidatorId,
                issuer: wallet.publicKey,
                payer: payer,
                systemProgram: web3_js_1.SystemProgram.programId,
            },
        }),
        useInvalidatorId,
    ];
};
exports.init = init;
const incrementUsages = async (connection, wallet, tokenManagerId, recipientTokenAccountId, usages) => {
    const provider = new anchor_1.AnchorProvider(connection, wallet, {});
    const useInvalidatorProgram = new anchor_1.Program(constants_1.USE_INVALIDATOR_IDL, constants_1.USE_INVALIDATOR_ADDRESS, provider);
    const [useInvalidatorId] = await (0, pda_2.findUseInvalidatorAddress)(tokenManagerId);
    return useInvalidatorProgram.instruction.incrementUsages(new anchor_1.BN(usages), {
        accounts: {
            tokenManager: tokenManagerId,
            useInvalidator: useInvalidatorId,
            recipientTokenAccount: recipientTokenAccountId,
            user: wallet.publicKey,
        },
    });
};
exports.incrementUsages = incrementUsages;
const invalidate = async (connection, wallet, mintId, tokenManagerId, tokenManagerKind, tokenManagerState, tokenManagerTokenAccountId, recipientTokenAccountId, returnAccounts) => {
    const provider = new anchor_1.AnchorProvider(connection, wallet, {});
    const useInvalidatorProgram = new anchor_1.Program(constants_1.USE_INVALIDATOR_IDL, constants_1.USE_INVALIDATOR_ADDRESS, provider);
    const [[useInvalidatorId], transferAccounts] = await Promise.all([
        (0, pda_2.findUseInvalidatorAddress)(tokenManagerId),
        (0, utils_1.getRemainingAccountsForKind)(mintId, tokenManagerKind),
    ]);
    return useInvalidatorProgram.instruction.invalidate({
        accounts: {
            tokenManager: tokenManagerId,
            useInvalidator: useInvalidatorId,
            invalidator: wallet.publicKey,
            cardinalTokenManager: tokenManager_1.TOKEN_MANAGER_ADDRESS,
            tokenManagerTokenAccount: tokenManagerTokenAccountId,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            mint: mintId,
            recipientTokenAccount: recipientTokenAccountId,
            rent: web3_js_1.SYSVAR_RENT_PUBKEY,
        },
        remainingAccounts: [
            ...(tokenManagerState === tokenManager_1.TokenManagerState.Claimed
                ? transferAccounts
                : []),
            ...returnAccounts,
        ],
    });
};
exports.invalidate = invalidate;
const extendUsages = (connection, wallet, tokenManagerId, paymentManager, payerTokenAccountId, useInvalidatorId, usagesToAdd, paymentAccounts) => {
    const provider = new anchor_1.AnchorProvider(connection, wallet, {});
    const useInvalidatorProgram = new anchor_1.Program(constants_1.USE_INVALIDATOR_IDL, constants_1.USE_INVALIDATOR_ADDRESS, provider);
    const [paymentTokenAccountId, feeCollectorTokenAccount, remainingAccounts] = paymentAccounts;
    return useInvalidatorProgram.instruction.extendUsages(new anchor_1.BN(usagesToAdd), {
        accounts: {
            tokenManager: tokenManagerId,
            useInvalidator: useInvalidatorId,
            paymentManager: paymentManager,
            paymentTokenAccount: paymentTokenAccountId,
            feeCollectorTokenAccount: feeCollectorTokenAccount,
            payer: wallet.publicKey,
            payerTokenAccount: payerTokenAccountId,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            cardinalPaymentManager: paymentManager_1.PAYMENT_MANAGER_ADDRESS,
        },
        remainingAccounts,
    });
};
exports.extendUsages = extendUsages;
const close = (connection, wallet, useInvalidatorId, tokenManagerId, collector) => {
    const provider = new anchor_1.AnchorProvider(connection, wallet, {});
    const useInvalidatorProgram = new anchor_1.Program(constants_1.USE_INVALIDATOR_IDL, constants_1.USE_INVALIDATOR_ADDRESS, provider);
    return useInvalidatorProgram.instruction.close({
        accounts: {
            tokenManager: tokenManagerId,
            useInvalidator: useInvalidatorId,
            collector: collector || tokenManager_1.CRANK_KEY,
            closer: wallet.publicKey,
        },
    });
};
exports.close = close;
//# sourceMappingURL=instruction.js.map