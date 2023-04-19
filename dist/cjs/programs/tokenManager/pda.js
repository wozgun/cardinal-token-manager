"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findReceiptMintManagerId = exports.findMintCounterId = exports.findMintManagerId = exports.findTransferReceiptId = exports.findClaimReceiptId = exports.findTokenManagerAddress = exports.tokenManagerAddressFromMint = exports.tryTokenManagerAddressFromMint = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const _1 = require(".");
const constants_1 = require("./constants");
/**
 * Finds the token manager address for a given mint
 * @returns
 */
const tryTokenManagerAddressFromMint = async (connection, mint) => {
    try {
        const tokenManagerId = await (0, exports.tokenManagerAddressFromMint)(connection, mint);
        return tokenManagerId;
    }
    catch (e) {
        return null;
    }
};
exports.tryTokenManagerAddressFromMint = tryTokenManagerAddressFromMint;
/**
 * Finds the token manager address for a given mint
 * @returns
 */
const tokenManagerAddressFromMint = async (_connection, mint) => {
    const [tokenManagerId] = await (0, exports.findTokenManagerAddress)(mint);
    return tokenManagerId;
};
exports.tokenManagerAddressFromMint = tokenManagerAddressFromMint;
/**
 * Finds the token manager address for a given mint and mint counter
 * @returns
 */
const findTokenManagerAddress = async (mint) => {
    return await web3_js_1.PublicKey.findProgramAddress([anchor_1.utils.bytes.utf8.encode(constants_1.TOKEN_MANAGER_SEED), mint.toBuffer()], constants_1.TOKEN_MANAGER_ADDRESS);
};
exports.findTokenManagerAddress = findTokenManagerAddress;
/**
 * Finds the claim receipt id.
 * @returns
 */
const findClaimReceiptId = async (tokenManagerKey, recipientKey) => {
    return web3_js_1.PublicKey.findProgramAddress([
        anchor_1.utils.bytes.utf8.encode(constants_1.CLAIM_RECEIPT_SEED),
        tokenManagerKey.toBuffer(),
        recipientKey.toBuffer(),
    ], constants_1.TOKEN_MANAGER_ADDRESS);
};
exports.findClaimReceiptId = findClaimReceiptId;
/**
 * Finds the transfer receipt id.
 * @returns
 */
const findTransferReceiptId = async (tokenManagerId) => {
    return web3_js_1.PublicKey.findProgramAddress([anchor_1.utils.bytes.utf8.encode(_1.TRANSFER_RECEIPT_SEED), tokenManagerId.toBuffer()], constants_1.TOKEN_MANAGER_ADDRESS);
};
exports.findTransferReceiptId = findTransferReceiptId;
/**
 * Finds the mint manager id.
 * @returns
 */
const findMintManagerId = async (mintId) => {
    return web3_js_1.PublicKey.findProgramAddress([anchor_1.utils.bytes.utf8.encode(_1.MINT_MANAGER_SEED), mintId.toBuffer()], constants_1.TOKEN_MANAGER_ADDRESS);
};
exports.findMintManagerId = findMintManagerId;
/**
 * Finds the mint counter id.
 * @returns
 */
const findMintCounterId = async (mintId) => {
    return web3_js_1.PublicKey.findProgramAddress([anchor_1.utils.bytes.utf8.encode(_1.MINT_COUNTER_SEED), mintId.toBuffer()], constants_1.TOKEN_MANAGER_ADDRESS);
};
exports.findMintCounterId = findMintCounterId;
/**
 * Finds the receipt mint manager id.
 * @returns
 */
const findReceiptMintManagerId = async () => {
    return web3_js_1.PublicKey.findProgramAddress([anchor_1.utils.bytes.utf8.encode(_1.RECEIPT_MINT_MANAGER_SEED)], constants_1.TOKEN_MANAGER_ADDRESS);
};
exports.findReceiptMintManagerId = findReceiptMintManagerId;
//# sourceMappingURL=pda.js.map