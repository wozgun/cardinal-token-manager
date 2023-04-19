import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { DEFAULT_PAYMENT_MANAGER_NAME, PAYMENT_MANAGER_ADDRESS, } from "../paymentManager";
import { findPaymentManagerAddress } from "../paymentManager/pda";
import { CRANK_KEY } from "../tokenManager";
import * as tokenManager from "../tokenManager";
import { getRemainingAccountsForKind } from "../tokenManager/utils";
import { TIME_INVALIDATOR_ADDRESS, TIME_INVALIDATOR_IDL } from "./constants";
import { findTimeInvalidatorAddress } from "./pda";
export const init = async (connection, wallet, tokenManagerId, timeInvalidation, payer = wallet.publicKey) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const provider = new AnchorProvider(connection, wallet, {});
    const timeInvalidatorProgram = new Program(TIME_INVALIDATOR_IDL, TIME_INVALIDATOR_ADDRESS, provider);
    const [timeInvalidatorId, _timeInvalidatorBump] = await findTimeInvalidatorAddress(tokenManagerId);
    const [defaultPaymentManagerId] = await findPaymentManagerAddress(DEFAULT_PAYMENT_MANAGER_NAME);
    return [
        timeInvalidatorProgram.instruction.init({
            collector: timeInvalidation.collector || CRANK_KEY,
            paymentManager: timeInvalidation.paymentManager || defaultPaymentManagerId,
            durationSeconds: timeInvalidation.durationSeconds !== undefined
                ? new BN(timeInvalidation.durationSeconds)
                : null,
            extensionPaymentAmount: ((_a = timeInvalidation.extension) === null || _a === void 0 ? void 0 : _a.extensionPaymentAmount) !== undefined
                ? new BN((_b = timeInvalidation.extension) === null || _b === void 0 ? void 0 : _b.extensionPaymentAmount)
                : null,
            extensionDurationSeconds: ((_c = timeInvalidation.extension) === null || _c === void 0 ? void 0 : _c.extensionDurationSeconds) !== undefined
                ? new BN((_d = timeInvalidation.extension) === null || _d === void 0 ? void 0 : _d.extensionDurationSeconds)
                : null,
            extensionPaymentMint: ((_e = timeInvalidation.extension) === null || _e === void 0 ? void 0 : _e.extensionPaymentMint)
                ? (_f = timeInvalidation.extension) === null || _f === void 0 ? void 0 : _f.extensionPaymentMint
                : null,
            maxExpiration: timeInvalidation.maxExpiration !== undefined
                ? new BN(timeInvalidation.maxExpiration)
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
                systemProgram: SystemProgram.programId,
            },
        }),
        timeInvalidatorId,
    ];
};
export const extendExpiration = (connection, wallet, tokenManagerId, paymentManager, payerTokenAccountId, timeInvalidatorId, secondsToAdd, paymentAccounts) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const timeInvalidatorProgram = new Program(TIME_INVALIDATOR_IDL, TIME_INVALIDATOR_ADDRESS, provider);
    const [paymentTokenAccountId, feeCollectorTokenAccount, remainingAccounts] = paymentAccounts;
    return timeInvalidatorProgram.instruction.extendExpiration(new BN(secondsToAdd), {
        accounts: {
            tokenManager: tokenManagerId,
            timeInvalidator: timeInvalidatorId,
            paymentManager: paymentManager,
            paymentTokenAccount: paymentTokenAccountId,
            feeCollectorTokenAccount: feeCollectorTokenAccount,
            payer: wallet.publicKey,
            payerTokenAccount: payerTokenAccountId,
            tokenProgram: TOKEN_PROGRAM_ID,
            cardinalPaymentManager: PAYMENT_MANAGER_ADDRESS,
        },
        remainingAccounts,
    });
};
export const resetExpiration = (connection, wallet, tokenManagerId, timeInvalidatorId) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const timeInvalidatorProgram = new Program(TIME_INVALIDATOR_IDL, TIME_INVALIDATOR_ADDRESS, provider);
    return timeInvalidatorProgram.instruction.resetExpiration({
        accounts: {
            tokenManager: tokenManagerId,
            timeInvalidator: timeInvalidatorId,
        },
    });
};
export const invalidate = async (connection, wallet, mintId, tokenManagerId, tokenManagerKind, tokenManagerState, tokenManagerTokenAccountId, recipientTokenAccountId, returnAccounts) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const timeInvalidatorProgram = new Program(TIME_INVALIDATOR_IDL, TIME_INVALIDATOR_ADDRESS, provider);
    const [[timeInvalidatorId], transferAccounts] = await Promise.all([
        findTimeInvalidatorAddress(tokenManagerId),
        getRemainingAccountsForKind(mintId, tokenManagerKind),
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
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
        },
        remainingAccounts: [
            ...(tokenManagerState === tokenManager.TokenManagerState.Claimed
                ? transferAccounts
                : []),
            ...returnAccounts,
        ],
    });
};
export const close = (connection, wallet, timeInvalidatorId, tokenManagerId, collector) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const timeInvalidatorProgram = new Program(TIME_INVALIDATOR_IDL, TIME_INVALIDATOR_ADDRESS, provider);
    return timeInvalidatorProgram.instruction.close({
        accounts: {
            tokenManager: tokenManagerId,
            timeInvalidator: timeInvalidatorId,
            collector: collector || tokenManager.CRANK_KEY,
            closer: wallet.publicKey,
        },
    });
};
export const updateMaxExpiration = (connection, wallet, timeInvalidatorId, tokenManagerId, newMaxExpiration) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const timeInvalidatorProgram = new Program(TIME_INVALIDATOR_IDL, TIME_INVALIDATOR_ADDRESS, provider);
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
//# sourceMappingURL=instruction.js.map