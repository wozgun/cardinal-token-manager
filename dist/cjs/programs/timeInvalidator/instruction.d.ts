import { BN } from "@project-serum/anchor";
import type { Wallet } from "@saberhq/solana-contrib";
import type { AccountMeta, Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import type { TokenManagerKind } from "../tokenManager";
import * as tokenManager from "../tokenManager";
export declare type TimeInvalidationParams = {
    collector?: PublicKey;
    paymentManager?: PublicKey;
    durationSeconds?: number;
    maxExpiration?: number;
    extension?: {
        extensionPaymentAmount: number;
        extensionDurationSeconds: number;
        extensionPaymentMint: PublicKey;
        disablePartialExtension?: boolean;
    };
};
export declare const init: (connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, timeInvalidation: TimeInvalidationParams, payer?: PublicKey) => Promise<[TransactionInstruction, PublicKey]>;
export declare const extendExpiration: (connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, paymentManager: PublicKey, payerTokenAccountId: PublicKey, timeInvalidatorId: PublicKey, secondsToAdd: number, paymentAccounts: [PublicKey, PublicKey, AccountMeta[]]) => TransactionInstruction;
export declare const resetExpiration: (connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, timeInvalidatorId: PublicKey) => TransactionInstruction;
export declare const invalidate: (connection: Connection, wallet: Wallet, mintId: PublicKey, tokenManagerId: PublicKey, tokenManagerKind: TokenManagerKind, tokenManagerState: tokenManager.TokenManagerState, tokenManagerTokenAccountId: PublicKey, recipientTokenAccountId: PublicKey, returnAccounts: AccountMeta[]) => Promise<TransactionInstruction>;
export declare const close: (connection: Connection, wallet: Wallet, timeInvalidatorId: PublicKey, tokenManagerId: PublicKey, collector?: PublicKey) => TransactionInstruction;
export declare const updateMaxExpiration: (connection: Connection, wallet: Wallet, timeInvalidatorId: PublicKey, tokenManagerId: PublicKey, newMaxExpiration: BN) => TransactionInstruction;
//# sourceMappingURL=instruction.d.ts.map