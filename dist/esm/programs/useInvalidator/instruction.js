import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { DEFAULT_PAYMENT_MANAGER_NAME, PAYMENT_MANAGER_ADDRESS, } from "../paymentManager";
import { findPaymentManagerAddress } from "../paymentManager/pda";
import { CRANK_KEY, TOKEN_MANAGER_ADDRESS, TokenManagerState, } from "../tokenManager";
import { getRemainingAccountsForKind } from "../tokenManager/utils";
import { USE_INVALIDATOR_ADDRESS, USE_INVALIDATOR_IDL } from "./constants";
import { findUseInvalidatorAddress } from "./pda";
export const init = async (connection, wallet, tokenManagerId, params, payer = wallet.publicKey) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const provider = new AnchorProvider(connection, wallet, {});
    const useInvalidatorProgram = new Program(USE_INVALIDATOR_IDL, USE_INVALIDATOR_ADDRESS, provider);
    const [useInvalidatorId, _useInvalidatorBump] = await findUseInvalidatorAddress(tokenManagerId);
    const [defaultPaymentManagerId] = await findPaymentManagerAddress(DEFAULT_PAYMENT_MANAGER_NAME);
    return [
        useInvalidatorProgram.instruction.init({
            collector: params.collector || CRANK_KEY,
            paymentManager: params.paymentManager || defaultPaymentManagerId,
            totalUsages: params.totalUsages ? new BN(params.totalUsages) : null,
            maxUsages: ((_a = params.extension) === null || _a === void 0 ? void 0 : _a.maxUsages)
                ? new BN((_b = params.extension) === null || _b === void 0 ? void 0 : _b.maxUsages)
                : null,
            useAuthority: params.useAuthority || null,
            extensionPaymentAmount: ((_c = params.extension) === null || _c === void 0 ? void 0 : _c.extensionPaymentAmount)
                ? new BN((_d = params.extension) === null || _d === void 0 ? void 0 : _d.extensionPaymentAmount)
                : null,
            extensionPaymentMint: ((_e = params.extension) === null || _e === void 0 ? void 0 : _e.extensionPaymentMint) || null,
            extensionUsages: ((_f = params.extension) === null || _f === void 0 ? void 0 : _f.extensionUsages)
                ? new BN((_g = params.extension) === null || _g === void 0 ? void 0 : _g.extensionUsages)
                : null,
        }, {
            accounts: {
                tokenManager: tokenManagerId,
                useInvalidator: useInvalidatorId,
                issuer: wallet.publicKey,
                payer: payer,
                systemProgram: SystemProgram.programId,
            },
        }),
        useInvalidatorId,
    ];
};
export const incrementUsages = async (connection, wallet, tokenManagerId, recipientTokenAccountId, usages) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const useInvalidatorProgram = new Program(USE_INVALIDATOR_IDL, USE_INVALIDATOR_ADDRESS, provider);
    const [useInvalidatorId] = await findUseInvalidatorAddress(tokenManagerId);
    return useInvalidatorProgram.instruction.incrementUsages(new BN(usages), {
        accounts: {
            tokenManager: tokenManagerId,
            useInvalidator: useInvalidatorId,
            recipientTokenAccount: recipientTokenAccountId,
            user: wallet.publicKey,
        },
    });
};
export const invalidate = async (connection, wallet, mintId, tokenManagerId, tokenManagerKind, tokenManagerState, tokenManagerTokenAccountId, recipientTokenAccountId, returnAccounts) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const useInvalidatorProgram = new Program(USE_INVALIDATOR_IDL, USE_INVALIDATOR_ADDRESS, provider);
    const [[useInvalidatorId], transferAccounts] = await Promise.all([
        findUseInvalidatorAddress(tokenManagerId),
        getRemainingAccountsForKind(mintId, tokenManagerKind),
    ]);
    return useInvalidatorProgram.instruction.invalidate({
        accounts: {
            tokenManager: tokenManagerId,
            useInvalidator: useInvalidatorId,
            invalidator: wallet.publicKey,
            cardinalTokenManager: TOKEN_MANAGER_ADDRESS,
            tokenManagerTokenAccount: tokenManagerTokenAccountId,
            tokenProgram: TOKEN_PROGRAM_ID,
            mint: mintId,
            recipientTokenAccount: recipientTokenAccountId,
            rent: SYSVAR_RENT_PUBKEY,
        },
        remainingAccounts: [
            ...(tokenManagerState === TokenManagerState.Claimed
                ? transferAccounts
                : []),
            ...returnAccounts,
        ],
    });
};
export const extendUsages = (connection, wallet, tokenManagerId, paymentManager, payerTokenAccountId, useInvalidatorId, usagesToAdd, paymentAccounts) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const useInvalidatorProgram = new Program(USE_INVALIDATOR_IDL, USE_INVALIDATOR_ADDRESS, provider);
    const [paymentTokenAccountId, feeCollectorTokenAccount, remainingAccounts] = paymentAccounts;
    return useInvalidatorProgram.instruction.extendUsages(new BN(usagesToAdd), {
        accounts: {
            tokenManager: tokenManagerId,
            useInvalidator: useInvalidatorId,
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
export const close = (connection, wallet, useInvalidatorId, tokenManagerId, collector) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const useInvalidatorProgram = new Program(USE_INVALIDATOR_IDL, USE_INVALIDATOR_ADDRESS, provider);
    return useInvalidatorProgram.instruction.close({
        accounts: {
            tokenManager: tokenManagerId,
            useInvalidator: useInvalidatorId,
            collector: collector || CRANK_KEY,
            closer: wallet.publicKey,
        },
    });
};
//# sourceMappingURL=instruction.js.map