import type { Wallet } from "@saberhq/solana-contrib";
import type { AccountMeta, Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
export declare type ClaimApproverParams = {
    paymentMint: PublicKey;
    paymentAmount: number;
    collector?: PublicKey;
    paymentManager?: PublicKey;
};
export declare const init: (connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, params: ClaimApproverParams, payer?: PublicKey) => Promise<[TransactionInstruction, PublicKey]>;
export declare const pay: (connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, payerTokenAccountId: PublicKey, paymentManager: PublicKey, paymentAccounts: [PublicKey, PublicKey, AccountMeta[]]) => Promise<TransactionInstruction>;
export declare const close: (connection: Connection, wallet: Wallet, claimApproverId: PublicKey, tokenManagerId: PublicKey, collector?: PublicKey) => TransactionInstruction;
//# sourceMappingURL=instruction.d.ts.map