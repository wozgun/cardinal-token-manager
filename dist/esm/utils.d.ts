import type { Wallet } from "@saberhq/solana-contrib";
import type { Connection, PublicKey, Transaction } from "@solana/web3.js";
export declare type AccountData<T> = {
    pubkey: PublicKey;
    parsed: T;
};
declare type AccountFn<T> = () => Promise<AccountData<T>>;
export declare function tryGetAccount<T>(fn: AccountFn<T>): Promise<AccountData<T> | null>;
export declare const emptyWallet: (publicKey: PublicKey) => Wallet;
export declare function findAta(mint: PublicKey, owner: PublicKey, allowOwnerOffCurve?: boolean): Promise<PublicKey>;
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
export declare function withFindOrInitAssociatedTokenAccount(transaction: Transaction, connection: Connection, mint: PublicKey, owner: PublicKey, payer: PublicKey, allowOwnerOffCurve?: boolean): Promise<PublicKey>;
export {};
//# sourceMappingURL=utils.d.ts.map