import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID, } from "@solana/spl-token";
export async function tryGetAccount(fn) {
    try {
        return await fn();
    }
    catch {
        return null;
    }
}
export const emptyWallet = (publicKey) => ({
    signTransaction: async (tx) => new Promise(() => tx),
    signAllTransactions: async (txs) => new Promise(() => txs),
    publicKey: publicKey,
});
export async function findAta(mint, owner, allowOwnerOffCurve) {
    return Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mint, owner, allowOwnerOffCurve);
}
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
export async function withFindOrInitAssociatedTokenAccount(transaction, connection, mint, owner, payer, allowOwnerOffCurve) {
    const associatedAddress = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mint, owner, allowOwnerOffCurve);
    const account = await connection.getAccountInfo(associatedAddress);
    if (!account) {
        transaction.add(Token.createAssociatedTokenAccountInstruction(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mint, associatedAddress, owner, payer));
    }
    return associatedAddress;
}
//# sourceMappingURL=utils.js.map