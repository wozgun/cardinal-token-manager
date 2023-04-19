import type { Wallet } from "@saberhq/solana-contrib";
import type { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js";
export declare function withWrapSol(transaction: Transaction, connection: Connection, wallet: Wallet, lamports: number, skipInitTokenAccount?: boolean): Promise<Transaction>;
export declare function createSyncNativeInstruction(nativeAccount: PublicKey): TransactionInstruction;
//# sourceMappingURL=wrappedSol.d.ts.map