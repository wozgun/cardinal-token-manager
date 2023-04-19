"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllClaimApprovers = exports.getClaimApprovers = exports.getClaimApprover = void 0;
const anchor_1 = require("@project-serum/anchor");
const solana_contrib_1 = require("@saberhq/solana-contrib");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
const pda_1 = require("./pda");
const getClaimApprover = async (connection, tokenManagerId) => {
    const provider = new anchor_1.AnchorProvider(connection, new solana_contrib_1.SignerWallet(web3_js_1.Keypair.generate()), {});
    const claimApproverProgram = new anchor_1.Program(constants_1.CLAIM_APPROVER_IDL, constants_1.CLAIM_APPROVER_ADDRESS, provider);
    const [claimApproverId] = await (0, pda_1.findClaimApproverAddress)(tokenManagerId);
    const parsed = await claimApproverProgram.account.paidClaimApprover.fetch(claimApproverId);
    return {
        parsed,
        pubkey: claimApproverId,
    };
};
exports.getClaimApprover = getClaimApprover;
const getClaimApprovers = async (connection, claimApproverIds) => {
    const provider = new anchor_1.AnchorProvider(connection, new solana_contrib_1.SignerWallet(web3_js_1.Keypair.generate()), {});
    const claimApproverProgram = new anchor_1.Program(constants_1.CLAIM_APPROVER_IDL, constants_1.CLAIM_APPROVER_ADDRESS, provider);
    let claimApprovers = [];
    try {
        claimApprovers =
            (await claimApproverProgram.account.paidClaimApprover.fetchMultiple(claimApproverIds));
    }
    catch (e) {
        console.log(e);
    }
    return claimApprovers.map((tm, i) => ({
        parsed: tm,
        pubkey: claimApproverIds[i],
    }));
};
exports.getClaimApprovers = getClaimApprovers;
const getAllClaimApprovers = async (connection) => {
    const programAccounts = await connection.getProgramAccounts(constants_1.CLAIM_APPROVER_ADDRESS);
    const claimApprovers = [];
    const coder = new anchor_1.BorshAccountsCoder(constants_1.CLAIM_APPROVER_IDL);
    programAccounts.forEach((account) => {
        try {
            const claimApproverData = coder.decode("paidClaimApprover", account.account.data);
            claimApprovers.push({
                ...account,
                parsed: claimApproverData,
            });
        }
        catch (e) {
            console.log(`Failed to decode claim approver data`);
        }
    });
    return claimApprovers;
};
exports.getAllClaimApprovers = getAllClaimApprovers;
//# sourceMappingURL=accounts.js.map