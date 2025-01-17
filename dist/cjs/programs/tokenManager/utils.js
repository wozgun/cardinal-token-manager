"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRuleSetId =
  exports.findTokenRecordId =
  exports.getRemainingAccountsForClaim =
  exports.getRemainingAccountsForIssue =
  exports.remainingAccountForProgrammableUnlockAndTransfer =
  exports.remainingAccountForProgrammable =
  exports.getRemainingAccountsForTransfer =
  exports.withRemainingAccountsForReturn =
  exports.withRemainingAccountsForInvalidate =
  exports.getRemainingAccountsForInvalidate =
  exports.getRemainingAccountsForUnissue =
  exports.getRemainingAccountsForKind =
    void 0;
const common_1 = require("@cardinal/common");
const mpl_token_auth_rules_1 = require("@metaplex-foundation/mpl-token-auth-rules");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const _1 = require(".");
const pda_1 = require("./pda");
const getRemainingAccountsForKind = (mintId, tokenManagerKind) => {
  if (
    tokenManagerKind === _1.TokenManagerKind.Managed ||
    tokenManagerKind === _1.TokenManagerKind.Permissioned
  ) {
    return [
      {
        pubkey: (0, pda_1.findMintManagerId)(mintId),
        isSigner: false,
        isWritable: true,
      },
    ];
  } else if (tokenManagerKind === _1.TokenManagerKind.Edition) {
    return [
      {
        pubkey: (0, common_1.findMintEditionId)(mintId),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: common_1.METADATA_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
    ];
  } else {
    return [];
  }
};
exports.getRemainingAccountsForKind = getRemainingAccountsForKind;
const getRemainingAccountsForUnissue = (
  tokenManagerId,
  tokenManagerData,
  metadata
) => {
  var _a, _b, _c;
  const remainingAccounts = [];
  if (
    tokenManagerData.kind !== _1.TokenManagerKind.Programmable &&
    (metadata === null || metadata === void 0
      ? void 0
      : metadata.tokenStandard) ===
      mpl_token_metadata_1.TokenStandard.ProgrammableNonFungible
  ) {
    remainingAccounts.push({
      pubkey: (0, common_1.findMintMetadataId)(tokenManagerData.mint),
      isSigner: false,
      isWritable: false,
    });
  }
  if (
    (_a =
      metadata === null || metadata === void 0
        ? void 0
        : metadata.programmableConfig) === null || _a === void 0
      ? void 0
      : _a.ruleSet
  ) {
    remainingAccounts.push(
      {
        pubkey: web3_js_1.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      ...(0, exports.remainingAccountForProgrammable)(
        tokenManagerData.mint,
        (0, spl_token_1.getAssociatedTokenAddressSync)(
          tokenManagerData.mint,
          tokenManagerId,
          true
        ),
        (0, spl_token_1.getAssociatedTokenAddressSync)(
          tokenManagerData.mint,
          tokenManagerData.issuer,
          true
        ),
        (_c =
          (_b =
            metadata === null || metadata === void 0
              ? void 0
              : metadata.programmableConfig) === null || _b === void 0
            ? void 0
            : _b.ruleSet) !== null && _c !== void 0
          ? _c
          : undefined
      )
    );
  }
  return remainingAccounts;
};
exports.getRemainingAccountsForUnissue = getRemainingAccountsForUnissue;
/**
 * Convenience method to get remaining accounts for invalidation
 * NOTE: This ignores token account creation and assumes that is handled outside. Use withRemainingAccountsForInvalidate
 * to include token account creation in the current transaction
 * @param connection
 * @param mintId
 * @returns
 */
const getRemainingAccountsForInvalidate = async (
  connection,
  wallet,
  mintId
) => {
  const tokenManagerId = (0, pda_1.findTokenManagerAddress)(mintId);
  const [tokenManagerInfo, metadataInfo] =
    await connection.getMultipleAccountsInfo([
      tokenManagerId,
      (0, common_1.findMintMetadataId)(mintId),
    ]);
  if (!tokenManagerInfo) throw "Token manager not found";
  const tokenManagerData = (0, common_1.decodeIdlAccount)(
    tokenManagerInfo,
    "tokenManager",
    _1.TOKEN_MANAGER_IDL
  );
  if (!metadataInfo) throw "Metadata not found";
  const metadata = mpl_token_metadata_1.Metadata.deserialize(
    metadataInfo.data
  )[0];
  const receipientTokenAccount = await (0, spl_token_1.getAccount)(
    connection,
    tokenManagerData.parsed.recipientTokenAccount
  );
  return await (0, exports.withRemainingAccountsForInvalidate)(
    new web3_js_1.Transaction(),
    connection,
    wallet,
    mintId,
    { ...tokenManagerData, pubkey: tokenManagerId },
    receipientTokenAccount.owner,
    metadata
  );
};
exports.getRemainingAccountsForInvalidate = getRemainingAccountsForInvalidate;
const withRemainingAccountsForInvalidate = async (
  transaction,
  connection,
  wallet,
  mintId,
  tokenManagerData,
  recipientTokenAccountOwnerId,
  metadata
) => {
  var _a, _b, _c, _d;
  const remainingAccounts = [];
  if (
    tokenManagerData.parsed.kind !== _1.TokenManagerKind.Programmable &&
    (metadata === null || metadata === void 0
      ? void 0
      : metadata.tokenStandard) ===
      mpl_token_metadata_1.TokenStandard.ProgrammableNonFungible
  ) {
    // update kind
    tokenManagerData.parsed.kind = _1.TokenManagerKind.Programmable;
    remainingAccounts.push({
      pubkey: (0, common_1.findMintMetadataId)(mintId),
      isSigner: false,
      isWritable: false,
    });
  }
  if (tokenManagerData.parsed.state === _1.TokenManagerState.Claimed) {
    remainingAccounts.push(
      ...(0, exports.getRemainingAccountsForKind)(
        mintId,
        tokenManagerData.parsed.kind
      )
    );
  }
  if (
    tokenManagerData.parsed.kind === _1.TokenManagerKind.Programmable &&
    (tokenManagerData.parsed.invalidationType === _1.InvalidationType.Release ||
      tokenManagerData.parsed.invalidationType === _1.InvalidationType.Reissue)
  ) {
    if (
      !((_a =
        metadata === null || metadata === void 0
          ? void 0
          : metadata.programmableConfig) === null || _a === void 0
        ? void 0
        : _a.ruleSet)
    )
      throw "Ruleset not specified";
    const releaseAccounts = (0,
    exports.remainingAccountForProgrammableUnlockAndTransfer)(
      recipientTokenAccountOwnerId,
      wallet.publicKey,
      mintId,
      tokenManagerData.parsed.recipientTokenAccount,
      (_b =
        metadata === null || metadata === void 0
          ? void 0
          : metadata.programmableConfig) === null || _b === void 0
        ? void 0
        : _b.ruleSet
    );
    remainingAccounts.push(...releaseAccounts);
  } else {
    const returnAccounts = await (0, exports.withRemainingAccountsForReturn)(
      transaction,
      connection,
      wallet,
      tokenManagerData,
      recipientTokenAccountOwnerId,
      (_d =
        (_c =
          metadata === null || metadata === void 0
            ? void 0
            : metadata.programmableConfig) === null || _c === void 0
          ? void 0
          : _c.ruleSet) !== null && _d !== void 0
        ? _d
        : undefined
    );
    remainingAccounts.push(...returnAccounts);
  }
  return remainingAccounts;
};
exports.withRemainingAccountsForInvalidate = withRemainingAccountsForInvalidate;
const withRemainingAccountsForReturn = async (
  transaction,
  connection,
  wallet,
  tokenManagerData,
  recipientTokenAccountOwnerId,
  rulesetId
) => {
  var _a, _b;
  const {
    issuer,
    mint,
    claimApprover,
    recipientTokenAccount,
    invalidationType,
    kind,
    receiptMint,
    state,
  } = tokenManagerData.parsed;
  if (
    invalidationType === _1.InvalidationType.Vest &&
    state === _1.TokenManagerState.Issued
  ) {
    if (!claimApprover) throw "Claim approver must be set";
    const claimApproverTokenAccountId = await (0,
    common_1.withFindOrInitAssociatedTokenAccount)(
      transaction,
      connection,
      mint,
      claimApprover,
      wallet.publicKey,
      true
    );
    return [
      {
        pubkey: claimApproverTokenAccountId,
        isSigner: false,
        isWritable: true,
      },
    ];
  } else if (
    invalidationType === _1.InvalidationType.Return ||
    state === _1.TokenManagerState.Issued
  ) {
    if (kind === _1.TokenManagerKind.Programmable || rulesetId) {
      // if (!rulesetId) throw "Ruleset not specified";
      if (!recipientTokenAccountOwnerId)
        throw "Recipient token account owner not specified";
      const remainingAccounts = [];
      let returnTokenAccountId;
      if (receiptMint) {
        const receiptMintLargestAccount =
          await connection.getTokenLargestAccounts(receiptMint);
        // get holder of receipt mint
        const receiptTokenAccountId =
          (_a = receiptMintLargestAccount.value[0]) === null || _a === void 0
            ? void 0
            : _a.address;
        if (!receiptTokenAccountId) throw new Error("No token accounts found");
        const receiptTokenAccount = await (0, spl_token_1.getAccount)(
          connection,
          receiptTokenAccountId
        );
        // get ATA for this mint of receipt mint holder
        returnTokenAccountId = await (0,
        common_1.withFindOrInitAssociatedTokenAccount)(
          transaction,
          connection,
          mint,
          receiptTokenAccount.owner,
          wallet.publicKey,
          true
        );
        remainingAccounts.push(
          {
            pubkey: returnTokenAccountId,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: receiptTokenAccount.owner,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: receiptTokenAccountId,
            isSigner: false,
            isWritable: true,
          }
        );
      } else {
        returnTokenAccountId = await (0,
        common_1.withFindOrInitAssociatedTokenAccount)(
          transaction,
          connection,
          mint,
          issuer,
          wallet.publicKey,
          true
        );
        remainingAccounts.push(
          {
            pubkey: returnTokenAccountId,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: issuer,
            isSigner: false,
            isWritable: false,
          }
        );
      }
      remainingAccounts.push(
        {
          pubkey: recipientTokenAccountOwnerId,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: wallet.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: web3_js_1.SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: findTokenRecordId(
            mint,
            (0, spl_token_1.getAssociatedTokenAddressSync)(
              mint,
              tokenManagerData.pubkey,
              true
            )
          ),
          isSigner: false,
          isWritable: true,
        },
        ...(0, exports.remainingAccountForProgrammable)(
          mint,
          recipientTokenAccount,
          returnTokenAccountId,
          rulesetId
        )
      );
      return remainingAccounts;
    } else {
      if (receiptMint) {
        const receiptMintLargestAccount =
          await connection.getTokenLargestAccounts(receiptMint);
        // get holder of receipt mint
        const receiptTokenAccountId =
          (_b = receiptMintLargestAccount.value[0]) === null || _b === void 0
            ? void 0
            : _b.address;
        if (!receiptTokenAccountId) throw new Error("No token accounts found");
        const receiptTokenAccount = await (0, spl_token_1.getAccount)(
          connection,
          receiptTokenAccountId
        );
        // get ATA for this mint of receipt mint holder
        const returnTokenAccountId = await (0,
        common_1.withFindOrInitAssociatedTokenAccount)(
          transaction,
          connection,
          mint,
          receiptTokenAccount.owner,
          wallet.publicKey,
          true
        );
        return [
          {
            pubkey: returnTokenAccountId,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: receiptTokenAccountId,
            isSigner: false,
            isWritable: true,
          },
        ];
      } else {
        const issuerTokenAccountId = await (0,
        common_1.withFindOrInitAssociatedTokenAccount)(
          transaction,
          connection,
          mint,
          issuer,
          wallet.publicKey,
          true
        );
        return [
          {
            pubkey: issuerTokenAccountId,
            isSigner: false,
            isWritable: true,
          },
        ];
      }
    }
  } else {
    return [];
  }
};
exports.withRemainingAccountsForReturn = withRemainingAccountsForReturn;
const getRemainingAccountsForTransfer = (transferAuthority, tokenManagerId) => {
  if (transferAuthority) {
    const transferReceiptId = (0, pda_1.findTransferReceiptId)(tokenManagerId);
    return [
      {
        pubkey: transferReceiptId,
        isSigner: false,
        isWritable: true,
      },
    ];
  } else {
    return [];
  }
};
exports.getRemainingAccountsForTransfer = getRemainingAccountsForTransfer;
const remainingAccountForProgrammable = (
  mintId,
  fromTokenAccountId,
  toTokenAccountId,
  rulesetId
) => {
  return [
    {
      pubkey: mintId,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: (0, common_1.findMintMetadataId)(mintId),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: (0, common_1.findMintEditionId)(mintId),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: findTokenRecordId(mintId, fromTokenAccountId),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: findTokenRecordId(mintId, toTokenAccountId),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: mpl_token_auth_rules_1.PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey:
        rulesetId !== null && rulesetId !== void 0
          ? rulesetId
          : common_1.METADATA_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: common_1.METADATA_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
  ];
};
exports.remainingAccountForProgrammable = remainingAccountForProgrammable;
const remainingAccountForProgrammableUnlockAndTransfer = (
  recipient,
  payer,
  mintId,
  fromTokenAccountId,
  rulesetId
) => {
  return [
    {
      pubkey: recipient,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: payer,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: web3_js_1.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: findTokenRecordId(
        mintId,
        (0, spl_token_1.getAssociatedTokenAddressSync)(
          mintId,
          (0, pda_1.findTokenManagerAddress)(mintId),
          true
        )
      ),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: mintId,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: (0, common_1.findMintMetadataId)(mintId),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: (0, common_1.findMintEditionId)(mintId),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: findTokenRecordId(mintId, fromTokenAccountId),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: mpl_token_auth_rules_1.PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: rulesetId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: common_1.METADATA_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
  ];
};
exports.remainingAccountForProgrammableUnlockAndTransfer =
  remainingAccountForProgrammableUnlockAndTransfer;
const getRemainingAccountsForIssue = (
  tokenManagerKind,
  mintId,
  issuerTokenAccountId,
  tokenManagerTokenAccountId,
  rulesetId
) => {
  if (tokenManagerKind === _1.TokenManagerKind.Permissioned) {
    return [
      {
        pubkey: _1.CRANK_KEY,
        isSigner: false,
        isWritable: true,
      },
    ];
  } else if (tokenManagerKind === _1.TokenManagerKind.Programmable) {
    if (!rulesetId) throw "Ruleset not specified";
    return (0, exports.remainingAccountForProgrammable)(
      mintId,
      issuerTokenAccountId,
      tokenManagerTokenAccountId,
      rulesetId
    );
  } else {
    return [];
  }
};
exports.getRemainingAccountsForIssue = getRemainingAccountsForIssue;
const getRemainingAccountsForClaim = (
  tokenManagerData,
  recipientTokenAccountId,
  metadata,
  claimReceiptId
) => {
  var _a, _b;
  const remainingAccounts = [];
  if (
    tokenManagerData.parsed.kind !== _1.TokenManagerKind.Programmable &&
    (metadata === null || metadata === void 0
      ? void 0
      : metadata.tokenStandard) ===
      mpl_token_metadata_1.TokenStandard.ProgrammableNonFungible
  ) {
    // update kind
    tokenManagerData.parsed.kind = _1.TokenManagerKind.Programmable;
    remainingAccounts.push({
      pubkey: (0, common_1.findMintMetadataId)(tokenManagerData.parsed.mint),
      isSigner: false,
      isWritable: false,
    });
  }
  if (
    tokenManagerData.parsed.kind === _1.TokenManagerKind.Managed ||
    tokenManagerData.parsed.kind === _1.TokenManagerKind.Permissioned
  ) {
    const mintManagerId = (0, pda_1.findMintManagerId)(
      tokenManagerData.parsed.mint
    );
    remainingAccounts.push({
      pubkey: mintManagerId,
      isSigner: false,
      isWritable: true,
    });
  } else if (tokenManagerData.parsed.kind === _1.TokenManagerKind.Edition) {
    const editionId = (0, common_1.findMintEditionId)(
      tokenManagerData.parsed.mint
    );
    remainingAccounts.push(
      {
        pubkey: editionId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: common_1.METADATA_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      }
    );
  } else if (
    tokenManagerData.parsed.kind === _1.TokenManagerKind.Programmable
  ) {
    if (
      !((_a =
        metadata === null || metadata === void 0
          ? void 0
          : metadata.programmableConfig) === null || _a === void 0
        ? void 0
        : _a.ruleSet)
    )
      throw "Ruleset not specified";
    remainingAccounts.push(
      ...(0, exports.remainingAccountForProgrammable)(
        tokenManagerData.parsed.mint,
        (0, spl_token_1.getAssociatedTokenAddressSync)(
          tokenManagerData.parsed.mint,
          tokenManagerData.pubkey,
          true
        ),
        recipientTokenAccountId,
        (_b =
          metadata === null || metadata === void 0
            ? void 0
            : metadata.programmableConfig) === null || _b === void 0
          ? void 0
          : _b.ruleSet
      )
    );
  }
  if (claimReceiptId) {
    remainingAccounts.push({
      pubkey: claimReceiptId,
      isSigner: false,
      isWritable: true,
    });
  }
  return remainingAccounts;
};
exports.getRemainingAccountsForClaim = getRemainingAccountsForClaim;
function findTokenRecordId(mint, token) {
  return web3_js_1.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      common_1.METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("token_record"),
      token.toBuffer(),
    ],
    common_1.METADATA_PROGRAM_ID
  )[0];
}
exports.findTokenRecordId = findTokenRecordId;
const findRuleSetId = (authority, name) => {
  return web3_js_1.PublicKey.findProgramAddressSync(
    [
      Buffer.from(mpl_token_auth_rules_1.PREFIX),
      authority.toBuffer(),
      Buffer.from(name),
    ],
    mpl_token_auth_rules_1.PROGRAM_ID
  )[0];
};
exports.findRuleSetId = findRuleSetId;
//# sourceMappingURL=utils.js.map
