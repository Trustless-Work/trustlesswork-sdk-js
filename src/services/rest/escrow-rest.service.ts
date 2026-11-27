import type { EscrowType } from "../../types";
import type { AttributionHeaders } from "../../types/types.payload";
import {
  ApproveAndReleaseMilestonesPayload,
  ApproveMilestonesPayload,
  BatchContractIdsParams,
  CctpDestinationDomain,
  ChangeMilestoneStatusPayload,
  DeployMultiReleaseEscrowPayload,
  DeploySingleReleaseEscrowPayload,
  FundEscrowPayload,
  ListEscrowEventsParams,
  ListEscrowsParams,
  ManageMultiReleaseMilestonesPayload,
  ManageSingleReleaseMilestonesPayload,
  MultiReleaseClearCrossChainDestinationPayload,
  MultiReleaseGetCrossChainDestinationParams,
  MultiReleaseReleaseFundsPayload,
  MultiReleaseSetCrossChainDestinationPayload,
  MultiReleaseResolveDisputePayload,
  MultiReleaseStartDisputePayload,
  MultiReleaseWithdrawRemainingFundsPayload,
  SingleReleaseClearCrossChainDestinationPayload,
  SingleReleaseGetCrossChainDestinationParams,
  SingleReleaseReleaseFundsPayload,
  SingleReleaseResolveDisputePayload,
  SingleReleaseSetCrossChainDestinationPayload,
  SingleReleaseStartDisputePayload,
  SingleReleaseWithdrawRemainingFundsPayload,
  UpdateMultiReleaseEscrowPayload,
  UpdateSingleReleaseEscrowPayload,
} from "../../types/types.payload";
import {
  BatchEscrowDetailsResponse,
  BatchEscrowFinancialResponse,
  BatchEscrowMilestonesResponse,
  BuildTransactionResponse,
  CctpAttestationResponse,
  CctpFeeQuoteResponse,
  DeployEscrowResponse,
  GetCrossChainDestinationResponse,
  GetEscrowMilestonesResponse,
  GetEscrowResponse,
  ListEscrowEventsResponse,
  ListEscrowsResponse,
  SendTransactionResponse,
  SetCrossChainDestinationResponse,
} from "../../types/types.response";
import type { HttpTransport } from "../../transport/http-transport";

function attributionHeaders(
  attribution?: AttributionHeaders,
): Record<string, string> | undefined {
  if (!attribution) return undefined;
  const headers: Record<string, string> = {};
  if (attribution.platformId) {
    headers["X-TW-Platform"] = attribution.platformId;
  }
  if (attribution.subjectId) {
    headers["X-TW-Subject"] = attribution.subjectId;
  }
  return Object.keys(headers).length > 0 ? headers : undefined;
}

function toContractIdsParams(contractIds: string[]): Record<string, string[]> {
  return { contractIds };
}

/**
 * REST escrow API — operate (build XDR) + read endpoints under `/escrows` and `/escrow/:type/v2`.
 */
export class EscrowRestService {
  constructor(private readonly http: HttpTransport) {}

  private v2Base(type: EscrowType) {
    return `/escrow/${type}/v2`;
  }

  sendTransaction(signedXdr: string) {
    return this.http.request<SendTransactionResponse>({
      method: "POST",
      url: "/stellar/send-transaction",
      data: { signedXdr },
    });
  }

  deployEscrow(
    data: DeploySingleReleaseEscrowPayload | DeployMultiReleaseEscrowPayload,
    type: EscrowType,
    attribution?: AttributionHeaders,
  ) {
    return this.http.request<DeployEscrowResponse>({
      method: "POST",
      url: `${this.v2Base(type)}/deploy`,
      data,
      headers: attributionHeaders(attribution),
    });
  }

  updateEscrow(
    data: UpdateSingleReleaseEscrowPayload | UpdateMultiReleaseEscrowPayload,
    type: EscrowType,
  ) {
    return this.http.request<BuildTransactionResponse>({
      method: "PUT",
      url: `${this.v2Base(type)}/update`,
      data,
    });
  }

  changeMilestoneStatus(data: ChangeMilestoneStatusPayload, type: EscrowType) {
    return this.http.request<BuildTransactionResponse>({
      method: "POST",
      url: `${this.v2Base(type)}/change-milestone-status`,
      data,
    });
  }

  approveMilestones(data: ApproveMilestonesPayload, type: EscrowType) {
    return this.http.request<BuildTransactionResponse>({
      method: "POST",
      url: `${this.v2Base(type)}/approve-milestones`,
      data,
    });
  }

  manageMilestones(
    data:
      | ManageSingleReleaseMilestonesPayload
      | ManageMultiReleaseMilestonesPayload,
    type: EscrowType,
  ) {
    return this.http.request<BuildTransactionResponse>({
      method: "POST",
      url: `${this.v2Base(type)}/manage-milestones`,
      data,
    });
  }

  fundEscrow(data: FundEscrowPayload, type: EscrowType) {
    return this.http.request<BuildTransactionResponse>({
      method: "POST",
      url: `${this.v2Base(type)}/fund`,
      data,
    });
  }

  releaseFunds(
    data: SingleReleaseReleaseFundsPayload | MultiReleaseReleaseFundsPayload,
    type: EscrowType,
  ) {
    return this.http.request<BuildTransactionResponse>({
      method: "POST",
      url: `${this.v2Base(type)}/release-funds`,
      data,
    });
  }

  releaseMilestones(data: MultiReleaseReleaseFundsPayload) {
    return this.releaseFunds(data, "multi-release");
  }

  approveAndReleaseMilestones(data: ApproveAndReleaseMilestonesPayload) {
    return this.http.request<BuildTransactionResponse>({
      method: "POST",
      url: `${this.v2Base("multi-release")}/approve-and-release-milestones`,
      data,
    });
  }

  resolveDispute(
    data:
      | SingleReleaseResolveDisputePayload
      | MultiReleaseResolveDisputePayload,
    type: EscrowType,
  ) {
    return this.http.request<BuildTransactionResponse>({
      method: "POST",
      url: `${this.v2Base(type)}/resolve-dispute`,
      data,
    });
  }

  withdrawRemainingFunds(
    data:
      | SingleReleaseWithdrawRemainingFundsPayload
      | MultiReleaseWithdrawRemainingFundsPayload,
    type: EscrowType,
  ) {
    return this.http.request<BuildTransactionResponse>({
      method: "POST",
      url: `${this.v2Base(type)}/withdraw-remaining-funds`,
      data,
    });
  }

  startDispute(
    data: SingleReleaseStartDisputePayload | MultiReleaseStartDisputePayload,
    type: EscrowType,
  ) {
    const path = type === "single-release" ? "dispute" : "dispute-milestones";
    return this.http.request<BuildTransactionResponse>({
      method: "POST",
      url: `${this.v2Base(type)}/${path}`,
      data,
    });
  }

  disputeMilestones(data: MultiReleaseStartDisputePayload) {
    return this.startDispute(data, "multi-release");
  }

  /** Receiver registers where their payout goes via CCTP (multi-release: per milestone). */
  setCrossChainDestination(
    data:
      | SingleReleaseSetCrossChainDestinationPayload
      | MultiReleaseSetCrossChainDestinationPayload,
    type: EscrowType,
  ) {
    return this.http.request<SetCrossChainDestinationResponse>({
      method: "POST",
      url: `${this.v2Base(type)}/cross-chain-destination`,
      data,
    });
  }

  /** Receiver removes the destination; the payout goes back to Stellar. */
  clearCrossChainDestination(
    data:
      | SingleReleaseClearCrossChainDestinationPayload
      | MultiReleaseClearCrossChainDestinationPayload,
    type: EscrowType,
  ) {
    return this.http.request<BuildTransactionResponse>({
      method: "POST",
      url: `${this.v2Base(type)}/cross-chain-destination/clear`,
      data,
    });
  }

  /** Resolves to `null` when no destination is set (Stellar payout). */
  async getCrossChainDestination(
    params:
      | SingleReleaseGetCrossChainDestinationParams
      | MultiReleaseGetCrossChainDestinationParams,
    type: EscrowType,
  ) {
    let url = `${this.v2Base(type)}/cross-chain-destination/${encodeURIComponent(params.contractId)}`;
    if (type === "multi-release") {
      if (!("milestoneIndex" in params)) {
        throw new TypeError("milestoneIndex is required for multi-release");
      }
      url += `/${params.milestoneIndex}`;
    }
    return this.http.request<GetCrossChainDestinationResponse>({
      method: "GET",
      url,
    });
  }

  getCctpFeeQuote(destinationDomain: CctpDestinationDomain) {
    return this.http.request<CctpFeeQuoteResponse>({
      method: "GET",
      url: `/cctp/fee-quote/${destinationDomain}`,
    });
  }

  /** Status of a CCTP burn, by the Stellar tx hash of the release. */
  getCctpAttestation(burnTxHash: string) {
    return this.http.request<CctpAttestationResponse>({
      method: "GET",
      url: `/cctp/attestation/${encodeURIComponent(burnTxHash)}`,
    });
  }

  listEscrows(params: ListEscrowsParams = {}) {
    return this.http.request<ListEscrowsResponse>({
      method: "GET",
      url: "/escrows",
      params: params as Record<string, unknown>,
    });
  }

  getEscrow(contractId: string) {
    return this.http.request<GetEscrowResponse>({
      method: "GET",
      url: `/escrows/${encodeURIComponent(contractId)}`,
    });
  }

  getEscrowDetails(params: BatchContractIdsParams | string[]) {
    const contractIds = Array.isArray(params) ? params : params.contractIds;
    return this.http.request<BatchEscrowDetailsResponse>({
      method: "GET",
      url: "/escrows/details",
      params: toContractIdsParams(contractIds),
    });
  }

  listEscrowEvents(contractId: string, params: ListEscrowEventsParams = {}) {
    return this.http.request<ListEscrowEventsResponse>({
      method: "GET",
      url: `/escrows/${encodeURIComponent(contractId)}/events`,
      params: params as Record<string, unknown>,
    });
  }

  getEscrowMilestones(contractId: string) {
    return this.http.request<GetEscrowMilestonesResponse>({
      method: "GET",
      url: `/escrows/${encodeURIComponent(contractId)}/milestones`,
    });
  }

  getEscrowsMilestones(params: BatchContractIdsParams | string[]) {
    const contractIds = Array.isArray(params) ? params : params.contractIds;
    return this.http.request<BatchEscrowMilestonesResponse>({
      method: "GET",
      url: "/escrows/milestones",
      params: toContractIdsParams(contractIds),
    });
  }

  getEscrowsFinancial(params: BatchContractIdsParams | string[]) {
    const contractIds = Array.isArray(params) ? params : params.contractIds;
    return this.http.request<BatchEscrowFinancialResponse>({
      method: "GET",
      url: "/escrows/financial",
      params: toContractIdsParams(contractIds),
    });
  }
}
