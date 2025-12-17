export enum DeskType {
  CREDIT = 'CREDIT',
  LENDING = 'LENDING',
  SMART_CONTRACT = 'SMART_CONTRACT',
  TREASURY = 'TREASURY',
  COMMODITY = 'COMMODITY'
}

export interface LineItem {
  id: string;
  description: string;
  hsCode: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  riskGrading: 'A' | 'B' | 'C' | 'D'; // A is low risk
  riskReason: string; // e.g. "Stable Commodity", "Dual-Use Good"
}

export interface Commodity {
  id: string;
  name: string;
  sector: string;
  totalExposureINR: number;
  varAmount: number; // Value at Risk Amount
  activeContracts: number;
  volatilityIndex: number; // 0-100 score
  volatilityChange: number; // Percentage change (e.g. +1.24)
  trend: 'Rising' | 'Falling' | 'Stable';
  newsImpact: {
    summary: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    source: string;
  };
}

export interface SmartContractData {
  contractAddress: string;
  status: 'AWAITING_FUNDS' | 'ACTIVE_TRANSIT' | 'CUSTOMS_HOLD' | 'PAYMENT_PENDING' | 'SETTLED';
  creationDate: string;
  lastUpdate: string;
  financials: {
    loanAmountINR: number;
    interestRateToExporter: number; // e.g. 8.5%
    ukBankGuaranteeFee: number; // e.g. 2.0% (Cost to Indian Bank)
    indianBankNetMargin: number; // e.g. 6.5% (Profit)
  };
  liveMetrics: {
    swapMTM: number; // Mark to market profit/loss in INR
    riskScoreCurrent: number; // Fluctuating risk score
    logisticsStatus: string;
  };
  // NEW: Deep details about the bank-to-bank contract
  interBankSwapDetails: {
    isdaVersion: string; // e.g., 'ISDA 2002 Master'
    masterAgreementId: string;
    counterpartyBank: string;
    counterpartyCountry: string;
    maturityBucket: 'Monthly' | 'Quarterly' | 'Yearly';
    maturityDate: string;
    settlementCycle: string; // e.g., 'T+2'
  };
}

export interface Invoice {
  id: string;
  exporter: string;
  importer: string;
  amountGBP: number;
  amountINR: number;
  dueDate: string;
  status: 'Draft' | 'Underwriting' | 'ReadyToFund' | 'Active' | 'Settled';
  integrity: {
    gstnVerified: boolean;
    logisticsVerified: boolean; // e-BL
    dpcVerified: boolean; // Digital Payment Commitment
  };
  industry: string;
  riskScore: number;
  lineItems: LineItem[];
  riskProfile?: {
    exporter: {
      cibilScore: number;
      gstStatus: string;
      regulatoryStatus: string;
      financialHealth: string;
      panAvailability: boolean;
      itrCompliance: string;
      dgft: { 
        iecCode: string;
        iecStatus: 'Active' | 'Suspended';
        exportBenefits: string; 
      };
    };
    importer: {
      creditAgencyScore: number;
      bankCounterpartyTier: string;
      countryRisk: string;
      forexExposure: string;
      creditLimitGBP: number;
      currentUtilizationGBP: number;
      disputeHistory: string; 
    };
    transaction: {
      fraudProbability: string;
      priceAnomaly: string;
      tradeHistory: string;
    };
  };
  ukBankCommitment?: {
    bankName: string; 
    swiftRef: string; 
    commitmentType: string; 
    commitmentDate: string;
    status: 'Approved' | 'Pending';
  };
  logistics?: {
    provider: string;
    trackingId: string;
    vesselName?: string;
    status: string;
    routeRisk: 'Low' | 'Medium' | 'High';
    estimatedArrival: string;
    coordinates?: { lat: number, lng: number };
  };
  smartContractData?: SmartContractData;
  financingProposal?: {
    interestRate: number;
    processingFee: number;
    tenureDays: number;
    projectedInterestIncome: number;
    swapStrategy: {
      spotRef: number;
      forwardPoints: number;
      effectiveHedgeRate: number;
    };
  };
}

export interface SwapRate {
  pair: string;
  spot: number;
  sonia: number;
  mifor: number;
  basisSpread: number; // bps
  timestamp: string;
}

export interface GeminiAnalysis {
  recommendation: string;
  riskAssessment: string;
  actionItem: string;
}

export interface LiquidityProvider {
  id: string;
  bankName: string; // e.g., Barclays, Std Chartered
  quoteGBP: number; // Cost of borrowing GBP
  availableLimit: number;
  grossPayable: number;
  grossReceivable: number;
  tier: 'Tier 1' | 'Tier 2';
  lastUpdated: string;
}

export interface SwapRiskMetrics {
  delta: number; // Sensitivity to spot price
  gamma: number; // Sensitivity to delta
  theta: number; // Time decay
  vega: number; // Sensitivity to volatility
  rho: number; // Sensitivity to interest rate
  var99: number; // Value at Risk (99% confidence)
  stressTestResult: 'Pass' | 'Warning' | 'Fail';
}

export interface RegulatoryLog {
  id: string;
  authority: 'RBI (India)' | 'FCA (UK)' | 'EDPMS';
  type: 'FEMA Declaration' | 'MIFID II' | 'Purpose Code P0103';
  referenceId: string; // IRN or Similar
  status: 'Pending' | 'Acknowledged' | 'Rejected';
  timestamp: string;
  details: string;
}

export interface MaturityBucket {
  bucket: string; // e.g., '1M', '3M'
  exposure: number; // in GBP
  count: number;
}