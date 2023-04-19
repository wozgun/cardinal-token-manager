import { utils } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { CLAIM_APPROVER_ADDRESS, CLAIM_APPROVER_SEED } from "./constants";
/**
 * Finds the address of the paid claim approver.
 * @returns
 */
export const findClaimApproverAddress = async (tokenManagerId) => {
    return await PublicKey.findProgramAddress([utils.bytes.utf8.encode(CLAIM_APPROVER_SEED), tokenManagerId.toBuffer()], CLAIM_APPROVER_ADDRESS);
};
//# sourceMappingURL=pda.js.map