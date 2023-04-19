"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withFindOrInitAssociatedTokenAccount = exports.findAta = exports.emptyWallet = exports.tryGetAccount = void 0;
const spl_token_1 = require("@solana/spl-token");
async function tryGetAccount(fn) {
    try {
        return await fn();
    }
    catch {
        return null;
    }
}
exports.tryGetAccount = tryGetAccount;
const emptyWallet = (publicKey) => ({
    signTransaction: async (tx) => new Promise(() => tx),
    signAllTransactions: async (txs) => new Promise(() => txs),
    publicKey: publicKey,
});
exports.emptyWallet = emptyWallet;
async function findAta(mint, owner, allowOwnerOffCurve) {
    return spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, owner, allowOwnerOffCurve);
}
exports.findAta = findAta;
/**
 * Utility function for adding a find or init associated token account instruction to a transaction
 * Useful when using associated token accounts so you can be sure they are created before hand
 * @param transaction
 * @param connection
 * @param mint
 * @param owner
 * @param payer
 * @param allowOwnerOffCurve
 * @returns The associated token account ID that was found or will be created. This also adds the relevent instruction to create it to the transaction if not found
 */
async function withFindOrInitAssociatedTokenAccount(transaction, connection, mint, owner, payer, allowOwnerOffCurve) {
    const associatedAddress = await spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, owner, allowOwnerOffCurve);
    const account = await connection.getAccountInfo(associatedAddress);
    if (!account) {
        transaction.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, associatedAddress, owner, payer));
    }
    return associatedAddress;
}
exports.withFindOrInitAssociatedTokenAccount = withFindOrInitAssociatedTokenAccount;
//# sourceMappingURL=utils.js.map