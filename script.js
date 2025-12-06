/* ===================================================
   STEPS FETP India Decision Aid
   Script with interactive DCE sensitivity / benefits tab
   and Copilot / AI briefing integration
   =================================================== */

/* ===========================
   Global model coefficients
   =========================== */

const MXL_COEFS = {
  ascProgram: 0.168,
  ascOptOut: -0.601,
  tier: {
    frontline: 0.0,
    intermediate: 0.220,
    advanced: 0.487
  },
  career: {
    certificate: 0.0,
    uniqual: 0.017,
    career_path: -0.122
  },
  mentorship: {
    low: 0.0,
    medium: 0.453,
    high: 0.640
  },
  delivery: {
    blended: 0.0,
    inperson: -0.232,
    online: -1.073
  },
  response: {
    30: 0.0,
    15: 0.546,
    7: 0.610
  },
  costPerThousand: -0.005
};

const LC2_COEFS = {
  ascProgram: 0.098,
  ascOptOut: -2.543,
  tier: {
    frontline: 0.0,
    intermediate: 0.087,
    advanced: 0.422
  },
  career: {
    certificate: 0.0,
    uniqual: -0.024,
    career_path: -0.123
  },
  mentorship: {
    low: 0.0,
    medium: 0.342,
    high: 0.486
  },
  delivery: {
    blended: 0.0,
    inperson: -0.017,
    online: -0.700
  },
  response: {
    30: 0.0,
    15: 0.317,
    7: 0.504
  },
  costPerThousand: -0.001
};

/* Conservative / resister class (for endorsement only; cost coefficient not used for WTP) */
const LC1_COEFS = {
  ascProgram: 0.181,
  ascOptOut: 1.222,
  tier: {
    frontline: 0.0,
    intermediate: 0.070,
    advanced: 0.045
  },
  career: {
    certificate: 0.0,
    uniqual: 0.098,
    career_path: -0.027
  },
  mentorship: {
    low: 0.0,
    medium: 0.327,
    high: 0.636
  },
  delivery: {
    blended: 0.0,
    inperson: -0.476,
    online: -0.798
  },
  response: {
    30: 0.0,
    15: 0.640,
    7: 0.513
  },
  costPerThousand: 0.0001
};

/* ===========================
   Cost templates (fallback)
   =========================== */

const COST_TEMPLATES = {
  frontline: {
    who: {
      id: "who",
      label: "Frontline - WHO template (6 cohorts)",
      description:
        "WHO costing template for Frontline FETP with six cohorts. Includes staff, travel, supervision and management costs.",
      oppRate: 0.15,
      components: [
        { id: "staff", label: "Staff and tutors", directShare: 0.40 },
        {
          id: "travel",
          label: "Trainee travel and field work",
          directShare: 0.20
        },
        {
          id: "materials",
          label: "Training materials and supplies",
          directShare: 0.15
        },
        {
          id: "supervision",
          label: "Supervision and mentoring costs",
          directShare: 0.15
        },
        { id: "overheads", label: "Management and overheads", directShare: 0.10 }
      ]
    }
  },
  intermediate: {
    who: {
      id: "who",
      label: "Intermediate - WHO template",
      description:
        "WHO costing template for Intermediate FETP. Reflects a mix of direct training and supervision costs.",
      oppRate: 0.20,
      components: [
        { id: "staff", label: "Staff and tutors", directShare: 0.38 },
        {
          id: "travel",
          label: "Trainee travel and field work",
          directShare: 0.18
        },
        {
          id: "materials",
          label: "Training materials and supplies",
          directShare: 0.14
        },
        {
          id: "supervision",
          label: "Supervision and mentoring costs",
          directShare: 0.18
        },
        {
          id: "overheads",
          label: "Management and overheads",
          directShare: 0.12
        }
      ]
    },
    nie: {
      id: "nie",
      label: "Intermediate - NIE template",
      description:
        "NIE budget template for Intermediate FETP. Slightly higher supervision share.",
      oppRate: 0.22,
      components: [
        { id: "staff", label: "Staff and tutors", directShare: 0.36 },
        {
          id: "travel",
          label: "Trainee travel and field work",
          directShare: 0.18
        },
        {
          id: "materials",
          label: "Training materials and supplies",
          directShare: 0.12
        },
        {
          id: "supervision",
          label: "Supervision and mentoring costs",
          directShare: 0.22
        },
        {
          id: "overheads",
          label: "Management and overheads",
          directShare: 0.12
        }
      ]
    },
    ncdc: {
      id: "ncdc",
      label: "Intermediate - NCDC template",
      description:
        "NCDC costing assumptions for Intermediate FETP. Higher management share.",
      oppRate: 0.18,
      components: [
        { id: "staff", label: "Staff and tutors", directShare: 0.35 },
        {
          id: "travel",
          label: "Trainee travel and field work",
          directShare: 0.17
        },
        {
          id: "materials",
          label: "Training materials and supplies",
          directShare: 0.13
        },
        {
          id: "supervision",
          label: "Supervision and mentoring costs",
          directShare: 0.20
        },
        {
          id: "overheads",
          label: "Management and overheads",
          directShare: 0.15
        }
      ]
    }
  },
  advanced: {
    nie: {
      id: "nie",
      label: "Advanced - NIE template",
      description:
        "NIE budget template for Advanced FETP. Reflects intensive staff time and supervision.",
      oppRate: 0.25,
      components: [
        { id: "staff", label: "Staff and tutors", directShare: 0.45 },
        {
          id: "travel",
          label: "Trainee travel and field work",
          directShare: 0.18
        },
        {
          id: "materials",
          label: "Training materials and supplies",
          directShare: 0.10
        },
        {
          id: "supervision",
          label: "Supervision and mentoring costs",
          directShare: 0.17
        },
        {
          id: "overheads",
          label: "Management and overheads",
          directShare: 0.10
        }
      ]
    },
    ncdc: {
      id: "ncdc",
      label: "Advanced - NCDC template",
      description:
        "NCDC costing assumptions for Advanced FETP. Slightly higher overhead share.",
      oppRate: 0.23,
      components: [
        { id: "staff", label: "Staff and tutors", directShare: 0.42 },
        {
          id: "travel",
          label: "Trainee travel and field work",
          directShare: 0.19
        },
        {
          id: "materials",
          label: "Training materials and supplies",
          directShare: 0.11
        },
        {
          id: "supervision",
          label: "Supervision and mentoring costs",
          directShare: 0.16
        },
        {
          id: "overheads",
          label: "Management and overheads",
          directShare: 0.12
        }
      ]
    }
  }
};

/* External JSON-driven cost configuration (if present) */
let COST_CONFIG = null;

/* ===========================
   Epidemiological settings
   =========================== */

const DEFAULT_EPI_SETTINGS = {
  general: {
    planningHorizonYears: 5,
    inrPerUsd: 83
  },
  tiers: {
    frontline: {
      gradShare: 0.9,
      outbreaksPerCohortPerYear: 0.3,
      valuePerGraduate: 800000,
      valuePerOutbreak: 30000000
    },
    intermediate: {
      gradShare: 0.92,
      outbreaksPerCohortPerYear: 0.45,
      valuePerGraduate: 1000000,
      valuePerOutbreak: 35000000
    },
    advanced: {
      gradShare: 0.95,
      outbreaksPerCohortPerYear: 0.8,
      valuePerGraduate: 1200000,
      valuePerOutbreak: 40000000
    }
  }
};

/* Response-time multipliers for outbreak benefits */
const RESPONSE_TIME_MULTIPLIERS = {
  "30": 1.0,
  "15": 1.2,
  "7": 1.5
};

/* ===========================
   Global state
   =========================== */

const state = {
  model: "mxl",
  currency: "INR",
  includeOpportunityCost: true,
  epiSettings: JSON.parse(JSON.stringify(DEFAULT_EPI_SETTINGS)),
  currentTier: "frontline",
  currentCostSourceId: null,
  lastResults: null,
  scenarios: [],
  charts: {
    uptake: null,
    bcr: null,
    epi: null,
    natCostBenefit: null,
    natGradOutbreak: null,
    natBcr: null
  },
  tour: {
    seen: false,
    active: false,
    stepIndex: 0,
    steps: []
  }
};

/* ===========================
   Utility helpers
   =========================== */

function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined || isNaN(value)) return "-";
  return value.toLocaleString("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  });
}

function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return "-";
  return `${value.toFixed(decimals)} %`;
}

function formatCurrencyInr(value, decimals = 0) {
  if (value === null || value === undefined || isNaN(value)) return "-";
  return `INR ${value.toLocaleString("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  })}`;
}

function formatCurrency(valueInInr, currency = "INR", decimalsInr = 0) {
  if (valueInInr === null || valueInInr === undefined || isNaN(valueInInr))
    return "-";
  if (currency === "USD") {
    const rate = state.epiSettings.general.inrPerUsd || 83;
    const valueUsd = valueInInr / rate;
    return `USD ${valueUsd.toLocaleString("en-US", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1
    })}`;
  }
  return formatCurrencyInr(valueInInr, decimalsInr);
}

function logistic(x) {
  if (x > 50) return 1;
  if (x < -50) return 0;
  return 1 / (1 + Math.exp(-x));
}

function getModelCoefs(modelId) {
  if (modelId === "lc2") return LC2_COEFS;
  if (modelId === "lc1") return LC1_COEFS;
  return MXL_COEFS;
}

/* ===========================
   Configuration reading
   =========================== */

function readConfigurationFromInputs() {
  const tier = document.getElementById("program-tier").value;
  const career = document.getElementById("career-track").value;
  const mentorship = document.getElementById("mentorship").value;
  const delivery = document.getElementById("delivery").value;
  const response = document.getElementById("response").value;

  const costSlider = document.getElementById("cost-slider");
  const traineesInput = document.getElementById("trainees");
  const cohortsInput = document.getElementById("cohorts");

  const costPerTraineePerMonth = parseFloat(costSlider.value) || 0;
  const traineesPerCohort = parseInt(traineesInput.value, 10) || 0;
  const numberOfCohorts = parseInt(cohortsInput.value, 10) || 0;

  const scenarioNameInput = document.getElementById("scenario-name");
  const scenarioNotesInput = document.getElementById("scenario-notes");

  return {
    tier,
    career,
    mentorship,
    delivery,
    response,
    costPerTraineePerMonth,
    traineesPerCohort,
    numberOfCohorts,
    scenarioName: scenarioNameInput ? scenarioNameInput.value.trim() : "",
    scenarioNotes: scenarioNotesInput ? scenarioNotesInput.value.trim() : ""
  };
}

/* ===========================
   Utility and endorsement
   =========================== */

function computeNonCostUtility(cfg, coefs) {
  const uTier = coefs.tier[cfg.tier] || 0;
  const uCareer = coefs.career[cfg.career] || 0;
  const uMentor = coefs.mentorship[cfg.mentorship] || 0;
  const uDelivery = coefs.delivery[cfg.delivery] || 0;
  const uResponse = coefs.response[cfg.response] || 0;
  return uTier + uCareer + uMentor + uDelivery + uResponse;
}

/*
  Compute WTP components (INR per trainee per month) using:
  WTP_k (thousand INR / trainee / month) = -beta_k / beta_cost
  Multiply by 1000 to express in INR / trainee / month.
*/
function computeWtpComponents(cfg, coefs) {
  const betaCost = coefs.costPerThousand || 0;
  if (!betaCost) {
    return {
      totalPerTraineePerMonth: null,
      components: null
    };
  }

  const betaTier = coefs.tier[cfg.tier] || 0;
  const betaCareer = coefs.career[cfg.career] || 0;
  const betaMentor = coefs.mentorship[cfg.mentorship] || 0;
  const betaDelivery = coefs.delivery[cfg.delivery] || 0;
  const betaResponse = coefs.response[cfg.response] || 0;

  const tierWtp = (-1000 * betaTier) / betaCost;
  const careerWtp = (-1000 * betaCareer) / betaCost;
  const mentorshipWtp = (-1000 * betaMentor) / betaCost;
  const deliveryWtp = (-1000 * betaDelivery) / betaCost;
  const responseWtp = (-1000 * betaResponse) / betaCost;

  const total =
    tierWtp + careerWtp + mentorshipWtp + deliveryWtp + responseWtp;

  return {
    totalPerTraineePerMonth: total,
    components: {
      tier: tierWtp,
      career: careerWtp,
      mentorship: mentorshipWtp,
      delivery: deliveryWtp,
      response: responseWtp
    }
  };
}

/*
  Compute endorsement probabilities and (optionally) WTP.
  options.forceNoWtp can be used (e.g. for conservative class)
  to suppress WTP even if a cost coefficient is available.
*/
function computeEndorsementAndWtp(cfg, modelId, options = {}) {
  const coefs = getModelCoefs(modelId);
  const designUtility = computeNonCostUtility(cfg, coefs);

  const uAsc =
    typeof coefs.ascProgram === "number" ? coefs.ascProgram : 1.0;
  const nonCostUtilityWithAsc = uAsc + designUtility;

  const costThousands = cfg.costPerTraineePerMonth / 1000;
  const costUtil = (coefs.costPerThousand || 0) * costThousands;
  const ascOptOut = coefs.ascOptOut || 0;

  const deltaV = -ascOptOut + nonCostUtilityWithAsc + costUtil;
  const endorseProb = logistic(deltaV);
  const optOutProb = 1 - endorseProb;

  const betaCost = coefs.costPerThousand || 0;

  let wtpConfig = null;
  let wtpComponents = null;

  const forceNoWtp = !!options.forceNoWtp;

  if (!forceNoWtp && betaCost !== 0) {
    const wtp = computeWtpComponents(cfg, coefs);
    wtpConfig = wtp.totalPerTraineePerMonth;
    wtpComponents = wtp.components;
  }

  return {
    designUtility,
    nonCostUtilityWithAsc,
    costUtil,
    deltaV,
    endorseProb,
    optOutProb,
    wtpConfig,
    wtpComponents
  };
}

/* ===========================
   Cost calculations
   =========================== */

function getProgrammeDurationMonths(tier) {
  if (tier === "intermediate") return 12;
  if (tier === "advanced") return 24;
  return 3; // frontline default
}

function getCurrentCostTemplate(tier) {
  const selectConfigTier =
    COST_CONFIG && COST_CONFIG[tier] ? COST_CONFIG[tier] : null;

  let chosenId = state.currentCostSourceId || null;

  if (selectConfigTier) {
    const tierConfig = selectConfigTier;
    const ids = Object.keys(tierConfig);
    if (ids.length) {
      if (!chosenId || !tierConfig[chosenId]) {
        chosenId = ids[0];
        state.currentCostSourceId = chosenId;
      }
      const src = tierConfig[chosenId];
      const allComponents = src.components || [];
      const nonOpp = allComponents.filter(c => !c.isOpportunityCost);
      const opp = allComponents.filter(c => c.isOpportunityCost);

      const totalNonOpp = nonOpp.reduce(
        (sum, c) => sum + (c.amountTotal || 0),
        0
      );
      const totalOpp = opp.reduce(
        (sum, c) => sum + (c.amountTotal || 0),
        0
      );
      const oppRate = totalNonOpp > 0 ? totalOpp / totalNonOpp : 0;

      const components = nonOpp.map((c, idx) => {
        const share =
          totalNonOpp > 0 ? (c.amountTotal || 0) / totalNonOpp : 0;

        const labelParts = [];
        if (c.major) labelParts.push(c.major);
        if (c.category) labelParts.push(c.category);
        if (c.subCategory) labelParts.push(c.subCategory);
        const labelBase = labelParts.length
          ? labelParts.join(" / ")
          : `Cost component ${idx + 1}`;
        const label = c.label || labelBase;

        return {
          id: c.id || `comp_${idx}`,
          label,
          directShare: share,
          major: c.major || "",
          category: c.category || "",
          subCategory: c.subCategory || "",
          description: c.description || ""
        };
      });

      return {
        id: src.id || chosenId,
        label: src.label || chosenId,
        description: src.description || "",
        oppRate,
        components
      };
    }
  }

  const templatesForTier = COST_TEMPLATES[tier] || {};
  const availableIds = Object.keys(templatesForTier);
  if (!availableIds.length) return null;

  if (!chosenId || !templatesForTier[chosenId]) {
    chosenId = availableIds[0];
    state.currentCostSourceId = chosenId;
  }

  return templatesForTier[chosenId];
}

/*
  Compute direct programme cost, opportunity cost and total economic cost.
  Costs are per cohort, then scaled elsewhere by number of cohorts.
*/
function computeCosts(cfg) {
  const durationMonths = getProgrammeDurationMonths(cfg.tier);
  const programmeCostPerCohort =
    cfg.costPerTraineePerMonth * cfg.traineesPerCohort * durationMonths;

  const template = getCurrentCostTemplate(cfg.tier);

  if (!template) {
    const opportunityCostPerCohort = 0;
    const totalEconomicCostPerCohort = programmeCostPerCohort;
    return {
      durationMonths,
      programmeCostPerCohort,
      opportunityCostPerCohort,
      totalEconomicCostPerCohort,
      components: []
    };
  }

  const oppRate = template.oppRate || 0;
  const directCostPerCohort = programmeCostPerCohort;
  const opportunityCostPerCohort = state.includeOpportunityCost
    ? directCostPerCohort * oppRate
    : 0;
  const totalEconomicCostPerCohort =
    directCostPerCohort + opportunityCostPerCohort;

  const components = (template.components || []).map(comp => {
    const compAmountPerCohort =
      directCostPerCohort * (comp.directShare || 0);
    const amountPerTraineePerMonth =
      durationMonths > 0 && cfg.traineesPerCohort > 0
        ? compAmountPerCohort /
          (durationMonths * cfg.traineesPerCohort)
        : 0;

    return {
      id: comp.id,
      label: comp.label,
      share: comp.directShare || 0,
      amountPerCohort: compAmountPerCohort,
      amountPerTraineePerMonth,
      major: comp.major || "",
      category: comp.category || "",
      subCategory: comp.subCategory || "",
      description: comp.description || ""
    };
  });

  return {
    durationMonths,
    programmeCostPerCohort: directCostPerCohort,
    opportunityCostPerCohort,
    totalEconomicCostPerCohort,
    components
  };
}

/* ===========================
   Epidemiological calculations
   =========================== */

function getResponseTimeMultiplier(responseValue) {
  const key = String(responseValue);
  if (Object.prototype.hasOwnProperty.call(RESPONSE_TIME_MULTIPLIERS, key)) {
    return RESPONSE_TIME_MULTIPLIERS[key];
  }
  return 1.0;
}

/*
  Compute epidemiological outputs and outbreak benefits for all cohorts.
*/
function computeEpi(cfg, endorseProb) {
  const tierConfig = state.epiSettings.tiers[cfg.tier];
  if (!tierConfig) {
    return {
      graduatesAllCohorts: 0,
      outbreaksPerYearAllCohorts: 0,
      benefitGraduatesAllCohorts: 0,
      benefitOutbreaksAllCohorts: 0,
      totalBenefitAllCohorts: 0,
      benefitPerCohort: 0
    };
  }

  const horizon = state.epiSettings.general.planningHorizonYears || 5;
  const gradShare = tierConfig.gradShare || 0;
  const outbreaksPerCohortYear =
    tierConfig.outbreaksPerCohortPerYear || 0;
  const valuePerGrad = tierConfig.valuePerGraduate || 0;
  const valuePerOutbreak = tierConfig.valuePerOutbreak || 0;

  const totalTrainees = cfg.traineesPerCohort * cfg.numberOfCohorts;

  const graduatesAllCohorts = totalTrainees * gradShare * endorseProb;
  const outbreaksPerYearAllCohorts =
    cfg.numberOfCohorts * outbreaksPerCohortYear * endorseProb;

  const responseMultiplier = getResponseTimeMultiplier(cfg.response);

  const benefitGraduatesAllCohorts =
    graduatesAllCohorts * valuePerGrad;

  const benefitOutbreaksAllCohortsBase =
    outbreaksPerYearAllCohorts * horizon * valuePerOutbreak;

  const benefitOutbreaksAllCohorts =
    benefitOutbreaksAllCohortsBase * responseMultiplier;

  const totalBenefitAllCohorts =
    benefitGraduatesAllCohorts + benefitOutbreaksAllCohorts;

  const benefitPerCohort =
    cfg.numberOfCohorts > 0
      ? totalBenefitAllCohorts / cfg.numberOfCohorts
      : 0;

  return {
    graduatesAllCohorts,
    outbreaksPerYearAllCohorts,
    benefitGraduatesAllCohorts,
    benefitOutbreaksAllCohorts,
    totalBenefitAllCohorts,
    benefitPerCohort
  };
}

/* ===========================
   DCE benefits & sensitivity
   =========================== */

/*
  Endorsement override for sensitivity tab.

  - If user enters 70 treat as 70%.
  - If user enters 0.7 treat as 70%.
*/
function getEndorsementRateForSensitivity(defaultRate) {
  let rate = defaultRate;

  const input = document.getElementById("endorsement-override");

  if (input) {
    const raw = parseFloat(input.value);
    if (!isNaN(raw) && raw >= 0) {
      rate = raw > 1.5 ? raw / 100 : raw;
    }
  }

  if (!isFinite(rate) || isNaN(rate)) rate = 0;
  if (rate < 0) rate = 0;
  if (rate > 1) rate = 1;

  return rate;
}

function isSensitivityEpiIncluded() {
  const btn = document.getElementById("sensitivity-epi-toggle");
  if (!btn) return true;
  return btn.classList.contains("on");
}

/*
  Compute DCE-based WTP benefits and CBA profiles for:
  - Overall (mixed logit)
  - Supportive latent class (LC2)
  - Conservative / resister class (LC1; endorsement only)
*/
function computeDceCbaProfiles(cfg, costs, epi, options) {
  const opts = options || {};
  const useUiOverrides = !!opts.useUiOverrides;
  const dceScale =
    typeof opts.dceScale === "number" ? opts.dceScale : 1;
  const epiScale =
    typeof opts.epiScale === "number" ? opts.epiScale : 1;

  const durationMonths = costs.durationMonths || 0;
  const trainees = cfg.traineesPerCohort || 0;
  const cohorts = cfg.numberOfCohorts || 0;

  const totalCostAllCohorts =
    costs.totalEconomicCostPerCohort * cohorts;

  const epiOutbreakBenefitAllCohorts =
    (epi.benefitOutbreaksAllCohorts || 0) * epiScale;

  const overallUtil = computeEndorsementAndWtp(cfg, "mxl");
  const supportiveUtil = computeEndorsementAndWtp(cfg, "lc2");
  const conservativeUtil = computeEndorsementAndWtp(cfg, "lc1", {
    forceNoWtp: true
  });

  function buildProfile(label, utilObj, suppressWtp) {
    const wtpPerTraineePerMonth = suppressWtp
      ? null
      : utilObj.wtpConfig;

    const components = suppressWtp
      ? null
      : utilObj.wtpComponents || {};
    const wtpRespPerTraineePerMonth =
      !suppressWtp && components && typeof components.response === "number"
        ? components.response
        : null;

    const hasWtp =
      typeof wtpPerTraineePerMonth === "number" &&
      isFinite(wtpPerTraineePerMonth);

    const wtpPerCohort = hasWtp
      ? wtpPerTraineePerMonth * trainees * durationMonths
      : null;
    const wtpRespPerCohort =
      hasWtp && typeof wtpRespPerTraineePerMonth === "number"
        ? wtpRespPerTraineePerMonth *
          trainees *
          durationMonths
        : null;

    const baseWtpAllCohorts =
      hasWtp && wtpPerCohort !== null ? wtpPerCohort * cohorts : null;
    const baseWtpRespAllCohorts =
      hasWtp && wtpRespPerCohort !== null
        ? wtpRespPerCohort * cohorts
        : null;

    const wtpAllCohorts =
      baseWtpAllCohorts !== null
        ? baseWtpAllCohorts * dceScale
        : null;
    const wtpRespAllCohorts =
      baseWtpRespAllCohorts !== null
        ? baseWtpRespAllCohorts * dceScale
        : null;

    const baseRate = utilObj.endorseProb || 0;
    const endorsementRate = useUiOverrides
      ? getEndorsementRateForSensitivity(baseRate)
      : baseRate;

    const effectiveBenefitAllCohorts =
      wtpAllCohorts !== null
        ? wtpAllCohorts * endorsementRate
        : null;

    const npvDce =
      wtpAllCohorts !== null
        ? wtpAllCohorts - totalCostAllCohorts
        : null;
    const bcrDce =
      wtpAllCohorts !== null && totalCostAllCohorts > 0
        ? wtpAllCohorts / totalCostAllCohorts
        : null;

    const npvEffective =
      effectiveBenefitAllCohorts !== null
        ? effectiveBenefitAllCohorts - totalCostAllCohorts
        : null;
    const bcrEffective =
      effectiveBenefitAllCohorts !== null &&
      totalCostAllCohorts > 0
        ? effectiveBenefitAllCohorts / totalCostAllCohorts
        : null;

    const combinedBenefit =
      wtpAllCohorts !== null
        ? wtpAllCohorts + epiOutbreakBenefitAllCohorts
        : null;
    const npvCombined =
      combinedBenefit !== null
        ? combinedBenefit - totalCostAllCohorts
        : null;
    const bcrCombined =
      combinedBenefit !== null && totalCostAllCohorts > 0
        ? combinedBenefit / totalCostAllCohorts
        : null;

    const combinedEffectiveBenefit =
      effectiveBenefitAllCohorts !== null
        ? effectiveBenefitAllCohorts + epiOutbreakBenefitAllCohorts
        : null;
    const npvCombinedEffective =
      combinedEffectiveBenefit !== null
        ? combinedEffectiveBenefit - totalCostAllCohorts
        : null;
    const bcrCombinedEffective =
      combinedEffectiveBenefit !== null && totalCostAllCohorts > 0
        ? combinedEffectiveBenefit / totalCostAllCohorts
        : null;

    return {
      label,
      wtpPerTraineePerMonth,
      wtpPerCohort,
      wtpAllCohorts,
      wtpRespPerTraineePerMonth,
      wtpRespPerCohort,
      wtpRespAllCohorts,
      endorsementRate,
      effectiveBenefitAllCohorts,
      npvDce,
      bcrDce,
      npvEffective,
      bcrEffective,
      combinedBenefit,
      npvCombined,
      bcrCombined,
      combinedEffectiveBenefit,
      npvCombinedEffective,
      bcrEffectiveTotal: bcrCombinedEffective
    };
  }

  const profiles = {
    overall: buildProfile(
      "Overall (mixed logit)",
      overallUtil,
      false
    ),
    supportive: buildProfile(
      "Supportive class (latent class)",
      supportiveUtil,
      false
    ),
    conservative: buildProfile(
      "Conservative / resister class (latent class)",
      conservativeUtil,
      true
    )
  };

  const scenarioLabel =
    cfg.scenarioName && cfg.scenarioName.trim().length
      ? cfg.scenarioName.trim()
      : "Current configuration";

  const scenarioSummary = {
    id: scenarioLabel,
    label: scenarioLabel,
    totalCostAllCohorts,
    epiOutbreakBenefitAllCohorts,
    overall: {
      B_WTP: profiles.overall.wtpAllCohorts,
      B_WTP_response: profiles.overall.wtpRespAllCohorts,
      endorsementRate: profiles.overall.endorsementRate,
      effectiveWTP: profiles.overall.effectiveBenefitAllCohorts,
      npvDce: profiles.overall.npvDce,
      bcrDce: profiles.overall.bcrDce,
      npvTotal: profiles.overall.npvCombined,
      bcrTotal: profiles.overall.bcrCombined,
      npvEffective: profiles.overall.npvEffective,
      bcrEffective: profiles.overall.bcrEffective,
      npvEffectiveTotal: profiles.overall.npvCombinedEffective,
      bcrEffectiveTotal: profiles.overall.bcrCombinedEffective
    },
    supporters: {
      B_WTP: profiles.supportive.wtpAllCohorts,
      B_WTP_response: profiles.supportive.wtpRespAllCohorts,
      endorsementRate: profiles.supportive.endorsementRate,
      effectiveWTP: profiles.supportive.effectiveBenefitAllCohorts,
      npvDce: profiles.supportive.npvDce,
      bcrDce: profiles.supportive.bcrDce,
      npvTotal: profiles.supportive.npvCombined,
      bcrTotal: profiles.supportive.bcrCombined,
      npvEffective: profiles.supportive.npvEffective,
      bcrEffective: profiles.supportive.bcrEffective,
      npvEffectiveTotal: profiles.supportive.npvCombinedEffective,
      bcrEffectiveTotal: profiles.supportive.bcrCombinedEffective
    },
    conservative: {
      B_WTP: profiles.conservative.wtpAllCohorts,
      B_WTP_response: profiles.conservative.wtpRespAllCohorts,
      endorsementRate: profiles.conservative.endorsementRate,
      effectiveWTP: profiles.conservative.effectiveBenefitAllCohorts,
      npvDce: profiles.conservative.npvDce,
      bcrDce: profiles.conservative.bcrDce,
      npvTotal: profiles.conservative.npvCombined,
      bcrTotal: profiles.conservative.bcrCombined,
      npvEffective: profiles.conservative.npvEffective,
      bcrEffective: profiles.conservative.bcrEffective,
      npvEffectiveTotal:
        profiles.conservative.npvCombinedEffective,
      bcrEffectiveTotal:
        profiles.conservative.bcrCombinedEffective
    }
  };

  return {
    profiles,
    totalCostAllCohorts,
    epiOutbreakBenefitAllCohorts,
    scenarioSummary
  };
}

/* ===========================
   Combined results
   =========================== */

function computeFullResults(cfg) {
  const util = computeEndorsementAndWtp(cfg, state.model);
  const costs = computeCosts(cfg);
  const epi = computeEpi(cfg, util.endorseProb);

  const totalCostAllCohorts =
    costs.totalEconomicCostPerCohort * cfg.numberOfCohorts;
  const totalBenefitAllCohorts = epi.totalBenefitAllCohorts;
  const netBenefitAllCohorts =
    totalBenefitAllCohorts - totalCostAllCohorts;
  const bcr =
    totalCostAllCohorts > 0
      ? totalBenefitAllCohorts / totalCostAllCohorts
      : null;

  const dceCba = computeDceCbaProfiles(cfg, costs, epi, {
    useUiOverrides: false,
    dceScale: 1,
    epiScale: 1
  });

  return {
    cfg,
    util,
    costs,
    epi,
    totalCostAllCohorts,
    totalBenefitAllCohorts,
    netBenefitAllCohorts,
    bcr,
    dceCba
  };
}

/* ===========================
   Global refresh helper
   =========================== */

function refreshAll(results, options = {}) {
  if (!results) return;
  const { skipToast } = options;
  state.lastResults = results;

  updateConfigSummary(results);
  updateResultsTab(results);
  updateCostingTab(results);
  updateNationalSimulation(results);
  updateSensitivityTab();

  if (!skipToast) {
    showToast("Configuration applied. Results updated.", "success");
  }
}

/* ===========================
   DOM helpers
   =========================== */

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
}

function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove(
    "toast-success",
    "toast-warning",
    "toast-error",
    "hidden"
  );

  if (type === "success") toast.classList.add("toast-success");
  if (type === "warning") toast.classList.add("toast-warning");
  if (type === "error") toast.classList.add("toast-error");

  toast.classList.add("show");

  if (showToast._timeoutId) {
    clearTimeout(showToast._timeoutId);
  }

  showToast._timeoutId = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

/* ===========================
   Tabs
   =========================== */

function setupTabs() {
  const tabLinks = document.querySelectorAll(".tab-link");

  tabLinks.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      if (!tab) return;

      tabLinks.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".tab-panel").forEach(panel => {
        panel.classList.remove("active");
      });

      const panel = document.getElementById(`tab-${tab}`);
      if (panel) panel.classList.add("active");
    });
  });
}

/* ===========================
   Info tooltips
   =========================== */

let activeTooltip = null;
let activeTooltipIcon = null;

function hideTooltip() {
  if (activeTooltip) {
    activeTooltip.remove();
    activeTooltip = null;
    activeTooltipIcon = null;
  }
}

function showTooltipForIcon(icon) {
  if (!icon) return;
  const text =
    icon.dataset.tooltip ||
    icon.getAttribute("aria-label") ||
    "";
  if (!text) return;

  hideTooltip();

  const bubble = document.createElement("div");
  bubble.className = "tooltip-bubble";
  bubble.innerHTML = `<p>${text}</p>`;
  document.body.appendChild(bubble);

  const rect = icon.getBoundingClientRect();
  const bubbleRect = bubble.getBoundingClientRect();

  let top = rect.bottom + 8;
  let left =
    rect.left + rect.width / 2 - bubbleRect.width / 2;

  if (left < 8) left = 8;
  if (left + bubbleRect.width > window.innerWidth - 8) {
    left = window.innerWidth - bubbleRect.width - 8;
  }

  if (top + bubbleRect.height > window.innerHeight - 8) {
    top = rect.top - bubbleRect.height - 8;
  }

  bubble.style.top = `${top}px`;
  bubble.style.left = `${left}px`;

  const arrow = document.createElement("div");
  arrow.className = "tooltip-arrow";
  arrow.style.bottom = "-4px";
  arrow.style.left = "calc(50% - 4px)";
  bubble.appendChild(arrow);

  activeTooltip = bubble;
  activeTooltipIcon = icon;
}

function setupInfoTooltips() {
  const icons = document.querySelectorAll(".info-icon");

  icons.forEach(icon => {
    const title = icon.getAttribute("title");
    if (title) {
      icon.dataset.tooltip = title;
      icon.removeAttribute("title");
    }

    icon.setAttribute("tabindex", "0");
    icon.setAttribute("role", "button");
    icon.setAttribute(
      "aria-label",
      icon.dataset.tooltip || "More information"
    );

    icon.addEventListener("mouseenter", () =>
      showTooltipForIcon(icon)
    );
    icon.addEventListener("mouseleave", () => hideTooltip());
    icon.addEventListener("focus", () =>
      showTooltipForIcon(icon)
    );
    icon.addEventListener("blur", () => hideTooltip());

    icon.addEventListener("click", e => {
      e.stopPropagation();
      if (activeTooltipIcon === icon) {
        hideTooltip();
      } else {
        showTooltipForIcon(icon);
      }
    });

    icon.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (activeTooltipIcon === icon) {
          hideTooltip();
        } else {
          showTooltipForIcon(icon);
        }
      }
    });
  });

  document.addEventListener("click", e => {
    if (activeTooltip && !e.target.closest(".info-icon")) {
      hideTooltip();
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      hideTooltip();
    }
  });
}

/* ===========================
   Cost template UI
   =========================== */

function populateCostSourceOptions(tier) {
  const select = document.getElementById("cost-source");
  if (!select) return;

  let sourcesForTier = null;

  if (COST_CONFIG && COST_CONFIG[tier]) {
    sourcesForTier = COST_CONFIG[tier];
  } else {
    sourcesForTier = COST_TEMPLATES[tier] || {};
  }

  const ids = Object.keys(sourcesForTier);
  select.innerHTML = "";

  if (!ids.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No templates available";
    select.appendChild(opt);
    state.currentCostSourceId = null;
    return;
  }

  if (
    !state.currentCostSourceId ||
    !sourcesForTier[state.currentCostSourceId]
  ) {
    state.currentCostSourceId = ids[0];
  }

  ids.forEach(id => {
    const tpl = sourcesForTier[id];
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = tpl.label || id;
    select.appendChild(opt);
  });

  select.value = state.currentCostSourceId;

  if (!select.dataset.bound) {
    select.addEventListener("change", () => {
      state.currentCostSourceId = select.value;
      if (!state.lastResults) return;
      const cfg = { ...state.lastResults.cfg };
      const results = computeFullResults(cfg);
      refreshAll(results, { skipToast: true });
    });
    select.dataset.bound = "1";
  }
}

/* ===========================
   Results and summaries
   =========================== */

function updateConfigSummary(results) {
  const container = document.getElementById("config-summary");
  if (!container) return;

  const { cfg, util } = results;
  const endorsementPercent = util.endorseProb * 100;

  const tierLabelMap = {
    frontline: "Frontline (3 months)",
    intermediate: "Intermediate (12 months)",
    advanced: "Advanced (24 months)"
  };
  const careerLabelMap = {
    certificate: "Government and partner certificate",
    uniqual: "University qualification",
    career_path: "Government career pathway"
  };
  const mentorshipLabelMap = {
    low: "Low mentorship",
    medium: "Medium mentorship",
    high: "High mentorship"
  };
  const deliveryLabelMap = {
    blended: "Blended delivery",
    inperson: "Fully in person delivery",
    online: "Fully online delivery"
  };
  const responseLabelMap = {
    30: "Detect and respond within 30 days",
    15: "Detect and respond within 15 days",
    7: "Detect and respond within 7 days"
  };

  const modelLabel =
    state.model === "lc2"
      ? "Supportive group (latent class)"
      : state.model === "lc1"
      ? "Conservative group (latent class)"
      : "Average mixed logit";

  const tierLabel = tierLabelMap[cfg.tier] || cfg.tier;
  const careerLabel = careerLabelMap[cfg.career] || cfg.career;
  const mentorLabel =
    mentorshipLabelMap[cfg.mentorship] || cfg.mentorship;
  const deliveryLabel =
    deliveryLabelMap[cfg.delivery] || cfg.delivery;
  const responseLabel =
    responseLabelMap[cfg.response] ||
    `${cfg.response} days`;

  const template = getCurrentCostTemplate(cfg.tier);
  const templateLabel = template ? template.label : "No template selected";

  const lines = [
    { label: "Programme tier", value: tierLabel },
    { label: "Career incentive", value: careerLabel },
    { label: "Mentorship intensity", value: mentorLabel },
    { label: "Delivery mode", value: deliveryLabel },
    {
      label: "Expected response time for events",
      value: responseLabel
    },
    { label: "Preference model", value: modelLabel },
    {
      label: "Trainees per cohort",
      value: formatNumber(cfg.traineesPerCohort, 0)
    },
    {
      label: "Number of cohorts",
      value: formatNumber(cfg.numberOfCohorts, 0)
    },
    {
      label: "Cost per trainee per month",
      value: formatCurrency(cfg.costPerTraineePerMonth, state.currency)
    },
    { label: "Cost template", value: templateLabel }
  ];

  container.innerHTML = lines
    .map(
      row => `
      <div class="config-summary-row">
        <div class="config-summary-label">${row.label}</div>
        <div class="config-summary-value">${row.value}</div>
      </div>`
    )
    .join("");

  const endorsementValueEl =
    document.getElementById("config-endorsement-value");
  if (endorsementValueEl) {
    endorsementValueEl.textContent = formatPercent(
      endorsementPercent,
      1
    );
  }

  const headlineStatusEl =
    document.getElementById("headline-status-pill") ||
    document.getElementById("headline-status-tag");
  const headlineTextEl = document.getElementById(
    "headline-recommendation"
  );
  const briefingEl = document.getElementById(
    "headline-briefing-text"
  );

  const resultsForHeadline = buildHeadlineText(results);

  if (headlineStatusEl) {
    headlineStatusEl.className =
      "status-pill " + resultsForHeadline.statusClass;
    headlineStatusEl.textContent =
      resultsForHeadline.statusLabel;
  }
  if (headlineTextEl) {
    headlineTextEl.textContent = resultsForHeadline.headline;
  }
  if (briefingEl) {
    briefingEl.textContent = resultsForHeadline.briefing;
  }
}

function buildHeadlineText(results) {
  const {
    util,
    bcr,
    epi,
    totalCostAllCohorts,
    totalBenefitAllCohorts
  } = results;

  const endorsement = util.endorseProb * 100;

  let statusClass = "status-neutral";
  let statusLabel = "Scenario not yet classified";
  let headline =
    "Apply a configuration to see an interpreted recommendation.";
  let briefing =
    "Once you apply a configuration, this box will summarise endorsement, costs and benefits in plain language for use in business case documents.";

  if (totalCostAllCohorts <= 0 || !isFinite(totalCostAllCohorts)) {
    return { statusClass, statusLabel, headline, briefing };
  }

  const bcrValue =
    bcr !== null && isFinite(bcr) ? bcr : 0;

  if (bcrValue >= 1.2 && endorsement >= 70) {
    statusClass = "status-good";
    statusLabel = "High impact and good value";
    headline =
      "This configuration appears attractive, combining strong endorsement with a benefit cost ratio above one.";
    briefing =
      "Estimated endorsement is around " +
      formatPercent(endorsement, 1) +
      " and the benefit cost ratio is " +
      (bcrValue ? bcrValue.toFixed(2) : "N/A") +
      ". National scale up is likely to deliver positive net benefits, subject to budget and implementation feasibility.";
  } else if (bcrValue >= 1 && endorsement >= 50) {
    statusClass = "status-warning";
    statusLabel = "Moderate impact and acceptable value";
    headline =
      "This configuration has positive net benefits and moderate endorsement.";
    briefing =
      "Estimated endorsement is around " +
      formatPercent(endorsement, 1) +
      " and the benefit cost ratio is close to one. It may be suitable for targeted scale up or as part of a mixed portfolio, especially if budgets are constrained.";
  } else if (bcrValue >= 1 && endorsement < 50) {
    statusClass = "status-warning";
    statusLabel = "Positive value but limited support";
    headline =
      "Net benefits are positive but endorsement is limited.";
    briefing =
      "The benefit cost ratio is above one but only about " +
      formatPercent(endorsement, 1) +
      " of stakeholders are predicted to endorse this option. Consider adjustments to career incentives, mentorship or cost before committing to large scale implementation.";
  } else if (bcrValue < 1) {
    statusClass = "status-poor";
    statusLabel = "Low value for money";
    headline =
      "This configuration does not appear cost effective under current assumptions.";
    briefing =
      "The benefit cost ratio is below one and net benefits are negative. Before moving forward, consider options to reduce costs or redesign the programme. It may be better used as a comparator or for local pilots rather than national scale up.";
  }

  const graduatesText = formatNumber(
    epi.graduatesAllCohorts,
    0
  );
  const outbreaksText = formatNumber(
    epi.outbreaksPerYearAllCohorts,
    1
  );
  const totalCostText = formatCurrency(
    totalCostAllCohorts,
    state.currency
  );
  const totalBenefitText = formatCurrency(
    totalBenefitAllCohorts,
    state.currency
  );

  briefing +=
    " Under these assumptions, the configuration would generate roughly " +
    graduatesText +
    " graduates, support about " +
    outbreaksText +
    " outbreak responses per year over the planning horizon, and involve total economic costs of " +
    totalCostText +
    " for indicative benefits of " +
    totalBenefitText +
    ".";

  return { statusClass, statusLabel, headline, briefing };
}

function updateResultsTab(results) {
  const {
    cfg,
    util,
    costs,
    epi
  } = results;

  const endorsePercent = util.endorseProb * 100;
  const optOutPercent = util.optOutProb * 100;

  setText("endorsement-rate", formatPercent(endorsePercent, 1));
  setText("optout-rate", formatPercent(optOutPercent, 1));

  // WTP per trainee per month (current preference model)
  const wtpPerTrainee = util.wtpConfig;
  const durationMonths = costs.durationMonths || 0;
  const wtpPerCohort =
    wtpPerTrainee !== null && isFinite(wtpPerTrainee)
      ? wtpPerTrainee *
        cfg.traineesPerCohort *
        durationMonths
      : null;

  setText(
    "wtp-per-trainee",
    wtpPerTrainee !== null && isFinite(wtpPerTrainee)
      ? formatCurrency(wtpPerTrainee, state.currency)
      : "-"
  );
  setText(
    "wtp-total-cohort",
    wtpPerCohort !== null && isFinite(wtpPerCohort)
      ? formatCurrency(wtpPerCohort, state.currency)
      : "-"
  );

  setText(
    "prog-cost-per-cohort",
    formatCurrency(costs.programmeCostPerCohort, state.currency)
  );
  setText(
    "total-cost",
    formatCurrency(costs.totalEconomicCostPerCohort, state.currency)
  );

  const netBenefitPerCohort =
    epi.benefitPerCohort - costs.totalEconomicCostPerCohort;

  setText(
    "net-benefit",
    formatCurrency(netBenefitPerCohort, state.currency)
  );

  const bcrPerCohort =
    costs.totalEconomicCostPerCohort > 0
      ? epi.benefitPerCohort /
        costs.totalEconomicCostPerCohort
      : null;

  setText(
    "bcr",
    bcrPerCohort !== null && isFinite(bcrPerCohort)
      ? bcrPerCohort.toFixed(2)
      : "-"
  );

  setText(
    "epi-graduates",
    formatNumber(epi.graduatesAllCohorts, 0)
  );
  setText(
    "epi-outbreaks",
    formatNumber(epi.outbreaksPerYearAllCohorts, 1)
  );
  setText(
    "epi-benefit",
    formatCurrency(epi.benefitPerCohort, state.currency)
  );

  updateResultCharts(results);
}

function updateCostingTab(results) {
  const { cfg, costs } = results;
  const template = getCurrentCostTemplate(cfg.tier);

  const summary = document.getElementById("cost-breakdown-summary");
  const list = document.getElementById("cost-components-list");
  const templateDescrEl = document.getElementById(
    "cost-template-description"
  );

  if (!summary || !list) return;

  const economicCost = costs.totalEconomicCostPerCohort;
  const oppCost = costs.opportunityCostPerCohort;
  const directCost = costs.programmeCostPerCohort;

  summary.innerHTML = `
    <div class="cost-summary-card">
      <div class="cost-summary-label">Programme cost per cohort</div>
      <div class="cost-summary-value">${formatCurrency(
        directCost,
        state.currency
      )}</div>
    </div>
    <div class="cost-summary-card">
      <div class="cost-summary-label">Opportunity cost per cohort</div>
      <div class="cost-summary-value">${formatCurrency(
        oppCost,
        state.currency
      )}</div>
    </div>
    <div class="cost-summary-card">
      <div class="cost-summary-label">Total economic cost per cohort</div>
      <div class="cost-summary-value">${formatCurrency(
        economicCost,
        state.currency
      )}</div>
    </div>
  `;

  if (templateDescrEl) {
    templateDescrEl.textContent =
      template && template.description ? template.description : "";
  }

  const componentsRows = (costs.components || [])
    .map(comp => {
      const sharePercent = comp.share * 100;
      const metaParts = [];
      if (comp.major) metaParts.push(comp.major);
      if (comp.category) metaParts.push(comp.category);
      if (comp.subCategory) metaParts.push(comp.subCategory);
      const metaText = metaParts.join(" / ");
      const metaBlock = metaText
        ? `<div class="cost-component-meta">${metaText}</div>`
        : "";
      const notesText = comp.description || "";

      return `
        <tr>
          <td>
            <div class="cost-component-name">${comp.label}</div>
            ${metaBlock}
          </td>
          <td>${sharePercent.toFixed(1)} %</td>
          <td>${formatCurrency(
            comp.amountPerCohort,
            state.currency
          )}</td>
          <td>${formatCurrency(
            comp.amountPerTraineePerMonth,
            state.currency
          )}</td>
          <td>${notesText}</td>
        </tr>
      `;
    })
    .join("");

  const oppRow = `
    <tr>
      <td>Opportunity cost of trainee time</td>
      <td>${
        template && typeof template.oppRate === "number"
          ? (template.oppRate * 100).toFixed(1) + " %"
          : "-"
      }</td>
      <td>${formatCurrency(oppCost, state.currency)}</td>
      <td>-</td>
      <td>Included when the opportunity cost toggle is on.</td>
    </tr>
  `;

  list.innerHTML = componentsRows + oppRow;
}

function updateNationalSimulation(results) {
  const {
    epi,
    totalCostAllCohorts,
    totalBenefitAllCohorts,
    netBenefitAllCohorts,
    bcr,
    dceCba
  } = results;

  setText(
    "nat-total-cost",
    formatCurrency(totalCostAllCohorts, state.currency)
  );
  setText(
    "nat-total-benefit",
    formatCurrency(totalBenefitAllCohorts, state.currency)
  );
  setText(
    "nat-net-benefit",
    formatCurrency(netBenefitAllCohorts, state.currency)
  );
  setText(
    "nat-bcr",
    bcr !== null && isFinite(bcr) ? bcr.toFixed(2) : "-"
  );

  setText(
    "nat-graduates",
    formatNumber(epi.graduatesAllCohorts, 0)
  );
  setText(
    "nat-outbreaks",
    formatNumber(epi.outbreaksPerYearAllCohorts, 1)
  );

  // Total WTP all cohorts (overall mixed logit profile)
  const natWtp =
    dceCba &&
    dceCba.profiles &&
    dceCba.profiles.overall &&
    typeof dceCba.profiles.overall.wtpAllCohorts === "number"
      ? dceCba.profiles.overall.wtpAllCohorts
      : null;
  setText(
    "nat-total-wtp",
    natWtp !== null && isFinite(natWtp)
      ? formatCurrency(natWtp, state.currency)
      : "-"
  );

  const summaryTextEl = document.getElementById(
    "natsim-summary-text"
  );
  if (summaryTextEl) {
    const gradsText = formatNumber(epi.graduatesAllCohorts, 0);
    const outbreaksText = formatNumber(
      epi.outbreaksPerYearAllCohorts,
      1
    );
    const costText = formatCurrency(
      totalCostAllCohorts,
      state.currency
    );
    const benefitText = formatCurrency(
      totalBenefitAllCohorts,
      state.currency
    );
    const bcrText =
      bcr !== null && isFinite(bcr) ? bcr.toFixed(2) : "-";
    summaryTextEl.textContent =
      "At national scale, this configuration would produce around " +
      gradsText +
      " graduates across all cohorts, support roughly " +
      outbreaksText +
      " outbreak responses per year once the programme is fully implemented, and involve total economic costs of " +
      costText +
      " for indicative epidemiological benefits of " +
      benefitText +
      ". The national benefit cost ratio is approximately " +
      bcrText +
      ", summarising the value for money from an epidemiological perspective.";
  }

  updateNationalCharts(results);
}

/* ===========================
   Sensitivity / DCE benefits
   =========================== */

function getSelectedBenefitDefinition() {
  const select = document.getElementById("benefit-definition-select");
  if (!select) return "wtp_only";
  return select.value || "wtp_only";
}

function getSelectedClassKey() {
  const select = document.getElementById("benefit-class-scenario");
  const val = select ? select.value : "overall";
  if (val === "supportive") return "supporters";
  if (val === "conservative") return "conservative";
  return "overall";
}

function getAllScenarioConfigs() {
  const configs = [];
  if (state.lastResults) {
    const label =
      state.lastResults.cfg.scenarioName ||
      "Current configuration";
    configs.push({
      label,
      cfg: { ...state.lastResults.cfg }
    });
  }
  (state.scenarios || []).forEach((s, idx) => {
    configs.push({
      label: s.name || `Scenario ${idx + 1}`,
      cfg: { ...s.cfg }
    });
  });
  return configs;
}

function buildScenarioDceCbaForSensitivity() {
  const configs = getAllScenarioConfigs();
  if (!configs.length) return [];

  const epiIncluded = isSensitivityEpiIncluded();
  const benefitDef = getSelectedBenefitDefinition();
  const useOverrides = benefitDef === "endorsement_adjusted";

  const results = [];

  configs.forEach(item => {
    const res = computeFullResults(item.cfg);
    const epiScale = epiIncluded ? 1 : 0;

    const dce = computeDceCbaProfiles(
      item.cfg,
      res.costs,
      res.epi,
      {
        useUiOverrides: useOverrides,
        dceScale: 1,
        epiScale
      }
    );

    results.push({
      label: item.label,
      cfg: res.cfg,
      costs: res.costs,
      epi: res.epi,
      dceProfiles: dce.profiles,
      summary: dce.scenarioSummary,
      epiIncluded
    });
  });

  return results;
}

function renderHeadlineDceBenefitsTable() {
  const table = document.getElementById("dce-benefits-table");
  const tbody = document.getElementById("dce-benefits-table-body");
  if (!table || !tbody) return;

  tbody.innerHTML = "";

  const scenarioEntries = buildScenarioDceCbaForSensitivity();
  if (!scenarioEntries.length) return;

  const classKey = getSelectedClassKey();

  scenarioEntries.forEach(entry => {
    const s = entry.summary;
    const group = s[classKey];

    const totalWtp = group.B_WTP;
    const wtpResp = group.B_WTP_response;

    const epiBenefit = entry.epiIncluded
      ? s.epiOutbreakBenefitAllCohorts
      : null;

    const endorsementRate = group.endorsementRate || 0;
    const endorsementPercent = endorsementRate * 100;

    const effectiveWtp = group.effectiveWTP;

    const bcrDce = group.bcrDce;
    const npvDce = group.npvDce;

    const bcrTotal = entry.epiIncluded
      ? group.bcrTotal
      : group.bcrDce;
    const npvTotal = entry.epiIncluded
      ? group.npvTotal
      : group.npvDce;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.label}</td>
      <td>${formatCurrency(
        s.totalCostAllCohorts,
        state.currency
      )}</td>
      <td>${formatCurrency(
        totalWtp,
        state.currency
      )}</td>
      <td>${formatCurrency(
        wtpResp,
        state.currency
      )}</td>
      <td>${
        epiBenefit !== null && isFinite(epiBenefit)
          ? formatCurrency(epiBenefit, state.currency)
          : entry.epiIncluded
          ? "-"
          : "Not included"
      }</td>
      <td>${formatPercent(endorsementPercent, 1)}</td>
      <td>${formatCurrency(
        effectiveWtp,
        state.currency
      )}</td>
      <td>${
        bcrDce !== null && isFinite(bcrDce)
          ? bcrDce.toFixed(2)
          : "-"
      }</td>
      <td>${formatCurrency(
        npvDce,
        state.currency
      )}</td>
      <td>${
        bcrTotal !== null && isFinite(bcrTotal)
          ? bcrTotal.toFixed(2)
          : "-"
      }</td>
      <td>${formatCurrency(
        npvTotal,
        state.currency
      )}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderDetailedSensitivityTable() {
  const table = document.getElementById("sensitivity-table");
  const tbody = document.getElementById("sensitivity-table-body");
  if (!table || !tbody) return;

  tbody.innerHTML = "";

  const scenarioEntries = buildScenarioDceCbaForSensitivity();
  if (!scenarioEntries.length) return;

  scenarioEntries.forEach(entry => {
    const s = entry.summary;
    const costsPerCohort =
      entry.costs.totalEconomicCostPerCohort;
    const epiPerCohort =
      entry.cfg.numberOfCohorts > 0
        ? s.epiOutbreakBenefitAllCohorts /
          entry.cfg.numberOfCohorts
        : 0;

    const overall = s.overall;
    const supporters = s.supporters;

    const totalWtpPerCohort =
      entry.cfg.numberOfCohorts > 0 && overall.B_WTP !== null
        ? overall.B_WTP / entry.cfg.numberOfCohorts
        : null;
    const wtpRespPerCohort =
      entry.cfg.numberOfCohorts > 0 &&
      overall.B_WTP_response !== null
        ? overall.B_WTP_response /
          entry.cfg.numberOfCohorts
        : null;

    const bcrDce =
      overall.bcrDce !== null && isFinite(overall.bcrDce)
        ? overall.bcrDce
        : null;
    const npvDce = overall.npvDce;

    const bcrDceEpi =
      overall.bcrTotal !== null &&
      isFinite(overall.bcrTotal)
        ? overall.bcrTotal
        : null;
    const npvDceEpi = overall.npvTotal;

    const supportiveWtpPerCohort =
      entry.cfg.numberOfCohorts > 0 &&
      supporters.B_WTP !== null
        ? supporters.B_WTP / entry.cfg.numberOfCohorts
        : null;

    const supportiveBcrWtpOnly =
      supporters.bcrDce !== null &&
      isFinite(supporters.bcrDce)
        ? supporters.bcrDce
        : null;

    const effectiveWtpPerCohort =
      entry.cfg.numberOfCohorts > 0 &&
      overall.effectiveWTP !== null
        ? overall.effectiveWTP / entry.cfg.numberOfCohorts
        : null;

    const effectiveCombinedPerCohort =
      entry.cfg.numberOfCohorts > 0 &&
      overall.npvEffectiveTotal !== null
        ? (overall.effectiveWTP +
            s.epiOutbreakBenefitAllCohorts) /
          entry.cfg.numberOfCohorts
        : null;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.label}</td>
      <td>Overall sample (mixed logit)</td>
      <td>${formatPercent(
        overall.endorsementRate * 100,
        1
      )}</td>
      <td>${formatCurrency(
        costsPerCohort,
        state.currency
      )}</td>
      <td>${formatCurrency(
        totalWtpPerCohort,
        state.currency
      )}</td>
      <td>${formatCurrency(
        wtpRespPerCohort,
        state.currency
      )}</td>
      <td>${
        entry.epiIncluded
          ? formatCurrency(epiPerCohort, state.currency)
          : "Not included"
      }</td>
      <td>${
        bcrDce !== null && isFinite(bcrDce)
          ? bcrDce.toFixed(2)
          : "-"
      }</td>
      <td>${formatCurrency(
        entry.cfg.numberOfCohorts > 0
          ? npvDce / entry.cfg.numberOfCohorts
          : null,
        state.currency
      )}</td>
      <td>${
        bcrDceEpi !== null && isFinite(bcrDceEpi)
          ? bcrDceEpi.toFixed(2)
          : "-"
      }</td>
      <td>${formatCurrency(
        entry.cfg.numberOfCohorts > 0
          ? npvDceEpi / entry.cfg.numberOfCohorts
          : null,
        state.currency
      )}</td>
      <td>${formatCurrency(
        supportiveWtpPerCohort,
        state.currency
      )}</td>
      <td>${
        supportiveBcrWtpOnly !== null &&
        isFinite(supportiveBcrWtpOnly)
          ? supportiveBcrWtpOnly.toFixed(2)
          : "-"
      }</td>
      <td>${formatCurrency(
        effectiveWtpPerCohort,
        state.currency
      )}</td>
      <td>${formatCurrency(
        effectiveCombinedPerCohort,
        state.currency
      )}</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateSensitivityTab() {
  if (!state.lastResults) return;
  renderHeadlineDceBenefitsTable();
  renderDetailedSensitivityTable();
}

/* ===========================
   Charts with Chart.js
   =========================== */

function safeDestroyChart(chart) {
  if (chart && typeof chart.destroy === "function") {
    chart.destroy();
  }
}

function updateResultCharts(results) {
  const { util, costs, epi } = results;
  const endorsePercent = util.endorseProb * 100;
  const optPercent = util.optOutProb * 100;

  if (!window.Chart) return;

  const uptakeCtx = document.getElementById("chart-uptake");
  if (uptakeCtx) {
    safeDestroyChart(state.charts.uptake);
    state.charts.uptake = new Chart(uptakeCtx, {
      type: "doughnut",
      data: {
        labels: ["Endorse FETP option", "Choose opt out"],
        datasets: [
          {
            data: [endorsePercent, optPercent],
            backgroundColor: ["#1D4F91", "#9CA3AF"]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          tooltip: { enabled: true }
        },
        cutout: "55%"
      }
    });
  }

  const bcrCtx = document.getElementById("chart-bcr");
  if (bcrCtx) {
    safeDestroyChart(state.charts.bcr);
    const economicCost = costs.totalEconomicCostPerCohort;
    const epiBenefit = epi.benefitPerCohort;

    state.charts.bcr = new Chart(bcrCtx, {
      type: "bar",
      data: {
        labels: ["Per cohort"],
        datasets: [
          {
            label: "Economic cost",
            data: [economicCost],
            backgroundColor: "#1D4F91"
          },
          {
            label: "Indicative benefit",
            data: [epiBenefit],
            backgroundColor: "#0F766E"
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: ctx =>
                `${ctx.dataset.label}: ${formatCurrency(
                  ctx.parsed.y,
                  state.currency
                )}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value =>
                formatCurrency(value, state.currency)
            }
          }
        }
      }
    });
  }

  const epiCtx = document.getElementById("chart-epi");
  if (epiCtx) {
    safeDestroyChart(state.charts.epi);
    state.charts.epi = new Chart(epiCtx, {
      type: "bar",
      data: {
        labels: ["Graduates", "Outbreak responses per year"],
        datasets: [
          {
            label: "Epidemiological outputs",
            data: [
              epi.graduatesAllCohorts,
              epi.outbreaksPerYearAllCohorts
            ],
            backgroundColor: ["#1D4F91", "#0F766E"]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => formatNumber(value, 0)
            }
          }
        }
      }
    });
  }
}

function updateNationalCharts(currentResults) {
  if (!window.Chart) return;

  const scenarios = state.scenarios || [];
  const allScenarios = [];

  const currentLabel =
    currentResults.cfg.scenarioName || "Current configuration";

  allScenarios.push({
    label: currentLabel,
    totalCost: currentResults.totalCostAllCohorts,
    totalBenefit: currentResults.totalBenefitAllCohorts,
    graduates: currentResults.epi.graduatesAllCohorts,
    outbreaks: currentResults.epi.outbreaksPerYearAllCohorts,
    bcr: currentResults.bcr
  });

  scenarios.forEach((s, idx) => {
    const res = computeFullResults(s.cfg);
    allScenarios.push({
      label: s.name || `Scenario ${idx + 1}`,
      totalCost: res.totalCostAllCohorts,
      totalBenefit: res.totalBenefitAllCohorts,
      graduates: res.epi.graduatesAllCohorts,
      outbreaks: res.epi.outbreaksPerYearAllCohorts,
      bcr: res.bcr
    });
  });

  const labels = allScenarios.map(s => s.label);
  const costs = allScenarios.map(s => s.totalCost);
  const benefits = allScenarios.map(s => s.totalBenefit);
  const grads = allScenarios.map(s => s.graduates);
  const outbreaks = allScenarios.map(s => s.outbreaks);
  const bcrs = allScenarios.map(s =>
    s.bcr !== null && isFinite(s.bcr) ? s.bcr : 0
  );

  const natCostCtx = document.getElementById(
    "chart-nat-cost-benefit"
  );
  if (natCostCtx) {
    safeDestroyChart(state.charts.natCostBenefit);
    state.charts.natCostBenefit = new Chart(natCostCtx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Total economic cost",
            data: costs,
            backgroundColor: "#1D4F91"
          },
          {
            label: "Total epidemiological benefit",
            data: benefits,
            backgroundColor: "#0F766E"
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: ctx =>
                `${ctx.dataset.label}: ${formatCurrency(
                  ctx.parsed.y,
                  state.currency
                )}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value =>
                formatCurrency(value, state.currency)
            }
          }
        }
      }
    });
  }

  const natEpiCtx = document.getElementById("chart-nat-epi");
  if (natEpiCtx) {
    safeDestroyChart(state.charts.natGradOutbreak);
    state.charts.natGradOutbreak = new Chart(natEpiCtx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Total graduates",
            data: grads,
            backgroundColor: "#1D4F91"
          },
          {
            label: "Outbreak responses per year",
            data: outbreaks,
            backgroundColor: "#0F766E"
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          tooltip: { enabled: true }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => formatNumber(value, 0)
            }
          }
        }
      }
    });
  }

  const natBcrCtx = document.getElementById("chart-nat-bcr");
  if (natBcrCtx) {
    safeDestroyChart(state.charts.natBcr);
    state.charts.natBcr = new Chart(natBcrCtx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Benefit cost ratio",
            data: bcrs,
            backgroundColor: "#1D4F91"
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx =>
                `BCR: ${ctx.parsed.y.toFixed(2)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

/* ===========================
   Saved scenarios
   =========================== */

function updateScenarioTable() {
  const table = document.getElementById("scenario-table");
  if (!table) return;
  const tbody = table.querySelector("tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  (state.scenarios || []).forEach((s, idx) => {
    const res = computeFullResults(s.cfg);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="checkbox" data-scenario-index="${idx}"></td>
      <td>${s.name || `Scenario ${idx + 1}`}</td>
      <td>${s.tags || ""}</td>
      <td>${s.cfg.tier}</td>
      <td>${s.cfg.career}</td>
      <td>${s.cfg.mentorship}</td>
      <td>${s.cfg.delivery}</td>
      <td>${s.cfg.response} days</td>
      <td>${formatNumber(s.cfg.numberOfCohorts, 0)}</td>
      <td>${formatNumber(s.cfg.traineesPerCohort, 0)}</td>
      <td>${formatCurrency(
        s.cfg.costPerTraineePerMonth,
        state.currency
      )}</td>
      <td>${s.modelLabel || ""}</td>
      <td>${formatPercent(
        res.util.endorseProb * 100,
        1
      )}</td>
      <td>${
        res.util.wtpConfig !== null &&
        isFinite(res.util.wtpConfig)
          ? formatCurrency(
              res.util.wtpConfig,
              state.currency
            )
          : "-"
      }</td>
      <td>${
        res.dceCba &&
        res.dceCba.profiles &&
        res.dceCba.profiles.overall &&
        res.dceCba.profiles.overall.wtpAllCohorts !== null
          ? formatCurrency(
              res.dceCba.profiles.overall.wtpAllCohorts,
              state.currency
            )
          : "-"
      }</td>
      <td>${
        res.bcr !== null && isFinite(res.bcr)
          ? res.bcr.toFixed(2)
          : "-"
      }</td>
      <td>${formatCurrency(
        res.totalCostAllCohorts,
        state.currency
      )}</td>
      <td>${formatCurrency(
        res.totalBenefitAllCohorts,
        state.currency
      )}</td>
      <td>${formatCurrency(
        res.netBenefitAllCohorts,
        state.currency
      )}</td>
      <td>${formatNumber(
        res.epi.outbreaksPerYearAllCohorts,
        1
      )}</td>
      <td>${s.notes || ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

function saveCurrentScenario() {
  if (!state.lastResults) {
    showToast("Apply a configuration before saving.", "warning");
    return;
  }

  const cfg = state.lastResults.cfg;
  const notesInput = document.getElementById("scenario-notes");
  const scenarioNotes = notesInput ? notesInput.value.trim() : "";

  const name =
    cfg.scenarioName && cfg.scenarioName.trim()
      ? cfg.scenarioName.trim()
      : `Scenario ${state.scenarios.length + 1}`;

  const modelLabel =
    state.model === "lc2"
      ? "Supportive group (latent class)"
      : state.model === "lc1"
      ? "Conservative group (latent class)"
      : "Average mixed logit";

  const newScenario = {
    name,
    cfg: { ...cfg },
    modelLabel,
    notes: scenarioNotes || cfg.scenarioNotes || "",
    tags: `tier:${cfg.tier}, mentorship:${cfg.mentorship}, response:${cfg.response}d`
  };

  state.scenarios.push(newScenario);
  updateScenarioTable();
  updateNationalCharts(state.lastResults);
  updateSensitivityTab();
  showToast("Scenario saved and added to comparison tables.", "success");
}

/* ===========================
   Export helpers (Excel / PDF)
   =========================== */

function getSelectedScenarioIndices() {
  const checkboxes = document.querySelectorAll(
    '#scenario-table tbody input[type="checkbox"]'
  );
  const indices = [];
  checkboxes.forEach(cb => {
    if (cb.checked) {
      const idx = parseInt(cb.dataset.scenarioIndex, 10);
      if (!isNaN(idx)) indices.push(idx);
    }
  });
  return indices;
}

function buildScenarioExportRows() {
  const rows = [];
  (state.scenarios || []).forEach((s, idx) => {
    const res = computeFullResults(s.cfg);
    rows.push({
      index: idx + 1,
      name: s.name || `Scenario ${idx + 1}`,
      tier: s.cfg.tier,
      career: s.cfg.career,
      mentorship: s.cfg.mentorship,
      delivery: s.cfg.delivery,
      response_days: s.cfg.response,
      cohorts: s.cfg.numberOfCohorts,
      trainees_per_cohort: s.cfg.traineesPerCohort,
      cost_per_trainee_month_inr: s.cfg.costPerTraineePerMonth,
      total_cost_all_cohorts_inr: res.totalCostAllCohorts,
      total_epi_benefit_all_cohorts_inr: res.totalBenefitAllCohorts,
      net_epi_benefit_all_cohorts_inr: res.netBenefitAllCohorts,
      endorsement_percent: res.util.endorseProb * 100,
      wtp_per_trainee_month_inr: res.util.wtpConfig,
      bcr_epi: res.bcr
    });
  });
  return rows;
}

function exportScenariosToExcel() {
  if (typeof XLSX === "undefined") {
    showToast("Excel export library not loaded.", "error");
    return;
  }
  const rows = buildScenarioExportRows();
  if (!rows.length) {
    showToast("No scenarios to export.", "warning");
    return;
  }
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "STEPS scenarios");
  XLSX.writeFile(wb, "steps_fetp_scenarios.xlsx");
  showToast("Scenario table exported to Excel.", "success");
}

function exportSensitivityTablesToExcel() {
  if (typeof XLSX === "undefined") {
    showToast("Excel export library not loaded.", "error");
    return;
  }
  const wb = XLSX.utils.book_new();

  const dceTable = document.getElementById("dce-benefits-table");
  if (dceTable) {
    const ws1 = XLSX.utils.table_to_sheet(dceTable);
    XLSX.utils.book_append_sheet(wb, ws1, "Headline DCE benefits");
  }

  const sensTable = document.getElementById("sensitivity-table");
  if (sensTable) {
    const ws2 = XLSX.utils.table_to_sheet(sensTable);
    XLSX.utils.book_append_sheet(wb, ws2, "Detailed sensitivity");
  }

  XLSX.writeFile(wb, "steps_fetp_dce_sensitivity.xlsx");
  showToast("DCE sensitivity tables exported to Excel.", "success");
}

function exportTableToPdf(tableId, title) {
  if (typeof window.jspdf === "undefined" && typeof window.jsPDF === "undefined") {
    showToast("PDF export library not loaded.", "error");
    return;
  }
  const table = document.getElementById(tableId);
  if (!table) {
    showToast("Table not found for PDF export.", "error");
    return;
  }

  const { jsPDF } = window.jspdf || window;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4"
  });

  doc.setFontSize(12);
  doc.text(title, 40, 40);

  const rows = [];
  const headers = [];
  const headerCells = table.querySelectorAll("thead tr th");
  headerCells.forEach(th => headers.push(th.textContent.trim()));

  const bodyRows = table.querySelectorAll("tbody tr");
  bodyRows.forEach(tr => {
    const row = [];
    tr.querySelectorAll("td").forEach(td => {
      row.push(td.textContent.trim());
    });
    rows.push(row);
  });

  const startY = 60;
  let y = startY;
  const rowHeight = 18;

  doc.setFontSize(9);

  doc.text(headers.join(" | "), 40, y);
  y += rowHeight;

  rows.forEach(r => {
    if (y > 550) {
      doc.addPage();
      y = 40;
    }
    doc.text(r.join(" | "), 40, y);
    y += rowHeight;
  });

  doc.save(title.toLowerCase().replace(/\s+/g, "_") + ".pdf");
}

/* ===========================
   Results modal / snapshot
   =========================== */

function buildScenarioSummaryHtml(results) {
  const { cfg, util, costs, epi, totalCostAllCohorts, totalBenefitAllCohorts, netBenefitAllCohorts, bcr } = results;

  const tierLabelMap = {
    frontline: "Frontline (3 months)",
    intermediate: "Intermediate (12 months)",
    advanced: "Advanced (24 months)"
  };
  const careerLabelMap = {
    certificate: "Government and partner certificate",
    uniqual: "University qualification",
    career_path: "Government career pathway"
  };
  const mentorshipLabelMap = {
    low: "Low mentorship (5 or more fellows per mentor)",
    medium: "Medium mentorship (3 to 4 fellows per mentor)",
    high: "High mentorship (maximum 2 fellows per mentor)"
  };
  const deliveryLabelMap = {
    blended: "Blended delivery",
    inperson: "Fully in person delivery",
    online: "Fully online delivery"
  };
  const responseLabelMap = {
    30: "Detect and respond within 30 days",
    15: "Detect and respond within 15 days",
    7: "Detect and respond within 7 days"
  };

  const tierLabel = tierLabelMap[cfg.tier] || cfg.tier;
  const careerLabel = careerLabelMap[cfg.career] || cfg.career;
  const mentorshipLabel = mentorshipLabelMap[cfg.mentorship] || cfg.mentorship;
  const deliveryLabel = deliveryLabelMap[cfg.delivery] || cfg.delivery;
  const responseLabel = responseLabelMap[cfg.response] || `${cfg.response} days`;

  const endorsementPercent = util.endorseProb * 100;
  const optOutPercent = util.optOutProb * 100;

  return `
    <h3>Configuration</h3>
    <p><strong>Scenario name:</strong> ${cfg.scenarioName || "Current configuration"}</p>
    <p><strong>Programme tier:</strong> ${tierLabel}</p>
    <p><strong>Career incentive:</strong> ${careerLabel}</p>
    <p><strong>Mentorship intensity:</strong> ${mentorshipLabel}</p>
    <p><strong>Delivery mode:</strong> ${deliveryLabel}</p>
    <p><strong>Expected response time:</strong> ${responseLabel}</p>
    <p><strong>Trainees per cohort:</strong> ${formatNumber(cfg.traineesPerCohort, 0)}</p>
    <p><strong>Number of cohorts:</strong> ${formatNumber(cfg.numberOfCohorts, 0)}</p>
    <p><strong>Cost per trainee per month:</strong> ${formatCurrency(cfg.costPerTraineePerMonth, state.currency)}</p>

    <h3>Preference and endorsement</h3>
    <p><strong>Endorsement:</strong> ${formatPercent(endorsementPercent, 1)} (choose FETP option)</p>
    <p><strong>Opt out:</strong> ${formatPercent(optOutPercent, 1)} (keep status quo)</p>
    <p><strong>WTP per trainee per month:</strong> ${
      util.wtpConfig !== null && isFinite(util.wtpConfig)
        ? formatCurrency(util.wtpConfig, state.currency)
        : "-"
    }</p>

    <h3>Costs and epidemiological benefits</h3>
    <p><strong>Programme cost per cohort:</strong> ${formatCurrency(costs.programmeCostPerCohort, state.currency)}</p>
    <p><strong>Total economic cost per cohort:</strong> ${formatCurrency(costs.totalEconomicCostPerCohort, state.currency)}</p>
    <p><strong>Total economic cost (all cohorts):</strong> ${formatCurrency(totalCostAllCohorts, state.currency)}</p>
    <p><strong>Indicative epidemiological benefit per cohort:</strong> ${formatCurrency(epi.benefitPerCohort, state.currency)}</p>
    <p><strong>Total epidemiological benefit (all cohorts):</strong> ${formatCurrency(totalBenefitAllCohorts, state.currency)}</p>
    <p><strong>Net epidemiological benefit (all cohorts):</strong> ${formatCurrency(netBenefitAllCohorts, state.currency)}</p>
    <p><strong>Benefit cost ratio (national):</strong> ${
      bcr !== null && isFinite(bcr) ? bcr.toFixed(2) : "-"
    }</p>

    <h3>Epidemiological outputs</h3>
    <p><strong>Graduates (all cohorts):</strong> ${formatNumber(epi.graduatesAllCohorts, 0)}</p>
    <p><strong>Outbreak responses per year (all cohorts):</strong> ${formatNumber(epi.outbreaksPerYearAllCohorts, 1)}</p>
  `;
}

function openResultsModal() {
  if (!state.lastResults) {
    showToast("Apply a configuration to see the summary.", "warning");
    return;
  }
  const modal = document.getElementById("results-modal");
  const body = document.getElementById("modal-body");
  if (!modal || !body) return;

  body.innerHTML = buildScenarioSummaryHtml(state.lastResults);
  modal.classList.remove("hidden");
}

function closeResultsModal() {
  const modal = document.getElementById("results-modal");
  if (!modal) return;
  modal.classList.add("hidden");
}

/* ===========================
   Copilot / AI briefing integration
   =========================== */

function buildCopilotScenarioJson(results) {
  if (!results) return null;

  const { cfg, util, costs, epi, totalCostAllCohorts, totalBenefitAllCohorts, netBenefitAllCohorts, bcr, dceCba } = results;

  const tierLabelMap = {
    frontline: "Frontline (3 months)",
    intermediate: "Intermediate (12 months)",
    advanced: "Advanced (24 months)"
  };
  const careerLabelMap = {
    certificate: "Government and partner certificate",
    uniqual: "University qualification",
    career_path: "Government career pathway"
  };
  const mentorshipLabelMap = {
    low: "Low mentorship (5 or more fellows per mentor)",
    medium: "Medium mentorship (3 to 4 fellows per mentor)",
    high: "High mentorship (maximum 2 fellows per mentor)"
  };
  const deliveryLabelMap = {
    blended: "Blended delivery (mix of in person, online and field work)",
    inperson: "Fully in person delivery",
    online: "Fully online delivery"
  };
  const responseLabelMap = {
    30: "Detect and respond within 30 days",
    15: "Detect and respond within 15 days",
    7: "Detect and respond within 7 days"
  };

  const template = getCurrentCostTemplate(cfg.tier);

  const modelLabel =
    state.model === "lc2"
      ? "Supportive group (latent class)"
      : state.model === "lc1"
      ? "Conservative group (latent class)"
      : "Average mixed logit";

  const scenarioSummary = dceCba ? dceCba.scenarioSummary : null;

  return {
    toolName: "STEPS FETP India Decision Aid",
    version: "1.0",
    context: {
      country: "India",
      purpose: "Exploring national scale up options for Field Epidemiology Training Programmes (FETP) in partnership with the Ministry of Health and Family Welfare and the World Bank.",
      planningHorizonYears: state.epiSettings.general.planningHorizonYears || 5
    },
    configuration: {
      scenarioName: cfg.scenarioName || "Current configuration",
      scenarioNotes: cfg.scenarioNotes || "",
      programmeTierCode: cfg.tier,
      programmeTierLabel: tierLabelMap[cfg.tier] || cfg.tier,
      careerIncentiveCode: cfg.career,
      careerIncentiveLabel: careerLabelMap[cfg.career] || cfg.career,
      mentorshipIntensityCode: cfg.mentorship,
      mentorshipIntensityLabel: mentorshipLabelMap[cfg.mentorship] || cfg.mentorship,
      deliveryModeCode: cfg.delivery,
      deliveryModeLabel: deliveryLabelMap[cfg.delivery] || cfg.delivery,
      expectedResponseTimeDays: Number(cfg.response),
      expectedResponseTimeLabel: responseLabelMap[cfg.response] || `${cfg.response} days`,
      costPerTraineePerMonthInr: cfg.costPerTraineePerMonth,
      traineesPerCohort: cfg.traineesPerCohort,
      numberOfCohorts: cfg.numberOfCohorts,
      programmeDurationMonths: getProgrammeDurationMonths(cfg.tier),
      preferenceModelId: state.model,
      preferenceModelLabel: modelLabel,
      includeOpportunityCost: state.includeOpportunityCost,
      costTemplateSource: template ? template.label : "No template selected"
    },
    endorsementAndWtp: {
      endorsementShareOverall: util.endorseProb,
      endorsementPercentOverall: util.endorseProb * 100,
      optOutShare: util.optOutProb,
      optOutPercent: util.optOutProb * 100,
      wtpPerTraineePerMonthInr: util.wtpConfig,
      wtpComponentsPerTraineePerMonthInr: util.wtpComponents || null
    },
    costsAndBenefits: {
      durationMonths: costs.durationMonths,
      programmeCostPerCohortInr: costs.programmeCostPerCohort,
      opportunityCostPerCohortInr: costs.opportunityCostPerCohort,
      totalEconomicCostPerCohortInr: costs.totalEconomicCostPerCohort,
      totalEconomicCostAllCohortsInr: totalCostAllCohorts,
      totalEpiBenefitAllCohortsInr: totalBenefitAllCohorts,
      netEpiBenefitAllCohortsInr: netBenefitAllCohorts,
      benefitCostRatioNational: bcr
    },
    epidemiologicalOutputs: {
      graduatesAllCohorts: epi.graduatesAllCohorts,
      outbreakResponsesPerYearAllCohorts: epi.outbreaksPerYearAllCohorts,
      benefitGraduatesAllCohortsInr: epi.benefitGraduatesAllCohorts,
      benefitOutbreaksAllCohortsInr: epi.benefitOutbreaksAllCohorts,
      benefitPerCohortInr: epi.benefitPerCohort
    },
    dceProfiles: scenarioSummary || null,
    displayCurrency: state.currency,
    inrPerUsdForDisplay: state.epiSettings.general.inrPerUsd || 83
  };
}

function buildCopilotPrompt(results) {
  const payload = buildCopilotScenarioJson(results);
  if (!payload) return "";

  const jsonBlock = JSON.stringify(
    { scenarioPayload: payload },
    null,
    2
  );

  const instructions = [
    "You are a senior health economist advising the Ministry of Health and Family Welfare in India.",
    "You have received a scenario exported from the STEPS FETP India Decision Aid (Scalable Training Estimation and Planning System).",
    "Use only the information provided in the JSON object called scenarioPayload below. Do not invent extra numbers.",
    "",
    "Please write a concise policy briefing for senior decision makers that:",
    "1. Starts with a short non technical summary that states whether the option looks attractive overall.",
    "2. Interprets endorsement, willingness to pay, costs, benefits, net benefits and benefit cost ratios in plain language.",
    "3. Explains the epidemiological outputs (graduates, outbreak responses, response time) and how they relate to the training tier, mentorship intensity, delivery mode and career incentives.",
    "4. Highlights any issues that a World Bank or cabinet level committee should consider, such as affordability, value for money, scale up risks and alignment with the FETP strategy.",
    "5. Ends with clear recommendations and a small set of talking points for a high level meeting.",
    "",
    "ScenarioPayload JSON (for you to parse programmatically):",
    jsonBlock
  ];

  return instructions.join("\n");
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  // Fallback
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch (e) {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
}

async function handleOpenInCopilotClick() {
  if (!state.lastResults) {
    showToast("Apply a configuration before opening Copilot.", "warning");
    return;
  }

  const promptText = buildCopilotPrompt(state.lastResults);
  if (!promptText) {
    showToast("Could not build Copilot prompt for the current scenario.", "error");
    return;
  }

  let copied = false;
  try {
    copied = await copyTextToClipboard(promptText);
  } catch (e) {
    copied = false;
  }

  if (copied) {
    showToast("Scenario prompt copied to clipboard. Copilot will open in a new tab.", "success");
  } else {
    showToast("Could not copy prompt to clipboard. The prompt will be shown in a dialog.", "warning");
    alert(promptText);
  }

  try {
    window.open("https://copilot.microsoft.com/", "_blank", "noopener");
  } catch (e) {
    // Ignore if blocked
  }
}

/* ===========================
   Advanced settings UI
   =========================== */

function loadAdvancedSettingsIntoUi() {
  const s = state.epiSettings;

  const inrPerUsdInput = document.getElementById("adv-inr-per-usd");
  if (inrPerUsdInput) {
    inrPerUsdInput.value = s.general.inrPerUsd || 83;
  }

  const f = s.tiers.frontline;
  const i = s.tiers.intermediate;
  const a = s.tiers.advanced;

  const map = [
    ["adv-frontline-grads", f.gradShare],
    ["adv-frontline-outbreaks", f.outbreaksPerCohortPerYear],
    ["adv-frontline-vgrad", f.valuePerGraduate],
    ["adv-frontline-voutbreak", f.valuePerOutbreak],
    ["adv-intermediate-grads", i.gradShare],
    ["adv-intermediate-outbreaks", i.outbreaksPerCohortPerYear],
    ["adv-intermediate-vgrad", i.valuePerGraduate],
    ["adv-intermediate-voutbreak", i.valuePerOutbreak],
    ["adv-advanced-grads", a.gradShare],
    ["adv-advanced-outbreaks", a.outbreaksPerCohortPerYear],
    ["adv-advanced-vgrad", a.valuePerGraduate],
    ["adv-advanced-voutbreak", a.valuePerOutbreak]
  ];

  map.forEach(([id, val]) => {
    const input = document.getElementById(id);
    if (input && typeof val === "number") {
      input.value = val;
    }
  });
}

function applyAdvancedSettingsFromUi() {
  const s = state.epiSettings;

  const inrPerUsdInput = document.getElementById("adv-inr-per-usd");
  if (inrPerUsdInput) {
    const v = parseFloat(inrPerUsdInput.value);
    if (!isNaN(v) && v > 0) {
      s.general.inrPerUsd = v;
    }
  }

  function setTierSetting(tierKey, field, inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const v = parseFloat(input.value);
    if (!isNaN(v) && v >= 0) {
      s.tiers[tierKey][field] = v;
    }
  }

  setTierSetting("frontline", "gradShare", "adv-frontline-grads");
  setTierSetting("frontline", "outbreaksPerCohortPerYear", "adv-frontline-outbreaks");
  setTierSetting("frontline", "valuePerGraduate", "adv-frontline-vgrad");
  setTierSetting("frontline", "valuePerOutbreak", "adv-frontline-voutbreak");

  setTierSetting("intermediate", "gradShare", "adv-intermediate-grads");
  setTierSetting("intermediate", "outbreaksPerCohortPerYear", "adv-intermediate-outbreaks");
  setTierSetting("intermediate", "valuePerGraduate", "adv-intermediate-vgrad");
  setTierSetting("intermediate", "valuePerOutbreak", "adv-intermediate-voutbreak");

  setTierSetting("advanced", "gradShare", "adv-advanced-grads");
  setTierSetting("advanced", "outbreaksPerCohortPerYear", "adv-advanced-outbreaks");
  setTierSetting("advanced", "valuePerGraduate", "adv-advanced-vgrad");
  setTierSetting("advanced", "valuePerOutbreak", "adv-advanced-voutbreak");

  if (state.lastResults) {
    const cfg = { ...state.lastResults.cfg };
    const results = computeFullResults(cfg);
    refreshAll(results, { skipToast: true });
  }

  updateAssumptionLog();
  showToast("Advanced settings applied.", "success");
}

function resetAdvancedSettings() {
  state.epiSettings = JSON.parse(JSON.stringify(DEFAULT_EPI_SETTINGS));
  loadAdvancedSettingsIntoUi();

  if (state.lastResults) {
    const cfg = { ...state.lastResults.cfg };
    const results = computeFullResults(cfg);
    refreshAll(results, { skipToast: true });
  }

  updateAssumptionLog();
  showToast("Advanced settings reset to defaults.", "success");
}

function updateAssumptionLog() {
  const el = document.getElementById("assumption-log-text");
  if (!el) return;

  const s = state.epiSettings;
  const lines = [];

  lines.push("Planning horizon (years): " + (s.general.planningHorizonYears || 5));
  lines.push("INR per USD (display only): " + (s.general.inrPerUsd || 83));
  lines.push("");

  ["frontline", "intermediate", "advanced"].forEach(tier => {
    const t = s.tiers[tier];
    if (!t) return;
    lines.push("Tier: " + tier);
    lines.push("  Graduates per cohort (share of trainees): " + t.gradShare);
    lines.push("  Outbreak responses per cohort per year: " + t.outbreaksPerCohortPerYear);
    lines.push("  Value per graduate (INR): " + t.valuePerGraduate);
    lines.push("  Value per outbreak response (INR): " + t.valuePerOutbreak);
    lines.push("");
  });

  el.textContent = lines.join("\n");
}

/* ===========================
   Tour (simple implementation)
   =========================== */

function buildTourSteps() {
  const stepElements = document.querySelectorAll("[data-tour-step]");
  const steps = [];
  stepElements.forEach(el => {
    const stepId = el.getAttribute("data-tour-step") || "";
    const title = el.getAttribute("data-tour-title") || "";
    const content = el.getAttribute("data-tour-content") || "";
    steps.push({ el, stepId, title, content });
  });
  state.tour.steps = steps;
}

function showTourStep(index) {
  const overlay = document.getElementById("tour-overlay");
  const popover = document.getElementById("tour-popover");
  if (!overlay || !popover) return;
  const titleEl = document.getElementById("tour-title");
  const contentEl = document.getElementById("tour-content");
  const indicatorEl = document.getElementById("tour-step-indicator");

  if (index < 0 || index >= state.tour.steps.length) {
    overlay.classList.add("hidden");
    popover.classList.add("hidden");
    state.tour.active = false;
    return;
  }

  const step = state.tour.steps[index];
  const rect = step.el.getBoundingClientRect();

  overlay.classList.remove("hidden");
  popover.classList.remove("hidden");

  const popRect = popover.getBoundingClientRect();
  let top = rect.bottom + 12;
  let left = rect.left;

  if (top + popRect.height > window.innerHeight - 20) {
    top = rect.top - popRect.height - 12;
  }
  if (left + popRect.width > window.innerWidth - 20) {
    left = window.innerWidth - popRect.width - 20;
  }
  if (left < 12) left = 12;
  if (top < 12) top = 12;

  popover.style.top = `${top + window.scrollY}px`;
  popover.style.left = `${left + window.scrollX}px`;

  if (titleEl) titleEl.textContent = step.title || "Tour step";
  if (contentEl) contentEl.textContent = step.content || "";
  if (indicatorEl) {
    indicatorEl.textContent = `${index + 1} / ${state.tour.steps.length}`;
  }

  state.tour.stepIndex = index;
  state.tour.active = true;
}

function startTour() {
  if (!state.tour.steps.length) {
    buildTourSteps();
  }
  if (!state.tour.steps.length) {
    showToast("No tour steps defined in this page.", "warning");
    return;
  }
  showTourStep(0);
}

function nextTourStep() {
  if (!state.tour.active) return;
  const nextIndex = state.tour.stepIndex + 1;
  if (nextIndex >= state.tour.steps.length) {
    endTour();
  } else {
    showTourStep(nextIndex);
  }
}

function prevTourStep() {
  if (!state.tour.active) return;
  const prevIndex = state.tour.stepIndex - 1;
  if (prevIndex < 0) {
    showTourStep(0);
  } else {
    showTourStep(prevIndex);
  }
}

function endTour() {
  const overlay = document.getElementById("tour-overlay");
  const popover = document.getElementById("tour-popover");
  if (overlay) overlay.classList.add("hidden");
  if (popover) popover.classList.add("hidden");
  state.tour.active = false;
}

/* ===========================
   External config loading
   =========================== */

function tryLoadJsonFile(path, onSuccess) {
  fetch(path)
    .then(resp => {
      if (!resp.ok) throw new Error("Not found");
      return resp.json();
    })
    .then(json => {
      if (typeof onSuccess === "function") {
        onSuccess(json);
      }
    })
    .catch(() => {
      // silent if missing
    });
}

function loadExternalConfigsIfPresent() {
  tryLoadJsonFile("epi_config.json", json => {
    if (json && json.general && json.tiers) {
      state.epiSettings = JSON.parse(JSON.stringify(json));
      loadAdvancedSettingsIntoUi();
      updateAssumptionLog();
      if (state.lastResults) {
        const cfg = { ...state.lastResults.cfg };
        const results = computeFullResults(cfg);
        refreshAll(results, { skipToast: true });
      }
    }
  });

  tryLoadJsonFile("cost_config.json", json => {
    COST_CONFIG = json;
    if (state.currentTier) {
      populateCostSourceOptions(state.currentTier);
      if (state.lastResults) {
        const cfg = { ...state.lastResults.cfg };
        const results = computeFullResults(cfg);
        refreshAll(results, { skipToast: true });
      }
    }
  });
}

/* ===========================
   Event wiring and init
   =========================== */

function setupModelAndCurrencyToggles() {
  document.querySelectorAll(".pill-toggle-group").forEach(group => {
    group.addEventListener("click", e => {
      const btn = e.target.closest(".pill-toggle");
      if (!btn) return;

      group.querySelectorAll(".pill-toggle").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.dataset.model) {
        const modelId = btn.dataset.model;
        state.model = modelId;
        if (state.lastResults) {
          const cfg = { ...state.lastResults.cfg };
          const results = computeFullResults(cfg);
          refreshAll(results, { skipToast: true });
        }
      }

      if (btn.dataset.currency) {
        const curr = btn.dataset.currency;
        state.currency = curr;
        const labelEl = document.getElementById("currency-label");
        if (labelEl) labelEl.textContent = curr;
        if (state.lastResults) {
          // No need to recompute utilities, just re-render
          refreshAll(state.lastResults, { skipToast: true });
        }
      }
    });
  });

  const oppToggle = document.getElementById("opp-toggle");
  if (oppToggle) {
    oppToggle.addEventListener("click", () => {
      const isOn = oppToggle.classList.contains("on");
      if (isOn) {
        oppToggle.classList.remove("on");
        state.includeOpportunityCost = false;
        const label = oppToggle.querySelector(".switch-label");
        if (label) label.textContent = "Opportunity cost excluded";
      } else {
        oppToggle.classList.add("on");
        state.includeOpportunityCost = true;
        const label = oppToggle.querySelector(".switch-label");
        if (label) label.textContent = "Opportunity cost included";
      }
      if (state.lastResults) {
        const cfg = { ...state.lastResults.cfg };
        const results = computeFullResults(cfg);
        refreshAll(results, { skipToast: true });
      }
    });
  }

  const sensitivityEpiToggle = document.getElementById("sensitivity-epi-toggle");
  if (sensitivityEpiToggle) {
    sensitivityEpiToggle.addEventListener("click", () => {
      if (sensitivityEpiToggle.classList.contains("on")) {
        sensitivityEpiToggle.classList.remove("on");
        const label = sensitivityEpiToggle.querySelector(".switch-label");
        if (label) label.textContent = "Outbreak benefits excluded";
      } else {
        sensitivityEpiToggle.classList.add("on");
        const label = sensitivityEpiToggle.querySelector(".switch-label");
        if (label) label.textContent = "Outbreak benefits included";
      }
      updateSensitivityTab();
    });
  }
}

function setupConfigControls() {
  const tierSelect = document.getElementById("program-tier");
  if (tierSelect) {
    tierSelect.addEventListener("change", () => {
      state.currentTier = tierSelect.value || "frontline";
      populateCostSourceOptions(state.currentTier);
      if (state.lastResults) {
        const cfg = { ...state.lastResults.cfg, tier: state.currentTier };
        const results = computeFullResults(cfg);
        refreshAll(results, { skipToast: true });
      }
    });
  }

  const costSlider = document.getElementById("cost-slider");
  const costDisplay = document.getElementById("cost-display");
  if (costSlider && costDisplay) {
    const updateSliderDisplay = () => {
      const v = parseFloat(costSlider.value) || 0;
      costDisplay.textContent = formatCurrencyInr(v);
    };
    costSlider.addEventListener("input", updateSliderDisplay);
    updateSliderDisplay();
  }

  const applyBtn = document.getElementById("update-results");
  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const cfg = readConfigurationFromInputs();
      const results = computeFullResults(cfg);
      refreshAll(results);
    });
  }

  const snapshotBtn = document.getElementById("open-snapshot");
  if (snapshotBtn) {
    snapshotBtn.addEventListener("click", () => openResultsModal());
  }

  const closeModalBtn = document.getElementById("close-modal");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => closeResultsModal());
  }

  const modal = document.getElementById("results-modal");
  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeResultsModal();
    });
  }

  const saveScenarioBtn = document.getElementById("save-scenario");
  if (saveScenarioBtn) {
    saveScenarioBtn.addEventListener("click", () => saveCurrentScenario());
  }
}

function setupExportButtons() {
  const exportScenariosExcelBtn = document.getElementById("export-excel");
  if (exportScenariosExcelBtn) {
    exportScenariosExcelBtn.addEventListener("click", () => exportScenariosToExcel());
  }

  const exportScenariosPdfBtn = document.getElementById("export-pdf");
  if (exportScenariosPdfBtn) {
    exportScenariosPdfBtn.addEventListener("click", () => {
      exportTableToPdf("scenario-table", "STEPS FETP scenarios");
    });
  }

  const exportSensExcelBtn = document.getElementById("export-sensitivity-benefits-excel");
  if (exportSensExcelBtn) {
    exportSensExcelBtn.addEventListener("click", () => exportSensitivityTablesToExcel());
  }

  const exportSensPdfBtn = document.getElementById("export-sensitivity-benefits-pdf");
  if (exportSensPdfBtn) {
    exportSensPdfBtn.addEventListener("click", () => {
      exportTableToPdf("dce-benefits-table", "STEPS DCE headline benefits");
    });
  }
}

function setupSensitivityButtons() {
  const refreshSensBtn = document.getElementById("refresh-sensitivity-benefits");
  if (refreshSensBtn) {
    refreshSensBtn.addEventListener("click", () => updateSensitivityTab());
  }

  const benefitDefSelect = document.getElementById("benefit-definition-select");
  if (benefitDefSelect) {
    benefitDefSelect.addEventListener("change", () => updateSensitivityTab());
  }

  const classSelect = document.getElementById("benefit-class-scenario");
  if (classSelect) {
    classSelect.addEventListener("change", () => updateSensitivityTab());
  }

  const endorseOverride = document.getElementById("endorsement-override");
  if (endorseOverride) {
    endorseOverride.addEventListener("change", () => updateSensitivityTab());
  }
}

function setupCopilotButton() {
  const copilotBtn = document.getElementById("open-in-copilot");
  if (copilotBtn) {
    copilotBtn.addEventListener("click", () => {
      handleOpenInCopilotClick();
    });
  }
}

function setupTourControls() {
  const startTourBtn = document.getElementById("btn-start-tour");
  if (startTourBtn) {
    startTourBtn.addEventListener("click", () => startTour());
  }

  const tourNext = document.getElementById("tour-next");
  if (tourNext) {
    tourNext.addEventListener("click", () => nextTourStep());
  }

  const tourPrev = document.getElementById("tour-prev");
  if (tourPrev) {
    tourPrev.addEventListener("click", () => prevTourStep());
  }

  const tourClose = document.getElementById("tour-close");
  if (tourClose) {
    tourClose.addEventListener("click", () => endTour());
  }

  const overlay = document.getElementById("tour-overlay");
  if (overlay) {
    overlay.addEventListener("click", () => endTour());
  }
}

function initApp() {
  setupTabs();
  setupInfoTooltips();
  setupModelAndCurrencyToggles();
  setupConfigControls();
  setupExportButtons();
  setupSensitivityButtons();
  setupCopilotButton();
  setupTourControls();

  // Initial tier and cost templates
  const tierSelect = document.getElementById("program-tier");
  state.currentTier = tierSelect ? tierSelect.value || "frontline" : "frontline";
  populateCostSourceOptions(state.currentTier);

  // Advanced settings
  loadAdvancedSettingsIntoUi();
  updateAssumptionLog();

  // Initial configuration and results
  const cfg = readConfigurationFromInputs();
  const results = computeFullResults(cfg);
  refreshAll(results, { skipToast: true });

  // Load external config files if present
  loadExternalConfigsIfPresent();

  // Prepare tour steps
  buildTourSteps();
}

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});
