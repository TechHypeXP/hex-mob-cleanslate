import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { homedir } from "os";

const LOCAL_URL = "http://localhost:6333";
const CLOUD_URL = "https://your-qdrant-cloud-url"; // Replace if needed
const SETTINGS_PATH = `${homedir()}/.config/Code/User/settings.json`;

function isLocalQdrantAlive(): boolean {
  try {
    const curlOutput = execSync(`curl -s -o /dev/null -w "%{http_code}" ${LOCAL_URL}/readyz`, { timeout: 5000 });
    return curlOutput.toString().trim() === "200";
  } catch {
    return false;
  }
}

function readSettings(): any {
  if (!existsSync(SETTINGS_PATH)) throw new Error("VS Code settings.json not found");
  return JSON.parse(readFileSync(SETTINGS_PATH, "utf8"));
}

function writeSettings(settings: any) {
  writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf8");
}

function updateRooConfig(url: string) {
  const key = "roo-cline.qdrantUrl";
  const settings = readSettings();
  if (settings[key] !== url) {
    settings[key] = url;
    writeSettings(settings);
    console.log(`[Info] roo-cline.qdrantUrl updated to: ${url}`);
    restartVSCodeExtension();
  } else {
    console.log(`[Info] roo-cline.qdrantUrl already set to: ${url}`);
  }
}

function restartVSCodeExtension() {
  try {
    execSync("code --force-reload-extensions", { stdio: "inherit" });
    console.log("[Info] VS Code extensions reloaded");
  } catch (err) {
    console.error("[Error] Could not reload VS Code extensions:", err);
  }
}

async function monitor() {
  console.log("[Info] Starting Qdrant hotspare auto-failover monitor...");
  while (true) {
    const localUp = isLocalQdrantAlive();
    updateRooConfig(localUp ? LOCAL_URL : CLOUD_URL);
    await new Promise(r => setTimeout(r, 30000));
  }
}
if (import.meta.main) monitor();
