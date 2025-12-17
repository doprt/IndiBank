import { Invoice, SwapRate, Commodity, LiquidityProvider, SwapRiskMetrics, RegulatoryLog, MaturityBucket } from './types';

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2024-001',
    exporter: 'Tata Textiles Ltd',
    importer: 'British Retail Group',
    amountGBP: 450000,
    amountINR: 47250000,
    dueDate: '2024-06-15',
    status: 'Underwriting',
    integrity: { gstnVerified: true, logisticsVerified: true, dpcVerified: true },
    industry: 'Textiles',
    riskScore: 92,
    lineItems: [
      { id: 'LI-01', description: 'Premium Cotton Sheets (Thread Count 400)', hsCode: '6302.21', quantity: 5000, unitPrice: 25, totalValue: 125000, riskGrading: 'A', riskReason: 'Stable Price, Non-Perishable' },
      { id: 'LI-02', description: 'Dyed Woven Fabrics', hsCode: '5208.32', quantity: 10000, unitPrice: 32.5, totalValue: 325000, riskGrading: 'A', riskReason: 'Standard Commodity' }
    ],
    riskProfile: {
      exporter: {
        cibilScore: 785,
        gstStatus: "36M Consistent Filing",
        regulatoryStatus: "MCA Active (Clean)",
        financialHealth: "Strong EBITDA",
        panAvailability: true,
        itrCompliance: "Filed (3 Years Avg Growth > 10%)",
        dgft: { iecCode: "0588123991", iecStatus: "Active", exportBenefits: "RoDTEP (Tier 1)" }
      },
      importer: {
        creditAgencyScore: 92,
        bankCounterpartyTier: "Tier 1 (HSBC UK)",
        countryRisk: "Low (UK Sovereign)",
        forexExposure: "Fully Hedged",
        creditLimitGBP: 1000000,
        currentUtilizationGBP: 450000,
        disputeHistory: "Clean Record"
      },
      transaction: {
        fraudProbability: "Very Low (<0.1%)",
        priceAnomaly: "Matches Export Index",
        tradeHistory: "Strategic Partner (12+ Yrs)"
      }
    },
    ukBankCommitment: {
      bankName: "HSBC UK Plc",
      swiftRef: "HSBC-LON-772910",
      commitmentType: "Irrevocable Reimbursement Undertaking",
      commitmentDate: "2024-03-14",
      status: "Approved"
    },
    logistics: {
      provider: "Maersk Line",
      trackingId: "MSK99822100",
      vesselName: "Maersk Seletar",
      status: "Departed Nhava Sheva",
      routeRisk: "Low",
      estimatedArrival: "2024-06-10",
      coordinates: { lat: 18.94, lng: 72.95 }
    },
    financingProposal: {
      interestRate: 8.25,
      processingFee: 15000,
      tenureDays: 90,
      projectedInterestIncome: 974531,
      swapStrategy: { spotRef: 105.45, forwardPoints: 0.85, effectiveHedgeRate: 106.30 }
    }
  },
  {
    id: 'INV-2024-004',
    exporter: 'Hyderabad Pharma',
    importer: 'NHS Supply Chain',
    amountGBP: 2200000,
    amountINR: 231000000,
    dueDate: '2024-06-10',
    status: 'Active',
    integrity: { gstnVerified: true, logisticsVerified: true, dpcVerified: true },
    industry: 'Pharmaceuticals',
    riskScore: 98,
    lineItems: [
      { id: 'LI-01', description: 'Paracetamol API', hsCode: '2924.29', quantity: 50000, unitPrice: 24, totalValue: 1200000, riskGrading: 'A', riskReason: 'Critical Medicine' },
      { id: 'LI-02', description: 'Sterile Surgical Gloves', hsCode: '4015.11', quantity: 100000, unitPrice: 10, totalValue: 1000000, riskGrading: 'A', riskReason: 'Sovereign Buyer' }
    ],
    riskProfile: {
      exporter: {
        cibilScore: 810,
        gstStatus: "Gold Standard Compliance",
        regulatoryStatus: "US FDA Approved Facility",
        financialHealth: "Cash Rich",
        panAvailability: true,
        itrCompliance: "Filed (Audited)",
        dgft: { iecCode: "0992100221", iecStatus: "Active", exportBenefits: "RoDTEP (Pharma Special)" }
      },
      importer: {
        creditAgencyScore: 99,
        bankCounterpartyTier: "Sovereign Backed",
        countryRisk: "Negligible",
        forexExposure: "Govt Protocol",
        creditLimitGBP: 50000000,
        currentUtilizationGBP: 2200000,
        disputeHistory: "None"
      },
      transaction: {
        fraudProbability: "None",
        priceAnomaly: "Contracted Rate",
        tradeHistory: "Volume Partner"
      }
    },
    ukBankCommitment: {
      bankName: "Bank of England (Settlement)",
      swiftRef: "BOE-GOV-PAY-99",
      commitmentType: "Sovereign Payment Undertaking",
      commitmentDate: "2024-03-01",
      status: "Approved"
    },
    smartContractData: {
      contractAddress: "0x7a2...99b1",
      status: "ACTIVE_TRANSIT",
      creationDate: "2024-05-10",
      lastUpdate: "2024-05-23 14:00:00",
      financials: {
        loanAmountINR: 231000000,
        interestRateToExporter: 7.50,
        ukBankGuaranteeFee: 1.50,
        indianBankNetMargin: 6.00
      },
      liveMetrics: {
        swapMTM: 125000, // Positive MTM
        riskScoreCurrent: 98,
        logisticsStatus: "In Air - approaching Heathrow"
      },
      interBankSwapDetails: {
        isdaVersion: 'ISDA 2002 Master',
        masterAgreementId: 'MA-AXIS-BOE-2019',
        counterpartyBank: 'Barclays London (Clearing)',
        counterpartyCountry: 'United Kingdom',
        maturityBucket: 'Monthly',
        maturityDate: '2024-06-15',
        settlementCycle: 'T+2'
      }
    },
    logistics: {
      provider: "FedEx Trade",
      trackingId: "FX991200",
      vesselName: "Air Cargo Flight 991",
      status: "In Transit (Air)",
      routeRisk: "Low",
      estimatedArrival: "2024-06-08",
      coordinates: { lat: 51.47, lng: -0.45 }
    },
    financingProposal: {
      interestRate: 7.50,
      processingFee: 100000,
      tenureDays: 45,
      projectedInterestIncome: 2130000,
      swapStrategy: { spotRef: 105.45, forwardPoints: 0.40, effectiveHedgeRate: 105.85 }
    }
  },
  // NEW ACTIVE SMART CONTRACTS
  {
    id: 'INV-2024-008',
    exporter: 'Surat Diamond Works',
    importer: 'Antwerp Gems BV',
    amountGBP: 850000,
    amountINR: 89250000,
    dueDate: '2024-07-01',
    status: 'Active',
    integrity: { gstnVerified: true, logisticsVerified: true, dpcVerified: true },
    industry: 'Gems & Jewellery',
    riskScore: 95,
    lineItems: [{ id: 'LI-01', description: 'Cut Diamonds', hsCode: '7102.39', quantity: 500, unitPrice: 1700, totalValue: 850000, riskGrading: 'A', riskReason: 'High Value' }],
    smartContractData: {
      contractAddress: "0x8b1...22c3",
      status: "CUSTOMS_HOLD",
      creationDate: "2024-05-15",
      lastUpdate: "2024-05-24 09:30:00",
      financials: { loanAmountINR: 89250000, interestRateToExporter: 8.1, ukBankGuaranteeFee: 1.8, indianBankNetMargin: 6.3 },
      liveMetrics: { swapMTM: -45000, riskScoreCurrent: 88, logisticsStatus: "Held at Antwerp Port" },
      interBankSwapDetails: {
        isdaVersion: 'ISDA 2002 Master',
        masterAgreementId: 'MA-AXIS-KBC-2021',
        counterpartyBank: 'KBC Bank NV',
        counterpartyCountry: 'Belgium (EU)',
        maturityBucket: 'Quarterly',
        maturityDate: '2024-09-30',
        settlementCycle: 'T+2'
      }
    },
    logistics: { provider: "Brinks", trackingId: "BRK-9912", vesselName: "Secure Air 1", status: "Customs Hold", routeRisk: "Low", estimatedArrival: "2024-05-25", coordinates: { lat: 51.21, lng: 4.40 } },
    financingProposal: {interestRate: 8.1, processingFee: 25000, tenureDays: 45, projectedInterestIncome: 890000, swapStrategy: { spotRef: 105.40, forwardPoints: 0.50, effectiveHedgeRate: 105.90 }}
  },
  {
    id: 'INV-2024-012',
    exporter: 'Chennai Auto Components',
    importer: 'Detroit Motors UK',
    amountGBP: 1500000,
    amountINR: 157500000,
    dueDate: '2024-08-15',
    status: 'Active',
    integrity: { gstnVerified: true, logisticsVerified: true, dpcVerified: true },
    industry: 'Automotive',
    riskScore: 91,
    lineItems: [{ id: 'LI-01', description: 'Gearbox Assembly', hsCode: '8708.40', quantity: 200, unitPrice: 7500, totalValue: 1500000, riskGrading: 'A', riskReason: 'OEM Contract' }],
    smartContractData: {
      contractAddress: "0x9c4...11d9",
      status: "ACTIVE_TRANSIT",
      creationDate: "2024-05-18",
      lastUpdate: "2024-05-24 10:15:00",
      financials: { loanAmountINR: 157500000, interestRateToExporter: 7.8, ukBankGuaranteeFee: 1.6, indianBankNetMargin: 6.2 },
      liveMetrics: { swapMTM: 85000, riskScoreCurrent: 94, logisticsStatus: "Vessel in Red Sea" },
      interBankSwapDetails: {
        isdaVersion: 'ISDA 2002 Master',
        masterAgreementId: 'MA-AXIS-LLOYDS-2020',
        counterpartyBank: 'Lloyds Bank',
        counterpartyCountry: 'United Kingdom',
        maturityBucket: 'Quarterly',
        maturityDate: '2024-09-30',
        settlementCycle: 'T+2'
      }
    },
    logistics: { provider: "MSC", trackingId: "MSC-7721", vesselName: "MSC Oscar", status: "In Transit", routeRisk: "High", estimatedArrival: "2024-06-20", coordinates: { lat: 15.5, lng: 41.5 } },
    financingProposal: {interestRate: 7.8, processingFee: 45000, tenureDays: 90, projectedInterestIncome: 3050000, swapStrategy: { spotRef: 105.50, forwardPoints: 0.90, effectiveHedgeRate: 106.40 }}
  },
  {
    id: 'INV-2024-015',
    exporter: 'Punjab Agro Foods',
    importer: 'US Whole Foods',
    amountGBP: 350000,
    amountINR: 36750000,
    dueDate: '2024-06-30',
    status: 'Active',
    integrity: { gstnVerified: true, logisticsVerified: true, dpcVerified: true },
    industry: 'Agriculture',
    riskScore: 89,
    lineItems: [{ id: 'LI-01', description: 'Basmati Rice Premium', hsCode: '1006.30', quantity: 10000, unitPrice: 35, totalValue: 350000, riskGrading: 'B', riskReason: 'Perishable' }],
    smartContractData: {
      contractAddress: "0x3f2...88a1",
      status: "PAYMENT_PENDING",
      creationDate: "2024-04-20",
      lastUpdate: "2024-05-24 08:00:00",
      financials: { loanAmountINR: 36750000, interestRateToExporter: 8.5, ukBankGuaranteeFee: 2.1, indianBankNetMargin: 6.4 },
      liveMetrics: { swapMTM: 12000, riskScoreCurrent: 90, logisticsStatus: "Delivered to Warehouse" },
      interBankSwapDetails: {
        isdaVersion: 'ISDA 1992 Master',
        masterAgreementId: 'MA-AXIS-JPM-2018',
        counterpartyBank: 'JP Morgan Chase (Lon)',
        counterpartyCountry: 'United States',
        maturityBucket: 'Monthly',
        maturityDate: '2024-06-30',
        settlementCycle: 'T+1'
      }
    },
    logistics: { provider: "Hapag-Lloyd", trackingId: "HL-3321", vesselName: "Al Jmeliyah", status: "Delivered", routeRisk: "Low", estimatedArrival: "2024-05-20", coordinates: { lat: 40.71, lng: -74.00 } },
    financingProposal: {interestRate: 8.5, processingFee: 12000, tenureDays: 60, projectedInterestIncome: 520000, swapStrategy: { spotRef: 105.35, forwardPoints: 0.45, effectiveHedgeRate: 105.80 }}
  },
  {
    id: 'INV-2024-022',
    exporter: 'Kerala Spices',
    importer: 'German BioMarkt',
    amountGBP: 120000,
    amountINR: 12600000,
    dueDate: '2024-07-15',
    status: 'Active',
    integrity: { gstnVerified: true, logisticsVerified: true, dpcVerified: true },
    industry: 'Agriculture',
    riskScore: 85,
    lineItems: [{ id: 'LI-01', description: 'Organic Cardamom', hsCode: '0908.31', quantity: 500, unitPrice: 240, totalValue: 120000, riskGrading: 'B', riskReason: 'Price Volatility' }],
    smartContractData: {
      contractAddress: "0x1d4...55e9",
      status: "ACTIVE_TRANSIT",
      creationDate: "2024-05-20",
      lastUpdate: "2024-05-24 11:00:00",
      financials: { loanAmountINR: 12600000, interestRateToExporter: 8.8, ukBankGuaranteeFee: 2.2, indianBankNetMargin: 6.6 },
      liveMetrics: { swapMTM: -1500, riskScoreCurrent: 85, logisticsStatus: "Departed Kochi" },
      interBankSwapDetails: {
        isdaVersion: 'ISDA 2002 Master',
        masterAgreementId: 'MA-AXIS-DEUTSCHE-2022',
        counterpartyBank: 'Deutsche Bank AG',
        counterpartyCountry: 'Germany (EU)',
        maturityBucket: 'Monthly',
        maturityDate: '2024-07-31',
        settlementCycle: 'T+2'
      }
    },
    logistics: { provider: "CMA CGM", trackingId: "CMA-9910", vesselName: "CMA CGM Marco Polo", status: "In Transit", routeRisk: "Medium", estimatedArrival: "2024-06-15", coordinates: { lat: 9.93, lng: 76.26 } },
    financingProposal: {interestRate: 8.8, processingFee: 5000, tenureDays: 55, projectedInterestIncome: 168000, swapStrategy: { spotRef: 105.45, forwardPoints: 0.55, effectiveHedgeRate: 106.00 }}
  }
];

export const MOCK_MATURITY_PROFILE: MaturityBucket[] = [
  { bucket: 'Spot (<1W)', exposure: 12000000, count: 15 },
  { bucket: 'Monthly (Jun)', exposure: 45000000, count: 42 },
  { bucket: 'Monthly (Jul)', exposure: 38000000, count: 35 },
  { bucket: 'Q3 (Aug-Sep)', exposure: 85000000, count: 60 },
  { bucket: 'Q4 (Oct-Dec)', exposure: 22000000, count: 18 },
  { bucket: 'Long Term (>1Y)', exposure: 5000000, count: 4 },
];

export const MOCK_COMMODITY_DATA: Commodity[] = [
  // TEXTILES
  {
    id: 'CMD-01', name: 'Industrial Cotton', sector: 'Textiles', totalExposureINR: 47250000, varAmount: 2362500,
    activeContracts: 1, volatilityIndex: 45, volatilityChange: 1.2, trend: 'Stable',
    newsImpact: { summary: "Gujarat yields stable. Global demand moderate.", sentiment: "Neutral", source: "Reuters" }
  },
  {
    id: 'CMD-02', name: 'Silk (Raw)', sector: 'Textiles', totalExposureINR: 15500000, varAmount: 930000,
    activeContracts: 2, volatilityIndex: 60, volatilityChange: -2.1, trend: 'Falling',
    newsImpact: { summary: "Import duty hike discussions in China.", sentiment: "Negative", source: "Textile Min" }
  },
  {
    id: 'CMD-03', name: 'Synthetic Yarn', sector: 'Textiles', totalExposureINR: 8200000, varAmount: 328000,
    activeContracts: 4, volatilityIndex: 30, volatilityChange: 0.5, trend: 'Rising',
    newsImpact: { summary: "Crude oil prices pushing input costs up.", sentiment: "Negative", source: "Platts" }
  },
  // PHARMA
  {
    id: 'CMD-04', name: 'Paracetamol API', sector: 'Pharma', totalExposureINR: 120000000, varAmount: 3600000,
    activeContracts: 5, volatilityIndex: 15, volatilityChange: 0.2, trend: 'Stable',
    newsImpact: { summary: "Strategic stockpile mandate by UK NHS.", sentiment: "Positive", source: "PharmaBiz" }
  },
  {
    id: 'CMD-05', name: 'Ibuprofen API', sector: 'Pharma', totalExposureINR: 45000000, varAmount: 1800000,
    activeContracts: 2, volatilityIndex: 20, volatilityChange: -0.8, trend: 'Stable',
    newsImpact: { summary: "Supply chain normalized post-monsoon.", sentiment: "Neutral", source: "Pharmexcil" }
  },
  {
    id: 'CMD-06', name: 'Vaccine Adjuvants', sector: 'Pharma', totalExposureINR: 66000000, varAmount: 5280000,
    activeContracts: 1, volatilityIndex: 35, volatilityChange: 4.5, trend: 'Rising',
    newsImpact: { summary: "New flu strain concerns in Europe.", sentiment: "Positive", source: "WHO/News" }
  },
  // AGRICULTURE
  {
    id: 'CMD-07', name: 'Turmeric (Salem)', sector: 'Agriculture', totalExposureINR: 8000000, varAmount: 560000,
    activeContracts: 3, volatilityIndex: 68, volatilityChange: -3.2, trend: 'Falling',
    newsImpact: { summary: "Excess rainfall affecting curcumin content.", sentiment: "Negative", source: "Spices Board" }
  },
  {
    id: 'CMD-08', name: 'Black Pepper', sector: 'Agriculture', totalExposureINR: 5125000, varAmount: 358750,
    activeContracts: 2, volatilityIndex: 55, volatilityChange: 1.8, trend: 'Rising',
    newsImpact: { summary: "Vietnam harvest delayed.", sentiment: "Positive", source: "AgriWatch" }
  },
  {
    id: 'CMD-09', name: 'Basmati Rice', sector: 'Agriculture', totalExposureINR: 89000000, varAmount: 4450000,
    activeContracts: 8, volatilityIndex: 25, volatilityChange: 0.1, trend: 'Stable',
    newsImpact: { summary: "Export ban lifted for specific grades.", sentiment: "Positive", source: "DGFT Notification" }
  },
  {
    id: 'CMD-10', name: 'Assam Tea (Orthodox)', sector: 'Agriculture', totalExposureINR: 22000000, varAmount: 1320000,
    activeContracts: 4, volatilityIndex: 40, volatilityChange: 2.2, trend: 'Rising',
    newsImpact: { summary: "Strong demand from London auction houses.", sentiment: "Positive", source: "Tea Board" }
  },
  {
    id: 'CMD-11', name: 'Robusta Coffee', sector: 'Agriculture', totalExposureINR: 34000000, varAmount: 2380000,
    activeContracts: 3, volatilityIndex: 62, volatilityChange: 5.1, trend: 'Rising',
    newsImpact: { summary: "Brazil frost affecting global futures.", sentiment: "Positive", source: "Bloomberg" }
  },
  // METALS
  {
    id: 'CMD-12', name: 'Copper Cathodes', sector: 'Metals', totalExposureINR: 150000000, varAmount: 12000000,
    activeContracts: 2, volatilityIndex: 75, volatilityChange: -4.5, trend: 'Falling',
    newsImpact: { summary: "LME inventory buildup signals weak demand.", sentiment: "Negative", source: "LME Feed" }
  },
  {
    id: 'CMD-13', name: 'Aluminum Ingots', sector: 'Metals', totalExposureINR: 98000000, varAmount: 5880000,
    activeContracts: 3, volatilityIndex: 42, volatilityChange: 1.1, trend: 'Rising',
    newsImpact: { summary: "Green energy transition driving demand.", sentiment: "Positive", source: "Metal Bulletin" }
  },
  {
    id: 'CMD-14', name: 'Steel Coils (HRC)', sector: 'Metals', totalExposureINR: 210000000, varAmount: 10500000,
    activeContracts: 6, volatilityIndex: 38, volatilityChange: -0.5, trend: 'Stable',
    newsImpact: { summary: "Domestic infra spend offsetting global slump.", sentiment: "Neutral", source: "SteelMint" }
  },
  // ENERGY & CHEMICALS
  {
    id: 'CMD-15', name: 'Mentha Oil', sector: 'Chemicals', totalExposureINR: 5500000, varAmount: 440000,
    activeContracts: 1, volatilityIndex: 82, volatilityChange: 6.7, trend: 'Rising',
    newsImpact: { summary: "Speculative buying in futures market.", sentiment: "Negative", source: "MCX Feed" }
  },
  {
    id: 'CMD-16', name: 'Ethanol (Industrial)', sector: 'Energy', totalExposureINR: 18000000, varAmount: 900000,
    activeContracts: 2, volatilityIndex: 28, volatilityChange: 0.3, trend: 'Stable',
    newsImpact: { summary: "Government blending mandate targets met.", sentiment: "Positive", source: "Energy Min" }
  },
  {
    id: 'CMD-17', name: 'Solar Glass', sector: 'Energy', totalExposureINR: 42000000, varAmount: 2940000,
    activeContracts: 3, volatilityIndex: 33, volatilityChange: 1.5, trend: 'Rising',
    newsImpact: { summary: "Anti-dumping duty on imports considered.", sentiment: "Positive", source: "Renewable Watch" }
  },
  {
    id: 'CMD-18', name: 'Castor Oil', sector: 'Chemicals', totalExposureINR: 11000000, varAmount: 660000,
    activeContracts: 2, volatilityIndex: 41, volatilityChange: -1.2, trend: 'Falling',
    newsImpact: { summary: "China demand slowdown.", sentiment: "Negative", source: "Solvent Extractors" }
  }
];

export const MOCK_RATES: SwapRate = {
  pair: 'GBP/INR',
  spot: 105.45,
  sonia: 5.25,
  mifor: 6.85,
  basisSpread: 160,
  timestamp: new Date().toISOString(),
};

export const CONCENTRATION_DATA = [
  { name: 'Pharmaceuticals', size: 231000000, fill: '#3b82f6' },
  { name: 'Automotive', size: 89250000, fill: '#6366f1' },
  { name: 'Textiles', size: 47250000, fill: '#8b5cf6' },
  { name: 'Agriculture', size: 13125000, fill: '#10b981' },
  { name: 'Services', size: 6300000, fill: '#f59e0b' },
];

export const BASIS_HISTORY = [
  { time: '09:00', spread: 158 },
  { time: '10:00', spread: 160 },
  { time: '11:00', spread: 162 },
  { time: '12:00', spread: 159 },
  { time: '13:00', spread: 161 },
  { time: '14:00', spread: 165 },
  { time: '15:00', spread: 160 },
];

export const SWAP_CONFIG = {
  maturityMatching: "Perfectly Matched (Spot+2)",
  collateralHaircut: 0.00
};

export const MOCK_NETTING_BATCH = {
  id: "NET-2024-05-23-B1",
  totalInvoices: 124,
  netAmountGBP: 14200000,
  merkleRoot: "0x7f8a9...b2c1",
  counterpartyBank: "Barclays London (GB)",
};

export const MOCK_UK_IMPORTERS = [
  {
    id: "IMP-UK-001",
    name: "British Retail Group",
    availableHeadroom: 550000,
    totalCreditLine: 1000000,
    sanctionsStatus: "Clean",
    ofsiCheckDate: "2024-05-23",
  },
  {
    id: "IMP-UK-002",
    name: "NHS Supply Chain",
    availableHeadroom: 47800000,
    totalCreditLine: 50000000,
    sanctionsStatus: "Clean",
    ofsiCheckDate: "2024-05-23",
  },
  {
    id: "IMP-UK-003",
    name: "London Flavours Plc",
    availableHeadroom: 175000,
    totalCreditLine: 300000,
    sanctionsStatus: "Clean",
    ofsiCheckDate: "2024-05-22",
  },
];

export const MOCK_DPCS = [
  {
    commitmentId: "DPC-2024-001",
    status: "Signed",
    amount: 450000,
    exporterName: "Tata Textiles Ltd",
    legalSignature: "0xSignedByHSBC...99a",
  },
  {
    commitmentId: "DPC-2024-002",
    status: "Draft",
    amount: 125000,
    exporterName: "Bengal Spices Corp",
    legalSignature: "",
  },
  {
    commitmentId: "DPC-2024-004",
    status: "Signed",
    amount: 2200000,
    exporterName: "Hyderabad Pharma",
    legalSignature: "0xSignedByBOE...11b",
  },
];

export const MOCK_SHIPMENTS = [
  {
    id: "SHP-001",
    vessel: "Maersk Seletar",
    origin: "Nhava Sheva",
    destination: "Southampton",
    gpsStatus: "On Course",
    coordinates: { lat: 36.1, lng: -5.35 }, // Near Gibraltar
    hmrcRef: "GB-CDS-992100",
    customsStatus: "Pre-Lodged (Cleared)",
  },
  {
    id: "SHP-004",
    vessel: "Air Cargo Flight 991",
    origin: "Hyderabad",
    destination: "Heathrow",
    gpsStatus: "On Course",
    coordinates: { lat: 48.85, lng: 2.35 }, // Over France
    hmrcRef: "GB-CDS-772811",
    customsStatus: "Cleared (Priority)",
  },
];

export const MOCK_GLOBAL_SETTLEMENT = {
  batchId: "SET-GLOBAL-2024-05-23",
  counterparties: [
    {
      bankName: "Barclays London",
      country: "United Kingdom",
      currency: "GBP",
      netPosition: -4200000, // Negative means we pay them? Or they pay us? The UI shows PAY for negative.
      status: "Confirmed",
      isoMessage: "pacs.009",
    },
    {
      bankName: "JP Morgan NY",
      country: "United States",
      currency: "USD",
      netPosition: 1500000,
      status: "Settled",
      isoMessage: "pacs.008",
    },
    {
      bankName: "Deutsche Bank",
      country: "Germany",
      currency: "EUR",
      netPosition: -850000,
      status: "Pending",
      isoMessage: "pacs.009",
    },
  ],
};

// NEW MOCK DATA FOR TREASURY UPGRADE
export const MOCK_LIQUIDITY_PROVIDERS: LiquidityProvider[] = [
  {
    id: 'LP-001', bankName: 'Barclays UK', quoteGBP: 5.25, availableLimit: 50000000,
    grossPayable: 25000000, grossReceivable: 23000000, tier: 'Tier 1', lastUpdated: '00:05 ago'
  },
  {
    id: 'LP-002', bankName: 'Standard Chartered', quoteGBP: 5.22, availableLimit: 15000000,
    grossPayable: 10000000, grossReceivable: 4000000, tier: 'Tier 1', lastUpdated: '00:02 ago'
  },
  {
    id: 'LP-003', bankName: 'HSBC London', quoteGBP: 5.28, availableLimit: 120000000,
    grossPayable: 40000000, grossReceivable: 45000000, tier: 'Tier 1', lastUpdated: '00:10 ago'
  },
  {
    id: 'LP-004', bankName: 'Lloyds Commercial', quoteGBP: 5.35, availableLimit: 5000000,
    grossPayable: 2000000, grossReceivable: 500000, tier: 'Tier 2', lastUpdated: '01:00 ago'
  }
];

export const MOCK_RISK_METRICS: SwapRiskMetrics = {
  delta: 0.45, // Sensitivity to GBP spot
  gamma: 0.02,
  theta: -1200, // Time decay cost per day in INR
  vega: 0.15,
  rho: 0.08,
  var99: 4500000, // INR 45 Lakhs VaR
  stressTestResult: 'Pass'
};

export const MOCK_REGULATORY_LOGS: RegulatoryLog[] = [
  {
    id: 'REG-991',
    authority: 'RBI (India)',
    type: 'FEMA Declaration',
    referenceId: 'EDPMS-2024-8821',
    status: 'Acknowledged',
    timestamp: '10:05 AM',
    details: 'Purpose Code P0103 (Advance Payment) Linked to IRN'
  },
  {
    id: 'REG-992',
    authority: 'FCA (UK)',
    type: 'MIFID II',
    referenceId: 'LEI-8821-X99',
    status: 'Acknowledged',
    timestamp: '10:06 AM',
    details: 'Swap Reporting: Underlying Trade Finance Hedge'
  },
  {
    id: 'REG-993',
    authority: 'RBI (India)',
    type: 'Purpose Code P0103',
    referenceId: 'INV-2024-004',
    status: 'Pending',
    timestamp: '11:30 AM',
    details: 'Settlement Batch waiting final pacs.008 trigger'
  }
];

export const MOCK_SWAP_HISTORY = [
    { day: '1', basis: 158, pnl: 12000, var: 42000 },
    { day: '2', basis: 160, pnl: 15000, var: 43000 },
    { day: '3', basis: 162, pnl: 18000, var: 45000 },
    { day: '4', basis: 159, pnl: 11000, var: 41000 },
    { day: '5', basis: 161, pnl: 14000, var: 42500 },
    { day: '6', basis: 165, pnl: 22000, var: 48000 },
    { day: '7', basis: 160, pnl: 13500, var: 43000 },
    { day: '8', basis: 155, pnl: 8000, var: 40000 },
    { day: '9', basis: 158, pnl: 12500, var: 42000 },
    { day: '10', basis: 163, pnl: 19000, var: 46000 },
    { day: '11', basis: 167, pnl: 25000, var: 50000 },
    { day: '12', basis: 164, pnl: 21000, var: 47000 },
];