import { readFileSync } from "node:fs";
const lock = readFileSync("docs/version-lock.md","utf8");
const pkg = JSON.parse(readFileSync("package.json","utf8"));

function must(re){
  if(!re.test(lock)) { 
    console.error("Violation:", re, "\nLock:\n", lock); 
    process.exit(1); 
  }
}

// Accept "- Expo SDK: 53" or "- Expo SDK: 53.x"
must(/- Expo SDK\s*:\s*53(\.x)?/i);

// TS must be ~5.8.x
if(!/^~5\.8\.\d+$/.test(pkg.devDependencies?.typescript||"")) {
  console.error("TS not ~5.8.x:", pkg.devDependencies?.typescript); 
  process.exit(1);
}

console.log("Version lock OK");
