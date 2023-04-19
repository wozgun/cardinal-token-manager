"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMaxExpiration = exports.close = exports.invalidate = exports.resetExpiration = exports.extendExpiration = exports.init = void 0;
const tslib_1 = require("tslib");
const anchor_1 = require("@project-serum/anchor");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const paymentManager_1 = require("../paymentManager");
const pda_1 = require("../paymentManager/pda");
const tokenManager_1 = require("../tokenManager");
const tokenManager = tslib_1.__importStar(require("../tokenManager"));
const utils_1 = require("../tokenManager/utils");
const constants_1 = require("./constants");
const pda_2 = require("./pda");
const init = async (connection, wallet, tokenManagerId, timeInvalidation, payer = wallet.publicKey) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const provider = new anchor_1.AnchorProvider(connection, wallet, {});
    const timeInvalidatorProgram = new anchor_1.Program(constants_1.TIME_INVALIDATOR_IDL, constants_1.TIME_INVALIDATOR_ADDRESS, provider);
    const [timeInvalidatorId, _timeInvalidatorBump] = await (0, pda_2.findTimeInvalidatorAddress)(tokenManagerId);
    const [defaultPaymentManagerId] = await (0, pda_1.findPaymentManagerAddress)(paymentManager_1.DEFAULT_PAYMENT_MANAGER_NAME);
    return [
        timeInvalidatorProgram.instruction.init({
            collector: timeInvalidation.collector || tokenManager_1.CRANK_KEY,
            paymentManager: timeInvalidation.paymentManager || defaultPaymentManagerId,
            durationSeconds: timeInvalidation.durationSeconds !== undefined
                ? new anchor_1.BN(timeInvalidation.durationSeconds)
                : null,
            extensionPaymentAmount: ((_a = timeInvalidation.extension) === null || _a === void 0 ? void 0 : _a.extensionPaymentAmount) !== undefined
                ? new anchor_1.BN((_b = timeInvalidation.extension) === null || _b === void 0 ? void 0 : _b.extensionPaymentAmount)
                : null,
            extensionDurationSeconds: ((_c = timeInvalidation.extension) === null || _c === void 0 ? void 0 : _c.extensionDurationSeconds) !== undefined
                ? new anchor_1.BN((_d = timeInvalidation.extension) === null || _d === void 0 ? void 0 : _d.extensionDurationSeconds)
                : null,
            extensionPaymentMint: ((_e = timeInvalidation.extension) === null || _e === void 0 ? void 0 : _e.extensionPaymentMint)
                ? (_f = timeInvalidation.extension) === null || _f === void 0 ? void 0 : _f.extensionPaymentMint
                : null,
            maxExpiration: timeInvalidation.maxExpiration !== undefined
                ? new anchor_1.BN(timeInvalidation.maxExpiration)
                : null,
            disablePartialExtension: ((_g = timeInvalidation.extension) === null || _g === void 0 ? void 0 : _g.disablePartialExtension)
                ? (_h = timeInvalidation.extension) === null || _h === void 0 ? void 0 : _h.disablePartialExtension
                : null,
        }, {
            accounts: {
                tokenManager: tokenManagerId,
                timeInvalidator: timeInvalidatorId,
                issuer: wallet.publicKey,
                payer: payer,
                systemProgram: web3_js_1.SystemProgram.programId,
            },
        }),
        timeInvalidatorId,
    ];
};
exports.init = init;
const extendExpiration = (connection, wallet, tokenManagerId, paymentManager, payerTokenAccountId, timeInvalidatorId, secondsToAdd, paymentAccounts) => {
    const provider = new anchor_1.AnchorProvider(connection, wallet, {});
    const timeInvalidatorProgram = new anchor_1.Program(constants_1.TIME_INVALIDATOR_IDL, constants_1.TIME_INVALIDATOR_ADDRESS, provider);
    const [paymentTokenAccountId, feeCollectorTokenAccount, remainingAccounts] = paymentAccounts;
    return timeInvalidatorProgram.instruction.extendExpiration(new anchor_1.BN(secondsToAdd), {
        accounts: {
            tokenManager: tokenManagerId,
            timeInvalidator: timeInvalidatorId,
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
exports.extendExpiration = extendExpiration;
const resetExpiration = (connection, wallet, tokenManagerId, timeInvalidatorId) => {
    const provider = new anchor_1.AnchorProvider(connection, wallet, {});
    const timeInvalidatorProgram = new anchor_1.Program(constants_1.TIME_INVALIDATOR_IDL, constants_1.TIME_INVALIDATOR_ADDRESS, provider);
    return timeInvalidatorProgram.instruction.resetExpiration({
        accounts: {
            tokenManager: tokenManagerId,
            timeInvalidator: timeInvalidatorId,
        },
    });
};
exports.resetExpiration = resetExpiration;
const invalidate = async (connection, wallet, mintId, tokenManagerId, tokenManagerKind, tokenManagerState, tokenManagerTokenAccountId, recipientTokenAccountId, returnAccounts) => {
    const provider = new anchor_1.AnchorProvider(connection, wallet, {});
    const timeInvalidatorProgram = new anchor_1.Program(constants_1.TIME_INVALIDATOR_IDL, constants_1.TIME_INVALIDATOR_ADDRESS, provider);
    const [[timeInvalidatorId], transferAccounts] = await Promise.all([
        (0, pda_2.findTimeInvalidatorAddress)(tokenManagerId),
        (0, utils_1.getRemainingAccountsForKind)(mintId, tokenManagerKind),
    ]);
    return timeInvalidatorProgram.instruction.invalidate({
        accounts: {
            tokenManager: tokenManagerId,
            timeInvalidator: timeInvalidatorId,
            invalidator: wallet.publicKey,
            tokenManagerTokenAccount: tokenManagerTokenAccountId,
            mint: mintId,
            recipientTokenAccount: recipientTokenAccountId,
            cardinalTokenManager: tokenManager.TOKEN_MANAGER_ADDRESS,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            rent: web3_js_1.SYSVAR_RENT_PUBKEY,
        },
        remainingAccounts: [
            ...(tokenManagerState === tokenManager.TokenManagerState.Claimed
                ? transferAccounts
                : []),
            ...returnAccounts,
        ],
    });
};
exports.invalidate = invalidate;
const close = (connection, wallet, timeInvalidatorId, tokenManagerId, collector) => {
    const provider = new anchor_1.AnchorProvider(connection, wallet, {});
    const timeInvalidatorProgram = new anchor_1.Program(constants_1.TIME_INVALIDATOR_IDL, constants_1.TIME_INVALIDATOR_ADDRESS, provider);
    return timeInvalidatorProgram.instruction.close({
        accounts: {
            tokenManager: tokenManagerId,
            timeInvalidator: timeInvalidatorId,
            collector: collector || tokenManager.CRANK_KEY,
            closer: wallet.publicKey,
        },
    });
};
exports.close = close;
const updateMaxExpiration = (connection, wallet, timeInvalidatorId, tokenManagerId, newMaxExpiration) => {
    const provider = new anchor_1.AnchorProvider(connection, wallet, {});
    const timeInvalidatorProgram = new anchor_1.Program(constants_1.TIME_INVALIDATOR_IDL, constants_1.TIME_INVALIDATOR_ADDRESS, provider);
    return timeInvalidatorProgram.instruction.updateMaxExpiration({
        newMaxExpiration: newMaxExpiration,
    }, {
        accounts: {
            tokenManager: tokenManagerId,
            timeInvalidator: timeInvalidatorId,
            issuer: wallet.publicKey,
        },
    });
};
exports.updateMaxExpiration = updateMaxExpiration;
//# sourceMappingURL=instruction.js.map