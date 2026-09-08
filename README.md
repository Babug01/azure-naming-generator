# Azure Naming Generator

**Live demo:** https://babug01.github.io/azure-naming-generator/

Builds Azure resource names from Microsoft's Cloud Adoption Framework abbreviations —
`<type>-<workload>-<env>-<region>-<instance>` — so you stop retyping the same naming-convention
lookup every time you spin up a resource group or a VM. Storage Accounts and Container Registries
get special handling: Azure requires those to be lowercase alphanumeric only with no dashes and a
24-character cap, so the tool compacts the name automatically and flags it if it's still too long.

## Features

- **17 real CAF resource-type abbreviations** — Resource Group (`rg`), Virtual Network (`vnet`),
  Subnet (`snet`), Network Security Group (`nsg`), Virtual Machine (`vm`), AKS Cluster (`aks`),
  Storage Account (`st`), Key Vault (`kv`), App Service (`app`), Function App (`func`), SQL Server
  (`sql`), SQL Database (`sqldb`), Cosmos DB Account (`cosmos`), Public IP (`pip`), Load Balancer
  (`lb`), Container Registry (`cr`), Log Analytics Workspace (`log`)
- **Environment and region dropdowns** — dev/tst/acc/prd/shared, and short region codes (East US,
  West US 2, West Europe, North Europe, UK South, Southeast Asia)
- **Dash-friendly names** for most resource types: `<type>-<workload>-<env>-<region>-<instance>`
- **Compacted no-dash names for Storage Accounts and Container Registries** — lowercase
  alphanumeric only, no separators, with a live character-count check against the 24-character
  Azure limit
- **Over-length warning with an auto-suggested shortened form** — strips vowels from the workload
  name first, then truncates only as a last resort, so the type/env/region/instance segments (the
  parts that actually carry meaning) survive intact as long as possible
- **One-click copy** of the generated name

## Tech stack

[React](https://react.dev/) + [Vite](https://vitejs.dev/) — naming logic is plain JavaScript
string handling, no external CAF/naming library.

## Running locally

```bash
git clone https://github.com/Babug01/azure-naming-generator.git
cd azure-naming-generator
npm install
npm run dev
```

## License

MIT — see [LICENSE](LICENSE).
