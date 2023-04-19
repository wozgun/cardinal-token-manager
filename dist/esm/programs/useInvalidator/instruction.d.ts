import type { Wallet } from "@saberhq/solana-contrib";
import type { AccountMeta, Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import type { TokenManagerKind } from "../tokenManager";
import { TokenManagerState } from "../tokenManager";
export declare type UseInvalidationParams = {
    collector?: PublicKey;
    paymentManager?: PublicKey;
    totalUsages?: number;
    useAuthority?: PublicKey;
    extension?: {
        extensionUsages: number;
        extensionPaymentMint: PublicKey;
        extensionPaymentAmount: number;
        maxUsages?: number;
    };
};
export declare const init: (connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, params: UseInvalidationParams, payer?: PublicKey) => Promise<[TransactionInstruction, PublicKey]>;
export declare const incrementUsages: (connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, recipientTokenAccountId: PublicKey, usages: number) => Promise<TransactionInstruction>;
export declare const invalidate: (connection: Connection, wallet: Wallet, mintId: PublicKey, tokenManagerId: PublicKey, tokenManagerKind: TokenManagerKind, tokenManagerState: TokenManagerState, tokenManagerTokenAccountId: PublicKey, recipientTokenAccountId: PublicKey, returnAccounts: AccountMeta[]) => Promise<TransactionInstruction>;
export declare const extendUsages: (connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, paymentManager: PublicKey, payerTokenAccountId: PublicKey, useInvalidatorId: PublicKey, usagesToAdd: number, paymentAccounts: [PublicKey, PublicKey, AccountMeta[]]) => TransactionInstruction;
export declare const close: (connection: Connection, wallet: Wallet, useInvalidatorId: PublicKey, tokenManagerId: PublicKey, collector?: PublicKey) => TransactionInstruction;
//# sourceMappingURL=instruction.d.ts.map