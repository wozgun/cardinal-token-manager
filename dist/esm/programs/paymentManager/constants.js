import { emptyWallet } from "@cardinal/common";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import * as PAYMENT_MANAGER_TYPES from "../../idl/cardinal_payment_manager";
export const BASIS_POINTS_DIVISOR = 10000;
export const DEFAULT_BUY_SIDE_FEE_SHARE = 50;
export const PAYMENT_MANAGER_ADDRESS = new PublicKey(
  "pmBbdddvcssmfNgNfu8vgULnhTAcnrn841K5QVhh5VV"
);
export const CRANK_KEY = new PublicKey(
  "crkdpVWjHWdggGgBuSyAqSmZUmAjYLzD435tcLDRLXr"
);
export const PAYMENT_MANAGER_SEED = "payment-manager";
export const DEFAULT_PAYMENT_MANAGER_NAME = "cardinal";
export const PAYMENT_MANAGER_IDL = PAYMENT_MANAGER_TYPES.IDL;
export const paymentManagerProgram = (connection, wallet, confirmOptions) => {
  return new Program(
    PAYMENT_MANAGER_IDL,
    PAYMENT_MANAGER_ADDRESS,
    new AnchorProvider(
      connection,
      wallet !== null && wallet !== void 0
        ? wallet
        : emptyWallet(PublicKey.default),
      confirmOptions !== null && confirmOptions !== void 0 ? confirmOptions : {}
    )
  );
};
//# sourceMappingURL=constants.js.map
