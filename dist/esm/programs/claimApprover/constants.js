import { emptyWallet } from "@cardinal/common";
import { DEFAULT_PAYMENT_MANAGER_NAME } from "@cardinal/payment-manager";
import { findPaymentManagerAddress } from "@cardinal/payment-manager/dist/cjs/pda";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as CLAIM_APPROVER_TYPES from "../../idl/cardinal_paid_claim_approver";
export const CLAIM_APPROVER_ADDRESS = new PublicKey("ASARc3C85tapTVLHLfDMdzxiNCjJDM4C7ZmEZNJ5g9FV");
export const CLAIM_APPROVER_SEED = "paid-claim-approver";
export const CLAIM_APPROVER_IDL = CLAIM_APPROVER_TYPES.IDL;
export const defaultPaymentManagerId = findPaymentManagerAddress(DEFAULT_PAYMENT_MANAGER_NAME);
export const claimApproverProgram = (connection, wallet, confirmOptions) => {
    return new Program(CLAIM_APPROVER_IDL, CLAIM_APPROVER_ADDRESS, new AnchorProvider(connection, wallet !== null && wallet !== void 0 ? wallet : emptyWallet(Keypair.generate().publicKey), confirmOptions !== null && confirmOptions !== void 0 ? confirmOptions : {}));
};
//# sourceMappingURL=constants.js.map