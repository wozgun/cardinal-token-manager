"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentManagerProgram =
  exports.PAYMENT_MANAGER_IDL =
  exports.DEFAULT_PAYMENT_MANAGER_NAME =
  exports.PAYMENT_MANAGER_SEED =
  exports.CRANK_KEY =
  exports.PAYMENT_MANAGER_ADDRESS =
  exports.DEFAULT_BUY_SIDE_FEE_SHARE =
  exports.BASIS_POINTS_DIVISOR =
    void 0;
const tslib_1 = require("tslib");
const common_1 = require("@cardinal/common");
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const PAYMENT_MANAGER_TYPES = tslib_1.__importStar(
  require("../../idl/cardinal_payment_manager")
);
exports.BASIS_POINTS_DIVISOR = 10000;
exports.DEFAULT_BUY_SIDE_FEE_SHARE = 50;
exports.PAYMENT_MANAGER_ADDRESS = new web3_js_1.PublicKey(
  "pmBbdddvcssmfNgNfu8vgULnhTAcnrn841K5QVhh5VV"
);
exports.CRANK_KEY = new web3_js_1.PublicKey(
  "crkdpVWjHWdggGgBuSyAqSmZUmAjYLzD435tcLDRLXr"
);
exports.PAYMENT_MANAGER_SEED = "payment-manager";
exports.DEFAULT_PAYMENT_MANAGER_NAME = "cardinal";
exports.PAYMENT_MANAGER_IDL = PAYMENT_MANAGER_TYPES.IDL;
const paymentManagerProgram = (connection, wallet, confirmOptions) => {
  return new anchor_1.Program(
    exports.PAYMENT_MANAGER_IDL,
    exports.PAYMENT_MANAGER_ADDRESS,
    new anchor_1.AnchorProvider(
      connection,
      wallet !== null && wallet !== void 0
        ? wallet
        : (0, common_1.emptyWallet)(web3_js_1.PublicKey.default),
      confirmOptions !== null && confirmOptions !== void 0 ? confirmOptions : {}
    )
  );
};
exports.paymentManagerProgram = paymentManagerProgram;
//# sourceMappingURL=constants.js.map
