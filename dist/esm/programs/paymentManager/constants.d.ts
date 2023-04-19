import type { AnchorTypes } from "@saberhq/anchor-contrib";
import { PublicKey } from "@solana/web3.js";
import * as PAYMENT_MANAGER_TYPES from "../../idl/cardinal_payment_manager";
export declare const BASIS_POINTS_DIVISOR = 10000;
export declare const PAYMENT_MANAGER_ADDRESS: PublicKey;
export declare const PAYMENT_MANAGER_SEED = "payment-manager";
export declare const DEFAULT_PAYMENT_MANAGER_NAME = "cardinal";
export declare const PAYMENT_MANAGER_IDL: PAYMENT_MANAGER_TYPES.CardinalPaymentManager;
export declare type PAYMENT_MANAGER_PROGRAM = PAYMENT_MANAGER_TYPES.CardinalPaymentManager;
export declare type PaymentManagerTypes = AnchorTypes<PAYMENT_MANAGER_PROGRAM, {
    tokenManager: PaymentManagerData;
}>;
declare type Accounts = PaymentManagerTypes["Accounts"];
export declare type PaymentManagerData = Accounts["paymentManager"];
export {};
//# sourceMappingURL=constants.d.ts.map