import type { ParsedIdlAccountData } from "@cardinal/common";
import { emptyWallet } from "@cardinal/common";
import { AnchorProvider, Program } from "@project-serum/anchor";
import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { ConfirmOptions, Connection } from "@solana/web3.js";
import { Keypair, PublicKey } from "@solana/web3.js";

import * as CLAIM_APPROVER_TYPES from "../../idl/cardinal_paid_claim_approver";
import { DEFAULT_PAYMENT_MANAGER_NAME } from "../paymentManager";
import { findPaymentManagerAddress } from "../paymentManager/pda";

export const CLAIM_APPROVER_ADDRESS = new PublicKey(
  "4MD5VTfXNDN7Z4qzJ5Puet6ZCRgqrfnc8mzosNkviRAW"
);

export const CLAIM_APPROVER_SEED = "paid-claim-approver";

export const CLAIM_APPROVER_IDL = CLAIM_APPROVER_TYPES.IDL;

export type CLAIM_APPROVER_PROGRAM =
  CLAIM_APPROVER_TYPES.CardinalPaidClaimApprover;

export type PaidClaimApproverData = ParsedIdlAccountData<
  "paidClaimApprover",
  CLAIM_APPROVER_PROGRAM
>;

export const defaultPaymentManagerId = findPaymentManagerAddress(
  DEFAULT_PAYMENT_MANAGER_NAME
);

export type ClaimApproverParams = {
  paymentMint: PublicKey;
  paymentAmount: number;
  collector?: PublicKey;
  paymentManager?: PublicKey;
};

export const claimApproverProgram = (
  connection: Connection,
  wallet?: Wallet,
  confirmOptions?: ConfirmOptions
) => {
  return new Program<CLAIM_APPROVER_PROGRAM>(
    CLAIM_APPROVER_IDL,
    CLAIM_APPROVER_ADDRESS,
    new AnchorProvider(
      connection,
      wallet ?? emptyWallet(Keypair.generate().publicKey),
      confirmOptions ?? {}
    )
  );
};
