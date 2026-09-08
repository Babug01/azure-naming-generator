import { useMemo, useState } from "react";
import Header from "./components/Header";
import { RESOURCE_TYPES, ENVIRONMENTS, REGIONS, generateName } from "./lib/naming";

const REPO_URL = "https://github.com/Babug01/azure-naming-generator";

export default function AzureNamingGenerator() {
  const [type, setType] = useState(RESOURCE_TYPES[0].value);
  const [workload, setWorkload] = useState("payments");
  const [env, setEnv] = useState("dev");
  const [region, setRegion] = useState("weu");
  const [instance, setInstance] = useState("01");
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => generateName({ type, workload, env, region, instance }),
    [type, workload, env, region, instance]
  );

  function copy() {
    navigator.clipboard.writeText(result.primary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={styles.root}>
      <Header repoUrl={REPO_URL} />
      <div style={styles.content}>
        <h1 style={styles.title}>Azure Naming Generator</h1>
        <p style={styles.subtitle}>
          Builds a resource name from Microsoft's Cloud Adoption Framework abbreviations. Storage
          Accounts and Container Registries get a compacted, dash-free, length-checked form
          automatically — everything else stays dash-friendly.
        </p>

        <div style={styles.form}>
          <label style={styles.field}>
            <span style={styles.label}>Resource type</span>
            <select style={styles.input} value={type} onChange={(e) => setType(e.target.value)}>
              {RESOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label} ({t.value})</option>
              ))}
            </select>
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Workload / app name</span>
            <input style={styles.input} value={workload} onChange={(e) => setWorkload(e.target.value)} placeholder="payments" />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Environment</span>
            <select style={styles.input} value={env} onChange={(e) => setEnv(e.target.value)}>
              {ENVIRONMENTS.map((e2) => (
                <option key={e2} value={e2}>{e2}</option>
              ))}
            </select>
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Region</span>
            <select style={styles.input} value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label} ({r.value})</option>
              ))}
            </select>
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Instance number</span>
            <input style={styles.input} value={instance} onChange={(e) => setInstance(e.target.value)} placeholder="01" />
          </label>
        </div>

        <div style={styles.resultBox}>
          <div style={styles.resultHeader}>
            <span style={styles.sectionTitle}>{result.isCompact ? "Compacted name (no dashes)" : "Generated name"}</span>
            <button style={styles.iconBtn} onClick={copy}>{copied ? "Copied" : "Copy"}</button>
          </div>
          <div style={{ ...styles.resultName, color: result.isCompact && result.overLimit ? "#e05c5c" : "var(--text, #1a1a1a)" }}>
            {result.primary || "—"}
          </div>

          {result.isCompact && (
            <div style={styles.compactMeta}>
              <span>{result.compact.length} / {result.maxLength} characters</span>
              {result.overLimit ? (
                <span style={styles.warnTag}>Exceeds limit</span>
              ) : (
                <span style={styles.okTag}>Within limit</span>
              )}
            </div>
          )}

          {result.isCompact && result.overLimit && result.suggestion && (
            <div style={styles.suggestionBox}>
              <span style={styles.label}>Suggested shortened form</span>
              <div style={styles.resultName}>{result.suggestion}</div>
            </div>
          )}
        </div>

        <p style={styles.note}>
          Storage Account and Container Registry names must be globally unique, lowercase
          alphanumeric only (no dashes), and 3–24 characters — Azure rejects anything else.
        </p>
      </div>
    </div>
  );
}

const styles = {
  root: { minHeight: "100dvh", display: "flex", flexDirection: "column" },
  content: {
    fontFamily: "system-ui, sans-serif", padding: "24px 32px", maxWidth: 760, margin: "0 auto",
    color: "var(--text, #1a1a1a)", width: "100%", boxSizing: "border-box", background: "var(--bg-subtle, #f0efed)", flex: 1,
  },
  title: { fontSize: 22, fontWeight: 700, margin: 0 },
  subtitle: { fontSize: 13, opacity: 0.6, margin: "4px 0 24px" },
  form: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24,
  },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 600, opacity: 0.65 },
  input: {
    padding: "9px 10px", borderRadius: 6, border: "1px solid var(--border, #e5e7eb)",
    background: "var(--input-bg, #f9fafb)", color: "var(--text, #1a1a1a)", fontSize: 13,
    fontFamily: "system-ui, sans-serif",
  },
  resultBox: {
    padding: 18, borderRadius: 8, border: "1px solid var(--border, #e5e7eb)", background: "var(--bg, #fff)", marginBottom: 16,
  },
  resultHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", opacity: 0.6 },
  resultName: {
    fontFamily: "'SFMono-Regular', Consolas, monospace", fontSize: 18, fontWeight: 700, wordBreak: "break-all",
  },
  iconBtn: {
    padding: "2px 10px", borderRadius: 6, border: "1px solid var(--border, #e5e7eb)", background: "transparent",
    color: "var(--text, #1a1a1a)", cursor: "pointer", fontSize: 11,
  },
  compactMeta: { display: "flex", alignItems: "center", gap: 10, marginTop: 10, fontSize: 12, opacity: 0.75 },
  warnTag: {
    padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700, color: "#e05c5c", background: "rgba(224,92,92,0.12)",
  },
  okTag: {
    padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700, color: "#3fb950", background: "rgba(63,185,80,0.12)",
  },
  suggestionBox: {
    marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border, #e5e7eb)", display: "flex", flexDirection: "column", gap: 6,
  },
  note: { fontSize: 12, opacity: 0.55, marginTop: 4 },
};
