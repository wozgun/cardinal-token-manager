import { Metadata, MetadataProgram, } from "@metaplex-foundation/mpl-token-metadata";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, } from "@solana/spl-token";
import { SystemProgram, SYSVAR_INSTRUCTIONS_PUBKEY, SYSVAR_RENT_PUBKEY, } from "@solana/web3.js";
import { findAta } from "../..";
import { CRANK_KEY, TokenManagerState } from ".";
import { TOKEN_MANAGER_ADDRESS, TOKEN_MANAGER_IDL } from "./constants";
import { findClaimReceiptId, findMintCounterId, findMintManagerId, findReceiptMintManagerId, findTokenManagerAddress, findTransferReceiptId, } from "./pda";
import { getRemainingAccountsForKind } from "./utils";
export const initMintCounter = async (connection, wallet, mint) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    const [mintCounterId, _mintCounterBump] = await findMintCounterId(mint);
    return tokenManagerProgram.instruction.initMintCounter(mint, {
        accounts: {
            mintCounter: mintCounterId,
            payer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        },
    });
};
export const init = async (connection, wallet, mint, issuerTokenAccountId, amount, kind, invalidationType, numInvalidators = 1, payer) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    const [[tokenManagerId], [mintCounterId]] = await Promise.all([
        findTokenManagerAddress(mint),
        findMintCounterId(mint),
    ]);
    return [
        tokenManagerProgram.instruction.init({
            numInvalidators,
            amount,
            kind,
            invalidationType,
        }, {
            accounts: {
                tokenManager: tokenManagerId,
                mintCounter: mintCounterId,
                mint: mint,
                issuer: wallet.publicKey,
                payer: payer || wallet.publicKey,
                issuerTokenAccount: issuerTokenAccountId,
                systemProgram: SystemProgram.programId,
            },
        }),
        tokenManagerId,
    ];
};
export const setClaimApprover = (connection, wallet, tokenManagerId, claimApproverId) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    return tokenManagerProgram.instruction.setClaimApprover(claimApproverId, {
        accounts: {
            tokenManager: tokenManagerId,
            issuer: wallet.publicKey,
        },
    });
};
export const setTransferAuthority = (connection, wallet, tokenManagerId, transferAuthorityId) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    return tokenManagerProgram.instruction.setTransferAuthority(transferAuthorityId, {
        accounts: {
            tokenManager: tokenManagerId,
            issuer: wallet.publicKey,
        },
    });
};
export const transfer = (connection, wallet, tokenManagerId, mint, currentHolderTokenAccountId, recipient, recipientTokenAccountId, remainingAcounts) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    return tokenManagerProgram.instruction.transfer({
        accounts: {
            tokenManager: tokenManagerId,
            mint: mint,
            currentHolderTokenAccount: currentHolderTokenAccountId,
            recipient: recipient,
            recipientTokenAccount: recipientTokenAccountId,
            tokenProgram: TOKEN_PROGRAM_ID,
        },
        remainingAccounts: remainingAcounts ? remainingAcounts : [],
    });
};
export const addInvalidator = (connection, wallet, tokenManagerId, invalidatorId) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    return tokenManagerProgram.instruction.addInvalidator(invalidatorId, {
        accounts: {
            tokenManager: tokenManagerId,
            issuer: wallet.publicKey,
        },
    });
};
export const issue = (connection, wallet, tokenManagerId, tokenManagerTokenAccountId, issuerTokenAccountId, payer = wallet.publicKey, remainingAccounts) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    return tokenManagerProgram.instruction.issue({
        accounts: {
            tokenManager: tokenManagerId,
            tokenManagerTokenAccount: tokenManagerTokenAccountId,
            issuer: wallet.publicKey,
            issuerTokenAccount: issuerTokenAccountId,
            payer: payer,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
        },
        remainingAccounts: remainingAccounts !== null && remainingAccounts !== void 0 ? remainingAccounts : [],
    });
};
export const unissue = (connection, wallet, tokenManagerId, tokenManagerTokenAccountId, issuerTokenAccountId) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    return tokenManagerProgram.instruction.unissue({
        accounts: {
            tokenManager: tokenManagerId,
            tokenManagerTokenAccount: tokenManagerTokenAccountId,
            issuer: wallet.publicKey,
            issuerTokenAccount: issuerTokenAccountId,
            tokenProgram: TOKEN_PROGRAM_ID,
        },
    });
};
export const updateInvalidationType = (connection, wallet, tokenManagerId, invalidationType) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    return tokenManagerProgram.instruction.updateInvalidationType(invalidationType, {
        accounts: {
            tokenManager: tokenManagerId,
            issuer: wallet.publicKey,
        },
    });
};
export const claim = async (connection, wallet, tokenManagerId, tokenManagerKind, mintId, tokenManagerTokenAccountId, recipientTokenAccountId, claimReceipt) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    const remainingAccounts = await getRemainingAccountsForKind(mintId, tokenManagerKind);
    return tokenManagerProgram.instruction.claim({
        accounts: {
            tokenManager: tokenManagerId,
            tokenManagerTokenAccount: tokenManagerTokenAccountId,
            mint: mintId,
            recipient: wallet.publicKey,
            recipientTokenAccount: recipientTokenAccountId,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
        },
        remainingAccounts: claimReceipt
            ? [
                ...remainingAccounts,
                { pubkey: claimReceipt, isSigner: false, isWritable: true },
            ]
            : remainingAccounts,
    });
};
export const createClaimReceipt = async (connection, wallet, tokenManagerId, claimApproverId, payer = wallet.publicKey, target = wallet.publicKey) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    const [claimReceiptId] = await findClaimReceiptId(tokenManagerId, target);
    return [
        tokenManagerProgram.instruction.createClaimReceipt(target, {
            accounts: {
                tokenManager: tokenManagerId,
                claimApprover: claimApproverId,
                claimReceipt: claimReceiptId,
                payer,
                systemProgram: SystemProgram.programId,
            },
        }),
        claimReceiptId,
    ];
};
export const creatMintManager = async (connection, wallet, mintId, payer = wallet.publicKey) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    const [mintManagerId, _mintManagerBump] = await findMintManagerId(mintId);
    return [
        tokenManagerProgram.instruction.createMintManager({
            accounts: {
                mintManager: mintManagerId,
                mint: mintId,
                freezeAuthority: wallet.publicKey,
                payer: payer,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            },
        }),
        mintManagerId,
    ];
};
export const closeMintManager = async (connection, wallet, mintId) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    const [mintManagerId] = await findMintManagerId(mintId);
    return [
        tokenManagerProgram.instruction.closeMintManager({
            accounts: {
                mintManager: mintManagerId,
                mint: mintId,
                freezeAuthority: wallet.publicKey,
                payer: wallet.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            },
        }),
        mintManagerId,
    ];
};
export const claimReceiptMint = async (connection, wallet, name, tokenManagerId, receiptMintId, payer = wallet.publicKey) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    const [receiptMintMetadataId, recipientTokenAccountId, [receiptMintManagerId],] = await Promise.all([
        Metadata.getPDA(receiptMintId),
        findAta(receiptMintId, wallet.publicKey),
        findReceiptMintManagerId(),
    ]);
    return tokenManagerProgram.instruction.claimReceiptMint(name, {
        accounts: {
            tokenManager: tokenManagerId,
            receiptMint: receiptMintId,
            receiptMintMetadata: receiptMintMetadataId,
            recipientTokenAccount: recipientTokenAccountId,
            issuer: wallet.publicKey,
            payer: payer,
            receiptMintManager: receiptMintManagerId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedToken: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            tokenMetadataProgram: MetadataProgram.PUBKEY,
            rent: SYSVAR_RENT_PUBKEY,
        },
    });
};
export const invalidate = async (connection, wallet, mintId, tokenManagerId, tokenManagerKind, tokenManagerState, tokenManagerTokenAccountId, recipientTokenAccountId, returnAccounts) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    const transferAccounts = await getRemainingAccountsForKind(mintId, tokenManagerKind);
    return tokenManagerProgram.instruction.invalidate({
        accounts: {
            tokenManager: tokenManagerId,
            tokenManagerTokenAccount: tokenManagerTokenAccountId,
            mint: mintId,
            recipientTokenAccount: recipientTokenAccountId,
            invalidator: wallet.publicKey,
            collector: CRANK_KEY,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
        },
        remainingAccounts: [
            ...(tokenManagerState === TokenManagerState.Claimed
                ? transferAccounts
                : []),
            ...returnAccounts,
        ],
    });
};
export const createTransferReceipt = async (connection, wallet, tokenManagerId, target, payer) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    const [transferReceiptId] = await findTransferReceiptId(tokenManagerId);
    return [
        tokenManagerProgram.instruction.createTransferReceipt(target, {
            accounts: {
                tokenManager: tokenManagerId,
                transferAuthority: wallet.publicKey,
                transferReceipt: transferReceiptId,
                payer: payer !== null && payer !== void 0 ? payer : wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
        }),
        transferReceiptId,
    ];
};
export const updateTransferReceipt = async (connection, wallet, tokenManagerId, target) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    const [transferReceiptId] = await findTransferReceiptId(tokenManagerId);
    return [
        tokenManagerProgram.instruction.updateTransferReceipt(target, {
            accounts: {
                tokenManager: tokenManagerId,
                transferAuthority: wallet.publicKey,
                transferReceipt: transferReceiptId,
            },
        }),
        transferReceiptId,
    ];
};
export const closeTransferReceipt = async (connection, wallet, tokenManagerId, reipient) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    const [transferReceiptId] = await findTransferReceiptId(tokenManagerId);
    return [
        tokenManagerProgram.instruction.closeTransferReceipt({
            accounts: {
                tokenManager: tokenManagerId,
                transferAuthority: wallet.publicKey,
                transferReceipt: transferReceiptId,
                recipient: reipient !== null && reipient !== void 0 ? reipient : wallet.publicKey,
            },
        }),
        transferReceiptId,
    ];
};
export const delegate = (connection, wallet, mintId, tokenManagerId, mintManagerId, recipient, recipientTokenAccountId) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    return tokenManagerProgram.instruction.delegate({
        accounts: {
            tokenManager: tokenManagerId,
            mint: mintId,
            mintManager: mintManagerId,
            recipient: recipient,
            recipientTokenAccount: recipientTokenAccountId,
            tokenProgram: TOKEN_PROGRAM_ID,
        },
    });
};
export const undelegate = (connection, wallet, mintId, tokenManagerId, mintManagerId, recipient, recipientTokenAccountId) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    return tokenManagerProgram.instruction.undelegate({
        accounts: {
            tokenManager: tokenManagerId,
            mint: mintId,
            mintManager: mintManagerId,
            recipient: recipient,
            recipientTokenAccount: recipientTokenAccountId,
            tokenProgram: TOKEN_PROGRAM_ID,
        },
    });
};
export const send = (connection, wallet, mintId, tokenManagerId, mintManagerId, recipient, recipientTokenAccountId, target, targetTokenAccountId) => {
    const provider = new AnchorProvider(connection, wallet, {});
    const tokenManagerProgram = new Program(TOKEN_MANAGER_IDL, TOKEN_MANAGER_ADDRESS, provider);
    return tokenManagerProgram.instruction.send({
        accounts: {
            tokenManager: tokenManagerId,
            mint: mintId,
            mintManager: mintManagerId,
            recipient: recipient,
            recipientTokenAccount: recipientTokenAccountId,
            target: target,
            targetTokenAccount: targetTokenAccountId,
            payer: wallet.publicKey,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
            instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        },
    });
};
//# sourceMappingURL=instruction.js.map