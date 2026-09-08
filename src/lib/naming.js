// Pure naming logic — no React — so it can be smoke-tested directly with
// `node` against known input/output pairs.

// Microsoft Cloud Adoption Framework abbreviations:
// https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations
export const RESOURCE_TYPES = [
  { value: "rg", label: "Resource Group" },
  { value: "vnet", label: "Virtual Network" },
  { value: "snet", label: "Subnet" },
  { value: "nsg", label: "Network Security Group" },
  { value: "vm", label: "Virtual Machine" },
  { value: "aks", label: "AKS Cluster" },
  { value: "st", label: "Storage Account" },
  { value: "kv", label: "Key Vault" },
  { value: "app", label: "App Service" },
  { value: "func", label: "Function App" },
  { value: "sql", label: "SQL Server" },
  { value: "sqldb", label: "SQL Database" },
  { value: "cosmos", label: "Cosmos DB Account" },
  { value: "pip", label: "Public IP" },
  { value: "lb", label: "Load Balancer" },
  { value: "cr", label: "Container Registry" },
  { value: "log", label: "Log Analytics Workspace" },
];

export const ENVIRONMENTS = ["dev", "tst", "acc", "prd", "shared"];

export const REGIONS = [
  { value: "eus", label: "East US" },
  { value: "wus2", label: "West US 2" },
  { value: "weu", label: "West Europe" },
  { value: "neu", label: "North Europe" },
  { value: "uks", label: "UK South" },
  { value: "sea", label: "Southeast Asia" },
];

// Resource types whose Azure naming rules forbid dashes and require
// lowercase alphanumeric only, with a hard length cap.
export const NO_DASH_TYPES = {
  st: { maxLength: 24 },
  cr: { maxLength: 24 },
};

function sanitizeSegment(s) {
  return String(s || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Standard dash-friendly name: <type>-<workload>-<env>-<region>-<instance>
export function buildDashName({ type, workload, env, region, instance }) {
  const parts = [type, sanitizeSegment(workload), env, region, String(instance || "").trim()].filter(Boolean);
  return parts.join("-");
}

// Storage Account / Container Registry: lowercase alphanumeric only, no
// dashes, <= 24 chars. We compact the same segments (no separators), flag
// if it's still too long, and auto-suggest a shortened form that drops
// vowels from the workload name first, then truncates as a last resort.
export function buildCompactName({ type, workload, env, region, instance }) {
  const rawWorkload = sanitizeSegment(workload).replace(/-/g, "");
  const compact = [type, rawWorkload, env, region, String(instance || "").trim()]
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const maxLength = (NO_DASH_TYPES[type] && NO_DASH_TYPES[type].maxLength) || 24;
  const overLimit = compact.length > maxLength;

  let suggestion = null;
  if (overLimit) {
    // First pass: strip vowels from the workload segment (keep the first
    // letter so it stays recognizable), which usually buys enough room
    // without touching type/env/region/instance — the parts that carry
    // the naming-convention meaning.
    const consonantsOnly = rawWorkload.length > 1 ? rawWorkload[0] + rawWorkload.slice(1).replace(/[aeiou]/g, "") : rawWorkload;
    let candidate = [type, consonantsOnly, env, region, String(instance || "").trim()].join("");
    if (candidate.length > maxLength) {
      // Still too long — truncate the workload segment down to whatever
      // room is left after the fixed-meaning parts (type/env/region/instance).
      const fixedLength = [type, env, region, String(instance || "").trim()].join("").length;
      const room = Math.max(1, maxLength - fixedLength);
      candidate = [type, consonantsOnly.slice(0, room), env, region, String(instance || "").trim()].join("");
    }
    suggestion = candidate.slice(0, maxLength);
  }

  return { compact, maxLength, overLimit, suggestion };
}

export function isCompactType(type) {
  return Object.prototype.hasOwnProperty.call(NO_DASH_TYPES, type);
}

// Top-level helper the UI calls: returns the primary name plus compact-form
// details when the resource type requires it.
export function generateName(fields) {
  const dash = buildDashName(fields);
  if (!isCompactType(fields.type)) {
    return { primary: dash, isCompact: false };
  }
  const compactInfo = buildCompactName(fields);
  return { primary: compactInfo.compact, isCompact: true, ...compactInfo };
}
