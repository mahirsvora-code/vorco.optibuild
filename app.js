const form = document.getElementById("projectForm");
const unitButtons = document.querySelectorAll(".unit-btn");
const summary = document.getElementById("summary");
const splitBar = document.getElementById("splitBar");
const waterfallPanel = document.getElementById("waterfallPanel");
const scenarioCards = document.getElementById("scenarioCards");
const phasePanel = document.getElementById("phasePanel");
const riskPanel = document.getElementById("riskPanel");
const boqBody = document.getElementById("boqBody");
const grandTotal = document.getElementById("grandTotal");
const plotUnit = document.getElementById("plotUnit");
const buaUnit = document.getElementById("buaUnit");
const salePriceValue = document.getElementById("salePriceValue");
const liveClock = document.getElementById("liveClock");

const reportBtn = document.getElementById("reportBtn");
const auditBtn = document.getElementById("auditBtn");
const salePriceInput = document.getElementById("salePrice");
const smartToggle = document.getElementById("smartToggle");
const smartTools = document.getElementById("smartTools");
const presetButtons = document.querySelectorAll(".preset-btn");
const quickSaleFactor = document.getElementById("quickSaleFactor");
const quickSoldAdj = document.getElementById("quickSoldAdj");
const quickEscalationAdj = document.getElementById("quickEscalationAdj");
const quickSaleFactorValue = document.getElementById("quickSaleFactorValue");
const quickSoldAdjValue = document.getElementById("quickSoldAdjValue");
const quickEscalationAdjValue = document.getElementById("quickEscalationAdjValue");
const timelineToggle = document.getElementById("timelineToggle");
const timelineTools = document.getElementById("timelineTools");
const cashflowPanel = document.getElementById("cashflowPanel");
const heatmapToggle = document.getElementById("heatmapToggle");
const heatmapPanel = document.getElementById("heatmapPanel");
const pricingPanel = document.getElementById("pricingPanel");
const mixPanel = document.getElementById("mixPanel");
const visualInsightsPanel = document.getElementById("visualInsightsPanel");
const trendPanel = document.getElementById("trendPanel");
const riskScorePanel = document.getElementById("riskScorePanel");
const comparePanel = document.getElementById("comparePanel");
const loanSchedulePanel = document.getElementById("loanSchedulePanel");
const mixPlannerToggle = document.getElementById("mixPlannerToggle");
const mixPlannerTools = document.getElementById("mixPlannerTools");
const saveCompareLeftBtn = document.getElementById("saveCompareLeftBtn");
const saveCompareRightBtn = document.getElementById("saveCompareRightBtn");
const clearCompareBtn = document.getElementById("clearCompareBtn");
const stressBtn = document.getElementById("stressBtn");
const saveScenarioBtn = document.getElementById("saveScenarioBtn");
const icMemoBtn = document.getElementById("icMemoBtn");
const savedScenarioSelect = document.getElementById("savedScenarioSelect");
const applySavedScenarioBtn = document.getElementById("applySavedScenarioBtn");
const renameSavedScenarioBtn = document.getElementById("renameSavedScenarioBtn");
const guardrailPanel = document.getElementById("guardrailPanel");
const stressPanel = document.getElementById("stressPanel");
const validationPanel = document.getElementById("validationPanel");
const tracePanel = document.getElementById("tracePanel");
const bankabilityPanel = document.getElementById("bankabilityPanel");
const workingCapitalPanel = document.getElementById("workingCapitalPanel");
const delayImpactPanel = document.getElementById("delayImpactPanel");
const taxFeePanel = document.getElementById("taxFeePanel");
const icMemoPanel = document.getElementById("icMemoPanel");
const loanViewMode = document.getElementById("loanViewMode");
const marketPreset = document.getElementById("marketPreset");

let activeUnit = "sqft";
let currentResult = null;
let currentInputData = null;
let compareLeft = null;
let compareRight = null;
let showDetailedLoan = false;
let lastStressResult = null;
const scenarioStorageKey = "optibuildScenarioLibraryV1";
const LOADING_RISK_THRESHOLD_PCT = 45;

const sqFtFactor = {
  sqft: 1,
  sqm: 10.7639,
  sqyd: 9,
};

const tierRates = {
  default: { optimistic: 2200, base: 2450, stressed: 2700 },
};

const marketPresetAssumptions = {
  economy: {
    rateOptimistic: 1900,
    rateBase: 2050,
    rateStressed: 2200,
    legalCost: 1200000,
    interestPct: 11.5,
    soldPct: 78,
    salesMonths: 24,
    steelEscalationOptimisticPct: 1,
    steelEscalationBasePct: 3,
    steelEscalationStressedPct: 8,
    laborEscalationOptimisticPct: 2,
    laborEscalationBasePct: 4,
    laborEscalationStressedPct: 9,
  },
  mid: {
    rateOptimistic: 2200,
    rateBase: 2450,
    rateStressed: 2700,
    legalCost: 1800000,
    interestPct: 10.75,
    soldPct: 82,
    salesMonths: 20,
    steelEscalationOptimisticPct: 1,
    steelEscalationBasePct: 3,
    steelEscalationStressedPct: 8,
    laborEscalationOptimisticPct: 2,
    laborEscalationBasePct: 4,
    laborEscalationStressedPct: 9,
  },
  premium: {
    rateOptimistic: 2700,
    rateBase: 3050,
    rateStressed: 3400,
    legalCost: 2500000,
    interestPct: 10.25,
    soldPct: 75,
    salesMonths: 30,
    steelEscalationOptimisticPct: 1.5,
    steelEscalationBasePct: 4,
    steelEscalationStressedPct: 10,
    laborEscalationOptimisticPct: 2.5,
    laborEscalationBasePct: 5,
    laborEscalationStressedPct: 11,
  },
};

const bhkMixWeights = {
  1: { area: 0.82, price: 0.94 },
  2: { area: 1, price: 1 },
  3: { area: 1.22, price: 1.1 },
  4: { area: 1.48, price: 1.24 },
  5: { area: 1.8, price: 1.4 },
};

const boqTemplate = [
  ["Site Preparation", "Site clearance, setting-out, excavation", "cum", 0.042, 0.04],
  ["Foundation", "PCC + footings + plinth beams", "cum", 0.08, 0.1],
  ["Structure", "RCC frame (columns, beams, slabs)", "sqft", 1, 0.24],
  ["Structure", "TMT steel reinforcement", "kg", 4.2, 0.11],
  ["Masonry", "Brick / AAC block walls", "sqft", 0.93, 0.09],
  ["Openings", "Doors, windows, glazing", "sqft", 0.12, 0.08],
  ["Flooring", "Tile / stone flooring and skirting", "sqft", 0.82, 0.1],
  ["Finishes", "Plaster, putty, paint systems", "sqft", 1.95, 0.11],
  ["Waterproofing", "Terrace + wet-area waterproofing", "sqft", 0.24, 0.03],
  ["MEP", "Electrical + plumbing + fire services", "sqft", 1, 0.09],
  ["External Works", "Drainage, paving, site development", "sqft", 0.16, 0.02],
  ["Miscellaneous", "Preliminaries and contingency", "ls", 1, 0],
];

function formatINR(value, digits = 0) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(Math.max(0, Number(value || 0)));
}

function formatSignedINR(value) {
  const num = Number(value || 0);
  const sign = num < 0 ? "-" : "+";
  return `${sign}Rs ${formatINR(Math.abs(num))}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function pickInputValue(source, keys, fallback = "") {
  const data = source && typeof source === "object" ? source : {};
  for (const key of keys) {
    const value = data[key];
    if (value == null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return fallback;
}

function formatAuditKey(key) {
  const labelMap = {
    projectName: "Project Name",
    city: "Location / City",
    developerName: "Developer / Client",
    plotArea: "Plot Area",
    bua: "Built-up Area (BUA)",
    floors: "Residential Floors",
    basements: "Basements",
    flatsPerFloor: "Flats / Floor",
    parkingSlots: "Parking Slots",
    bhkType: "BHK Type",
    loadingPct: "SBA Loading %",
    carpetRatio: "Carpet Ratio %",
    marketPreset: "Market Preset",
    sensitivityCase: "Sensitivity Case",
    rateBase: "Rate Base (Rs / sq ft)",
    rateOptimistic: "Rate Optimistic (Rs / sq ft)",
    rateStressed: "Rate Stressed (Rs / sq ft)",
    customRate: "Custom Rate (Rs / sq ft)",
    escalationPct: "Escalation %",
    landRate: "Land Rate (Rs / sq ft)",
    landCost: "Land Cost Override (Rs)",
    stampPct: "Stamp + Registration %",
    legalCost: "Legal / Approval Cost (Rs)",
    architectPct: "Architect Fee %",
    salePrice: "Sale Price (Rs / sq ft)",
    soldPct: "Inventory Sold %",
    gstPct: "GST %",
    brokerPct: "Broker %",
    loanPct: "Loan %",
    interestPct: "Interest %",
    durationMonths: "Loan Duration (months)",
    delayMonths: "Planning / Launch Delay (months)",
    salesMonths: "Sales Realization Window (months)",
    salesStartOffset: "Sales Start Offset (months)",
    approvalDelayMonths: "Approval Delay (months)",
    executionDelayMonths: "Execution Delay (months)",
    salesDelayMonths: "Sales Delay (months)",
    moratoriumMonths: "EMI Moratorium (months)",
    prepaymentPct: "Prepayment from Sales %",
    loanViewMode: "Loan View",
    salesCurve: "Sales Absorption Curve",
    costCurve: "Construction Drawdown Curve",
    viewPremiumPct: "View Premium %",
    steelEscalationBasePct: "Steel Escalation Base %",
    steelEscalationOptimisticPct: "Steel Escalation Optimistic %",
    steelEscalationStressedPct: "Steel Escalation Stressed %",
    cementEscalationPct: "Cement Escalation %",
    laborEscalationBasePct: "Labor Escalation Base %",
    laborEscalationOptimisticPct: "Labor Escalation Optimistic %",
    laborEscalationStressedPct: "Labor Escalation Stressed %",
    mepEscalationPct: "MEP Escalation %",
    mix1Pct: "Mix 1 BHK %",
    mix2Pct: "Mix 2 BHK %",
    mix3Pct: "Mix 3 BHK %",
    mix4Pct: "Mix 4 BHK %",
    mix5Pct: "Mix 5 BHK %",
    advancedTimeline: "Delay Simulation",
  };

  return labelMap[key] || key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (char) => char.toUpperCase());
}

function auditValueText(value) {
  if (value === "on") return "Enabled";
  return String(value ?? "");
}

function formatAhmedabadTime(date = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

function updateLiveClock() {
  if (!liveClock) return;
  liveClock.textContent = `Ahmedabad IST ${formatAhmedabadTime()}`;
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function convertToSqFt(value) {
  return Number(value || 0) * sqFtFactor[activeUnit];
}

function getLiftCount(floors, flatsPerFloor) {
  if (floors <= 6) return 1;
  if (floors <= 12) return flatsPerFloor > 8 ? 3 : 2;
  return flatsPerFloor > 8 ? 4 : 3;
}

function pickRate(data, sensitivityCase = "base") {
  const customRate = toNumber(data.customRate, 0);
  if (customRate > 0) return customRate;

  const optimistic = toNumber(data.rateOptimistic, tierRates.default.optimistic);
  const base = toNumber(data.rateBase, tierRates.default.base);
  const stressed = toNumber(data.rateStressed, tierRates.default.stressed);

  if (sensitivityCase === "optimistic") return optimistic;
  if (sensitivityCase === "stressed") return stressed;
  return base;
}

function pickCaseValue(data, sensitivityCase, baseName, optimisticName, stressedName, fallback = 0, legacyName = "") {
  const baseValue = toNumber(data[baseName], fallback);
  const optimisticValue = toNumber(data[optimisticName], baseValue);
  const stressedValue = toNumber(data[stressedName], baseValue);

  if (sensitivityCase === "optimistic") {
    return optimisticValue;
  }
  if (sensitivityCase === "stressed") {
    return stressedValue;
  }

  const picked = baseValue;
  if (picked > 0) return picked;
  if (legacyName) return toNumber(data[legacyName], fallback);
  return fallback;
}

function cloneResultSnapshot(result) {
  return JSON.parse(JSON.stringify(result));
}

function calculateRiskScore(result) {
  let score = 50;

  score += Math.max(-15, Math.min(20, result.roi * 1.05));
  score += Math.max(-10, Math.min(12, result.margin * 0.6));

  if (result.parkingSlots >= result.units * 1.25) score += 8;
  else score -= 15;

  if (result.flatsPerFloor <= 6) score += 5;
  else if (result.flatsPerFloor > 10) score -= 12;
  else score -= 4;

  if (result.loanPct > 70) score -= 8;
  else if (result.loanPct > 50) score -= 3;

  if (result.mixEnabled && result.mixRevenueDelta > 0) score += 4;
  if (result.totalCost > 0 && result.netRevenue > result.totalCost) score += 6;

  // Guardrail breaches should visibly reduce the final score.
  const guardrailPenalty = getGuardrailWarnings(result).length * 8;
  score -= guardrailPenalty;

  score = Math.max(0, Math.min(100, Math.round(score)));
  const label = score >= 70 ? "Safe" : score >= 45 ? "Borderline" : "Weak";
  const tone = score >= 70 ? "safe" : score >= 45 ? "borderline" : "weak";

  return { score, label, tone };
}

function buildUnitMixPlan(result, data) {
  const enabled = Boolean(mixPlannerToggle?.checked);
  const unitTypes = [1, 2, 3, 4, 5];
  const shares = unitTypes.map((type) => Math.max(0, toNumber(data[`mix${type}Pct`], 0)));
  const totalUnits = Math.max(0, result.units);

  if (!enabled || totalUnits === 0) {
    return {
      enabled,
      totalUnits,
      rows: [],
      mixGrossRevenue: result.sbaArea * result.salePrice,
      mixRevenueDelta: 0,
      mixRevenueImpactPct: 0,
    };
  }

  const shareTotal = shares.reduce((sum, share) => sum + share, 0) || unitTypes.length;
  const normalizedShares = shares.every((share) => share === 0)
    ? unitTypes.map(() => 1 / unitTypes.length)
    : shares.map((share) => share / shareTotal);

  const rawUnits = normalizedShares.map((share) => totalUnits * share);
  const unitsAllocated = rawUnits.map((value) => Math.floor(value));
  let remaining = totalUnits - unitsAllocated.reduce((sum, value) => sum + value, 0);
  const remainders = rawUnits.map((value, index) => ({ index, remainder: value - Math.floor(value) }));
  remainders.sort((left, right) => right.remainder - left.remainder);
  for (let idx = 0; idx < remainders.length && remaining > 0; idx += 1) {
    unitsAllocated[remainders[idx].index] += 1;
    remaining -= 1;
  }

  const areaWeights = unitTypes.map((type, index) => unitsAllocated[index] * bhkMixWeights[type].area);
  const totalAreaWeight = areaWeights.reduce((sum, weight) => sum + weight, 0) || 1;

  const rows = unitTypes.map((type, index) => {
    const units = unitsAllocated[index];
    const sharePct = totalUnits > 0 ? (units / totalUnits) * 100 : 0;
    const allocatedArea = result.sbaArea * (areaWeights[index] / totalAreaWeight);
    const priceMultiplier = bhkMixWeights[type].price;
    const grossRevenue = allocatedArea * result.salePrice * priceMultiplier;
    const realizedRevenue = grossRevenue * (result.soldPct / 100);

    return {
      type,
      units,
      sharePct,
      allocatedArea,
      priceMultiplier,
      grossRevenue,
      realizedRevenue,
    };
  });

  const mixGrossRevenue = rows.reduce((sum, row) => sum + row.grossRevenue, 0);
  const baseGrossRevenue = result.sbaArea * result.salePrice;
  const mixRevenueDelta = mixGrossRevenue - baseGrossRevenue;
  const mixRevenueImpactPct = baseGrossRevenue > 0 ? (mixRevenueDelta / baseGrossRevenue) * 100 : 0;

  return {
    enabled,
    totalUnits,
    rows,
    mixGrossRevenue,
    mixRevenueDelta,
    mixRevenueImpactPct,
  };
}

function buildLoanSchedule(result) {
  const principal = Math.max(0, result.financedPrincipal || 0);
  const months = Math.max(0, toNumber(result.durationMonths, 0));
  const monthlyRate = Math.max(0, toNumber(result.interestPct, 0)) / 100 / 12;
  const salesMonths = Math.max(1, toNumber(result.salesMonths, 1));
  const delayMonths = Math.max(0, toNumber(result.totalDelayMonths, result.delayMonths || 0));
  const moratoriumMonths = Math.max(0, toNumber(result.moratoriumMonths, 0));
  const prepaymentPct = Math.max(0, Math.min(100, toNumber(result.prepaymentPct, 0))) / 100;
  const salesStart = delayMonths + Math.ceil(Math.max(1, months) / 2) + Math.max(0, toNumber(result.salesStartOffset, 0));
  const horizon = Math.max(delayMonths + Math.max(months, 1) + salesMonths + 2, 24);

  if (principal <= 0 || months <= 0) {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      totalPrincipal: 0,
      rows: [],
      horizon,
      salesStart,
    };
  }

  const monthlyPayment = monthlyRate === 0
    ? principal / months
    : principal * (monthlyRate / (1 - (1 + monthlyRate) ** (-months)));

  const durationForCurve = Math.max(toNumber(result.durationMonths, 1), 1);
  const monthlySalesBase = result.netRevenue / salesMonths;
  const salesCurve = result.salesCurve || "flat";
  const costCurve = result.costCurve || "flat";
  const phaseTimeline = buildPhaseTimeline(result);
  const monthlyProjectOutflow = phaseTimeline.progress.map((row) => row.spent);

  let openingBalance = principal;
  let totalInterest = 0;
  let totalPrincipal = 0;
  let cumulativeCashflow = 0;
  let breakevenMonth = null;
  let lastActiveMonth = 0;
  const rows = [];

  const curveMultiplier = (mode, idx, totalCount) => {
    if (mode !== "realistic") return 1;
    if (totalCount <= 1) return 1;
    const p = idx / (totalCount - 1);
    if (p < 0.2) return 0.65;
    if (p < 0.45) return 0.9;
    if (p < 0.75) return 1.35;
    return 0.85;
  };

  const salesCurveMultiplier = (idx) => curveMultiplier(salesCurve, idx, salesMonths);
  const costCurveMultiplier = (idx) => {
    if (costCurve !== "realistic") return 1;
    if (durationForCurve <= 1) return 1;
    const p = idx / (durationForCurve - 1);
    if (p < 0.2) return 0.7;
    if (p < 0.5) return 1.15;
    if (p < 0.8) return 1.35;
    return 0.75;
  };

  for (let month = 1; month <= horizon; month += 1) {
    const inLoanWindow = month <= months + moratoriumMonths;
    const isMoratorium = month <= moratoriumMonths;
    const interest = inLoanWindow ? openingBalance * monthlyRate : 0;
    const regularPayment = inLoanWindow && !isMoratorium ? monthlyPayment : 0;
    const principalFromEmi = inLoanWindow && !isMoratorium
      ? Math.min(Math.max(0, regularPayment - interest), openingBalance)
      : 0;

    const constructionMonthIndex = month - delayMonths - 1;
    const scheduledProjectOutflow = month - 1 < monthlyProjectOutflow.length ? monthlyProjectOutflow[month - 1] : 0;
    const constructionOutflow = scheduledProjectOutflow > 0
      ? scheduledProjectOutflow
      : constructionMonthIndex >= 0 && constructionMonthIndex < durationForCurve
        ? (result.totalCost / durationForCurve) * costCurveMultiplier(constructionMonthIndex)
        : 0;

    const salesMonthIndex = month - salesStart;
    const salesInflow = salesMonthIndex >= 0 && salesMonthIndex < salesMonths
      ? monthlySalesBase * salesCurveMultiplier(salesMonthIndex)
      : 0;

    const prepayment = openingBalance > 0 ? Math.min(openingBalance - principalFromEmi, salesInflow * prepaymentPct) : 0;
    const principalPaid = principalFromEmi + Math.max(0, prepayment);
    const loanPayment = regularPayment + prepayment;
    const closingBalance = Math.max(0, openingBalance - principalPaid);
    const netCashflow = salesInflow - constructionOutflow - loanPayment;

    cumulativeCashflow += netCashflow;
    totalInterest += interest;
    totalPrincipal += principalPaid;
    if (breakevenMonth === null && cumulativeCashflow >= 0) breakevenMonth = month;
    if (loanPayment > 0 || constructionOutflow > 0 || salesInflow > 0) lastActiveMonth = month;

    rows.push({
      month,
      openingBalance,
      interest,
      principalPaid,
      loanPayment,
      closingBalance,
      constructionOutflow,
      salesInflow,
      prepayment,
      netCashflow,
      cumulativeCashflow,
    });

    openingBalance = closingBalance;
  }

  return {
    monthlyPayment,
    totalInterest,
    totalPrincipal,
    rows,
    horizon,
    salesStart,
    breakevenMonth,
    lastActiveMonth,
  };
}

function makeBoqLines(buaSqFt, constructionCost, effectiveRate) {
  const lines = boqTemplate.map(([category, item, unit, factor, pct]) => {
    const qty = unit === "ls" ? 1 : buaSqFt * factor;
    let amount = pct === 0 ? constructionCost * 0.03 : constructionCost * pct;
    let rate = unit === "ls" ? amount : amount / Math.max(qty, 1);

    if (unit === "kg") {
      rate = Math.max(rate, 72);
      amount = rate * qty;
    }
    if (unit === "cum") {
      rate = Math.max(rate, 5600);
      amount = rate * qty;
    }

    if (unit === "sqft" && category === "Structure") {
      rate = Math.max(rate, effectiveRate * 0.24);
      amount = rate * qty;
    }

    return { category, item, unit, qty, rate, amount };
  });

  const totalLine = lines.reduce((sum, line) => sum + line.amount, 0);
  const scale = constructionCost / Math.max(totalLine, 1);
  lines.forEach((line) => {
    line.amount *= scale;
    line.rate = line.unit === "ls" ? line.amount : line.amount / Math.max(line.qty, 1);
  });
  return lines;
}

function recomputeFinancials(result) {
  const grossRevenueBase = result.sbaArea * result.salePrice;
  const totalGrossRevenue = result.mixEnabled && result.mixGrossRevenue > 0 ? result.mixGrossRevenue : grossRevenueBase;
  const soldSbaArea = result.sbaArea * (result.soldPct / 100);
  const realizedGrossRevenue = totalGrossRevenue * (result.soldPct / 100);
  const gstAmount = realizedGrossRevenue * (result.gstPct / 100);
  const brokerAmount = realizedGrossRevenue * (result.brokerPct / 100);
  const netRevenue = realizedGrossRevenue - gstAmount - brokerAmount;

  result.baseGrossRevenue = grossRevenueBase;
  result.totalGrossRevenue = totalGrossRevenue;
  result.soldSbaArea = soldSbaArea;
  result.realizedGrossRevenue = realizedGrossRevenue;
  result.grossRevenue = totalGrossRevenue;
  result.gstAmount = gstAmount;
  result.brokerAmount = brokerAmount;
  result.netRevenue = netRevenue;
  result.mixRevenueDelta = totalGrossRevenue - grossRevenueBase;
  result.mixRevenueImpactPct = grossRevenueBase > 0 ? (result.mixRevenueDelta / grossRevenueBase) * 100 : 0;

  const baseProjectCost = result.landCost + result.stampCost + result.legalCost + result.constructionCost;
  const architectPct = Math.min(15, Math.max(0, toNumber(result.architectPct, 0)));
  const architectCost = architectPct > 0 ? (baseProjectCost * architectPct) / Math.max(100 - architectPct, 1) : 0;
  const projectBeforeFinance = baseProjectCost + architectCost;
  const financedPrincipal = projectBeforeFinance * (result.loanPct / 100);

  // Keep a temporary zero finance state so loan-schedule math can run consistently.
  result.architectPct = architectPct;
  result.architectCost = architectCost;
  result.projectBeforeFinance = projectBeforeFinance;
  result.financedPrincipal = financedPrincipal;
  result.interestCost = 0;
  result.effectiveDelayMonths = Math.max(0, toNumber(result.totalDelayMonths, result.delayMonths || 0));
  result.delayInterestCost = 0;
  result.totalCost = projectBeforeFinance;

  const loanSchedule = buildLoanSchedule(result);
  const interestCost = loanSchedule.totalInterest;
  const monthlyRate = Math.max(0, toNumber(result.interestPct, 0)) / 100 / 12;
  const hasDelayDebtBasis = financedPrincipal > 0 && monthlyRate > 0 && result.effectiveDelayMonths > 0;
  const delayInterestCost = hasDelayDebtBasis ? financedPrincipal * monthlyRate * result.effectiveDelayMonths : 0;

  result.interestCost = interestCost;
  result.delayInterestCost = delayInterestCost;
  result.totalCost = projectBeforeFinance + interestCost + delayInterestCost;
  result.profit = netRevenue - result.totalCost;
  result.roi = result.totalCost > 0 ? (result.profit / result.totalCost) * 100 : 0;
  result.margin = netRevenue > 0 ? (result.profit / netRevenue) * 100 : 0;

  const netFactor = result.sbaArea * (1 - result.gstPct / 100 - result.brokerPct / 100);
  const targetRoiPct = 20;
  result.targetRoiPct = targetRoiPct;
  result.breakEvenSalePrice = netFactor > 0 ? result.totalCost / netFactor : 0;
  result.targetSalePrice = netFactor > 0 ? (result.totalCost * (1 + targetRoiPct / 100)) / netFactor : 0;
}

function renderPricing(result) {
  if (!pricingPanel) return;

  const netRealizationFactor = 1 - result.gstPct / 100 - result.brokerPct / 100;
  const hasValidSbaPricingBasis = result.sbaArea > 0 && netRealizationFactor > 0 && result.totalCost > 0;
  const minSaleDisplay = hasValidSbaPricingBasis
    ? `Rs ${formatINR(result.breakEvenSalePrice)} / sq ft`
    : "N/A";
  const minSaleNote = hasValidSbaPricingBasis
    ? "Break-even price based on total project cost and full sellable SBA."
    : "Enter valid BUA/loading and revenue deductions (GST + broker under 100%) to compute break-even price.";

  pricingPanel.innerHTML = `
    <div class="pricing-grid">
      <article class="pricing-card">
        <p class="pricing-label">Minimum Sale Price</p>
        <p class="pricing-value">${minSaleDisplay}</p>
        <p class="pricing-note">${minSaleNote}</p>
      </article>
    </div>
  `;
}

function buildStressCase(base) {
  const stressed = cloneResultSnapshot(base);
  stressed.salePrice = Math.max(0, base.salePrice * 0.9);
  stressed.soldPct = Math.max(0, Math.min(100, base.soldPct - 10));
  stressed.constructionCost = Math.max(0, base.constructionCost * 1.12);
  stressed.totalDelayMonths = Math.max(0, (base.totalDelayMonths || 0) + 3);
  stressed.salesMonths = Math.max(1, (base.salesMonths || 1) + 3);
  recomputeFinancials(stressed);
  return stressed;
}

function renderStressPanel(base, stressed) {
  if (!stressPanel) return;
  if (!stressed) {
    stressPanel.classList.add("hidden");
    stressPanel.innerHTML = "";
    return;
  }

  stressPanel.classList.remove("hidden");
  const roiDelta = stressed.roi - base.roi;
  const profitDelta = stressed.profit - base.profit;
  stressPanel.innerHTML = `
    <div class="compare-head">
      <div>
        <h3>Stress Test (Worst-Case)</h3>
        <p>Sale price down 10%, sold % down 10 points, construction up 12%, delay +3 months.</p>
      </div>
    </div>
    <div class="compare-grid">
      <article class="compare-card">
        <h4>Base Case</h4>
        <div class="compare-value"><span>ROI</span><strong>${base.roi.toFixed(1)}%</strong></div>
        <div class="compare-value"><span>Profit</span><strong>${formatSignedINR(base.profit)}</strong></div>
      </article>
      <article class="compare-card">
        <h4>Stress Case</h4>
        <div class="compare-value"><span>ROI</span><strong>${stressed.roi.toFixed(1)}%</strong></div>
        <div class="compare-value"><span>Profit</span><strong>${formatSignedINR(stressed.profit)}</strong></div>
        <div class="compare-value"><span>ROI Impact</span><strong>${roiDelta.toFixed(1)} pts</strong></div>
        <div class="compare-value"><span>Profit Impact</span><strong>${formatSignedINR(profitDelta)}</strong></div>
      </article>
    </div>
  `;
}

function calculateBankability(result) {
  const schedule = buildLoanSchedule(result);
  const hasDebt = schedule.monthlyPayment > 0 && result.loanPct > 0 && result.financedPrincipal > 0;
  const annualDebtService = hasDebt ? Math.max(1, schedule.monthlyPayment * 12) : 0;
  const salesWindowMonths = result.timelineEnabled
    ? Math.max(1, toNumber(result.salesMonths, 1))
    : Math.max(1, toNumber(result.durationMonths, 12));
  const annualizedNetRevenue = result.netRevenue * (12 / salesWindowMonths);
  const dscr = hasDebt ? annualizedNetRevenue / annualDebtService : 0;
  const icr = hasDebt && result.interestCost > 0 ? (result.profit + result.interestCost) / result.interestCost : 0;
  const paybackMonths = result.timelineEnabled ? (buildCashflow(result)?.breakevenMonth || 0) : 0;
  const hasSalePriceBasis = result.salePrice > 0 && Number.isFinite(result.breakEvenSalePrice) && result.breakEvenSalePrice > 0;
  const safetyBufferPct = hasSalePriceBasis ? ((result.salePrice - result.breakEvenSalePrice) / result.salePrice) * 100 : 0;
  return { dscr, icr, paybackMonths, safetyBufferPct, hasDebt, hasSalePriceBasis };
}

function renderBankability(result) {
  if (!bankabilityPanel) return;
  const m = calculateBankability(result);
  const dscrText = m.hasDebt ? m.dscr.toFixed(2) : "N/A";
  const icrText = m.hasDebt ? m.icr.toFixed(2) : "N/A";
  const safetyBufferText = m.hasSalePriceBasis ? `${m.safetyBufferPct.toFixed(1)}%` : "N/A";
  bankabilityPanel.classList.remove("hidden");
  bankabilityPanel.innerHTML = `
    <div class="compare-head"><div><h3>Bankability Scorecard</h3></div></div>
    <div class="compare-grid">
      <article class="compare-card">
        <div class="compare-value"><span>DSCR</span><strong>${dscrText}</strong></div>
        <div class="compare-value"><span>Interest Coverage</span><strong>${icrText}</strong></div>
      </article>
      <article class="compare-card">
        <div class="compare-value"><span>Payback Month</span><strong>${m.paybackMonths ? `M${m.paybackMonths}` : "N/A"}</strong></div>
        <div class="compare-value"><span>Margin Safety Buffer</span><strong>${safetyBufferText}</strong></div>
      </article>
    </div>
  `;
}

function renderTaxFeePanel(result) {
  if (!taxFeePanel) return;
  const hasRevenueBasis = result.realizedGrossRevenue > 0 && result.salePrice > 0 && result.sbaArea > 0 && result.soldPct > 0;
  const hasStampBasis = result.stampCost > 0;
  const moneyOrNA = (value, show) => (show ? `Rs ${formatINR(value)}` : "N/A");
  taxFeePanel.classList.remove("hidden");
  taxFeePanel.innerHTML = `
    <div class="compare-head"><div><h3>Tax + Fees Breakdown</h3></div></div>
    <article class="compare-card">
      <div class="compare-value"><span>GST</span><strong>${moneyOrNA(result.gstAmount, hasRevenueBasis)}</strong></div>
      <div class="compare-value"><span>Brokerage</span><strong>${moneyOrNA(result.brokerAmount, hasRevenueBasis)}</strong></div>
      <div class="compare-value"><span>Registration/Stamp</span><strong>${moneyOrNA(result.stampCost, hasStampBasis)}</strong></div>
      <div class="compare-value"><span>Net Realization</span><strong>${moneyOrNA(result.netRevenue, hasRevenueBasis)}</strong></div>
    </article>
  `;
}

function renderDelayImpact(result) {
  if (!delayImpactPanel) return;
  const effectiveDelayMonths = Math.max(0, toNumber(result.effectiveDelayMonths, result.totalDelayMonths || 0));
  const hasDelayBasis = effectiveDelayMonths > 0 && result.delayInterestCost > 0;
  const monthlyDelayCarry = hasDelayBasis ? result.delayInterestCost / effectiveDelayMonths : 0;
  const planningImpact = hasDelayBasis ? Math.max(0, toNumber(result.delayMonths, 0)) * monthlyDelayCarry : 0;
  const approvalImpact = hasDelayBasis ? result.approvalDelayMonths * monthlyDelayCarry : 0;
  const executionImpact = hasDelayBasis ? result.executionDelayMonths * monthlyDelayCarry : 0;
  const salesImpact = hasDelayBasis ? result.salesDelayMonths * monthlyDelayCarry * 0.5 : 0;
  const totalClassified = hasDelayBasis ? planningImpact + approvalImpact + executionImpact + salesImpact : 0;
  const renderMoneyOrNA = (value) => (hasDelayBasis ? `Rs ${formatINR(value)}` : "N/A");
  delayImpactPanel.classList.remove("hidden");
  delayImpactPanel.innerHTML = `
    <div class="compare-head"><div><h3>Approval/Delay Risk Impact</h3></div></div>
    <article class="compare-card">
      <div class="compare-value"><span>Planning Delay Cost</span><strong>${renderMoneyOrNA(planningImpact)}</strong></div>
      <div class="compare-value"><span>Approval Delay Cost</span><strong>${renderMoneyOrNA(approvalImpact)}</strong></div>
      <div class="compare-value"><span>Execution Delay Cost</span><strong>${renderMoneyOrNA(executionImpact)}</strong></div>
      <div class="compare-value"><span>Sales Delay Effect</span><strong>${renderMoneyOrNA(salesImpact)}</strong></div>
      <div class="compare-value"><span>Total Classified Delay</span><strong>${renderMoneyOrNA(totalClassified)}</strong></div>
      <div class="compare-value"><span>Total Delay Carry (Debt)</span><strong>${renderMoneyOrNA(result.delayInterestCost)}</strong></div>
    </article>
  `;
}

function renderWorkingCapital(result) {
  if (!workingCapitalPanel) return;
  const cashflow = buildCashflow(result);
  if (!cashflow) {
    workingCapitalPanel.classList.add("hidden");
    workingCapitalPanel.innerHTML = "";
    return;
  }
  workingCapitalPanel.classList.remove("hidden");
  workingCapitalPanel.innerHTML = `
    <div class="compare-head"><div><h3>Working Capital Gap Alert</h3></div></div>
    <article class="compare-card">
      <div class="compare-value"><span>Peak Funding Gap</span><strong>Rs ${formatINR(cashflow.peakFundingGap)}</strong></div>
      <div class="compare-value"><span>Gap Month</span><strong>${cashflow.peakGapMonth ? `M${cashflow.peakGapMonth}` : "N/A"}</strong></div>
      <div class="compare-value"><span>Suggested Buffer</span><strong>Rs ${formatINR(cashflow.peakFundingGap * 1.1)}</strong></div>
    </article>
  `;
}

function buildSparkline(values, width = 320, height = 110, padding = 10) {
  const nums = values.map((value) => Number(value)).filter((value) => Number.isFinite(value));
  if (nums.length < 2) return null;

  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const span = Math.max(1e-6, max - min);
  const xStep = (width - padding * 2) / Math.max(1, nums.length - 1);

  const pointAt = (value, idx) => {
    const x = padding + idx * xStep;
    const y = padding + (height - padding * 2) * (1 - (value - min) / span);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  };

  const points = nums.map(pointAt).join(" ");
  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return {
    points,
    areaPoints,
    min,
    max,
    first: nums[0],
    last: nums[nums.length - 1],
  };
}

function renderVisualInsights(result) {
  if (!visualInsightsPanel) return;

  const hasCostBasis = result.totalCost > 0;
  const hasRevenueBasis = result.netRevenue > 0;
  const total = Math.max(1, result.totalCost);
  const landShare = ((result.landCost + result.stampCost + result.legalCost) / total) * 100;
  const constructionShare = (result.constructionCost / total) * 100;
  const financeShare = Math.max(0, 100 - landShare - constructionShare);

  const conservative = scenarioResult(result, 0.9);
  const base = scenarioResult(result, 1);
  const optimistic = scenarioResult(result, 1.1);
  const scenarioSet = [
    { name: "Conservative", profit: conservative.profit, roi: conservative.roi },
    { name: "Base", profit: base.profit, roi: base.roi },
    { name: "Optimistic", profit: optimistic.profit, roi: optimistic.roi },
  ];
  const maxScenarioProfit = Math.max(1, ...scenarioSet.map((entry) => Math.abs(entry.profit)));
  const roiGaugePct = Math.max(0, Math.min(100, ((result.roi + 10) / 40) * 100));

  if (!hasCostBasis && !hasRevenueBasis) {
    visualInsightsPanel.classList.add("hidden");
    visualInsightsPanel.innerHTML = "";
    return;
  }

  visualInsightsPanel.classList.remove("hidden");
  visualInsightsPanel.innerHTML = `
    <div class="compare-head">
      <div>
        <h3>Visual Insights</h3>
        <p>Live visual snapshots for return quality, cost structure, and scenario behavior.</p>
      </div>
    </div>
    <div class="viz-grid">
      <article class="viz-card">
        <h4>ROI Momentum Gauge</h4>
        <div class="gauge-wrap">
          <div class="gauge" style="background:conic-gradient(#2f6ea6 0 ${roiGaugePct.toFixed(2)}%, #e2e8f0 ${roiGaugePct.toFixed(2)}% 100%);">
            <div class="gauge-hole">
              <strong>${hasCostBasis ? `${result.roi.toFixed(1)}%` : "N/A"}</strong>
              <span>ROI</span>
            </div>
          </div>
        </div>
        <p>${hasCostBasis ? `${result.margin.toFixed(1)}% margin with ${formatSignedINR(result.profit)} projected profit.` : "Need cost and revenue basis to compute ROI."}</p>
      </article>

      <article class="viz-card">
        <h4>Capital Stack Split</h4>
        <div class="stack-track">
          <span class="stack-land" style="width:${landShare.toFixed(2)}%"></span>
          <span class="stack-construction" style="width:${constructionShare.toFixed(2)}%"></span>
          <span class="stack-finance" style="width:${financeShare.toFixed(2)}%"></span>
        </div>
        <div class="stack-legend">
          <p><i class="dot land"></i>Land + Statutory <strong>${landShare.toFixed(1)}%</strong></p>
          <p><i class="dot construction"></i>Construction <strong>${constructionShare.toFixed(1)}%</strong></p>
          <p><i class="dot finance"></i>Finance + Other <strong>${financeShare.toFixed(1)}%</strong></p>
        </div>
      </article>

      <article class="viz-card">
        <h4>Scenario Profit Bars</h4>
        <div class="scenario-bar-grid">
          ${scenarioSet
            .map((entry) => {
              const width = (Math.abs(entry.profit) / maxScenarioProfit) * 100;
              const cls = entry.profit >= 0 ? "pos" : "neg";
              return `
                <div class="scenario-bar-row">
                  <p>${entry.name}</p>
                  <div class="scenario-bar-track"><span class="scenario-bar ${cls}" style="width:${width.toFixed(2)}%"></span></div>
                  <strong>${formatSignedINR(entry.profit)}</strong>
                </div>
              `;
            })
            .join("")}
        </div>
      </article>
    </div>
  `;
}

function renderTrendPanel(result) {
  if (!trendPanel) return;

  const phaseData = buildPhaseTimeline(result);
  const loan = buildLoanSchedule(result);
  const cashflow = buildCashflow(result);

  const spendSeries = phaseData.progress.map((row) => row.spent).slice(0, 36);
  const cumulativeSeries = phaseData.progress.map((row) => row.cumulative).slice(0, 36);
  const debtSeries = loan.rows.map((row) => row.closingBalance).slice(0, 36);
  const netCashSeries = loan.rows.map((row) => row.netCashflow).slice(0, 36);

  const spendSpark = buildSparkline(spendSeries);
  const cumulativeSpark = buildSparkline(cumulativeSeries);
  const debtSpark = buildSparkline(debtSeries);
  const cashSpark = buildSparkline(netCashSeries);

  if (!spendSpark && !debtSpark) {
    trendPanel.classList.add("hidden");
    trendPanel.innerHTML = "";
    return;
  }

  const sparkCard = (title, spark, valueLabel, colorClass) => {
    if (!spark) {
      return `
        <article class="trend-card">
          <h4>${title}</h4>
          <p class="muted">Not enough data yet.</p>
        </article>
      `;
    }
    const delta = spark.last - spark.first;
    return `
      <article class="trend-card">
        <h4>${title}</h4>
        <svg viewBox="0 0 320 110" class="sparkline ${colorClass}" role="img" aria-label="${title}">
          <polygon points="${spark.areaPoints}" class="spark-area"></polygon>
          <polyline points="${spark.points}" class="spark-line" fill="none"></polyline>
        </svg>
        <div class="trend-meta">
          <span>${valueLabel}: ${formatINR(spark.last)}</span>
          <strong class="${delta >= 0 ? "pos" : "neg"}">${delta >= 0 ? "+" : ""}${formatINR(delta)}</strong>
        </div>
      </article>
    `;
  };

  trendPanel.classList.remove("hidden");
  trendPanel.innerHTML = `
    <div class="compare-head">
      <div>
        <h3>Trend Charts</h3>
        <p>Month-wise motion for spend, cumulative deployment, debt outstanding, and net cashflow.</p>
      </div>
    </div>
    <div class="trend-grid">
      ${sparkCard("Monthly Spend Trend", spendSpark, "Latest", "teal")}
      ${sparkCard("Cumulative Spend Curve", cumulativeSpark, "Latest", "blue")}
      ${sparkCard("Debt Balance Curve", debtSpark, "Latest", "amber")}
      ${sparkCard("Net Cashflow Motion", cashSpark, "Latest", "slate")}
    </div>
    <div class="trend-foot">
      <p>Sales starts ${cashflow ? `from M${cashflow.salesStart}` : "when timeline mode is enabled"}; break-even ${cashflow?.breakevenMonth ? `around M${cashflow.breakevenMonth}` : "depends on current assumptions"}.</p>
    </div>
  `;
}

function getGuardrailWarnings(result) {
  const warnings = [];
  const hasAreaBasis = result.buaSqFt > 0 || result.sbaArea > 0;
  const hasRevenuePotential = result.sbaArea > 0 && result.salePrice > 0;
  const hasCostBasis = result.totalCost > 0;

  if (result.sbaArea <= 0) warnings.push("Sellable SBA is zero. Enter valid BUA and loading %.");
  if (result.gstPct + result.brokerPct >= 100) warnings.push("GST + broker is 100% or more; net realization becomes invalid.");
  if (hasAreaBasis && result.loadingPct > LOADING_RISK_THRESHOLD_PCT) {
    warnings.push(`Loading is very high (>${LOADING_RISK_THRESHOLD_PCT}%).`);
  }
  if (hasRevenuePotential && hasCostBasis && result.breakEvenSalePrice > result.salePrice) {
    warnings.push("Break-even is above current sale price.");
  }
  if (result.loanPct > 75) warnings.push("Debt level is aggressive (>75%).");
  if (hasRevenuePotential && result.soldPct < 60) warnings.push("Sold % is low, absorption risk is elevated.");
  return warnings;
}

function renderGuardrails(result) {
  if (!guardrailPanel) return;
  const warnings = getGuardrailWarnings(result);

  if (!warnings.length) {
    guardrailPanel.classList.add("hidden");
    guardrailPanel.innerHTML = "";
    return;
  }

  guardrailPanel.classList.remove("hidden");
  guardrailPanel.innerHTML = `
    <div class="compare-head"><div><h3>Input Guardrails</h3></div></div>
    <article class="compare-card">
      ${warnings.map((w) => `<div class="compare-value"><span>Warning</span><strong>${w}</strong></div>`).join("")}
    </article>
  `;
}

function buildICMemo(result) {
  const topWarnings = riskMessages(result).warnings;
  const hasCostBasis = result.totalCost > 0;
  const hasRevenueBasis = result.totalGrossRevenue > 0 && result.sbaArea > 0 && result.salePrice > 0;
  const hasPricingBasis = result.sbaArea > 0 && (1 - result.gstPct / 100 - result.brokerPct / 100) > 0;
  const cashflow = buildCashflow(result);
  const recommendation = hasCostBasis
    ? result.roi >= 18
      ? "Proceed"
      : result.roi >= 10
        ? "Proceed with caution"
        : "Do not proceed yet"
    : "N/A (insufficient cost basis)";
  return [
    "Investment Committee Memo (Auto)",
    `Recommendation: ${recommendation}`,
    `ROI: ${hasCostBasis ? `${result.roi.toFixed(1)}%` : "N/A"}`,
    `Profit: ${hasCostBasis || hasRevenueBasis ? formatSignedINR(result.profit) : "N/A"}`,
    `Break-even Price: ${hasPricingBasis ? `Rs ${formatINR(result.breakEvenSalePrice)} / sq ft` : "N/A"}`,
    `Peak Funding Gap: ${cashflow && hasCostBasis ? `Rs ${formatINR(cashflow.peakFundingGap)}` : "N/A"}`,
    `Top Risks: ${(topWarnings || []).slice(0, 3).join("; ") || "None major"}`,
  ].join("\n");
}

function renderICMemo(result) {
  if (!icMemoPanel) return;
  const memo = buildICMemo(result);
  icMemoPanel.classList.remove("hidden");
  icMemoPanel.innerHTML = `
    <div class="compare-head"><div><h3>One-Page IC Memo</h3></div></div>
    <article class="compare-card"><pre>${memo}</pre></article>
  `;
}

function renderMixPlan(result) {
  if (!mixPanel) return;

  if (!result.mixEnabled || !result.mixRows.length) {
    mixPanel.classList.add("hidden");
    mixPanel.innerHTML = "";
    return;
  }

  mixPanel.classList.remove("hidden");
  mixPanel.innerHTML = `
    <h3>Unit Mix Planner</h3>
    <p class="muted">Area split and revenue impact based on the selected 1-5 BHK mix.</p>
    <div class="mix-grid">
      ${result.mixRows
        .map(
          (row) => `
            <article class="mix-card">
              <h4>${row.type} BHK</h4>
              <div class="mix-line"><span>Units</span><strong>${row.units}</strong></div>
              <div class="mix-line"><span>Share</span><strong>${row.sharePct.toFixed(1)}%</strong></div>
              <div class="mix-line"><span>Area</span><strong>${formatINR(row.allocatedArea)} sq ft</strong></div>
              <div class="mix-line"><span>Price Factor</span><strong>x${row.priceMultiplier.toFixed(2)}</strong></div>
              <div class="mix-line"><span>Gross Revenue</span><strong>Rs ${formatINR(row.grossRevenue)}</strong></div>
            </article>
          `,
        )
        .join("")}
    </div>
    <div class="mix-footer">
      <div class="summary-line"><span>Total Gross Revenue</span><strong>Rs ${formatINR(result.mixGrossRevenue)}</strong></div>
      <div class="summary-line"><span>Revenue Impact</span><strong>${formatSignedINR(result.mixRevenueDelta)} (${result.mixRevenueImpactPct.toFixed(1)}%)</strong></div>
    </div>
  `;
}

function renderRiskScore(result) {
  if (!riskScorePanel) return;

  const hasAreaBasis = result.buaSqFt > 0 || result.sbaArea > 0;
  if (!hasAreaBasis) {
    riskScorePanel.className = "risk-score-panel";
    riskScorePanel.innerHTML = `
      <div class="risk-score-head">
        <div>
          <p class="risk-score-kicker">Top Risk Score</p>
          <h3>N/A</h3>
        </div>
        <div class="risk-score-badge">N/A</div>
      </div>
      <div class="risk-score-track" aria-hidden="true"><span style="width:0%"></span></div>
      <div class="risk-score-foot">
        <p>Enter valid BUA/SBA inputs to compute score.</p>
        <p>Sellable SBA is zero. Enter valid BUA and loading %.</p>
      </div>
    `;
    result.riskScore = null;
    result.riskLabel = "N/A";
    result.riskTone = "na";
    return;
  }

  const risk = calculateRiskScore(result);
  const riskDetail = riskMessages(result);
  const note = risk.label === "Safe"
    ? "Comfortable risk profile"
    : risk.label === "Borderline"
      ? "Needs closer review"
      : "High caution required";

  riskScorePanel.className = `risk-score-panel ${risk.tone}`;
  riskScorePanel.innerHTML = `
    <div class="risk-score-head">
      <div>
        <p class="risk-score-kicker">Top Risk Score</p>
        <h3>${risk.label}</h3>
      </div>
      <div class="risk-score-badge">${risk.score}/100</div>
    </div>
    <div class="risk-score-track" aria-hidden="true"><span style="width:${risk.score}%"></span></div>
    <div class="risk-score-foot">
      <p>${note}</p>
      <p>${riskDetail.warnings.length ? riskDetail.warnings.slice(0, 2).join(" • ") : "No major warning flags"}</p>
    </div>
  `;

  result.riskScore = risk.score;
  result.riskLabel = risk.label;
  result.riskTone = risk.tone;
}

function renderCompare() {
  if (!comparePanel) return;

  if (!compareLeft && !compareRight) {
    comparePanel.classList.add("hidden");
    comparePanel.innerHTML = "";
    return;
  }

  const cards = [
    ["Scenario A", compareLeft],
    ["Scenario B", compareRight],
  ];

  comparePanel.classList.remove("hidden");
  comparePanel.innerHTML = `
    <div class="compare-head">
      <div>
        <h3>Compare Mode</h3>
        <p>Side-by-side saved scenarios for quick decision making.</p>
      </div>
    </div>
    <div class="compare-grid">
      ${cards
        .map(([title, snapshot]) => {
          if (!snapshot) {
            return `
              <article class="compare-card empty">
                <h4>${title}</h4>
                <p>Save a scenario here using the buttons above.</p>
              </article>
            `;
          }

          return `
            <article class="compare-card">
              <h4>${title}</h4>
              <div class="compare-value"><span>ROI</span><strong>${snapshot.roi.toFixed(1)}%</strong></div>
              <div class="compare-value"><span>Profit</span><strong>${formatSignedINR(snapshot.profit)}</strong></div>
              <div class="compare-value"><span>Total Cost</span><strong>Rs ${formatINR(snapshot.totalCost)}</strong></div>
              <div class="compare-value"><span>Break-even</span><strong>Rs ${formatINR(snapshot.breakEvenSalePrice)} / sq ft</strong></div>
              <div class="compare-value"><span>Risk Score</span><strong>${snapshot.riskScore ?? "N/A"}${snapshot.riskScore != null ? "/100" : ""}</strong></div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderLoanSchedule(result) {
  if (!loanSchedulePanel) return;

  const schedule = buildLoanSchedule(result);
  const timelineCashflow = result.timelineEnabled ? buildCashflow(result) : null;
  if (!schedule.rows.length) {
    loanSchedulePanel.classList.add("hidden");
    loanSchedulePanel.innerHTML = "";
    return;
  }

  const finalVisibleMonth = Math.max(
    1,
    (schedule.lastActiveMonth || 0) + 2,
    schedule.breakevenMonth || 0,
    timelineCashflow?.breakevenMonth || 0,
  );
  const visibleRows = schedule.rows.filter((row) => row.month <= finalVisibleMonth);
  const compactRows = visibleRows.slice(0, 12);
  const modePrefersDetailed = loanViewMode?.value === "detailed";
  const shouldShowDetailed = showDetailedLoan || modePrefersDetailed;
  const rowsToRender = shouldShowDetailed ? visibleRows : compactRows;
  const breakEvenLabel = schedule.breakevenMonth
    ? `M${schedule.breakevenMonth}`
    : timelineCashflow?.breakevenMonth
      ? `M${timelineCashflow.breakevenMonth}`
      : "Beyond horizon";

  loanSchedulePanel.classList.remove("hidden");
  loanSchedulePanel.innerHTML = `
    <h3>Loan Schedule</h3>
    <p class="muted">Simple month view: EMI, interest, principal, closing balance, and net cashflow.</p>
    <div class="head-actions">
      <button type="button" class="ghost" id="loanViewToggleBtn">${shouldShowDetailed ? "View Summary" : "View Full Schedule"}</button>
    </div>
    <div class="loan-summary-grid">
      <div class="kpi"><p class="k">Monthly EMI</p><p class="v">Rs ${formatINR(schedule.monthlyPayment)}</p></div>
      <div class="kpi"><p class="k">Modeled Interest</p><p class="v">Rs ${formatINR(result.interestCost)}</p></div>
      <div class="kpi"><p class="k">Total Principal</p><p class="v">Rs ${formatINR(schedule.totalPrincipal)}</p></div>
      <div class="kpi"><p class="k">Break-even Month</p><p class="v">${breakEvenLabel}</p></div>
    </div>
    <p class="muted">${shouldShowDetailed ? `Showing full ${rowsToRender.length} active months.` : `Showing first ${rowsToRender.length} active months (simplified view).`}</p>
    <div class="loan-table-wrap">
      <table class="loan-table ${shouldShowDetailed ? "" : "compact"}">
        <thead>
          <tr>
            <th>Month</th>
            <th>EMI</th>
            <th>Interest</th>
            <th>Principal</th>
            <th>Closing</th>
            <th>Net Cashflow</th>
          </tr>
        </thead>
        <tbody>
          ${rowsToRender
            .map(
              (row) => `
                <tr>
                  <td>M${row.month}</td>
                  <td class="num">Rs ${formatINR(row.loanPayment)}</td>
                  <td class="num">Rs ${formatINR(row.interest)}</td>
                  <td class="num">Rs ${formatINR(row.principalPaid)}</td>
                  <td class="num">Rs ${formatINR(row.closingBalance)}</td>
                  <td class="num cashflow-cell ${row.netCashflow >= 0 ? "pos" : "neg"}">${formatSignedINR(row.netCashflow)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  const toggleBtn = document.getElementById("loanViewToggleBtn");
  toggleBtn?.addEventListener("click", () => {
    showDetailedLoan = !shouldShowDetailed;
    renderLoanSchedule(result);
  });
}

function buildCashflow(result) {
  if (!result.timelineEnabled) return null;

  const delayMonths = Math.max(0, toNumber(result.totalDelayMonths, result.delayMonths || 0));
  const durationMonths = Math.max(1, toNumber(result.durationMonths, 1));
  const salesMonths = Math.max(1, toNumber(result.salesMonths, 1));
  const salesStart = delayMonths + Math.ceil(durationMonths / 2) + Math.max(0, toNumber(result.salesStartOffset, 0));
  const phaseTimeline = buildPhaseTimeline(result);
  const horizon = Math.max(delayMonths + durationMonths + salesMonths + 2, 24, phaseTimeline.progress.length, salesStart + salesMonths + 1);

  const monthlySalesNet = result.netRevenue / salesMonths;
  const salesCurve = result.salesCurve || "flat";
  const outflowByMonth = Array.from({ length: horizon }, (_, idx) => (idx < phaseTimeline.progress.length ? phaseTimeline.progress[idx].spent : 0));

  const curveMultiplier = (mode, idx, totalCount, type) => {
    if (mode !== "realistic") return 1;
    if (totalCount <= 1) return 1;
    const p = idx / (totalCount - 1);
    if (type === "sales") {
      if (p < 0.2) return 0.65;
      if (p < 0.45) return 0.9;
      if (p < 0.75) return 1.35;
      return 0.85;
    }
    if (p < 0.2) return 0.7;
    if (p < 0.5) return 1.15;
    if (p < 0.8) return 1.35;
    return 0.75;
  };

  let cumulative = 0;
  let minCumulative = cumulative;
  let peakGapMonth = 0;
  let breakevenMonth = null;

  for (let month = 1; month <= horizon; month += 1) {
    const salesIdx = month - salesStart;
    const inSalesWindow = salesIdx >= 0 && salesIdx < salesMonths;

    cumulative -= outflowByMonth[month - 1] || 0;
    if (inSalesWindow) cumulative += monthlySalesNet * curveMultiplier(salesCurve, salesIdx, salesMonths, "sales");

    if (cumulative < minCumulative) {
      minCumulative = cumulative;
      peakGapMonth = month;
    }
    if (breakevenMonth === null && cumulative >= 0) breakevenMonth = month;
  }

  return {
    salesStart,
    horizon,
    peakFundingGap: Math.abs(minCumulative),
    peakGapMonth,
    breakevenMonth,
  };
}

function scenarioResult(base, multiplier) {
  const price = Math.max(0, toNumber(base.inputSalePrice, base.salePrice)) * multiplier;
  const gross = base.sbaArea * (base.soldPct / 100) * price;
  const gst = gross * (base.gstPct / 100);
  const broker = gross * (base.brokerPct / 100);
  const net = gross - gst - broker;
  const profit = net - base.totalCost;
  const roi = base.totalCost > 0 ? (profit / base.totalCost) * 100 : 0;
  return { price, profit, roi };
}

function riskMessages(result) {
  const warnings = [...getGuardrailWarnings(result)];
  const hasAreaBasis = result.buaSqFt > 0 || result.sbaArea > 0;
  const hasRevenueBasis = result.sbaArea > 0 && result.salePrice > 0 && result.soldPct > 0;
  const hasCostBasis = result.totalCost > 0;
  const residentialFloors = Math.max(0, result.floors);
  const parkingRequired = result.units * 1.25;

  if (hasAreaBasis && residentialFloors === 0) warnings.push("No residential floors entered.");
  if (hasAreaBasis && result.flatsPerFloor > 10) warnings.push("Unit density is aggressive for residential absorption.");
  if (hasAreaBasis && parkingRequired > 0 && result.parkingSlots > 0 && result.parkingSlots < parkingRequired) {
    const shortfall = ((parkingRequired - result.parkingSlots) / parkingRequired) * 100;
    warnings.push(`Parking appears short by about ${shortfall.toFixed(0)}%.`);
  }
  if (hasCostBasis && result.roi < 10) warnings.push("ROI below safer threshold (10%).");
  if (hasRevenueBasis && result.margin < 12) warnings.push("Net margin below healthy developer target (12%).");
  if (hasAreaBasis && result.bhkType >= 4 && result.flatsPerFloor > 6) {
    warnings.push("High density for large BHK mix may reduce absorption speed.");
  }
  if (hasAreaBasis && result.bhkType === 1 && result.loadingPct > LOADING_RISK_THRESHOLD_PCT) {
    warnings.push(`Very high loading on 1 BHK projects (>${LOADING_RISK_THRESHOLD_PCT}%) can impact market acceptance.`);
  }

  const uniqueWarnings = [...new Set(warnings)];

  let level = "safe";
  if (uniqueWarnings.length > 0) level = uniqueWarnings.length > 2 ? "risky" : "warn";
  return { warnings: uniqueWarnings, level };
}

function collectData() {
  return Object.fromEntries(new FormData(form).entries());
}

function applyOptionalTuning(data) {
  if (!smartToggle || !smartToggle.checked) return data;

  const tuned = { ...data };
  const saleFactor = Number(quickSaleFactor?.value || 100) / 100;
  const soldAdj = Number(quickSoldAdj?.value || 0);
  const escalationAdj = Number(quickEscalationAdj?.value || 0);

  tuned.salePrice = String(Math.max(0, Number(tuned.salePrice || 0) * saleFactor));
  tuned.soldPct = String(Math.min(100, Math.max(0, Number(tuned.soldPct || 0) + soldAdj)));
  tuned.escalationPct = String(Math.max(0, Number(tuned.escalationPct || 0) + escalationAdj));
  return tuned;
}

function calculate(data) {
  const plotSqFt = convertToSqFt(data.plotArea);
  const buaSqFt = convertToSqFt(data.bua);
  const floors = toNumber(data.floors, 0);
  const basements = toNumber(data.basements, 0);
  const flatsPerFloor = toNumber(data.flatsPerFloor, 0);
  const parkingSlots = toNumber(data.parkingSlots, 0);
  const baseSalePrice = toNumber(data.salePrice, 0);
  const soldPct = toNumber(data.soldPct, 0);
  const bhkType = toNumber(data.bhkType, 0);
  const timelineEnabled = data.advancedTimeline === "on";
  const delayMonths = timelineEnabled ? Math.max(0, toNumber(data.delayMonths, 0)) : 0;
  const salesMonths = timelineEnabled ? Math.max(1, toNumber(data.salesMonths, 1)) : 1;
  const salesStartOffset = timelineEnabled ? Math.max(0, toNumber(data.salesStartOffset, 0)) : 0;
  const approvalDelayMonths = Math.max(0, toNumber(data.approvalDelayMonths, 0));
  const executionDelayMonths = Math.max(0, toNumber(data.executionDelayMonths, 0));
  const salesDelayMonths = Math.max(0, toNumber(data.salesDelayMonths, 0));
  const totalDelayMonths = delayMonths + approvalDelayMonths + executionDelayMonths;
  const moratoriumMonths = Math.max(0, toNumber(data.moratoriumMonths, 0));
  const prepaymentPct = Math.max(0, Math.min(100, toNumber(data.prepaymentPct, 0)));
  const salesCurve = data.salesCurve || "realistic";
  const costCurve = data.costCurve || "realistic";
  const viewPremiumPct = Math.max(0, toNumber(data.viewPremiumPct, 0));
  const sensitivityCaseRaw = String(data.sensitivityCase || "base").toLowerCase();
  const sensitivityCase = ["base", "optimistic", "stressed"].includes(sensitivityCaseRaw) ? sensitivityCaseRaw : "base";

  const aboveGradeLevels = Math.max(0, floors);
  const basementLevels = Math.max(0, basements);
  const totalLevels = aboveGradeLevels + basementLevels;
  const aboveGradeShare = totalLevels > 0 ? aboveGradeLevels / totalLevels : 1;
  const basementAreaSqFt = buaSqFt * (1 - aboveGradeShare);
  const aboveGradeBuaSqFt = Math.max(0, buaSqFt - basementAreaSqFt);

  const loadingPct = toNumber(data.loadingPct, 0);
  const effectiveLoadingPct = loadingPct;
  const loadingFactor = 1 + effectiveLoadingPct / 100;
  const carpetRatioPct = Math.min(90, Math.max(0, toNumber(data.carpetRatio, 0)));
  const sbaArea = buaSqFt * loadingFactor;
  const carpetArea = buaSqFt * (carpetRatioPct / 100);
  const commonArea = Math.max(0, sbaArea - buaSqFt);
  const sbaVsBuaPct = buaSqFt > 0 ? ((sbaArea - buaSqFt) / buaSqFt) * 100 : 0;
  const carpetVsBuaPct = buaSqFt > 0 ? ((buaSqFt - carpetArea) / buaSqFt) * 100 : 0;

  const baseRate = pickRate(data, sensitivityCase);
  const effectiveRate = baseRate;

  const escalationPct = toNumber(data.escalationPct, 0);
  const steelEscalationPct = Math.max(
    0,
    pickCaseValue(
      data,
      sensitivityCase,
      "steelEscalationBasePct",
      "steelEscalationOptimisticPct",
      "steelEscalationStressedPct",
      0,
      "steelEscalationPct",
    ),
  );
  const cementEscalationPct = Math.max(0, toNumber(data.cementEscalationPct, 0));
  const laborEscalationPct = Math.max(
    0,
    pickCaseValue(
      data,
      sensitivityCase,
      "laborEscalationBasePct",
      "laborEscalationOptimisticPct",
      "laborEscalationStressedPct",
      0,
      "laborEscalationPct",
    ),
  );
  const mepEscalationPct = Math.max(0, toNumber(data.mepEscalationPct, 0));
  const componentEscalationPct =
    steelEscalationPct * 0.25 +
    cementEscalationPct * 0.15 +
    laborEscalationPct * 0.35 +
    mepEscalationPct * 0.25;
  const appliedEscalationPct = escalationPct > 0 ? escalationPct : componentEscalationPct;
  const escalationFactor = 1 + appliedEscalationPct / 100;
  const constructionCost = sbaArea * effectiveRate * escalationFactor;
  const aboveGradeConstructionCost = constructionCost;
  const basementConstructionCost = 0;
  const totalConstructedAreaSqFt = buaSqFt;

  const units = flatsPerFloor > 0 ? flatsPerFloor * Math.max(0, floors) : 0;
  const lifts = getLiftCount(floors, flatsPerFloor);

  const landRate = toNumber(data.landRate, 0);
  const landCostInput = toNumber(data.landCost, 0);
  const landCost = landCostInput > 0 ? landCostInput : plotSqFt * landRate;
  const stampPct = toNumber(data.stampPct, 0);
  const stampCost = landCost * (stampPct / 100);
  const legalCost = toNumber(data.legalCost, 0);

  const salePrice = baseSalePrice;

  const mixPlan = buildUnitMixPlan(
    {
      sbaArea,
      salePrice,
      soldPct,
      units: flatsPerFloor > 0 ? flatsPerFloor * Math.max(0, floors) : 0,
    },
    data,
  );

  const result = {
    plotSqFt,
    buaSqFt,
    carpetArea,
    commonArea,
    sbaVsBuaPct,
    carpetVsBuaPct,
    sbaArea,
    floors,
    basements,
    flatsPerFloor,
    units,
    lifts,
    parkingSlots,
    bhkType,
    inputSalePrice: baseSalePrice,
    salePrice,
    soldPct,
    timelineEnabled,
    delayMonths,
    totalDelayMonths,
    approvalDelayMonths,
    executionDelayMonths,
    salesDelayMonths,
    salesMonths,
    salesStartOffset: salesStartOffset + salesDelayMonths,
    moratoriumMonths,
    prepaymentPct,
    salesCurve,
    costCurve,
    sensitivityCase,
    viewPremiumPct,
    loadingPct,
    effectiveLoadingPct,
    carpetRatioPct,
    basementAreaSqFt,
    aboveGradeBuaSqFt,
    aboveGradeConstructionCost,
    basementConstructionCost,
    totalConstructedAreaSqFt,
    baseRate,
    effectiveRate,
    mixEnabled: mixPlan.enabled,
    mixRows: mixPlan.rows,
    mixGrossRevenue: mixPlan.mixGrossRevenue,
    mixRevenueDelta: mixPlan.mixRevenueDelta,
    mixRevenueImpactPct: mixPlan.mixRevenueImpactPct,
    constructionCost,
    landCost,
    stampCost,
    legalCost,
    loanPct: toNumber(data.loanPct, 0),
    interestPct: toNumber(data.interestPct, 0),
    durationMonths: toNumber(data.durationMonths, 0),
    escalationPct: appliedEscalationPct,
    componentEscalationPct,
    gstPct: toNumber(data.gstPct, 0),
    brokerPct: toNumber(data.brokerPct, 0),
    lines: makeBoqLines(sbaArea, constructionCost, effectiveRate),
  };

  recomputeFinancials(result);
  return result;
}

function renderSplitBar(result) {
  const total = result.totalCost;
  const hasCostBasis = total > 0;

  if (!hasCostBasis) {
    splitBar.innerHTML = `
      <div class="split-chart-wrap">
        <div class="split-pie" aria-label="Project cost allocation pie chart unavailable">
          <div class="split-pie-hole">
            <span>Total</span>
            <strong>N/A</strong>
          </div>
        </div>
        <div class="split-summary">
          <p><span class="dot land"></span>Land N/A</p>
          <p><span class="dot construction"></span>Construction N/A</p>
          <p><span class="dot finance"></span>Finance + Other N/A</p>
        </div>
      </div>
    `;
    return;
  }

  const landAndStatutory = result.landCost + result.stampCost + result.legalCost;
  const landShare = (landAndStatutory / total) * 100;
  const constructionShare = (result.constructionCost / total) * 100;
  const financeShare = Math.max(0, Math.min(100, 100 - landShare - constructionShare));
  const landStop = landShare;
  const constructionStop = landShare + constructionShare;
  const financeStop = 100;

  splitBar.innerHTML = `
    <div class="split-chart-wrap">
      <div
        class="split-pie"
        aria-label="Project cost allocation pie chart"
        style="background: conic-gradient(
          #2f7f4f 0 ${landStop.toFixed(2)}%,
          #6f6f6f ${landStop.toFixed(2)}% ${constructionStop.toFixed(2)}%,
          #2b6cb0 ${constructionStop.toFixed(2)}% ${financeStop.toFixed(2)}%,
          #e7e5e4 ${financeStop.toFixed(2)}% 100%
        );"
      >
        <div class="split-pie-hole">
          <span>Total</span>
          <strong>100%</strong>
        </div>
      </div>
      <div class="split-summary">
        <p><span class="dot land"></span>Land ${landShare.toFixed(1)}%</p>
        <p><span class="dot construction"></span>Construction ${constructionShare.toFixed(1)}%</p>
        <p><span class="dot finance"></span>Finance + Other ${financeShare.toFixed(1)}%</p>
      </div>
    </div>
  `;
}

function renderScenarios(result) {
  const hasPriceBasis = result.sbaArea > 0 && result.soldPct > 0 && result.salePrice > 0;
  const hasCostBasis = result.totalCost > 0;
  const conservative = scenarioResult(result, 0.85);
  const base = scenarioResult(result, 1);
  const optimistic = scenarioResult(result, 1.15);
  const cards = [
    ["Conservative", conservative],
    ["Base", base],
    ["Optimistic", optimistic],
  ];

  scenarioCards.innerHTML = cards
    .map(
      ([name, v]) => `
      <article class="scenario">
        <h4>${name}</h4>
        <p>Price: ${hasPriceBasis ? `Rs ${formatINR(v.price)} / sq ft` : "N/A"}</p>
        <p>Profit: ${hasCostBasis || hasPriceBasis ? formatSignedINR(v.profit) : "N/A"}</p>
        <p>ROI: ${hasCostBasis ? `${v.roi.toFixed(1)}%` : "N/A"}</p>
      </article>
    `,
    )
    .join("");
}

function renderWaterfall(result) {
  if (!waterfallPanel) return;

  const hasRevenueBasis = result.totalGrossRevenue > 0 && result.sbaArea > 0 && result.salePrice > 0;
  const hasCostBasis = result.totalCost > 0;
  const hasProfitBasis = hasRevenueBasis || hasCostBasis;

  const items = [
    { label: "Gross Revenue", value: result.totalGrossRevenue, cls: "wf-revenue", show: hasRevenueBasis },
    { label: "GST", value: -result.gstAmount, cls: "wf-deduction", show: hasRevenueBasis },
    { label: "Brokerage", value: -result.brokerAmount, cls: "wf-deduction", show: hasRevenueBasis },
    { label: "Net Revenue", value: result.netRevenue, cls: "wf-net", show: hasRevenueBasis },
    { label: "Total Cost", value: -result.totalCost, cls: "wf-cost", show: hasCostBasis },
    { label: "Profit", value: result.profit, cls: result.profit >= 0 ? "wf-profit" : "wf-loss", show: hasProfitBasis },
  ];

  const maxAbs = Math.max(...items.filter((item) => item.show).map((item) => Math.abs(item.value)), 1);

  waterfallPanel.innerHTML = `
    <h3>Waterfall Chart</h3>
    <p class="muted">Revenue → deductions → net revenue → total cost → profit</p>
    <div class="waterfall-grid">
      ${items
        .map((item) => {
          const width = item.show ? (Math.abs(item.value) / maxAbs) * 100 : 0;
          const valueText = item.show ? formatSignedINR(item.value) : "N/A";
          return `
            <div class="wf-row">
              <p class="wf-label">${item.label}</p>
              <div class="wf-track">
                <div class="wf-bar ${item.cls}" style="width:${width.toFixed(2)}%"></div>
              </div>
              <p class="wf-value">${valueText}</p>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function allocateMonths(totalMonths, phaseDefs) {
  const safeTotal = Math.max(1, totalMonths);
  const raw = phaseDefs.map((p) => p.weight * safeTotal);
  const ints = raw.map((v) => Math.max(1, Math.floor(v)));
  let current = ints.reduce((a, b) => a + b, 0);

  while (current > safeTotal) {
    const idx = ints.findIndex((m) => m > 1);
    if (idx === -1) break;
    ints[idx] -= 1;
    current -= 1;
  }
  while (current < safeTotal) {
    let bestIdx = 0;
    let bestFrac = -Infinity;
    raw.forEach((v, i) => {
      const frac = v - Math.floor(v);
      if (frac > bestFrac) {
        bestFrac = frac;
        bestIdx = i;
      }
    });
    ints[bestIdx] += 1;
    current += 1;
  }

  return ints;
}

function buildPhaseTimeline(result) {
  const planningDelay = Math.max(0, toNumber(result.delayMonths, 0));
  const approvalDelay = Math.max(0, toNumber(result.approvalDelayMonths, 0));
  const executionDelay = Math.max(0, toNumber(result.executionDelayMonths, 0));
  const salesDelay = Math.max(0, toNumber(result.salesDelayMonths, 0));
  const duration = Math.max(1, toNumber(result.durationMonths, 1));
  const salesMonths = Math.max(1, toNumber(result.salesMonths, 1));
  const floorCount = Math.max(1, toNumber(result.floors, 1));

  const phaseDefs = [
    { name: "Excavation", weight: 0.1, costShare: 0.08 },
    { name: "Foundation", weight: 0.14, costShare: 0.12 },
    { name: "Plinth/Podium", weight: 0.08, costShare: 0.07 },
    { name: "RCC Slabs", weight: 0.4, costShare: 0.45 },
    { name: "MEP + Finishes", weight: 0.2, costShare: 0.2 },
    { name: "External + Handover", weight: 0.08, costShare: 0.08 },
  ];
  const phaseMonths = allocateMonths(duration, phaseDefs);

  const phases = [];
  let cursor = 1;

  phases.push({
    name: "Land Acquisition",
    start: 1,
    end: 1,
    amount: result.landCost,
  });

  if (planningDelay > 0) {
    phases.push({
      name: "Planning Hold",
      start: cursor,
      end: cursor + planningDelay - 1,
      amount: 0,
    });
    cursor += planningDelay;
  }

  if (approvalDelay > 0) {
    phases.push({
      name: "Approvals & Permits",
      start: cursor,
      end: cursor + approvalDelay - 1,
      amount: result.legalCost + result.stampCost,
    });
    cursor += approvalDelay;
  } else {
    phases.push({
      name: "Approvals & Permits",
      start: 1,
      end: 1,
      amount: result.legalCost + result.stampCost,
    });
  }

  if (executionDelay > 0) {
    phases.push({
      name: "Execution Mobilization",
      start: cursor,
      end: cursor + executionDelay - 1,
      amount: 0,
    });
    cursor += executionDelay;
  }

  let slabStartMonth = cursor;
  let slabDurationMonths = 1;
  phaseDefs.forEach((phase, idx) => {
    const months = phaseMonths[idx];
    const start = cursor;
    const end = cursor + months - 1;
    const constructionPart = result.constructionCost * phase.costShare;
    const architectPart = result.architectCost * phase.costShare;
    const amount = constructionPart + architectPart;
    phases.push({ name: phase.name, start, end, amount });
    if (phase.name === "RCC Slabs") {
      slabStartMonth = start;
      slabDurationMonths = Math.max(1, months);
    }
    cursor = end + 1;
  });

  if (salesDelay > 0) {
    phases.push({
      name: "Selling Permit / Launch Delay",
      start: cursor,
      end: cursor + salesDelay - 1,
      amount: 0,
    });
    cursor += salesDelay;
  }

  phases.push({
    name: "Sales Window",
    start: cursor,
    end: cursor + salesMonths - 1,
    amount: 0,
  });

  phases.push({
    name: "Finance Carry",
    start: 1,
    end: Math.max(1, cursor - 1),
    amount: result.interestCost + result.delayInterestCost,
  });

  const slabTotal = (result.constructionCost + result.architectCost) * 0.45;
  const slabEach = slabTotal / Math.max(1, floorCount);
  const slabPoints = Array.from({ length: floorCount }, (_, i) => {
    const progress = floorCount > 1 ? i / (floorCount - 1) : 0;
    const month = slabStartMonth + Math.round(progress * Math.max(0, slabDurationMonths - 1));
    return {
      label: `Slab ${i + 1}`,
      month,
      amount: slabEach,
    };
  });

  let graphPoints = slabPoints;
  if (slabPoints.length > 12) {
    const chunk = Math.ceil(slabPoints.length / 12);
    graphPoints = [];
    for (let i = 0; i < slabPoints.length; i += chunk) {
      const group = slabPoints.slice(i, i + chunk);
      graphPoints.push({
        label: `${group[0].label} - ${group[group.length - 1].label}`,
        month: group[Math.floor(group.length / 2)].month,
        amount: group.reduce((sum, p) => sum + p.amount, 0),
      });
    }
  }

  const horizon = Math.max(
    1,
    phases.reduce((max, p) => Math.max(max, p.end), 1),
    1 + Math.max(1, toNumber(result.totalDelayMonths, 0)) + Math.max(1, toNumber(result.durationMonths, 1)),
  );

  const monthlySpent = Array.from({ length: horizon }, () => 0);
  const costWeight = (idx, count, mode) => {
    if (mode !== "realistic") return 1;
    if (count <= 1) return 1;
    const p = idx / (count - 1);
    if (p < 0.2) return 0.7;
    if (p < 0.5) return 1.15;
    if (p < 0.8) return 1.35;
    return 0.75;
  };

  const spreadAmount = (startMonth, endMonth, amount, mode = "flat") => {
    const safeAmount = Math.max(0, amount || 0);
    if (safeAmount <= 0) return;
    const start = Math.max(1, Math.min(horizon, startMonth));
    const end = Math.max(start, Math.min(horizon, endMonth));
    const count = end - start + 1;
    const weights = Array.from({ length: count }, (_, i) => costWeight(i, count, mode));
    const sum = weights.reduce((a, b) => a + b, 0) || 1;

    for (let i = 0; i < count; i += 1) {
      monthlySpent[start - 1 + i] += (safeAmount * weights[i]) / sum;
    }
  };

  const namedPhase = (name) => phases.find((phase) => phase.name === name);
  spreadAmount(1, 1, result.landCost, "flat");

  const approvals = namedPhase("Approvals & Permits");
  if (approvals) {
    spreadAmount(approvals.start, approvals.end, approvals.amount, "flat");
  }

  phaseDefs.forEach((def) => {
    const p = namedPhase(def.name);
    if (p) {
      spreadAmount(p.start, p.end, p.amount, result.costCurve || "flat");
    }
  });

  const finance = namedPhase("Finance Carry");
  if (finance) {
    spreadAmount(finance.start, finance.end, finance.amount, "flat");
  }

  const progress = [];
  let cumulative = 0;
  for (let i = 0; i < horizon; i += 1) {
    const month = i + 1;
    const spent = monthlySpent[i];
    cumulative += spent;
    const remaining = Math.max(0, result.totalCost - cumulative);
    progress.push({ month, spent, cumulative, remaining });
  }

  const lastActiveIdx = progress.reduce((last, row, idx) => (row.spent > 0.5 || row.remaining > 0.5 ? idx : last), 0);
  const trimmedProgress = progress.slice(0, Math.max(1, lastActiveIdx + 1));
  if (trimmedProgress.length) {
    trimmedProgress[trimmedProgress.length - 1].remaining = 0;
  }

  return { phases, graphPoints, progress: trimmedProgress };
}

function renderPhasePanel(result) {
  if (!phasePanel) return;
  const { phases, graphPoints, progress } = buildPhaseTimeline(result);
  const hasCostBasis = result.totalCost > 0;
  const maxAmt = Math.max(...graphPoints.map((p) => p.amount), 1);
  const maxSpent = Math.max(...progress.map((p) => p.spent), 1);
  const moneyOrNA = (value, show) => (show ? `Rs ${formatINR(value)}` : "N/A");

  phasePanel.classList.remove("hidden");

  if (!hasCostBasis) {
    phasePanel.innerHTML = `
      <h3>Construction Phase Timeline</h3>
      <p class="muted">Enter valid BUA, loading, and cost inputs to generate phase allocations and month-wise burn.</p>
      <div class="phase-empty">
        <div class="phase-empty-card">
          <strong>Timeline unavailable</strong>
          <p>The phase model needs a valid cost basis before it can distribute amounts across land, approvals, construction, and finance carry.</p>
          <ul>
            <li>Set BUA and SBA loading.</li>
            <li>Provide at least one cost basis input.</li>
            <li>Re-run analysis to populate phase spend and remaining balance.</li>
          </ul>
        </div>
      </div>
    `;
    return;
  }

  phasePanel.innerHTML = `
    <h3>Construction Phase Timeline</h3>
    <p class="muted">Amounts and monthly burn are now allocated from the same cost model so each phase and remaining balance stay consistent.</p>
    <div class="phase-grid">
      ${phases
        .map(
          (p) => `
            <article class="phase-card">
              <h4>${p.name}</h4>
              <div class="phase-line"><span>Timeline</span><strong>${hasCostBasis ? `M${p.start} - M${p.end}` : "N/A"}</strong></div>
              <div class="phase-line"><span>Required Amount</span><strong>${moneyOrNA(p.amount, hasCostBasis)}</strong></div>
            </article>
          `,
        )
        .join("")}
    </div>
    <h4 class="phase-subhead">Slab-wise Payment Need Graph</h4>
    <div class="slab-graph">
      ${graphPoints
        .map((p) => {
          const width = hasCostBasis ? (p.amount / maxAmt) * 100 : 0;
          return `
            <div class="slab-row">
              <p class="slab-label">${p.label} ${hasCostBasis ? `(M${p.month})` : ""}</p>
              <div class="slab-track"><div class="slab-fill" style="width:${width.toFixed(2)}%"></div></div>
              <p class="slab-value">${moneyOrNA(p.amount, hasCostBasis)}</p>
            </div>
          `;
        })
        .join("")}
    </div>
    <h4 class="phase-subhead">Monthly Spend and Remaining Project Cost</h4>
    <div class="progress-graph">
      ${progress
        .map((row) => {
          const spendWidth = hasCostBasis ? (row.spent / maxSpent) * 100 : 0;
          return `
            <div class="progress-row">
              <p class="progress-label">M${row.month}</p>
              <div class="progress-bars">
                <div class="progress-track"><div class="progress-spent" style="width:${spendWidth.toFixed(2)}%"></div></div>
              </div>
              <p class="progress-value">Spent: ${moneyOrNA(row.spent, hasCostBasis)} | Remaining: ${moneyOrNA(row.remaining, hasCostBasis)}</p>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderSummary(result) {
  const hasAreaBasis = result.buaSqFt > 0;
  const hasCostBasis = result.totalCost > 0;
  const hasRevenueBasis = result.totalGrossRevenue > 0 && result.sbaArea > 0 && result.salePrice > 0;
  const moneyOrNA = (value, show) => (show ? `Rs ${formatINR(value)}` : "N/A");
  const areaOrNA = (value, show) => (show ? `${formatINR(value)} sq ft` : "N/A");
  const kpis = [
    ["Construction Cost", moneyOrNA(result.constructionCost, hasCostBasis)],
    ["Land + Statutory", moneyOrNA(result.landCost + result.stampCost + result.legalCost, hasCostBasis)],
    ["Finance Cost", moneyOrNA(result.interestCost, hasCostBasis)],
    ["Total Project Cost", moneyOrNA(result.totalCost, hasCostBasis)],
    ["Built-up Area (BUA)", areaOrNA(result.buaSqFt, hasAreaBasis)],
    ["Carpet Area", areaOrNA(result.carpetArea, hasAreaBasis)],
    ["SBA", areaOrNA(result.sbaArea, hasAreaBasis)],
    ["Sold SBA Area", areaOrNA(result.soldSbaArea, hasRevenueBasis)],
    ["Gross Revenue (100% SBA)", moneyOrNA(result.totalGrossRevenue, hasRevenueBasis)],
    ["Net Revenue", moneyOrNA(result.netRevenue, hasRevenueBasis)],
    ["Profit / Loss", hasCostBasis || hasRevenueBasis ? formatSignedINR(result.profit) : "N/A"],
    ["ROI", hasCostBasis ? `${result.roi.toFixed(1)}%` : "N/A"],
    ["Margin", hasRevenueBasis ? `${result.margin.toFixed(1)}%` : "N/A"],
    ["Risk Score", hasAreaBasis ? `${result.riskScore ?? 0}/100` : "N/A"],
    ["BHK Mix", result.bhkType > 0 ? `${result.bhkType} BHK` : "N/A"],
    ["Units and Lifts", result.units > 0 ? `${result.units} units, ${result.lifts} lifts` : "N/A"],
  ];

  summary.innerHTML = "";
  kpis.forEach(([k, v]) => {
    const card = document.createElement("div");
    card.className = "kpi";
    card.innerHTML = `<p class="k">${k}</p><p class="v">${v}</p>`;
    summary.appendChild(card);
  });
}

function renderCashflow(result) {
  if (!cashflowPanel) return;
  const cashflow = buildCashflow(result);

  if (!cashflow) {
    cashflowPanel.classList.add("hidden");
    cashflowPanel.innerHTML = "";
    return;
  }

  cashflowPanel.classList.remove("hidden");
  cashflowPanel.innerHTML = `
    <h3>Cashflow Timeline (Optional)</h3>
    <div class="cashflow-grid">
      <div class="kpi"><p class="k">Sales Start Month</p><p class="v">M${cashflow.salesStart}</p></div>
      <div class="kpi"><p class="k">Break-even Month</p><p class="v">${cashflow.breakevenMonth ? `M${cashflow.breakevenMonth}` : "Beyond horizon"}</p></div>
      <div class="kpi"><p class="k">Peak Funding Gap</p><p class="v">Rs ${formatINR(cashflow.peakFundingGap)}</p></div>
      <div class="kpi"><p class="k">Timeline Horizon</p><p class="v">${cashflow.horizon} months</p></div>
    </div>
  `;
}

function evaluateScenarioMetrics(base, saleFactor, costFactor) {
  const salePrice = base.salePrice * saleFactor;
  const constructionCost = base.constructionCost * costFactor;
  const soldSbaArea = base.sbaArea * (base.soldPct / 100);
  const realizedGrossRevenue = soldSbaArea * salePrice;
  const gstAmount = realizedGrossRevenue * (base.gstPct / 100);
  const brokerAmount = realizedGrossRevenue * (base.brokerPct / 100);
  const netRevenue = realizedGrossRevenue - gstAmount - brokerAmount;

  const baseProjectCost = base.landCost + base.stampCost + base.legalCost + constructionCost;
  const architectPct = Math.min(15, Math.max(0, toNumber(base.architectPct, 0)));
  const architectCost = architectPct > 0 ? (baseProjectCost * architectPct) / Math.max(100 - architectPct, 1) : 0;
  const projectBeforeFinance = baseProjectCost + architectCost;
  const financedPrincipal = projectBeforeFinance * (base.loanPct / 100);
  const interestCost = financedPrincipal * (base.interestPct / 100) * (base.durationMonths / 12) * 0.5;
  const effectiveDelayMonths = Math.max(0, toNumber(base.totalDelayMonths, base.delayMonths || 0));
  const delayInterestCost = financedPrincipal * (base.interestPct / 100) * (effectiveDelayMonths / 12) * 0.5;
  const totalCost = projectBeforeFinance + interestCost + delayInterestCost;
  const profit = netRevenue - totalCost;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  return { roi, profit };
}

function heatmapZone(roi) {
  if (roi >= 18) return "safe";
  if (roi >= 10) return "caution";
  return "risky";
}

function renderHeatmap(result) {
  if (!heatmapPanel) return;
  if (!heatmapToggle || !heatmapToggle.checked) {
    heatmapPanel.classList.add("hidden");
    heatmapPanel.innerHTML = "";
    return;
  }

  const saleFactors = [0.9, 0.95, 1, 1.05, 1.1];
  const costFactors = [0.9, 0.95, 1, 1.05, 1.1];

  const head = saleFactors
    .map((f) => `<th>${Math.round(f * 100)}%</th>`)
    .join("");

  const rows = costFactors
    .map((costF) => {
      const cells = saleFactors
        .map((saleF) => {
          const metrics = evaluateScenarioMetrics(result, saleF, costF);
          const zone = heatmapZone(metrics.roi);
          return `<td class="heat-${zone}" title="Profit: ${formatSignedINR(metrics.profit)}">${metrics.roi.toFixed(1)}%</td>`;
        })
        .join("");

      return `<tr><th>${Math.round(costF * 100)}%</th>${cells}</tr>`;
    })
    .join("");

  heatmapPanel.classList.remove("hidden");
  heatmapPanel.innerHTML = `
    <h3>Sensitivity Heatmap (Optional)</h3>
    <p class="muted">Rows: Construction Cost factor, Columns: Sale Price factor, Cell value: ROI.</p>
    <div class="heatmap-legend">
      <span><i class="dot safe"></i> Safe</span>
      <span><i class="dot caution"></i> Caution</span>
      <span><i class="dot risky"></i> Risky</span>
    </div>
    <div class="heatmap-wrap">
      <table class="heatmap-table">
        <thead><tr><th>Cost \\ Price</th>${head}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderRisk(result) {
  const risk = riskMessages(result);
  riskPanel.className = "risk-panel";
  if (risk.level === "safe") riskPanel.classList.add("safe");
  if (risk.level === "risky") riskPanel.classList.add("risky");

  if (risk.warnings.length === 0) {
    riskPanel.innerHTML = "<strong>PROJECT RISKS</strong><br/>No major risk flags in current scenario. This looks balanced for a first-pass feasibility.";
    return;
  }
  riskPanel.innerHTML = `<strong>PROJECT RISKS</strong><br/>${risk.warnings.map((w) => `• ${w}`).join("<br/>")}`;
}

function renderBoq(result) {
  boqBody.innerHTML = "";
  const hasBoqBasis = result.constructionCost > 0 && result.totalConstructedAreaSqFt > 0;

  if (!hasBoqBasis) {
    boqBody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="boq-empty">
            <strong>BOQ unavailable</strong>
            <p>Enter valid geometry and cost basis to generate editable line items, rates, and construction totals.</p>
            <ul>
              <li>Set BUA and SBA loading.</li>
              <li>Provide a valid construction cost basis.</li>
              <li>Re-run analysis to populate BOQ quantities and amounts.</li>
            </ul>
          </div>
        </td>
      </tr>
    `;
    grandTotal.textContent = "N/A";
    return;
  }

  result.lines.forEach((line, idx) => {
    const hasLineBasis = hasBoqBasis && line.qty > 0;
    const rateCell = hasLineBasis
      ? `<input class="rate-edit" data-index="${idx}" type="number" min="1" step="1" value="${Math.round(line.rate)}" />`
      : "N/A";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${line.category}</td>
      <td>${line.item}</td>
      <td>${line.unit}</td>
      <td>${hasLineBasis ? formatINR(line.qty, 2) : "N/A"}</td>
      <td>${rateCell}</td>
      <td class="line-amount">${hasLineBasis ? formatINR(line.amount) : "N/A"}</td>
    `;
    boqBody.appendChild(tr);
  });
  grandTotal.textContent = hasBoqBasis ? `Rs ${formatINR(result.constructionCost)}` : "N/A";
}

function getValidationRows(result) {
  const netFactor = 1 - result.gstPct / 100 - result.brokerPct / 100;
  const hasArea = result.buaSqFt > 0 && result.sbaArea > 0;
  const hasCost = result.totalCost > 0;
  const hasRevenue = result.salePrice > 0 && result.soldPct > 0 && hasArea;
  const hasDebt = result.loanPct > 0 && result.financedPrincipal > 0 && result.interestPct > 0;
  const deductionsValid = netFactor > 0;

  return [
    { name: "Area Basis", ok: hasArea, reason: hasArea ? "BUA and SBA are available." : "Enter BUA and loading to build SBA." },
    { name: "Cost Basis", ok: hasCost, reason: hasCost ? "Total project cost is computed." : "Cost stack incomplete." },
    { name: "Revenue Basis", ok: hasRevenue, reason: hasRevenue ? "Sale price and sold % applied on SBA." : "Need sale price and sold % on valid SBA." },
    { name: "Deductions", ok: deductionsValid, reason: deductionsValid ? "GST + broker are within valid range." : "GST + broker must be under 100%." },
    { name: "Debt Basis", ok: hasDebt, reason: hasDebt ? "Debt inputs are sufficient for loan metrics." : "Loan %, interest, and principal basis missing." },
  ];
}

function renderValidationPanel(result) {
  if (!validationPanel) return;
  const rows = getValidationRows(result);
  const warnings = rows.filter((row) => !row.ok).length;
  validationPanel.classList.remove("hidden");
  validationPanel.innerHTML = `
    <div class="compare-head"><div><h3>Validation Status</h3><p>${warnings ? `${warnings} checks need attention.` : "All major basis checks are valid."}</p></div></div>
    <article class="compare-card">
      ${rows
        .map((row) => {
          const cls = row.ok ? "ok" : "warn";
          const label = row.ok ? "OK" : "Warning";
          return `<div class="compare-value"><span>${row.name}</span><strong><span class="status-chip ${cls}">${label}</span> ${row.reason}</strong></div>`;
        })
        .join("")}
    </article>
  `;
}

function renderTracePanel(result) {
  if (!tracePanel) return;

  const netFactor = result.sbaArea * (1 - result.gstPct / 100 - result.brokerPct / 100);
  const schedule = buildLoanSchedule(result);
  const salesWindowMonths = result.timelineEnabled ? Math.max(1, toNumber(result.salesMonths, 1)) : Math.max(1, toNumber(result.durationMonths, 12));
  const annualDebtService = schedule.monthlyPayment * 12;
  const annualizedNetRevenue = result.netRevenue * (12 / salesWindowMonths);
  const dscr = annualDebtService > 0 ? annualizedNetRevenue / annualDebtService : 0;

  tracePanel.classList.remove("hidden");
  tracePanel.innerHTML = `
    <div class="compare-head"><div><h3>Calculation Trace</h3><p>Key formulas with substituted values for audit.</p></div></div>
    <div class="trace-grid">
      <details class="trace-item">
        <summary>Minimum Sale Price</summary>
        <p>Formula: Total Cost / (SBA x (1 - GST% - Broker%))</p>
        <p>Substitution: ${formatINR(result.totalCost)} / (${formatINR(result.sbaArea)} x ${(1 - result.gstPct / 100 - result.brokerPct / 100).toFixed(4)}) = ${netFactor > 0 ? `Rs ${formatINR(result.breakEvenSalePrice)} / sq ft` : "N/A"}</p>
      </details>
      <details class="trace-item">
        <summary>Profit and ROI</summary>
        <p>Formula: Profit = Net Revenue - Total Cost; ROI = Profit / Total Cost</p>
        <p>Substitution: ${formatINR(result.netRevenue)} - ${formatINR(result.totalCost)} = ${formatSignedINR(result.profit)}; ROI = ${result.roi.toFixed(1)}%</p>
      </details>
      <details class="trace-item">
        <summary>Net Revenue</summary>
        <p>Formula: Realized Gross - GST - Brokerage</p>
        <p>Substitution: ${formatINR(result.realizedGrossRevenue)} - ${formatINR(result.gstAmount)} - ${formatINR(result.brokerAmount)} = Rs ${formatINR(result.netRevenue)}</p>
      </details>
      <details class="trace-item">
        <summary>DSCR</summary>
        <p>Formula: Annualized Net Revenue / Annual Debt Service</p>
        <p>Substitution: ${formatINR(annualizedNetRevenue)} / ${formatINR(annualDebtService)} = ${annualDebtService > 0 ? dscr.toFixed(2) : "N/A"}</p>
      </details>
    </div>
  `;
}

function buildAuditExportText(result) {
  const rows = getValidationRows(result);
  const lines = [
    "OPTIBUILD | VORCO AUDIT EXPORT",
    `Generated: ${formatAhmedabadTime(new Date())}`,
    "",
    "Validation Status:",
    ...rows.map((row) => `- ${row.name}: ${row.ok ? "OK" : "WARNING"} | ${row.reason}`),
    "",
    "Key Metrics:",
    `- Total Cost: Rs ${formatINR(result.totalCost)}`,
    `- Net Revenue: Rs ${formatINR(result.netRevenue)}`,
    `- Profit: ${formatSignedINR(result.profit)}`,
    `- ROI: ${result.roi.toFixed(1)}%`,
    `- Margin: ${result.margin.toFixed(1)}%`,
    `- Break-even Price: Rs ${formatINR(result.breakEvenSalePrice)} / sq ft`,
    `- Risk Score: ${result.riskScore != null ? `${result.riskScore}/100` : "N/A"}`,
  ];
  return lines.join("\n");
}

function buildAuditReportHtml(result, inputData = {}) {
  const validationRows = getValidationRows(result);
  const risks = riskMessages(result).warnings;
  const bankability = calculateBankability(result);
  const cashflow = buildCashflow(result);
  const loan = buildLoanSchedule(result);
  const phaseData = buildPhaseTimeline(result);
  const traceSchedule = buildLoanSchedule(result);
  const generatedAt = formatAhmedabadTime(new Date());
  const auditStatus = validationRows.some((row) => !row.ok) ? "Review" : "Validated";
  const auditSections = "Executive Summary | Input Register | Outputs | Validation | Timeline | Burn | Loan | BOQ | Risk";
  const runStamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const projectName = pickInputValue(inputData, ["projectName", "projectTitle", "siteName", "schemeName"], `${result.bhkType || 0} BHK Development`);
  const projectLocation = pickInputValue(inputData, ["city", "location", "microMarket", "projectLocation"], "Ahmedabad");
  const developerName = pickInputValue(inputData, ["developerName", "clientName", "builderName"], "VORCO");
  const auditScenario = `${String(result.sensitivityCase || inputData?.sensitivityCase || "base").toUpperCase()} / ${String(result.marketPreset || inputData?.marketPreset || "custom").toUpperCase()}`;
  const auditConfidentiality = risks.length <= 1 && auditStatus === "Validated"
    ? "Partner Review"
    : risks.length <= 3
      ? "Controlled Circulation"
      : "Restricted Underwriting";
  const auditRunId = `AUD-${runStamp}-${Math.max(0, result.units || 0)}`;
  const reportVersion = "v2026.04";
  const inputEntries = Object.entries(inputData || {});

  const inputSummary = [
    ["Inputs captured", inputEntries.length],
    ["Output fields", 38],
    ["BOQ lines", result.lines?.length || 0],
    ["Loan months", loan.rows?.length || 0],
    ["Phase rows", phaseData.phases?.length || 0],
  ];

  const outputRows = [
    ["Plot Area", `${formatINR(result.plotSqFt)} sq ft`],
    ["BUA", `${formatINR(result.buaSqFt)} sq ft`],
    ["Basement Area", `${formatINR(result.basementAreaSqFt)} sq ft`],
    ["Total Constructed Area", `${formatINR(result.totalConstructedAreaSqFt)} sq ft`],
    ["SBA", `${formatINR(result.sbaArea)} sq ft`],
    ["Carpet Area", `${formatINR(result.carpetArea)} sq ft`],
    ["Common Area", `${formatINR(result.commonArea)} sq ft`],
    ["Sold SBA Area", `${formatINR(result.soldSbaArea)} sq ft`],
    ["Sale Price", `Rs ${formatINR(result.salePrice)} / sq ft`],
    ["Base Gross Revenue", `Rs ${formatINR(result.baseGrossRevenue)}`],
    ["Total Gross Revenue", `Rs ${formatINR(result.totalGrossRevenue)}`],
    ["Realized Gross Revenue", `Rs ${formatINR(result.realizedGrossRevenue)}`],
    ["GST", `Rs ${formatINR(result.gstAmount)}`],
    ["Brokerage", `Rs ${formatINR(result.brokerAmount)}`],
    ["Net Revenue", `Rs ${formatINR(result.netRevenue)}`],
    ["Land Cost", `Rs ${formatINR(result.landCost)}`],
    ["Stamp Cost", `Rs ${formatINR(result.stampCost)}`],
    ["Legal Cost", `Rs ${formatINR(result.legalCost)}`],
    ["Architect Cost", `Rs ${formatINR(result.architectCost)}`],
    ["Construction Cost", `Rs ${formatINR(result.constructionCost)}`],
    ["Interest Cost", `Rs ${formatINR(result.interestCost)}`],
    ["Delay Carry Cost", `Rs ${formatINR(result.delayInterestCost)}`],
    ["Total Cost", `Rs ${formatINR(result.totalCost)}`],
    ["Project Before Finance", `Rs ${formatINR(result.projectBeforeFinance)}`],
    ["Financed Principal", `Rs ${formatINR(result.financedPrincipal)}`],
    ["Profit", formatSignedINR(result.profit)],
    ["ROI", `${result.roi.toFixed(1)}%`],
    ["Margin", `${result.margin.toFixed(1)}%`],
    ["Break-even Price", `Rs ${formatINR(result.breakEvenSalePrice)} / sq ft`],
    ["Risk Score", result.riskScore != null ? `${result.riskScore}/100` : "N/A"],
    ["DSCR", bankability.dscr.toFixed(2)],
    ["ICR", bankability.icr.toFixed(2)],
    ["Peak Funding Gap", `Rs ${formatINR(cashflow?.peakFundingGap || 0)}`],
    ["Payback Month", bankability.paybackMonths ? `M${bankability.paybackMonths}` : "Beyond horizon"],
  ];

  const formatTableRows = (rows) => rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row[0])}</td>
          <td>${escapeHtml(row[1])}</td>
        </tr>
      `,
    )
    .join("");

  const inputRows = inputEntries.length
    ? inputEntries
        .map(
          ([key, value]) => `
            <tr>
              <td>${escapeHtml(formatAuditKey(key))}</td>
              <td>${escapeHtml(auditValueText(value))}</td>
              <td>${escapeHtml(key)}</td>
            </tr>
          `,
        )
        .join("")
    : `<tr><td colspan="3">No input snapshot available.</td></tr>`;

  const phaseRows = phaseData.phases
    .map(
      (phase) => `
        <tr>
          <td>${escapeHtml(phase.name)}</td>
          <td>M${phase.start}</td>
          <td>M${phase.end}</td>
          <td>${Math.max(1, phase.end - phase.start + 1)} months</td>
          <td>Rs ${formatINR(phase.amount)}</td>
        </tr>
      `,
    )
    .join("");

  const burnRows = phaseData.progress
    .map(
      (row) => `
        <tr>
          <td>M${row.month}</td>
          <td>Rs ${formatINR(row.spent)}</td>
          <td>Rs ${formatINR(row.cumulative)}</td>
          <td>Rs ${formatINR(row.remaining)}</td>
        </tr>
      `,
    )
    .join("");

  const loanRows = loan.rows
    .map(
      (row) => `
        <tr>
          <td>M${row.month}</td>
          <td>Rs ${formatINR(row.loanPayment)}</td>
          <td>Rs ${formatINR(row.interest)}</td>
          <td>Rs ${formatINR(row.principalPaid)}</td>
          <td>Rs ${formatINR(row.closingBalance)}</td>
          <td>${formatSignedINR(row.netCashflow)}</td>
        </tr>
      `,
    )
    .join("");

  const boqRows = result.lines
    .map(
      (line) => `
        <tr>
          <td>${escapeHtml(line.category)}</td>
          <td>${escapeHtml(line.item)}</td>
          <td>${escapeHtml(line.unit)}</td>
          <td>${formatINR(line.qty, 2)}</td>
          <td>Rs ${formatINR(line.rate)}</td>
          <td>Rs ${formatINR(line.amount)}</td>
        </tr>
      `,
    )
    .join("");

  const riskRows = (risks.length ? risks : ["No major risk flags in current scenario."])
    .map((risk) => `<li>${escapeHtml(risk)}</li>`)
    .join("");

  const traceRows = [
    ["Minimum Sale Price", `Total Cost / (SBA x (1 - GST - Broker)) = ${formatINR(result.totalCost)} / (${formatINR(result.sbaArea)} x ${(1 - result.gstPct / 100 - result.brokerPct / 100).toFixed(4)}) = ${result.breakEvenSalePrice > 0 ? `Rs ${formatINR(result.breakEvenSalePrice)} / sq ft` : "N/A"}`],
    ["Profit and ROI", `Profit = ${formatINR(result.netRevenue)} - ${formatINR(result.totalCost)} = ${formatSignedINR(result.profit)}; ROI = ${result.roi.toFixed(1)}%`],
    ["Net Revenue", `Realized Gross - GST - Brokerage = ${formatINR(result.realizedGrossRevenue)} - ${formatINR(result.gstAmount)} - ${formatINR(result.brokerAmount)} = Rs ${formatINR(result.netRevenue)}`],
    ["DSCR", `Annualized Net Revenue / Annual Debt Service = ${formatINR(result.netRevenue * (12 / Math.max(1, result.timelineEnabled ? result.salesMonths : result.durationMonths))) } / ${formatINR(traceSchedule.monthlyPayment * 12)} = ${bankability.dscr.toFixed(2)}`],
  ]
    .map(
      (row) => `
        <details class="audit-trace-item">
          <summary>${escapeHtml(row[0])}</summary>
          <p>${escapeHtml(row[1])}</p>
        </details>
      `,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>OptiBuild | VORCO Audit Export</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Anton&family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;500;600;700;800&display=swap");

    :root {
      --ink: #172536;
      --muted: #5a6f85;
      --line: #d2ddeb;
      --paper: #ffffff;
      --sea: #1f6da5;
      --forest: #1d8b6b;
      --sand: #9b7447;
      --hero-a: #0f1f31;
      --hero-b: #1d4569;
      --hero-c: #2f7fa8;
      --good: #1f7a4a;
      --warn: #9a6716;
      --card-shadow: 0 18px 40px rgba(14, 31, 52, 0.12);
      --radius: 20px;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: "Outfit", Arial, sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at 10% 0%, rgba(47, 127, 168, 0.14) 0%, rgba(47, 127, 168, 0) 35%),
        radial-gradient(circle at 100% 12%, rgba(29, 139, 107, 0.12) 0%, rgba(29, 139, 107, 0) 36%),
        linear-gradient(180deg, #eef5fd 0%, #f8fcff 45%, #ffffff 100%);
    }

    .sheet {
      max-width: 1320px;
      margin: 0 auto;
      padding: 26px;
    }

    .hero {
      position: relative;
      overflow: hidden;
      border-radius: 30px;
      padding: 28px;
      color: #fff;
      background:
        radial-gradient(circle at 88% 18%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 38%),
        linear-gradient(128deg, var(--hero-a) 0%, var(--hero-b) 52%, var(--hero-c) 100%);
      box-shadow: 0 26px 60px rgba(10, 23, 37, 0.24);
    }

    .hero::before {
      content: "";
      position: absolute;
      inset: -1px;
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      pointer-events: none;
    }

    .hero-top {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      flex-wrap: wrap;
      align-items: flex-start;
    }

    .brand {
      margin: 0;
      font-family: "Sora", sans-serif;
      font-size: 32px;
      letter-spacing: 0.13em;
      font-weight: 700;
    }

    .hero-meta {
      text-align: right;
      font-size: 12px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.82);
      padding: 8px 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.09);
      border: 1px solid rgba(255, 255, 255, 0.14);
    }

    .hero h1 {
      margin: 16px 0 10px;
      font-family: "Sora", sans-serif;
      font-size: 36px;
      line-height: 1.04;
      letter-spacing: -0.03em;
      max-width: 28ch;
    }

    .hero p {
      margin: 0;
      max-width: 92ch;
      color: rgba(255, 255, 255, 0.86);
      line-height: 1.62;
      font-size: 14px;
    }

    .hero-strip {
      margin-top: 16px;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 10px;
    }

    .hero-card {
      padding: 12px 14px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.11);
      backdrop-filter: blur(8px);
    }

    .hero-card .k, .tile .k {
      margin: 0;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 700;
    }

    .hero-card .v {
      margin: 6px 0 0;
      font-size: 15px;
      font-weight: 800;
      color: #fff;
    }

    .section {
      margin-top: 18px;
      padding: 20px;
      border-radius: 22px;
      background: linear-gradient(180deg, #ffffff 0%, #fbfeff 100%);
      border: 1px solid var(--line);
      box-shadow: var(--card-shadow);
      position: relative;
      overflow: hidden;
    }

    .section::before {
      content: "";
      position: absolute;
      inset: 0 auto 0 0;
      width: 6px;
      background: linear-gradient(180deg, var(--sea), var(--forest));
      opacity: 0.42;
    }

    .section-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }

    .eyebrow {
      margin: 0 0 6px;
      font-size: 10px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--sand);
      font-weight: 800;
    }

    .section h2 {
      margin: 0;
      font-family: "Sora", sans-serif;
      font-size: 22px;
      letter-spacing: -0.02em;
    }

    .section-note {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.52;
      max-width: 92ch;
    }

    .chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 5px 11px;
      font-size: 11px;
      font-weight: 700;
      background: #fff;
      color: #3e556e;
    }

    .chip.ok {
      border-color: #b7dcc7;
      background: #edf8f1;
      color: var(--good);
    }

    .chip.warn {
      border-color: #f2d6ab;
      background: #fff5e6;
      color: var(--warn);
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }

    .tile {
      border: 1px solid var(--line);
      border-radius: 16px;
      background: linear-gradient(180deg, #ffffff 0%, #f8fcff 100%);
      padding: 13px 14px;
      box-shadow: 0 10px 24px rgba(16, 31, 51, 0.08);
    }

    .tile .v {
      color: var(--ink);
      font-size: 15px;
      margin: 6px 0 0;
      font-weight: 800;
    }

    .tile p:last-child {
      margin: 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.46;
    }

    .table-wrap {
      overflow: auto;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: #fff;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 760px;
    }

    thead th {
      background: linear-gradient(180deg, #edf4fc 0%, #f7fbff 100%);
      color: #50657b;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.11em;
      position: sticky;
      top: 0;
      z-index: 2;
    }

    th, td {
      padding: 10px 11px;
      border-bottom: 1px solid var(--line);
      text-align: left;
      font-size: 12px;
      vertical-align: top;
    }

    tbody tr:nth-child(even) { background: #f9fcff; }
    tbody tr:hover { background: #ecf4fb; }

    .input-table td:nth-child(2), .output-table td:nth-child(2), .input-table td:nth-child(3) {
      font-weight: 700;
    }

    .mini-note {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 11px;
    }

    .risk-list {
      margin: 0;
      padding-left: 18px;
      color: var(--ink);
    }

    .risk-list li {
      margin: 0.32rem 0;
      line-height: 1.45;
    }

    .audit-trace-grid {
      display: grid;
      gap: 10px;
    }

    .audit-trace-item {
      border: 1px solid var(--line);
      border-radius: 14px;
      background: linear-gradient(180deg, #ffffff 0%, #f4faff 100%);
      padding: 11px 12px;
    }

    .audit-trace-item summary {
      cursor: pointer;
      font-weight: 800;
      color: var(--sea);
      font-size: 13px;
      list-style: none;
    }

    .audit-trace-item summary::-webkit-details-marker {
      display: none;
    }

    .audit-trace-item p {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.52;
    }

    .footer {
      margin: 18px 0 0;
      color: #607589;
      text-align: center;
      font-size: 11px;
      border-top: 1px solid #dfe8f2;
      padding-top: 11px;
    }

    .cover {
      min-height: 88vh;
      border-radius: 28px;
      padding: 34px;
      color: #fff;
      background:
        radial-gradient(circle at 85% 16%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 40%),
        linear-gradient(132deg, #0f1f31 0%, #1a4467 55%, #2e7ea8 100%);
      box-shadow: 0 26px 56px rgba(11, 24, 40, 0.24);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      break-after: page;
      position: relative;
      overflow: hidden;
    }

    .cover::before {
      content: "";
      position: absolute;
      inset: -1px;
      border-radius: 28px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      pointer-events: none;
    }

    .cover-kicker {
      margin: 0;
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.72);
      font-weight: 700;
    }

    .cover h1 {
      margin: 10px 0 0;
      font-family: "Sora", sans-serif;
      font-size: 52px;
      line-height: 0.98;
      letter-spacing: -0.03em;
      max-width: 14ch;
    }

    .cover p {
      margin: 0;
      max-width: 66ch;
      line-height: 1.6;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.86);
    }

    .cover-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 18px;
    }

    .cover-tile {
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.1);
      padding: 10px 12px;
    }

    .cover-tile p {
      margin: 0;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.78);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .cover-tile strong {
      display: block;
      margin-top: 6px;
      font-size: 17px;
      letter-spacing: -0.01em;
      color: #fff;
    }

    .executive-page {
      margin-top: 18px;
      border-radius: 24px;
      border: 1px solid var(--line);
      background: linear-gradient(180deg, #ffffff 0%, #f6fbff 100%);
      box-shadow: var(--card-shadow);
      padding: 22px;
      page-break-after: always;
      break-after: page;
    }

    .executive-grid {
      margin-top: 12px;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
    }

    .executive-tile {
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 11px;
      background: #fff;
    }

    .executive-tile p {
      margin: 0;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
    }

    .executive-tile strong {
      display: block;
      margin-top: 6px;
      font-size: 17px;
      letter-spacing: -0.01em;
    }

    .section h2::before {
      content: "OPTIBUILD | VORCO";
      display: block;
      margin-bottom: 7px;
      color: var(--sea);
      font-size: 10px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 800;
      border-bottom: 1px solid #dce7f2;
      padding-bottom: 6px;
    }

    /* VORCO warm editorial theme override */
    :root {
      --ink: #1a1a1a;
      --muted: #5f5952;
      --line: #d8cec3;
      --paper: #fbf6f1;
      --sea: #c0392b;
      --forest: #3f3933;
      --sand: #8f6d49;
      --hero-a: #141414;
      --hero-b: #2a2320;
      --hero-c: #c0392b;
      --good: #1e6a43;
      --warn: #9a6a10;
      --card-shadow: 0 16px 34px rgba(36, 28, 22, 0.12);
      --radius: 20px;
    }

    body {
      font-family: "Syne", Arial, sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at 10% 0%, rgba(192, 57, 43, 0.1) 0%, rgba(192, 57, 43, 0) 35%),
        radial-gradient(circle at 100% 12%, rgba(143, 109, 73, 0.08) 0%, rgba(143, 109, 73, 0) 36%),
        linear-gradient(180deg, #f5efe9 0%, #f2ede8 100%);
    }

    .hero,
    .cover {
      background:
        radial-gradient(circle at 88% 18%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 38%),
        linear-gradient(128deg, var(--hero-a) 0%, var(--hero-b) 55%, var(--hero-c) 100%);
    }

    .brand {
      font-family: "Anton", sans-serif;
      letter-spacing: 0.09em;
      font-size: 33px;
    }

    .hero h1,
    .cover h1,
    .section h2,
    .executive-page h2 {
      font-family: "DM Serif Display", serif;
      letter-spacing: 0;
    }

    .section,
    .tile,
    .executive-page,
    .executive-tile,
    .audit-trace-item,
    .table-wrap {
      border-color: var(--line);
      background: linear-gradient(180deg, #fdf9f4 0%, var(--paper) 100%);
      box-shadow: var(--card-shadow);
    }

    .section::before {
      background: linear-gradient(180deg, #1f1f1f, var(--sea));
      opacity: 0.5;
    }

    .eyebrow,
    .section h2::before,
    .audit-trace-item summary {
      color: var(--sea);
    }

    .chip {
      background: #fbf2ea;
      color: #463a31;
      border-color: #d8c7b8;
    }

    .chip.ok {
      background: #e9f4ec;
      border-color: #b5d7c2;
      color: var(--good);
    }

    .chip.warn {
      background: #fdf1db;
      border-color: #e8cfad;
      color: var(--warn);
    }

    thead th {
      background: linear-gradient(180deg, #efe3d7 0%, #f7efe7 100%);
      color: #5c4a3b;
    }

    tbody tr:nth-child(even) { background: #f8efe7; }
    tbody tr:hover { background: #f2e4d9; }

    .footer {
      color: #6b5f54;
      border-top-color: #d8cec3;
    }

    .print-header,
    .print-footer {
      display: none;
    }

    .print-footer .page-count::after {
      content: "Page " counter(page) " of " counter(pages);
    }

    @media (max-width: 980px) {
      .hero-strip, .grid-3, .grid-4, .executive-grid, .cover-grid {
        grid-template-columns: 1fr;
      }

      .hero-meta {
        text-align: left;
      }

      .hero h1 {
        font-size: 30px;
      }
    }

    @media print {
      body {
        background: #fff;
      }

      .sheet {
        max-width: none;
        width: 100%;
        padding: 0 0 70px;
      }

      .hero, .section, .hero-card, .tile, .audit-trace-item {
        box-shadow: none;
      }

      .cover {
        min-height: 100vh;
        border-radius: 0;
      }

      .executive-page {
        box-shadow: none;
      }

      .hero {
        border-radius: 14px;
        break-after: avoid;
      }

      .section {
        break-inside: avoid;
      }

      .table-wrap {
        break-inside: auto;
      }

      thead th {
        position: static;
      }

      .print-header,
      .print-footer {
        display: flex;
        position: fixed;
        left: 0;
        right: 0;
        z-index: 999;
        font-size: 10px;
        color: #486178;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(3px);
      }

      .print-header {
        top: 0;
        justify-content: space-between;
        padding: 8px 14px;
        border-bottom: 1px solid #dce7f2;
      }

      .print-footer {
        bottom: 0;
        justify-content: space-between;
        padding: 8px 14px;
        border-top: 1px solid #dce7f2;
      }
    }
  </style>
</head>
<body>
  <div class="print-header">
    <span>OPTIBUILD | VORCO AUDIT EXPORT</span>
    <span>${auditSections}</span>
  </div>
  <div class="print-footer">
    <span>Generated ${generatedAt}</span>
    <span class="page-count"></span>
  </div>
  <div class="sheet">
    <section class="cover">
      <div>
        <p class="cover-kicker">Audit-Facing Export</p>
        <p class="brand">OPTIBUILD | VORCO</p>
        <h1>Development Feasibility Audit Pack</h1>
        <p>This package is designed for technical review, lender due diligence, and partner verification. It preserves source inputs, all derived outputs, trace math, debt tables, and line-level BOQ history in one print-ready document.</p>
      </div>
      <div>
        <div class="cover-grid">
          <article class="cover-tile"><p>Project</p><strong>${escapeHtml(projectName)}</strong></article>
          <article class="cover-tile"><p>Location</p><strong>${escapeHtml(projectLocation)}</strong></article>
          <article class="cover-tile"><p>Developer / Client</p><strong>${escapeHtml(developerName)}</strong></article>
          <article class="cover-tile"><p>Scenario Stamp</p><strong>${escapeHtml(auditScenario)}</strong></article>
          <article class="cover-tile"><p>Confidentiality</p><strong>${escapeHtml(auditConfidentiality)}</strong></article>
          <article class="cover-tile"><p>Version / Run ID</p><strong>${reportVersion} | ${auditRunId}</strong></article>
          <article class="cover-tile"><p>Generated</p><strong>${generatedAt}</strong></article>
          <article class="cover-tile"><p>Model Status</p><strong>${auditStatus}</strong></article>
          <article class="cover-tile"><p>Risk Flags</p><strong>${risks.length}</strong></article>
        </div>
      </div>
    </section>

    <section class="executive-page">
      <div class="section-head">
        <div>
          <p class="eyebrow">Executive one-page summary</p>
          <h2>Audit readiness snapshot</h2>
          <p class="section-note">A single-page summary for quick review before diving into detailed tables and trace sections.</p>
        </div>
      </div>
      <div class="executive-grid">
        <article class="executive-tile"><p>Total Cost</p><strong>Rs ${formatINR(result.totalCost)}</strong></article>
        <article class="executive-tile"><p>Net Revenue</p><strong>Rs ${formatINR(result.netRevenue)}</strong></article>
        <article class="executive-tile"><p>Profit</p><strong>${formatSignedINR(result.profit)}</strong></article>
        <article class="executive-tile"><p>ROI</p><strong>${result.roi.toFixed(1)}%</strong></article>
        <article class="executive-tile"><p>Break-even</p><strong>Rs ${formatINR(result.breakEvenSalePrice)} / sq ft</strong></article>
        <article class="executive-tile"><p>DSCR / ICR</p><strong>${bankability.dscr.toFixed(2)} / ${bankability.icr.toFixed(2)}</strong></article>
        <article class="executive-tile"><p>Peak Funding Gap</p><strong>Rs ${formatINR(cashflow?.peakFundingGap || 0)}</strong></article>
        <article class="executive-tile"><p>Sections</p><strong>9 review chapters</strong></article>
      </div>
    </section>

    <header class="hero">
      <div class="hero-top">
        <div>
          <p class="brand">OPTIBUILD | VORCO</p>
          <p>Full audit export with every captured input, every calculated output, trace substitutions, phase allocation, BOQ detail, and lending checks.</p>
        </div>
        <div class="hero-meta">
          <div>Generated: ${generatedAt}</div>
          <div>Report Type: Full audit pack</div>
          <div>Model Status: ${auditStatus}</div>
        </div>
      </div>

      <h1>Everything from input to output, preserved for review and PDF saving.</h1>
      <p>This audit pack is intentionally exhaustive: raw inputs, derived outputs, month-by-month flow, BOQ line items, validation, and formula trace are all shown in one printable view.</p>

      <div class="hero-strip">
        ${inputSummary
          .map(
            ([label, value]) => `
              <article class="hero-card tile">
                <p class="k">${escapeHtml(label)}</p>
                <p class="v">${escapeHtml(value)}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </header>

    <section class="section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Raw input register</p>
          <h2>Every captured form value</h2>
          <p class="section-note">This table lists the exact input snapshot used for the calculation, in the same order captured from the form.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table class="input-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
              <th>Key</th>
            </tr>
          </thead>
          <tbody>
            ${inputRows}
          </tbody>
        </table>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Calculated outputs</p>
          <h2>All major derived results</h2>
          <p class="section-note">This section keeps the full decision trail visible, from geometry through finance to profitability.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table class="output-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            ${formatTableRows(outputRows)}
          </tbody>
        </table>
      </div>
      <div class="badge-row">
        <span class="chip ${bankability.dscr >= 1.3 ? "ok" : "warn"}">DSCR ${bankability.dscr.toFixed(2)}</span>
        <span class="chip ${bankability.icr >= 1.5 ? "ok" : "warn"}">ICR ${bankability.icr.toFixed(2)}</span>
        <span class="chip ${risks.length === 0 ? "ok" : "warn"}">${risks.length} risk flags</span>
        <span class="chip">Projection horizon ${loan.horizon} months</span>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Validation and trace</p>
          <h2>Formula checks and substituted values</h2>
          <p class="section-note">Each trace block shows how the final numbers were derived so the audit can be checked line by line.</p>
        </div>
      </div>
      <div class="audit-trace-grid">
        ${traceRows}
      </div>
      <div class="badge-row">
        ${validationRows
          .map(
            (row) => `<span class="chip ${row.ok ? "ok" : "warn"}">${escapeHtml(row.name)}: ${row.ok ? "OK" : "Warning"}</span>`,
          )
          .join("")}
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Phase timeline</p>
          <h2>Construction and funding chronology</h2>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Phase</th>
              <th>Start</th>
              <th>End</th>
              <th>Duration</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${phaseRows}
          </tbody>
        </table>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Monthly burn</p>
          <h2>Cash deployment and remaining ledger</h2>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Monthly Spend</th>
              <th>Cumulative Spend</th>
              <th>Remaining Cost</th>
            </tr>
          </thead>
          <tbody>
            ${burnRows}
          </tbody>
        </table>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Loan schedule</p>
          <h2>Debt service by month</h2>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Payment</th>
              <th>Interest</th>
              <th>Principal</th>
              <th>Closing Balance</th>
              <th>Net Cashflow</th>
            </tr>
          </thead>
          <tbody>
            ${loanRows}
          </tbody>
        </table>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <p class="eyebrow">BOQ detail</p>
          <h2>Line item cost register</h2>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Item</th>
              <th>Unit</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${boqRows}
          </tbody>
        </table>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Risk review</p>
          <h2>Risks and mitigations captured by the model</h2>
        </div>
      </div>
      <ul class="risk-list">
        ${riskRows}
      </ul>
    </section>

    <p class="footer">OptiBuild | VORCO audit export generated from live calculator inputs. Save this view as PDF from the browser print dialog after review.</p>
  </div>
</body>
</html>`;
}

function renderAll(result) {
  renderValidationPanel(result);
  renderTracePanel(result);
  renderRiskScore(result);
  renderGuardrails(result);
  renderPricing(result);
  renderStressPanel(result, lastStressResult);
  renderBankability(result);
  renderWorkingCapital(result);
  renderVisualInsights(result);
  renderTrendPanel(result);
  renderDelayImpact(result);
  renderTaxFeePanel(result);
  renderMixPlan(result);
  renderCompare();
  renderSummary(result);
  renderSplitBar(result);
  renderWaterfall(result);
  renderScenarios(result);
  renderPhasePanel(result);
  renderLoanSchedule(result);
  renderCashflow(result);
  renderHeatmap(result);
  renderICMemo(result);
  renderRisk(result);
  renderBoq(result);
}

function calculateFromForm() {
  const data = applyOptionalTuning(collectData());
  currentInputData = cloneResultSnapshot(data);
  if (salePriceValue) {
    salePriceValue.textContent = `Rs ${formatINR(data.salePrice)} / sq ft`;
  }
  currentResult = calculate(data);
  renderAll(currentResult);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculateFromForm();
});

form.addEventListener("input", (event) => {
  if (event.target.id === "salePrice") {
    salePriceValue.textContent = `Rs ${formatINR(event.target.value)} / sq ft`;
  }
  if (event.target.name && event.target.name.startsWith("mix") && mixPlannerToggle?.checked) {
    calculateFromForm();
  }
});

if (smartToggle && smartTools) {
  smartToggle.addEventListener("change", () => {
    smartTools.classList.toggle("hidden", !smartToggle.checked);
    calculateFromForm();
  });
}

if (mixPlannerToggle && mixPlannerTools) {
  mixPlannerToggle.addEventListener("change", () => {
    mixPlannerTools.classList.toggle("hidden", !mixPlannerToggle.checked);
    calculateFromForm();
  });
}

if (timelineToggle) {
  timelineToggle.addEventListener("change", () => {
    if (timelineTools) timelineTools.classList.toggle("hidden", !timelineToggle.checked);
    calculateFromForm();
  });
}

if (heatmapToggle) {
  heatmapToggle.addEventListener("change", () => {
    calculateFromForm();
  });
}

function getSavedScenarios() {
  try {
    return JSON.parse(localStorage.getItem(scenarioStorageKey) || "[]");
  } catch {
    return [];
  }
}

function saveScenarioLibrary(items) {
  localStorage.setItem(scenarioStorageKey, JSON.stringify(items));
}

function refreshScenarioSelect() {
  if (!savedScenarioSelect) return;
  const scenarios = getSavedScenarios();
  const previousValue = savedScenarioSelect.value;
  const hasScenarios = scenarios.length > 0;

  if (applySavedScenarioBtn) applySavedScenarioBtn.disabled = !hasScenarios;
  if (renameSavedScenarioBtn) renameSavedScenarioBtn.disabled = !hasScenarios;

  savedScenarioSelect.innerHTML = scenarios.length
    ? scenarios.map((s, i) => `<option value="${i}">${s.name}</option>`).join("")
    : '<option value="">No saved scenarios</option>';

  if (!scenarios.length) return;
  const parsed = Number(previousValue);
  if (Number.isFinite(parsed) && parsed >= 0 && parsed < scenarios.length) {
    savedScenarioSelect.value = String(parsed);
  }
}

stressBtn?.addEventListener("click", () => {
  if (!currentResult) return;
  lastStressResult = buildStressCase(currentResult);
  renderStressPanel(currentResult, lastStressResult);
});

saveScenarioBtn?.addEventListener("click", () => {
  if (!currentResult) return;
  const scenarios = getSavedScenarios();
  scenarios.push({
    name: `Scenario ${new Date().toLocaleString("en-IN")}`,
    inputs: collectData(),
  });
  saveScenarioLibrary(scenarios.slice(-20));
  refreshScenarioSelect();
});

applySavedScenarioBtn?.addEventListener("click", () => {
  const scenarios = getSavedScenarios();
  const idx = Number(savedScenarioSelect?.value);
  const selected = scenarios[idx];
  if (!selected) return;
  Object.entries(selected.inputs || {}).forEach(([name, value]) => {
    const field = form.elements.namedItem(name);
    if (field) field.value = String(value);
  });
  calculateFromForm();
});

renameSavedScenarioBtn?.addEventListener("click", () => {
  const scenarios = getSavedScenarios();
  const idx = Number(savedScenarioSelect?.value);
  const selected = scenarios[idx];
  if (!selected) return;

  const proposed = window.prompt("Enter new scenario name", selected.name || "");
  if (proposed === null) return;
  const cleanName = proposed.trim();
  if (!cleanName) return;

  selected.name = cleanName;
  saveScenarioLibrary(scenarios);
  refreshScenarioSelect();
  savedScenarioSelect.value = String(idx);
});

icMemoBtn?.addEventListener("click", async () => {
  if (!currentResult) return;
  const memo = buildICMemo(currentResult);
  try {
    await navigator.clipboard.writeText(memo);
    icMemoBtn.textContent = "IC Memo Copied";
    setTimeout(() => {
      icMemoBtn.textContent = "IC Memo";
    }, 1200);
  } catch {
    icMemoBtn.textContent = "Copy Failed";
    setTimeout(() => {
      icMemoBtn.textContent = "IC Memo";
    }, 1200);
  }
});

loanViewMode?.addEventListener("change", () => {
  showDetailedLoan = loanViewMode.value === "detailed";
  if (currentResult) renderLoanSchedule(currentResult);
});

saveCompareLeftBtn?.addEventListener("click", () => {
  if (!currentResult) return;
  compareLeft = {
    label: "Scenario A",
    ...cloneResultSnapshot(currentResult),
  };
  renderCompare();
});

saveCompareRightBtn?.addEventListener("click", () => {
  if (!currentResult) return;
  compareRight = {
    label: "Scenario B",
    ...cloneResultSnapshot(currentResult),
  };
  renderCompare();
});

clearCompareBtn?.addEventListener("click", () => {
  compareLeft = null;
  compareRight = null;
  renderCompare();
});

function syncSmartLabels() {
  if (quickSaleFactorValue && quickSaleFactor) {
    quickSaleFactorValue.textContent = `${quickSaleFactor.value}%`;
  }
  if (quickSoldAdjValue && quickSoldAdj) {
    const soldVal = Number(quickSoldAdj.value || 0);
    quickSoldAdjValue.textContent = `${soldVal >= 0 ? "+" : ""}${soldVal}%`;
  }
  if (quickEscalationAdjValue && quickEscalationAdj) {
    const escVal = Number(quickEscalationAdj.value || 0);
    quickEscalationAdjValue.textContent = `${escVal >= 0 ? "+" : ""}${escVal}%`;
  }
}

function applyMarketPreset(presetKey) {
  const preset = marketPresetAssumptions[presetKey];
  if (!preset) return;

  Object.entries(preset).forEach(([name, value]) => {
    const field = form.elements.namedItem(name);
    if (field) field.value = String(value);
  });

  const customRateField = form.elements.namedItem("customRate");
  if (customRateField) customRateField.value = "0";

  const sensitivityField = form.elements.namedItem("sensitivityCase");
  if (sensitivityField) sensitivityField.value = "base";
}

[quickSaleFactor, quickSoldAdj, quickEscalationAdj].forEach((input) => {
  input?.addEventListener("input", () => {
    syncSmartLabels();
    if (smartToggle?.checked) calculateFromForm();
  });
});

["salesCurve", "costCurve", "moratoriumMonths", "prepaymentPct", "approvalDelayMonths", "executionDelayMonths", "salesDelayMonths", "viewPremiumPct", "sensitivityCase", "rateBase", "rateOptimistic", "rateStressed", "steelEscalationBasePct", "steelEscalationOptimisticPct", "steelEscalationStressedPct", "cementEscalationPct", "laborEscalationBasePct", "laborEscalationOptimisticPct", "laborEscalationStressedPct", "mepEscalationPct", "basementCostFactor"].forEach((name) => {
  const field = form.elements.namedItem(name);
  field?.addEventListener("input", () => calculateFromForm());
  field?.addEventListener("change", () => calculateFromForm());
});

marketPreset?.addEventListener("change", () => {
  const selected = marketPreset.value;
  if (selected !== "custom") {
    applyMarketPreset(selected);
  }
  calculateFromForm();
});

const presetValues = {
  conservative: { soldPct: 70, escalationPct: 8, loanPct: 50, loadingPct: 28, carpetRatio: 80 },
  balanced: { soldPct: 85, escalationPct: 5, loanPct: 60, loadingPct: 30, carpetRatio: 78 },
  aggressive: { soldPct: 95, escalationPct: 3, loanPct: 70, loadingPct: 35, carpetRatio: 75 },
};

presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const preset = presetValues[btn.dataset.preset];
    if (!preset) return;

    Object.entries(preset).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (field) field.value = String(value);
    });

    calculateFromForm();
  });
});

boqBody.addEventListener("input", (event) => {
  if (!event.target.classList.contains("rate-edit") || !currentResult) return;
  const idx = Number(event.target.dataset.index);
  const newRate = Number(event.target.value || 0);
  if (newRate <= 0) return;

  const line = currentResult.lines[idx];
  line.rate = newRate;
  line.amount = line.unit === "ls" ? newRate : newRate * line.qty;

  currentResult.constructionCost = currentResult.lines.reduce((sum, l) => sum + l.amount, 0);
  recomputeFinancials(currentResult);
  renderSummary(currentResult);
  renderSplitBar(currentResult);
  renderWaterfall(currentResult);
  renderScenarios(currentResult);
  renderPhasePanel(currentResult);
  renderCashflow(currentResult);
  renderHeatmap(currentResult);
  renderRisk(currentResult);

  const amountCell = event.target.closest("tr").querySelector(".line-amount");
  amountCell.textContent = formatINR(line.amount);
  grandTotal.textContent = `Rs ${formatINR(currentResult.constructionCost)}`;
});

unitButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    unitButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeUnit = btn.dataset.unit;

    const label = activeUnit === "sqft" ? "sq ft" : activeUnit === "sqm" ? "sq m" : "sq yd";
    plotUnit.textContent = label;
    buaUnit.textContent = label;
    calculateFromForm();
  });
});

function buildInvestorReportHtml(result) {
  const inputData = currentInputData || {};
  const risks = riskMessages(result).warnings;
  const bankability = calculateBankability(result);
  const cashflow = buildCashflow(result);
  const loan = buildLoanSchedule(result);
  const phaseData = buildPhaseTimeline(result);
  const conservative = scenarioResult(result, 0.85);
  const base = scenarioResult(result, 1);
  const optimistic = scenarioResult(result, 1.15);
  const totalCostBase = Math.max(result.totalCost, 1);
  const landShare = (result.landCost / totalCostBase) * 100;
  const constructionShare = (result.constructionCost / totalCostBase) * 100;
  const financeShare = Math.max(0, 100 - landShare - constructionShare);

  const riskCount = risks.length;
  const riskLabel = riskCount === 0 ? "Clean" : riskCount === 1 ? "Watch" : "Review";
  const recommendation = result.roi >= 18 ? "Proceed" : result.roi >= 10 ? "Proceed with Conditions" : "Rework Before Proceeding";
  const roiTone = result.roi >= 18 ? "good" : result.roi >= 10 ? "mid" : "bad";
  const monthlyDelayCarry = result.effectiveDelayMonths > 0
    ? result.delayInterestCost / result.effectiveDelayMonths
    : 0;
  const planningImpact = Math.max(0, toNumber(result.delayMonths, 0)) * monthlyDelayCarry;
  const approvalImpact = result.approvalDelayMonths * monthlyDelayCarry;
  const executionImpact = result.executionDelayMonths * monthlyDelayCarry;
  const salesImpact = result.salesDelayMonths * monthlyDelayCarry * 0.5;
  const phaseSpendTotal = phaseData.progress.reduce((sum, row) => sum + row.spent, 0);
  const reconciliationGap = result.totalCost - phaseSpendTotal;
  const reconciliationAbs = Math.abs(reconciliationGap);
  const reconciliationStatus = reconciliationAbs <= 2 ? "Matched" : "Review";
  const phaseTop = [...phaseData.phases]
    .sort((left, right) => right.amount - left.amount)
    .slice(0, 4)
    .map((phase) => ({
      ...phase,
      share: result.totalCost > 0 ? (phase.amount / result.totalCost) * 100 : 0,
    }));
  const maxMonthlySpend = Math.max(1, ...phaseData.progress.map((row) => row.spent));
  const generatedAt = formatAhmedabadTime(new Date());
  const investorSections = "Executive | Returns | Funding | Timeline | Scenarios | Risk | BOQ";
  const guardrails = getGuardrailWarnings(result);
  const lenderView = bankability.dscr >= 1.3 && bankability.icr >= 1.5 ? "Comfortable" : bankability.dscr >= 1.1 ? "Watch" : "Tight";
  const liquidityView = (cashflow?.peakFundingGap || 0) <= result.totalCost * 0.2
    ? "Controlled"
    : (cashflow?.peakFundingGap || 0) <= result.totalCost * 0.35
      ? "Manageable"
      : "Stretched";
  const riskPlaybook = (risks.length ? risks : guardrails)
    .slice(0, 6)
    .map((warning) => {
      const lower = warning.toLowerCase();
      let action = "Tighten launch assumptions and re-run downside scenario.";
      let impact = "Improves underwriting confidence and reduces execution surprises.";

      if (lower.includes("break-even") || lower.includes("roi")) {
        action = "Raise realization, trim hard cost line items, or phase launch in tranches.";
        impact = "Moves margin and ROI back into lender-acceptable range.";
      } else if (lower.includes("debt") || lower.includes("loan") || lower.includes("dscr")) {
        action = "Reduce leverage by 5-10 points and increase equity buffer for early phases.";
        impact = "Strengthens DSCR and lowers refinancing pressure.";
      } else if (lower.includes("parking") || lower.includes("density")) {
        action = "Rebalance unit mix and parking plan before final approvals.";
        impact = "Improves absorption pace and market acceptance.";
      } else if (lower.includes("sold") || lower.includes("absorption")) {
        action = "Extend sales window and model a slower ramp-up with conservative pricing.";
        impact = "Reduces short-term cash stress and improves forecast credibility.";
      }

      return { warning, action, impact };
    });
  const debtBridgeRows = loan.rows
    .filter((row) => row.loanPayment > 0 || row.salesInflow > 0 || row.constructionOutflow > 0)
    .slice(0, 12);
  const viabilityScore = Math.max(
    0,
    Math.min(100, Math.round(result.roi * 2 + bankability.dscr * 18 + bankability.icr * 8 - risks.length * 6)),
  );
  const executionPressurePct = Math.min(100, Math.max(0, phaseTop[0]?.share || 0));
  const capitalIntensityPct = Math.min(100, Math.max(0, constructionShare + financeShare));
  const breakEvenGap = result.salePrice - result.breakEvenSalePrice;
  const breakEvenSpreadPct = result.breakEvenSalePrice > 0 ? (breakEvenGap / result.breakEvenSalePrice) * 100 : 0;
  const costPerSbaSqFt = result.sbaArea > 0 ? result.totalCost / result.sbaArea : 0;
  const netRevenuePerSbaSqFt = result.sbaArea > 0 ? result.netRevenue / result.sbaArea : 0;
  const profitPerSbaSqFt = result.sbaArea > 0 ? result.profit / result.sbaArea : 0;
  const costPerUnit = result.units > 0 ? result.totalCost / result.units : 0;
  const netRevenuePerUnit = result.units > 0 ? result.netRevenue / result.units : 0;
  const profitPerUnit = result.units > 0 ? result.profit / result.units : 0;
  const grossToNetRatio = result.totalGrossRevenue > 0 ? (result.netRevenue / result.totalGrossRevenue) * 100 : 0;
  const equityPct = Math.max(0, 100 - result.loanPct);
  const runStamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const projectName = pickInputValue(inputData, ["projectName", "projectTitle", "siteName", "schemeName"], `${result.bhkType || 0} BHK | ${result.units || 0} Units`);
  const projectLocation = pickInputValue(inputData, ["city", "location", "microMarket", "projectLocation"], "Ahmedabad");
  const developerName = pickInputValue(inputData, ["developerName", "clientName", "builderName"], "VORCO");
  const investorScenario = `${String(result.sensitivityCase || inputData?.sensitivityCase || "base").toUpperCase()} / ${String(result.marketPreset || inputData?.marketPreset || "custom").toUpperCase()}`;
  const investorConfidentiality = riskCount <= 1 && result.roi >= 15
    ? "Investor Shareable"
    : riskCount <= 3
      ? "Internal Review"
      : "Restricted Draft";
  const investorRunId = `INV-${runStamp}-${Math.round(result.salePrice || 0)}`;
  const reportVersion = "v2026.04";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>OptiBuild | VORCO Investor Report</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Anton&family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;500;600;700;800&display=swap");

    :root {
      --ink: #1d252f;
      --muted: #66798f;
      --line: #d6e0ea;
      --faint: #f1f6fb;
      --sea: #2c77ad;
      --mint: #2f9270;
      --amber: #9c6f2a;
      --good: #1f7a4a;
      --mid: #8f631b;
      --bad: #a63c2f;
      --radius: 18px;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: "Outfit", Arial, sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at 0% 0%, rgba(53, 128, 177, 0.14) 0%, rgba(53, 128, 177, 0) 36%),
        radial-gradient(circle at 100% 8%, rgba(47, 146, 112, 0.13) 0%, rgba(47, 146, 112, 0) 38%),
        linear-gradient(180deg, #eef4fb 0%, #f8fcff 42%, #ffffff 100%);
    }

    .report {
      max-width: 1280px;
      margin: 0 auto;
      padding: 24px;
    }

    .hero {
      position: relative;
      overflow: hidden;
      border-radius: 28px;
      padding: 26px;
      color: #fff;
      background:
        radial-gradient(circle at 88% 14%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 40%),
        linear-gradient(126deg, #102133 0%, #214764 48%, #3580b1 100%);
      box-shadow: 0 26px 56px rgba(13, 28, 44, 0.22);
    }

    .hero::before {
      content: "";
      position: absolute;
      inset: -1px;
      border-radius: 28px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      pointer-events: none;
    }

    .hero-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      flex-wrap: wrap;
    }

    .brand {
      margin: 0;
      font-family: "Sora", sans-serif;
      letter-spacing: 0.13em;
      font-size: 31px;
      line-height: 1;
      font-weight: 700;
    }

    .hero-meta {
      text-align: right;
      color: rgba(255, 255, 255, 0.84);
      font-size: 12px;
      line-height: 1.56;
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 12px;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.08);
    }

    .hero h1 {
      margin: 14px 0 8px;
      font-family: "Sora", sans-serif;
      font-size: 35px;
      line-height: 1.05;
      letter-spacing: -0.03em;
      max-width: 28ch;
    }

    .hero p {
      margin: 0;
      color: rgba(255, 255, 255, 0.86);
      max-width: 90ch;
      line-height: 1.6;
      font-size: 14px;
    }

    .hero-insights {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 15px;
    }

    .insight-card {
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.1);
      padding: 12px 14px;
      backdrop-filter: blur(10px);
    }

    .eyebrow {
      margin: 0 0 6px;
      color: var(--amber);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-weight: 800;
    }

    .insight-card .eyebrow {
      color: rgba(255, 255, 255, 0.7);
    }

    .insight-card h3 {
      margin: 0;
      font-size: 16px;
      line-height: 1.3;
      letter-spacing: -0.02em;
    }

    .insight-card p {
      margin: 6px 0 0;
      color: rgba(255, 255, 255, 0.8);
      font-size: 12px;
      line-height: 1.45;
    }

    .insight-stat {
      margin-top: 10px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.14);
      font-size: 12px;
      font-weight: 700;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .hero-status {
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.14);
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 12px;
    }

    .hero-kpis {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 10px;
      margin-top: 14px;
    }

    .hero-card, .block {
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: rgba(255, 255, 255, 0.94);
      box-shadow: 0 14px 30px rgba(23, 37, 56, 0.08);
    }

    .hero-card {
      padding: 12px 14px;
      background: rgba(255, 255, 255, 0.11);
      border-color: rgba(255, 255, 255, 0.17);
    }

    .hero-card .k {
      color: rgba(255, 255, 255, 0.75);
    }

    .hero-card .v {
      color: #fff;
      font-size: 16px;
    }

    .k {
      margin: 0;
      color: var(--muted);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
    }

    .v {
      margin: 5px 0 0;
      font-weight: 800;
      font-size: 15px;
      line-height: 1.2;
    }

    .section-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .block {
      padding: 17px;
      background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
      position: relative;
      overflow: hidden;
    }

    .block::before {
      content: "";
      position: absolute;
      inset: 0 auto 0 0;
      width: 5px;
      background: linear-gradient(180deg, var(--sea), var(--mint));
      opacity: 0.36;
    }

    .status-row {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 10px;
    }

    .status-tile {
      border: 1px solid var(--line);
      border-radius: 12px;
      background: #fff;
      padding: 10px;
    }

    .status-tile .v.good { color: var(--good); }
    .status-tile .v.mid { color: var(--mid); }
    .status-tile .v.bad { color: var(--bad); }

    .block h2 {
      margin: 0 0 10px;
      font-family: "Sora", sans-serif;
      font-size: 19px;
      letter-spacing: -0.02em;
    }

    .block h3 {
      margin: 0 0 8px;
      font-size: 15px;
      letter-spacing: -0.01em;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 9px;
    }

    .metric, .scenario-card {
      border: 1px solid var(--line);
      border-radius: 12px;
      background: linear-gradient(180deg, #ffffff 0%, #f8fcff 100%);
      padding: 10px;
    }

    .mini-bar-wrap {
      display: grid;
      gap: 8px;
    }

    .mini-row {
      display: grid;
      grid-template-columns: 120px 1fr 62px;
      align-items: center;
      gap: 10px;
      font-size: 13px;
    }

    .mini-track {
      height: 10px;
      border-radius: 999px;
      overflow: hidden;
      background: #e8eff6;
    }

    .mini-fill { height: 100%; }
    .mini-land { background: var(--sea); }
    .mini-construction { background: var(--mint); }
    .mini-finance { background: var(--amber); }

    .allocation-note {
      margin: 0 0 10px;
      color: var(--muted);
      font-size: 12px;
    }

    .table-wrap {
      overflow: auto;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: #fff;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 620px;
    }

    thead th {
      background: linear-gradient(180deg, #edf4fc 0%, #f8fcff 100%);
      color: #54697f;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.11em;
    }

    th, td {
      border-bottom: 1px solid var(--line);
      padding: 9px 10px;
      text-align: left;
      font-size: 12px;
      vertical-align: top;
    }

    tbody tr:nth-child(even) {
      background: #f8fcff;
    }

    tbody tr:hover {
      background: #ebf4fb;
    }

    .report-band {
      margin-top: 14px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .summary-block {
      margin-top: 16px;
    }

    .section-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .section-head h2 {
      margin: 0;
    }

    .section-note {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.5;
      max-width: 78ch;
    }

    .highlight-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }

    .highlight-card {
      border: 1px solid var(--line);
      border-radius: 16px;
      background: linear-gradient(180deg, #ffffff 0%, #f8fcff 100%);
      padding: 14px;
      box-shadow: 0 8px 20px rgba(23, 37, 56, 0.05);
    }

    .highlight-card strong {
      display: block;
      margin-top: 8px;
      font-size: 18px;
      letter-spacing: -0.02em;
    }

    .highlight-card p {
      margin: 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.5;
    }

    .tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .band-card {
      border: 1px solid var(--line);
      border-radius: 14px;
      background: linear-gradient(180deg, #ffffff 0%, #f5fbff 100%);
      padding: 13px;
      box-shadow: 0 12px 24px rgba(23, 37, 56, 0.07);
    }

    .band-card h3 {
      margin: 0;
      font-family: "Sora", sans-serif;
      font-size: 15px;
      letter-spacing: -0.01em;
    }

    .band-card p {
      margin: 6px 0 0;
      font-size: 12px;
      color: var(--muted);
      line-height: 1.45;
    }

    .meter {
      margin-top: 8px;
      height: 9px;
      border-radius: 999px;
      background: #e6eef7;
      overflow: hidden;
    }

    .meter > span {
      display: block;
      height: 100%;
      background: linear-gradient(90deg, var(--sea) 0%, var(--mint) 100%);
    }

    .summary-rows {
      display: grid;
      gap: 6px;
    }

    .summary-line {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 10px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: #fff;
      font-size: 12px;
    }

    .summary-line span:first-child {
      color: var(--muted);
    }

    .scenario-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
    }

    .scenario-card h3 {
      margin: 0 0 8px;
      font-size: 14px;
    }

    .scenario-card.good { border-left: 4px solid #2f7f4f; }
    .scenario-card.mid { border-left: 4px solid #b4871f; }
    .scenario-card.strong { border-left: 4px solid #4f4a46; }

    .risk-box {
      border: 1px solid var(--line);
      border-radius: 12px;
      background: #fffbf6;
      padding: 12px;
    }

    .audit-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .audit-card {
      border: 1px solid var(--line);
      border-radius: 12px;
      background: #fff;
      padding: 10px;
    }

    .audit-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 12px;
      padding: 6px 0;
      border-bottom: 1px dashed #dce6f0;
    }

    .audit-row:last-child {
      border-bottom: 0;
    }

    .exec-strip {
      margin-top: 14px;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
    }

    .exec-tile {
      border: 1px solid var(--line);
      border-radius: 12px;
      background: #fff;
      padding: 10px;
    }

    .exec-tile .k {
      margin: 0;
      color: var(--muted);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .exec-tile .v {
      margin: 6px 0 0;
      font-size: 15px;
      font-weight: 800;
    }

    .v.good { color: var(--good); }
    .v.mid { color: var(--mid); }
    .v.bad { color: var(--bad); }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      border: 1px solid var(--line);
      background: #fff;
      color: #4f6378;
    }

    .chip.ok,
    .chip.good {
      border-color: #b7dcc7;
      background: #edf8f1;
      color: #1f7a4a;
    }

    .chip.mid,
    .chip.warn {
      border-color: #f2d6ab;
      background: #fff5e6;
      color: #9b6a08;
    }

    .chip.bad {
      border-color: #efc3be;
      background: #fff0ee;
      color: #a33a2f;
    }

    .focus-list {
      display: grid;
      gap: 8px;
    }

    .focus-item {
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 10px;
      background: #fff;
    }

    .focus-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .focus-bar {
      height: 8px;
      border-radius: 999px;
      background: #e8eef5;
      overflow: hidden;
    }

    .focus-bar > span {
      display: block;
      height: 100%;
      background: linear-gradient(90deg, var(--sea) 0%, var(--mint) 100%);
    }

    .burn-table-wrap {
      overflow: auto;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: #fff;
    }

    .burn-table {
      min-width: 700px;
    }

    .burn-track {
      width: 140px;
      height: 8px;
      border-radius: 999px;
      background: #e8eef6;
      overflow: hidden;
    }

    .burn-fill {
      display: block;
      height: 100%;
      background: #9c6f2a;
    }

    .playbook-table {
      min-width: 860px;
    }

    .playbook-table td:nth-child(1) {
      font-weight: 700;
      width: 26%;
    }

    .playbook-table td:nth-child(2) {
      width: 36%;
    }

    .playbook-table td:nth-child(3) {
      width: 38%;
      color: #3f4f61;
    }

    .risk-box ul {
      margin: 8px 0 0 18px;
      padding: 0;
    }

    .footer {
      margin: 16px 2px 0;
      color: var(--muted);
      font-size: 11px;
      text-align: center;
      border-top: 1px solid #dce6f0;
      padding-top: 10px;
    }

    .cover {
      min-height: 88vh;
      border-radius: 28px;
      padding: 34px;
      color: #fff;
      background:
        radial-gradient(circle at 88% 15%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 42%),
        linear-gradient(132deg, #102133 0%, #214764 52%, #3580b1 100%);
      box-shadow: 0 26px 56px rgba(13, 28, 44, 0.24);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
    }

    .cover::before {
      content: "";
      position: absolute;
      inset: -1px;
      border-radius: 28px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      pointer-events: none;
    }

    .cover-kicker {
      margin: 0;
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.74);
      font-weight: 700;
    }

    .cover h1 {
      margin: 10px 0 0;
      font-family: "Sora", sans-serif;
      font-size: 52px;
      line-height: 0.98;
      letter-spacing: -0.03em;
      max-width: 14ch;
    }

    .cover p {
      margin: 0;
      max-width: 66ch;
      line-height: 1.6;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.86);
    }

    .cover-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 18px;
    }

    .cover-tile {
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.1);
      padding: 10px 12px;
    }

    .cover-tile p {
      margin: 0;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.78);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .cover-tile strong {
      display: block;
      margin-top: 6px;
      font-size: 17px;
      letter-spacing: -0.01em;
      color: #fff;
    }

    .executive-page {
      margin-top: 18px;
      border-radius: 24px;
      border: 1px solid var(--line);
      background: linear-gradient(180deg, #ffffff 0%, #f6fbff 100%);
      box-shadow: 0 14px 30px rgba(23, 37, 56, 0.08);
      padding: 22px;
      page-break-after: always;
      break-after: page;
    }

    .executive-grid {
      margin-top: 12px;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
    }

    .executive-tile {
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 11px;
      background: #fff;
    }

    .executive-tile p {
      margin: 0;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
    }

    .executive-tile strong {
      display: block;
      margin-top: 6px;
      font-size: 17px;
      letter-spacing: -0.01em;
    }

    .block h2::before {
      content: "OPTIBUILD | VORCO";
      display: block;
      margin-bottom: 7px;
      color: var(--sea);
      font-size: 10px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 800;
      border-bottom: 1px solid #dce6f0;
      padding-bottom: 6px;
    }

    /* VORCO warm editorial theme override */
    :root {
      --ink: #1a1a1a;
      --muted: #5f5952;
      --line: #d8cec3;
      --faint: #fbf6f1;
      --sea: #c0392b;
      --mint: #3f3933;
      --amber: #8f6d49;
      --good: #1e6a43;
      --mid: #9a6a10;
      --bad: #9f3932;
    }

    body {
      font-family: "Syne", Arial, sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at 0% 0%, rgba(192, 57, 43, 0.1) 0%, rgba(192, 57, 43, 0) 36%),
        radial-gradient(circle at 100% 8%, rgba(143, 109, 73, 0.08) 0%, rgba(143, 109, 73, 0) 38%),
        linear-gradient(180deg, #f5efe9 0%, #f2ede8 100%);
    }

    .hero,
    .cover {
      background:
        radial-gradient(circle at 88% 14%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 40%),
        linear-gradient(126deg, #141414 0%, #2a2320 50%, #c0392b 100%);
    }

    .brand {
      font-family: "Anton", sans-serif;
      letter-spacing: 0.09em;
      font-size: 32px;
    }

    .hero h1,
    .cover h1,
    .block h2,
    .executive-page h2 {
      font-family: "DM Serif Display", serif;
      letter-spacing: 0;
    }

    .block,
    .metric,
    .scenario-card,
    .risk-box,
    .executive-page,
    .executive-tile,
    .table-wrap,
    .mini-row,
    .highlight,
    .audit-trace-item {
      border-color: var(--line);
      background: linear-gradient(180deg, #fdf9f4 0%, #fbf6f1 100%);
      box-shadow: 0 14px 30px rgba(34, 27, 21, 0.1);
    }

    .eyebrow,
    .block h2::before,
    .kpi-label,
    .tag {
      color: var(--sea);
    }

    .chip,
    .pill,
    .status-pill {
      background: #fbf2ea;
      border-color: #d8c7b8;
      color: #4a3c31;
    }

    thead th {
      background: linear-gradient(180deg, #efe3d7 0%, #f7efe7 100%);
      color: #5c4a3b;
    }

    tbody tr:nth-child(even) { background: #f8efe7; }

    .print-header,
    .print-footer {
      display: none;
    }

    .print-footer .page-count::after {
      content: "Page " counter(page) " of " counter(pages);
    }

    @media (max-width: 920px) {
      .hero-kpis, .grid, .scenario-grid, .section-grid, .status-row, .hero-insights, .highlight-grid, .executive-grid, .cover-grid {
        grid-template-columns: 1fr;
      }

      .report-band {
        grid-template-columns: 1fr;
      }

      .exec-strip {
        grid-template-columns: 1fr;
      }

      .hero-meta {
        text-align: left;
      }

      .mini-row {
        grid-template-columns: 96px 1fr 54px;
      }

      .audit-grid {
        grid-template-columns: 1fr;
      }

      .hero h1 {
        font-size: 30px;
      }
    }

    @media print {
      body {
        background: #fff;
      }

      .report {
        max-width: none;
        width: 100%;
        padding: 0 0 70px;
      }

      .hero, .block, .metric, .scenario-card, .risk-box {
        box-shadow: none;
      }

      .cover {
        min-height: 100vh;
        border-radius: 0;
      }

      .executive-page {
        box-shadow: none;
      }

      .hero {
        break-after: avoid;
        border-radius: 14px;
      }

      .section-grid {
        break-inside: avoid;
      }

      .print-header,
      .print-footer {
        display: flex;
        position: fixed;
        left: 0;
        right: 0;
        z-index: 999;
        font-size: 10px;
        color: #486178;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(3px);
      }

      .print-header {
        top: 0;
        justify-content: space-between;
        padding: 8px 14px;
        border-bottom: 1px solid #dce6f0;
      }

      .print-footer {
        bottom: 0;
        justify-content: space-between;
        padding: 8px 14px;
        border-top: 1px solid #dce6f0;
      }
    }
  </style>
</head>
<body>
  <div class="print-header">
    <span>OPTIBUILD | VORCO INVESTOR REPORT</span>
    <span>${investorSections}</span>
  </div>
  <div class="print-footer">
    <span>Generated ${generatedAt}</span>
    <span class="page-count"></span>
  </div>
  <div class="report">
    <section class="cover">
      <div>
        <p class="cover-kicker">Investor-Facing Export</p>
        <p class="brand">OPTIBUILD | VORCO</p>
        <h1>Investment Memorandum Snapshot</h1>
        <p>This pack is tailored for investor and partner decision rooms. It opens with thesis-level metrics and then expands into economics, risk posture, debt behavior, and execution readiness with print-ready structure.</p>
      </div>
      <div>
        <div class="cover-grid">
          <article class="cover-tile"><p>Project</p><strong>${escapeHtml(projectName)}</strong></article>
          <article class="cover-tile"><p>Location</p><strong>${escapeHtml(projectLocation)}</strong></article>
          <article class="cover-tile"><p>Developer / Client</p><strong>${escapeHtml(developerName)}</strong></article>
          <article class="cover-tile"><p>Scenario Stamp</p><strong>${escapeHtml(investorScenario)}</strong></article>
          <article class="cover-tile"><p>Confidentiality</p><strong>${escapeHtml(investorConfidentiality)}</strong></article>
          <article class="cover-tile"><p>Version / Run ID</p><strong>${reportVersion} | ${investorRunId}</strong></article>
          <article class="cover-tile"><p>Recommendation</p><strong>${recommendation}</strong></article>
          <article class="cover-tile"><p>ROI / Margin</p><strong>${result.roi.toFixed(1)}% / ${result.margin.toFixed(1)}%</strong></article>
          <article class="cover-tile"><p>Risk Posture</p><strong>${riskLabel}</strong></article>
        </div>
      </div>
    </section>

    <section class="executive-page">
      <div class="section-head">
        <div>
          <p class="eyebrow">Executive one-page summary</p>
          <h2>Investment decision snapshot</h2>
          <p class="section-note">Single-page overview before full underwriting detail: return quality, debt comfort, pricing spread, and liquidity signal.</p>
        </div>
      </div>
      <div class="executive-grid">
        <article class="executive-tile"><p>Profit</p><strong>${formatSignedINR(result.profit)}</strong></article>
        <article class="executive-tile"><p>ROI</p><strong>${result.roi.toFixed(1)}%</strong></article>
        <article class="executive-tile"><p>Margin</p><strong>${result.margin.toFixed(1)}%</strong></article>
        <article class="executive-tile"><p>Break-even Spread</p><strong>${breakEvenSpreadPct.toFixed(1)}%</strong></article>
        <article class="executive-tile"><p>DSCR / ICR</p><strong>${bankability.dscr.toFixed(2)} / ${bankability.icr.toFixed(2)}</strong></article>
        <article class="executive-tile"><p>Peak Funding Gap</p><strong>Rs ${formatINR(cashflow?.peakFundingGap || 0)}</strong></article>
        <article class="executive-tile"><p>Lender View</p><strong>${lenderView}</strong></article>
        <article class="executive-tile"><p>Liquidity View</p><strong>${liquidityView}</strong></article>
      </div>
    </section>

    <header class="hero">
      <div class="hero-top">
        <div>
          <p class="brand">OPTIBUILD | VORCO</p>
          <p>Comprehensive investor report with project assumptions, full financial stack, debt behavior, phasing, and execution risk details.</p>
        </div>
        <div class="hero-meta">
          <div>Generated: ${generatedAt}</div>
          <div>Scenario: Live inputs</div>
          <div>Risk status: ${riskLabel}</div>
        </div>
      </div>

      <h1>Investment snapshot, underwriting thesis, and execution detail in one view.</h1>
      <p>This report blends assumptions, costs, revenues, financing, delay sensitivity, phase spend, BOQ detail, and downside checks so the decision sits in one readable pack.</p>
      <div class="hero-status"><strong>Recommendation:</strong> ${recommendation}</div>

      <div class="hero-insights">
        <article class="insight-card">
          <p class="eyebrow">Underwriting view</p>
          <h3>${lenderView} debt profile with ${riskLabel.toLowerCase()} risk posture</h3>
          <p>${bankability.dscr.toFixed(2)} DSCR, ${bankability.icr.toFixed(2)} ICR, and ${cashflow?.peakFundingGap ? `peak funding gap of Rs ${formatINR(cashflow.peakFundingGap)}` : "no funding gap signal available"}.</p>
          <div class="insight-stat">${liquidityView} liquidity</div>
        </article>
        <article class="insight-card">
          <p class="eyebrow">Value capture</p>
          <h3>${formatSignedINR(result.profit)} profit on ${result.margin.toFixed(1)}% margin</h3>
          <p>Cost per SBA sq ft is Rs ${formatINR(costPerSbaSqFt)} and net realization per SBA sq ft is Rs ${formatINR(netRevenuePerSbaSqFt)}.</p>
          <div class="insight-stat">Rs ${formatINR(profitPerSbaSqFt)} profit / sq ft</div>
        </article>
        <article class="insight-card">
          <p class="eyebrow">Pricing cushion</p>
          <h3>${breakEvenSpreadPct.toFixed(1)}% above break-even</h3>
          <p>Sale price sits at Rs ${formatINR(result.salePrice)} / sq ft against a break-even of Rs ${formatINR(result.breakEvenSalePrice)} / sq ft.</p>
          <div class="insight-stat">Rs ${formatINR(breakEvenGap)} / sq ft spread</div>
        </article>
      </div>

      <div class="hero-kpis">
        <article class="hero-card"><p class="k">Profit</p><p class="v">${formatSignedINR(result.profit)}</p></article>
        <article class="hero-card"><p class="k">ROI</p><p class="v">${result.roi.toFixed(1)}%</p></article>
        <article class="hero-card"><p class="k">Margin</p><p class="v">${result.margin.toFixed(1)}%</p></article>
        <article class="hero-card"><p class="k">Break-even Price</p><p class="v">Rs ${formatINR(result.breakEvenSalePrice)}</p></article>
        <article class="hero-card"><p class="k">Peak Funding Gap</p><p class="v">Rs ${formatINR(cashflow?.peakFundingGap || 0)}</p></article>
      </div>

      <div class="tag-row">
        <span class="chip ${roiTone}">${recommendation}</span>
        <span class="chip ${riskCount === 0 ? "ok" : "warn"}">${riskCount} risk flags</span>
        <span class="chip">Equity ${equityPct.toFixed(1)}%</span>
        <span class="chip">Net/Gross ${grossToNetRatio.toFixed(1)}%</span>
        <span class="chip">Profit / unit Rs ${formatINR(profitPerUnit)}</span>
      </div>

      <div class="exec-strip">
        <article class="exec-tile"><p class="k">Lender View</p><p class="v ${lenderView === "Comfortable" ? "good" : lenderView === "Watch" ? "mid" : "bad"}">${lenderView}</p></article>
        <article class="exec-tile"><p class="k">Liquidity</p><p class="v ${liquidityView === "Controlled" ? "good" : liquidityView === "Manageable" ? "mid" : "bad"}">${liquidityView}</p></article>
        <article class="exec-tile"><p class="k">Key Flags</p><p class="v ${risks.length <= 1 ? "good" : risks.length <= 3 ? "mid" : "bad"}">${risks.length}</p></article>
        <article class="exec-tile"><p class="k">Guardrails Triggered</p><p class="v ${guardrails.length === 0 ? "good" : "mid"}">${guardrails.length}</p></article>
      </div>
    </header>

    <section class="block summary-block">
      <div class="section-head">
        <div>
          <p class="eyebrow">Executive summary</p>
          <h2>What the model is saying right now</h2>
          <p class="section-note">This strip translates the core model into decision language: return, debt comfort, pricing cushion, and execution pressure.</p>
        </div>
        <span class="chip ${riskCount === 0 ? "ok" : "warn"}">${riskLabel} / ${lenderView}</span>
      </div>
      <div class="highlight-grid">
        <article class="highlight-card">
          <p class="eyebrow">Return profile</p>
          <strong>${formatSignedINR(result.profit)}</strong>
          <p>Profit on the current case with a ${result.margin.toFixed(1)}% margin and ${result.roi.toFixed(1)}% ROI.</p>
        </article>
        <article class="highlight-card">
          <p class="eyebrow">Debt profile</p>
          <strong>DSCR ${bankability.dscr.toFixed(2)}</strong>
          <p>${bankability.icr.toFixed(2)} ICR, ${bankability.paybackMonths ? `payback by month ${bankability.paybackMonths}` : "no payback within the modeled horizon"}, and ${liquidityView.toLowerCase()} liquidity.</p>
        </article>
        <article class="highlight-card">
          <p class="eyebrow">Execution profile</p>
          <strong>${executionPressurePct.toFixed(1)}% concentrated</strong>
          <p>Top phase concentration is ${phaseTop[0]?.name || "not available"}, so procurement discipline matters most there.</p>
        </article>
      </div>
    </section>

    <section class="report-band">
      <article class="band-card">
        <h3>Investment Readiness Score: ${viabilityScore}/100</h3>
        <p>Composite signal derived from return, debt health, and current risk flag count.</p>
        <div class="meter"><span style="width:${viabilityScore}%"></span></div>
      </article>
      <article class="band-card">
        <h3>Capital Intensity: ${capitalIntensityPct.toFixed(1)}%</h3>
        <p>Share of total project cost concentrated in construction plus finance burden.</p>
        <div class="meter"><span style="width:${capitalIntensityPct.toFixed(1)}%"></span></div>
      </article>
      <article class="band-card">
        <h3>Execution Pressure: ${executionPressurePct.toFixed(1)}%</h3>
        <p>Top phase concentration signal; high values need tighter procurement governance.</p>
        <div class="meter"><span style="width:${executionPressurePct.toFixed(1)}%"></span></div>
      </article>
    </section>

    <div class="section-grid">
      <section class="block">
        <h2>Credit and Return Health</h2>
        <div class="status-row">
          <article class="status-tile"><p class="k">ROI Quality</p><p class="v ${roiTone}">${result.roi.toFixed(1)}%</p></article>
          <article class="status-tile"><p class="k">DSCR</p><p class="v">${bankability.dscr.toFixed(2)}</p></article>
          <article class="status-tile"><p class="k">Interest Coverage</p><p class="v">${bankability.icr.toFixed(2)}</p></article>
          <article class="status-tile"><p class="k">Payback</p><p class="v">${bankability.paybackMonths ? `M${bankability.paybackMonths}` : "N/A"}</p></article>
        </div>
        <div class="summary-rows">
          <div class="summary-line"><span>Chosen Sale Price</span><strong>Rs ${formatINR(result.salePrice)} / sq ft</strong></div>
          <div class="summary-line"><span>Margin Safety Buffer</span><strong>${bankability.safetyBufferPct.toFixed(1)}%</strong></div>
          <div class="summary-line"><span>Risk Score</span><strong>${result.riskScore != null ? `${result.riskScore}/100` : "N/A"}</strong></div>
          <div class="summary-line"><span>Sale Price vs Break-even</span><strong>${breakEvenSpreadPct.toFixed(1)}%</strong></div>
        </div>
      </section>

      <section class="block">
        <h2>Project Configuration Inputs</h2>
        <div class="summary-rows">
          <div class="summary-line"><span>Floors / Basements</span><strong>${result.floors} / ${result.basements}</strong></div>
          <div class="summary-line"><span>Flats per Floor</span><strong>${result.flatsPerFloor}</strong></div>
          <div class="summary-line"><span>Total Units / Lifts</span><strong>${result.units} / ${result.lifts}</strong></div>
          <div class="summary-line"><span>Parking Slots</span><strong>${result.parkingSlots}</strong></div>
          <div class="summary-line"><span>BHK Type</span><strong>${result.bhkType} BHK</strong></div>
          <div class="summary-line"><span>Loading (Input -> Effective) / Carpet Ratio</span><strong>${result.loadingPct.toFixed(1)}% -> ${result.effectiveLoadingPct.toFixed(1)}% / ${result.carpetRatioPct.toFixed(1)}%</strong></div>
          <div class="summary-line"><span>Loan / Interest / Tenure</span><strong>${result.loanPct.toFixed(1)}% / ${result.interestPct.toFixed(2)}% / ${result.durationMonths} months</strong></div>
          <div class="summary-line"><span>Moratorium / Prepayment</span><strong>${result.moratoriumMonths} months / ${result.prepaymentPct.toFixed(1)}%</strong></div>
          <div class="summary-line"><span>Equity Share / Sales %</span><strong>${equityPct.toFixed(1)}% / ${result.soldPct.toFixed(1)}%</strong></div>
        </div>
      </section>
    </div>

    <div class="section-grid">
      <section class="block">
        <h2>Area and Sellability Stack</h2>
        <div class="grid">
          <article class="metric"><p class="k">Plot Area</p><p class="v">${formatINR(result.plotSqFt)} sq ft</p></article>
          <article class="metric"><p class="k">BUA</p><p class="v">${formatINR(result.buaSqFt)} sq ft</p></article>
          <article class="metric"><p class="k">Basement Area</p><p class="v">${formatINR(result.basementAreaSqFt)} sq ft</p></article>
          <article class="metric"><p class="k">Total Constructed</p><p class="v">${formatINR(result.totalConstructedAreaSqFt)} sq ft</p></article>
          <article class="metric"><p class="k">SBA</p><p class="v">${formatINR(result.sbaArea)} sq ft</p></article>
          <article class="metric"><p class="k">Carpet Area</p><p class="v">${formatINR(result.carpetArea)} sq ft</p></article>
          <article class="metric"><p class="k">Common Area</p><p class="v">${formatINR(result.commonArea)} sq ft</p></article>
          <article class="metric"><p class="k">Sold SBA Area</p><p class="v">${formatINR(result.soldSbaArea)} sq ft</p></article>
          <article class="metric"><p class="k">SBA vs BUA</p><p class="v">${result.sbaVsBuaPct.toFixed(1)}%</p></article>
          <article class="metric"><p class="k">Loading Effective</p><p class="v">${result.effectiveLoadingPct.toFixed(1)}%</p></article>
          <article class="metric"><p class="k">Carpet vs BUA</p><p class="v">${result.carpetVsBuaPct.toFixed(1)}%</p></article>
          <article class="metric"><p class="k">Sold %</p><p class="v">${result.soldPct.toFixed(1)}%</p></article>
        </div>
        <div class="summary-rows" style="margin-top:10px;">
          <div class="summary-line"><span>Cost / Unit</span><strong>Rs ${formatINR(costPerUnit)}</strong></div>
          <div class="summary-line"><span>Cost / SBA sq ft</span><strong>Rs ${formatINR(costPerSbaSqFt)}</strong></div>
          <div class="summary-line"><span>Net Revenue / SBA sq ft</span><strong>Rs ${formatINR(netRevenuePerSbaSqFt)}</strong></div>
          <div class="summary-line"><span>Profit / SBA sq ft</span><strong>${formatSignedINR(profitPerSbaSqFt)}</strong></div>
          <div class="summary-line"><span>Net Revenue / Unit</span><strong>Rs ${formatINR(netRevenuePerUnit)}</strong></div>
        </div>
      </section>

      <section class="block">
        <h2>Revenue Waterfall Summary</h2>
        <div class="summary-rows">
          <div class="summary-line"><span>Base Gross Revenue</span><strong>Rs ${formatINR(result.baseGrossRevenue)}</strong></div>
          <div class="summary-line"><span>Total Gross Revenue</span><strong>Rs ${formatINR(result.totalGrossRevenue)}</strong></div>
          <div class="summary-line"><span>Mix Revenue Impact</span><strong>${formatSignedINR(result.mixRevenueDelta)} (${result.mixRevenueImpactPct.toFixed(1)}%)</strong></div>
          <div class="summary-line"><span>Realized Gross (Sold %)</span><strong>Rs ${formatINR(result.realizedGrossRevenue)}</strong></div>
          <div class="summary-line"><span>GST</span><strong>Rs ${formatINR(result.gstAmount)}</strong></div>
          <div class="summary-line"><span>Brokerage</span><strong>Rs ${formatINR(result.brokerAmount)}</strong></div>
          <div class="summary-line"><span>Net Revenue</span><strong>Rs ${formatINR(result.netRevenue)}</strong></div>
        </div>
      </section>
    </div>

    <div class="section-grid">
      <section class="block">
        <h2>Cost Stack and Allocation</h2>
        <p class="allocation-note">Distribution of capital deployment across land, construction and finance/other burden. Shares are normalized to 100%.</p>
        <div class="mini-bar-wrap">
          <div class="mini-row">
            <span>Land</span>
            <div class="mini-track"><div class="mini-fill mini-land" style="width:${landShare.toFixed(1)}%"></div></div>
            <strong>${landShare.toFixed(1)}%</strong>
          </div>
          <div class="mini-row">
            <span>Construction</span>
            <div class="mini-track"><div class="mini-fill mini-construction" style="width:${constructionShare.toFixed(1)}%"></div></div>
            <strong>${constructionShare.toFixed(1)}%</strong>
          </div>
          <div class="mini-row">
            <span>Finance + Other</span>
            <div class="mini-track"><div class="mini-fill mini-finance" style="width:${financeShare.toFixed(1)}%"></div></div>
            <strong>${financeShare.toFixed(1)}%</strong>
          </div>
        </div>
        <div class="summary-rows" style="margin-top:8px;">
          <div class="summary-line"><span>Land Cost</span><strong>Rs ${formatINR(result.landCost)}</strong></div>
          <div class="summary-line"><span>Stamp + Legal</span><strong>Rs ${formatINR(result.stampCost + result.legalCost)}</strong></div>
          <div class="summary-line"><span>Construction</span><strong>Rs ${formatINR(result.constructionCost)}</strong></div>
          <div class="summary-line"><span>Architect Cost</span><strong>Rs ${formatINR(result.architectCost)}</strong></div>
          <div class="summary-line"><span>Interest Cost</span><strong>Rs ${formatINR(result.interestCost)}</strong></div>
          <div class="summary-line"><span>Delay Carry</span><strong>Rs ${formatINR(result.delayInterestCost)}</strong></div>
          <div class="summary-line"><span>Total Cost</span><strong>Rs ${formatINR(result.totalCost)}</strong></div>
        </div>
      </section>

      <section class="block">
        <h2>Financing and Loan Behavior</h2>
        <div class="summary-rows">
          <div class="summary-line"><span>Project Before Finance</span><strong>Rs ${formatINR(result.projectBeforeFinance)}</strong></div>
          <div class="summary-line"><span>Financed Principal</span><strong>Rs ${formatINR(result.financedPrincipal)}</strong></div>
          <div class="summary-line"><span>Monthly EMI</span><strong>Rs ${formatINR(loan.monthlyPayment)}</strong></div>
          <div class="summary-line"><span>Total Loan Principal Repaid</span><strong>Rs ${formatINR(loan.totalPrincipal)}</strong></div>
          <div class="summary-line"><span>Total Loan Interest</span><strong>Rs ${formatINR(loan.totalInterest)}</strong></div>
          <div class="summary-line"><span>Loan Break-even Month</span><strong>${loan.breakevenMonth ? `M${loan.breakevenMonth}` : "Beyond horizon"}</strong></div>
          <div class="summary-line"><span>Loan Active Through</span><strong>${loan.lastActiveMonth ? `M${loan.lastActiveMonth}` : "N/A"}</strong></div>
          <div class="summary-line"><span>Loan Horizon Used</span><strong>${loan.horizon} months</strong></div>
        </div>
      </section>
    </div>

    <div class="section-grid">
      <section class="block">
        <h2>Delay and Timeline Effects</h2>
        <div class="summary-rows">
          <div class="summary-line"><span>Planning Delay Months</span><strong>${result.delayMonths}</strong></div>
          <div class="summary-line"><span>Approval Delay Months</span><strong>${result.approvalDelayMonths}</strong></div>
          <div class="summary-line"><span>Execution Delay Months</span><strong>${result.executionDelayMonths}</strong></div>
          <div class="summary-line"><span>Sales Delay Months</span><strong>${result.salesDelayMonths}</strong></div>
          <div class="summary-line"><span>Effective Delay Months (Costing)</span><strong>${result.effectiveDelayMonths}</strong></div>
          <div class="summary-line"><span>Planning Delay Cost</span><strong>Rs ${formatINR(planningImpact)}</strong></div>
          <div class="summary-line"><span>Approval Delay Cost</span><strong>Rs ${formatINR(approvalImpact)}</strong></div>
          <div class="summary-line"><span>Execution Delay Cost</span><strong>Rs ${formatINR(executionImpact)}</strong></div>
          <div class="summary-line"><span>Sales Delay Effect</span><strong>Rs ${formatINR(salesImpact)}</strong></div>
          <div class="summary-line"><span>Total Delay Carry</span><strong>Rs ${formatINR(result.delayInterestCost)}</strong></div>
        </div>
      </section>

      <section class="block">
        <h2>Liquidity, Phasing and Breakeven</h2>
        <div class="summary-rows">
          <div class="summary-line"><span>Cashflow Peak Funding Gap</span><strong>Rs ${formatINR(cashflow?.peakFundingGap || 0)}</strong></div>
          <div class="summary-line"><span>Peak Gap Month</span><strong>${cashflow?.peakGapMonth ? `M${cashflow.peakGapMonth}` : "N/A"}</strong></div>
          <div class="summary-line"><span>Cashflow Break-even Month</span><strong>${cashflow?.breakevenMonth ? `M${cashflow.breakevenMonth}` : "Beyond horizon"}</strong></div>
          <div class="summary-line"><span>Cashflow Horizon</span><strong>${cashflow?.horizon || 0} months</strong></div>
          <div class="summary-line"><span>Sales Start Month</span><strong>${cashflow?.salesStart ? `M${cashflow.salesStart}` : "N/A"}</strong></div>
          <div class="summary-line"><span>Sales Curve</span><strong>${result.salesCurve}</strong></div>
          <div class="summary-line"><span>Cost Curve</span><strong>${result.costCurve}</strong></div>
        </div>
      </section>
    </div>

    <section class="block">
      <h2>Debt and Cashflow Bridge (First 12 Active Months)</h2>
      <p class="allocation-note">Quick lender-friendly bridge of inflow, outflow, debt service, and net monthly position.</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Sales Inflow</th>
              <th>Project Outflow</th>
              <th>Debt Service</th>
              <th>Net Cashflow</th>
              <th>Cumulative</th>
            </tr>
          </thead>
          <tbody>
            ${debtBridgeRows
              .map(
                (row) => `
                  <tr>
                    <td>M${row.month}</td>
                    <td>Rs ${formatINR(row.salesInflow)}</td>
                    <td>Rs ${formatINR(row.constructionOutflow)}</td>
                    <td>Rs ${formatINR(row.loanPayment)}</td>
                    <td>${formatSignedINR(row.netCashflow)}</td>
                    <td>${formatSignedINR(row.cumulativeCashflow)}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>

    <section class="block">
      <h2>Scenario Grid (Price Sensitivity)</h2>
      <div class="scenario-grid">
        <article class="scenario-card good">
          <h3>Conservative</h3>
          <div class="summary-rows">
            <div class="summary-line"><span>Price / sq ft</span><strong>Rs ${formatINR(conservative.price)}</strong></div>
            <div class="summary-line"><span>Profit</span><strong>${formatSignedINR(conservative.profit)}</strong></div>
            <div class="summary-line"><span>ROI</span><strong>${conservative.roi.toFixed(1)}%</strong></div>
          </div>
        </article>
        <article class="scenario-card mid">
          <h3>Base</h3>
          <div class="summary-rows">
            <div class="summary-line"><span>Price / sq ft</span><strong>Rs ${formatINR(base.price)}</strong></div>
            <div class="summary-line"><span>Profit</span><strong>${formatSignedINR(base.profit)}</strong></div>
            <div class="summary-line"><span>ROI</span><strong>${base.roi.toFixed(1)}%</strong></div>
          </div>
        </article>
        <article class="scenario-card strong">
          <h3>Optimistic</h3>
          <div class="summary-rows">
            <div class="summary-line"><span>Price / sq ft</span><strong>Rs ${formatINR(optimistic.price)}</strong></div>
            <div class="summary-line"><span>Profit</span><strong>${formatSignedINR(optimistic.profit)}</strong></div>
            <div class="summary-line"><span>ROI</span><strong>${optimistic.roi.toFixed(1)}%</strong></div>
          </div>
        </article>
      </div>
    </section>

    <section class="block">
      <h2>Construction Phase Timeline Detail</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Phase</th>
              <th>Start</th>
              <th>End</th>
              <th>Duration</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${phaseData.phases
              .map(
                (phase) => `
                  <tr>
                    <td>${phase.name}</td>
                    <td>M${phase.start}</td>
                    <td>M${phase.end}</td>
                    <td>${Math.max(1, phase.end - phase.start + 1)} months</td>
                    <td>Rs ${formatINR(phase.amount)}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>

    <div class="section-grid">
      <section class="block">
        <h2>Model Integrity Check</h2>
        <div class="audit-grid">
          <article class="audit-card">
            <h3>Cost Reconciliation</h3>
            <div class="audit-row"><span>Model Total Cost</span><strong>Rs ${formatINR(result.totalCost)}</strong></div>
            <div class="audit-row"><span>Timeline Allocated Spend</span><strong>Rs ${formatINR(phaseSpendTotal)}</strong></div>
            <div class="audit-row"><span>Reconciliation Gap</span><strong>${formatSignedINR(reconciliationGap)}</strong></div>
            <div class="audit-row"><span>Status</span><strong><span class="chip ${reconciliationStatus === "Matched" ? "ok" : "warn"}">${reconciliationStatus}</span></strong></div>
          </article>
          <article class="audit-card">
            <h3>Decision Signals</h3>
            <div class="audit-row"><span>Recommendation</span><strong>${recommendation}</strong></div>
            <div class="audit-row"><span>Risk Flags</span><strong>${risks.length}</strong></div>
            <div class="audit-row"><span>Peak Funding Gap</span><strong>Rs ${formatINR(cashflow?.peakFundingGap || 0)}</strong></div>
            <div class="audit-row"><span>Cashflow Break-even</span><strong>${cashflow?.breakevenMonth ? `M${cashflow.breakevenMonth}` : "Beyond horizon"}</strong></div>
          </article>
        </div>
      </section>

      <section class="block">
        <h2>Execution Focus Areas</h2>
        <p class="allocation-note">Highest cost concentration phases that require strict procurement and execution control.</p>
        <div class="focus-list">
          ${phaseTop
            .map(
              (phase) => `
                <article class="focus-item">
                  <div class="focus-head">
                    <span>${phase.name} (M${phase.start}-M${phase.end})</span>
                    <span>${phase.share.toFixed(1)}%</span>
                  </div>
                  <div class="focus-bar"><span style="width:${Math.max(0, Math.min(100, phase.share)).toFixed(2)}%"></span></div>
                  <div class="audit-row" style="border-bottom:0; padding-bottom:0;"><span>Amount</span><strong>Rs ${formatINR(phase.amount)}</strong></div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
    </div>

    <section class="block">
      <h2>Risk and Mitigation Playbook</h2>
      <p class="allocation-note">Action-oriented responses for current warning set, framed for investment committee review.</p>
      <div class="table-wrap">
        <table class="playbook-table">
          <thead>
            <tr>
              <th>Observed Risk</th>
              <th>Recommended Mitigation</th>
              <th>Expected Effect</th>
            </tr>
          </thead>
          <tbody>
            ${(riskPlaybook.length ? riskPlaybook : [{
              warning: "No major risk flags in current scenario.",
              action: "Maintain current assumptions and validate with consultant checks.",
              impact: "Preserves model stability and strengthens execution confidence.",
            }])
              .map(
                (item) => `
                  <tr>
                    <td>${item.warning}</td>
                    <td>${item.action}</td>
                    <td>${item.impact}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>

    <p class="footer">OptiBuild | VORCO investor report generated from live calculator inputs. Verify assumptions with your project consultant, valuation expert, and lenders before execution.</p>
  </div>
</body>
</html>`;
}

reportBtn?.addEventListener("click", () => {
  if (!currentResult) return;
  const reportWindow = window.open("", "_blank");
  if (!reportWindow) return;
  reportWindow.document.open();
  reportWindow.document.write(buildInvestorReportHtml(currentResult));
  reportWindow.document.close();
  reportWindow.focus();
  reportWindow.print();
});

auditBtn?.addEventListener("click", () => {
  if (!currentResult) return;
  const auditWindow = window.open("", "_blank");
  if (!auditWindow) return;
  auditWindow.document.open();
  auditWindow.document.write(buildAuditReportHtml(currentResult, currentInputData || {}));
  auditWindow.document.close();
  auditWindow.focus();
  setTimeout(() => auditWindow.print(), 250);
});

salePriceValue.textContent = `Rs ${formatINR(salePriceInput.value)} / sq ft`;
syncSmartLabels();
refreshScenarioSelect();
updateLiveClock();
setInterval(updateLiveClock, 1000);
form.dispatchEvent(new Event("submit"));
