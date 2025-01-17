import type { ParsedIdlAccountData } from "@cardinal/common";
import { Program } from "@project-serum/anchor";
import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { ConfirmOptions, Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import * as PAYMENT_MANAGER_TYPES from "../../idl/cardinal_payment_manager";
export declare const BASIS_POINTS_DIVISOR = 10000;
export declare const DEFAULT_BUY_SIDE_FEE_SHARE = 50;
export declare const PAYMENT_MANAGER_ADDRESS: PublicKey;
export declare const CRANK_KEY: PublicKey;
export declare const PAYMENT_MANAGER_SEED = "payment-manager";
export declare const DEFAULT_PAYMENT_MANAGER_NAME = "cardinal";
export declare const PAYMENT_MANAGER_IDL: PAYMENT_MANAGER_TYPES.CardinalPaymentManager;
export type PAYMENT_MANAGER_PROGRAM = PAYMENT_MANAGER_TYPES.CardinalPaymentManager;
export type PaymentManagerData = ParsedIdlAccountData<"paymentManager", PAYMENT_MANAGER_PROGRAM>;
export declare const paymentManagerProgram: (connection: Connection, wallet?: Wallet, confirmOptions?: ConfirmOptions) => Program<PAYMENT_MANAGER_TYPES.CardinalPaymentManager>;
//# sourceMappingURL=constants.d.ts.map