"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSyncNativeInstruction = exports.withWrapSol = void 0;
const tslib_1 = require("tslib");
const BufferLayout = tslib_1.__importStar(require("@solana/buffer-layout"));
const splToken = tslib_1.__importStar(require("@solana/spl-token"));
const web3_js_1 = require("@solana/web3.js");
const _1 = require(".");
const utils_1 = require("./utils");
async function withWrapSol(transaction, connection, wallet, lamports, skipInitTokenAccount = false) {
    const nativeAssociatedTokenAccountId = skipInitTokenAccount
        ? await (0, utils_1.findAta)(splToken.NATIVE_MINT, wallet.publicKey, true)
        : await (0, _1.withFindOrInitAssociatedTokenAccount)(transaction, connection, splToken.NATIVE_MINT, wallet.publicKey, wallet.publicKey);
    transaction.add(web3_js_1.SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: nativeAssociatedTokenAccountId,
        lamports,
    }));
    transaction.add(createSyncNativeInstruction(nativeAssociatedTokenAccountId));
    return transaction;
}
exports.withWrapSol = withWrapSol;
function createSyncNativeInstruction(nativeAccount) {
    const dataLayout = BufferLayout.struct([
        BufferLayout.u8("instruction"),
    ]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: 17, // SyncNative instruction
    }, data);
    const keys = [{ pubkey: nativeAccount, isSigner: false, isWritable: true }];
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: splToken.TOKEN_PROGRAM_ID,
        data,
    });
}
exports.createSyncNativeInstruction = createSyncNativeInstruction;
//# sourceMappingURL=wrappedSol.js.map