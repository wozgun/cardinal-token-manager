import type { Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
/**
 * Finds the token manager address for a given mint
 * @returns
 */
export declare const tryTokenManagerAddressFromMint: (connection: Connection, mint: PublicKey) => Promise<PublicKey | null>;
/**
 * Finds the token manager address for a given mint
 * @returns
 */
export declare const tokenManagerAddressFromMint: (_connection: Connection, mint: PublicKey) => Promise<PublicKey>;
/**
 * Finds the token manager address for a given mint and mint counter
 * @returns
 */
export declare const findTokenManagerAddress: (mint: PublicKey) => Promise<[PublicKey, number]>;
/**
 * Finds the claim receipt id.
 * @returns
 */
export declare const findClaimReceiptId: (tokenManagerKey: PublicKey, recipientKey: PublicKey) => Promise<[PublicKey, number]>;
/**
 * Finds the transfer receipt id.
 * @returns
 */
export declare const findTransferReceiptId: (tokenManagerId: PublicKey) => Promise<[PublicKey, number]>;
/**
 * Finds the mint manager id.
 * @returns
 */
export declare const findMintManagerId: (mintId: PublicKey) => Promise<[PublicKey, number]>;
/**
 * Finds the mint counter id.
 * @returns
 */
export declare const findMintCounterId: (mintId: PublicKey) => Promise<[PublicKey, number]>;
/**
 * Finds the receipt mint manager id.
 * @returns
 */
export declare const findReceiptMintManagerId: () => Promise<[
    PublicKey,
    number
]>;
//# sourceMappingURL=pda.d.ts.map