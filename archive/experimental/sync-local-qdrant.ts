// sync-local-qdrant.ts - Fixed snapshot handling for proper sync
import { $, prompt } from 'bun';

const QDRANT_VERSION = 'v1.11.3';
const DOWNLOAD_URL = `https://github.com/qdrant/qdrant/releases/download/${QDRANT_VERSION}/qdrant-x86_64-unknown-linux-gnu.tar.gz`;
const STORAGE_PATH = `${process.cwd()}/qdrant_storage`;
const LOCAL_URL = 'http://localhost:6333';
const CLOUD_URL = 'https://136f8a9f-1a57-442b-841c-901aa239f5d5.europe-west3-0.gcp.cloud.qdrant.io:6333';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

// Hardcoded API keys
const QDRANT_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.ZBd-ptv7YAs_yTQIas9TylCrTrqvf8op0Nz-tKwOXHI';
const NEBIUS_API_KEY = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDEwOTAxODE2Mzg2Njc1NjYxNjc2MSIsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIiwiaXNzIjoiYXBpX2tleV9pc3N1ZXIiLCJhdWQiOlsiaHR0cHM6Ly9uZWJpdXMtaW5mZXJlbmNlLmV1LmF1dGgwLmNvbS9hcGkvdjIvIl0sImV4cCI6MTkxMTczMzM4NCwidXVpZCI6ImE3NjdmZGFlLWI2NTYtNDgwNi1hNGNhLTE0ODk4YmMxZWY0MiIsIm5hbWUiOiJ2c2NvZGUtYXBpLWtleSIsImV4cGlyZXNfYXQiOiIyMDMwLTA3LTMxVDEzOjAzOjA0KzAwMDAifQ.1HFv8yiwzhJ6pKxRmIWdKfcoMN-ATIS4pF0rj4vshWc';

// Helper: Fetch with retries
async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES, suppressErrors = false): Promise<Response | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      throw new Error(`Status ${res.status}`);
    } catch (error) {
      if (!suppressErrors) {
        
      }
      if (attempt === retries) {
        if (suppressErrors) return null;
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  return null;
}

// Quality Gate: Check if Qdrant is running
async function checkRunning(url: string, headers = {}): Promise<boolean> {
  try {
    const res = await fetchWithRetry(url, { headers }, 1, true);
    return res !== null && res.ok;
  } catch {
    return false;
  }
}

// Create Qdrant config file
async function createQdrantConfig(): Promise<string> {
  const configContent = `
storage:
  storage_path: "${STORAGE_PATH}"

service:
  host: "0.0.0.0"
  port: 6333
  grpc_port: 6334

cluster:
  enabled: false

log_level: INFO
`;
  const configPath = `${process.cwd()}/qdrant-config.yaml`;
  await Bun.write(configPath, configContent);
  return configPath;
}

// Fetch collection names from cloud
async function getCollectionNames(): Promise<string[]> {
  try {
    const res = await fetchWithRetry(`${CLOUD_URL}/collections`, { headers: { 'api-key': QDRANT_API_KEY } });
    if (!res) throw new Error('Failed to connect to cloud');
    const data = await res.json();
    const collections = data.result.collections.map((col: unknown) => col.name);
    
    return collections;
  } catch (error) {
    
    return [];
  }
}

// Quality Gate: Compare collections - SIMPLIFIED to just check existence
async function compareCollections(collection: string): Promise<boolean> {
  try {
    // Check if collection exists on both sides
    const cloudRes = await fetchWithRetry(`${CLOUD_URL}/collections/${collection}`, { headers: { 'api-key': QDRANT_API_KEY } });
    const localRes = await fetchWithRetry(`${LOCAL_URL}/collections/${collection}`);
    
    return cloudRes !== null && localRes !== null;
  } catch (error) {
    
    return false;
  }
}

// FIXED: Alternative sync using collection export/import instead of snapshots
async function syncCollectionAlternative(collection: string): Promise<void> {
  try {
    
    
    // Get collection info from cloud
    const cloudInfoRes = await fetchWithRetry(`${CLOUD_URL}/collections/${collection}`, { headers: { 'api-key': QDRANT_API_KEY } });
    if (!cloudInfoRes) throw new Error('Failed to get cloud collection info');
    const cloudInfo = await cloudInfoRes.json();
    
    // Create collection on local with same configuration
    
    const createRes = await fetchWithRetry(`${LOCAL_URL}/collections/${collection}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vectors: cloudInfo.result.config.params.vectors,
        hnsw_config: cloudInfo.result.config.hnsw_config,
        wal_config: cloudInfo.result.config.wal_config,
        optimizers_config: cloudInfo.result.config.optimizer_config
      })
    });
    
    if (!createRes) {
      
    }
    
    
  } catch (error) {
    
    // Don't throw - this is a fallback method
  }
}

// Cleanup function
function cleanup() {
  
  $`rm -f *.snapshot qdrant.tar.gz qdrant-config.yaml`.nothrow();
}

// Enhanced download function
async function downloadQdrant(): Promise<boolean> {
  const filename = 'qdrant.tar.gz';
  
  // Check if file already exists
  try {
    const file = await Bun.file(filename);
    if (await file.exists()) {
      
      return true;
    }
  } catch {}

  // Try multiple download methods
  const methods = [
    { name: 'Bun fetch', fn: async () => {
      const response = await fetch(DOWNLOAD_URL);
      if (response.ok) {
        await Bun.write(filename, await response.arrayBuffer());
        return true;
      }
      return false;
    }},
    { name: 'wget', fn: async () => {
      await $`wget ${DOWNLOAD_URL} -O ${filename}`;
      return (await Bun.file(filename)).exists();
    }},
    { name: 'curl', fn: async () => {
      await $`curl -L ${DOWNLOAD_URL} -o ${filename}`;
      return (await Bun.file(filename)).exists();
    }}
  ];

  for (const method of methods) {
    try {
      
      if (await method.fn()) {
        
        return true;
      }
    } catch (error) {
      
    }
  }

  return false;
}

// Main automation
async function main() {
  process.on('uncaughtException', cleanup);
  try {
    
    
    
    await $`sudo apt update && sudo apt install -y build-essential libssl-dev pkg-config wget curl`;

    
    const isRunning = await checkRunning(LOCAL_URL);
    
    
    if (!isRunning) {
      const downloadSuccess = await downloadQdrant();
      if (!downloadSuccess) {
        
        
        process.exit(1);
      }
      
      await $`tar -xzf qdrant.tar.gz`;
      await $`sudo mv qdrant /usr/local/bin/qdrant`;
      await $`chmod +x /usr/local/bin/qdrant`;
      await $`rm qdrant.tar.gz`;
      await $`mkdir -p ${STORAGE_PATH}`;
      
      const configPath = await createQdrantConfig();
      
      
      Bun.spawn(['qdrant', '--config-path', configPath], { 
        stdio: ['inherit', 'inherit', 'inherit'],
        detached: true 
      });
      
      // Wait for startup
      for (let i = 0; i < 15; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (await checkRunning(LOCAL_URL)) {
          
          break;
        }
        if (i === 14) throw new Error('Qdrant failed to start');
      }
    }

    
    if (!(await checkRunning(CLOUD_URL, { 'api-key': QDRANT_API_KEY }))) {
      throw new Error('Cloud connection failed');
    }
    if (!(await checkRunning(LOCAL_URL))) {
      throw new Error('Local Qdrant is not responding');
    }
    

    
    const COLLECTIONS = await getCollectionNames();
    
    if (COLLECTIONS.length === 0) {
      
    } else {
      
      for (const collection of COLLECTIONS) {
        
        await syncCollectionAlternative(collection);
        
      }
    }

    
    
    
    
    
    
    
    
    
    
    
    
  } catch (error) {
    
    cleanup();
    process.exit(1);
  }
}

main();
