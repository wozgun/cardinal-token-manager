import type { AnchorTypes } from "@saberhq/anchor-contrib";
import { PublicKey } from "@solana/web3.js";

import * as PAYMENT_MANAGER_TYPES from "../../idl/cardinal_payment_manager";

export const BASIS_POINTS_DIVISOR = 10000;

export const PAYMENT_MANAGER_ADDRESS = new PublicKey(
  "pmBbdddvcssmfNgNfu8vgULnhTAcnrn841K5QVhh5VV"
);

export const PAYMENT_MANAGER_SEED = "payment-manager";
export const DEFAULT_PAYMENT_MANAGER_NAME = "cardinal";

export const PAYMENT_MANAGER_IDL = PAYMENT_MANAGER_TYPES.IDL;

export type PAYMENT_MANAGER_PROGRAM =
  PAYMENT_MANAGER_TYPES.CardinalPaymentManager;

export type PaymentManagerTypes = AnchorTypes<
  PAYMENT_MANAGER_PROGRAM,
  {
    tokenManager: PaymentManagerData;
  }
>;

type Accounts = PaymentManagerTypes["Accounts"];
export type PaymentManagerData = Accounts["paymentManager"];
