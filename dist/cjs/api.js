"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendUsages =
  exports.extendExpiration =
  exports.claimToken =
  exports.unissueToken =
  exports.issueToken =
  exports.release =
  exports.invalidate =
  exports.useTransaction =
    void 0;
const web3_js_1 = require("@solana/web3.js");
const _1 = require(".");
const useTransaction = async (connection, wallet, mintId, usages, collector) =>
  (0, _1.withUse)(
    new web3_js_1.Transaction(),
    connection,
    wallet,
    mintId,
    usages,
    collector
  );
exports.useTransaction = useTransaction;
const invalidate = async (connection, wallet, mintId) =>
  (0, _1.withInvalidate)(
    new web3_js_1.Transaction(),
    connection,
    wallet,
    mintId
  );
exports.invalidate = invalidate;
const release = async (
  connection,
  wallet,
  mintId,
  transferAuthorityId,
  listerTokenAccountId
) =>
  (0, _1.withRelease)(
    new web3_js_1.Transaction(),
    connection,
    wallet,
    mintId,
    transferAuthorityId,
    listerTokenAccountId
  );
exports.release = release;
const issueToken = async (connection, wallet, rentalParameters) =>
  (0, _1.withIssueToken)(
    new web3_js_1.Transaction(),
    connection,
    wallet,
    rentalParameters
  );
exports.issueToken = issueToken;
const unissueToken = async (connection, wallet, mintId) =>
  (0, _1.withUnissueToken)(
    new web3_js_1.Transaction(),
    connection,
    wallet,
    mintId
  );
exports.unissueToken = unissueToken;
const claimToken = async (
  connection,
  wallet,
  tokenManagerId,
  additionalOptions
) =>
  (0, _1.withClaimToken)(
    new web3_js_1.Transaction(),
    connection,
    wallet,
    tokenManagerId,
    additionalOptions
  );
exports.claimToken = claimToken;
const extendExpiration = async (
  connection,
  wallet,
  tokenManagerId,
  paymentAmount
) =>
  (0, _1.withExtendExpiration)(
    new web3_js_1.Transaction(),
    connection,
    wallet,
    tokenManagerId,
    paymentAmount
  );
exports.extendExpiration = extendExpiration;
const extendUsages = async (connection, wallet, tokenManagerId, usagesToAdd) =>
  (0, _1.withExtendUsages)(
    new web3_js_1.Transaction(),
    connection,
    wallet,
    tokenManagerId,
    usagesToAdd
  );
exports.extendUsages = extendUsages;
//# sourceMappingURL=api.js.map
