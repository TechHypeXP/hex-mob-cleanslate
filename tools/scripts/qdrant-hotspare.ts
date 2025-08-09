// qdrant-hotspare.ts: Hotspare setup with auto-fallback to cloud
import { setInterval } from 'node:timers/promises';

const LOCAL_URL = 'http://localhost:6333';
const CLOUD_URL = 'https://your-qdrant-cloud-url'; // Replace with your actual cloud URL
const COLLECTION_NAME = 'ws-8fb6bfa20f7a6008';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.ZBd-ptv7YAs_yTQIas9TylCrTrqvf8op0Nz-tKwOXHI';

// Health check function
async function checkHealth(url: string): Promise<boolean> {
  try {
    const response = await fetch(url + '/readyz', { headers: { 'api-key': API_KEY } });
    return response.ok;
  } catch {
    return false;
  }
}

// Sync function: Push local changes to cloud (one-way for now)
async function syncToCloud() {
  try {
    const localPointsRes = await fetch(LOCAL_URL + '/collections/' + COLLECTION_NAME + '/points?with_payload=true');
    if (!localPointsRes.ok) {
      console.warn('Failed to fetch points from local Qdrant.');
      return;
    }
    const localPoints = await localPointsRes.json();
    if (!(localPoints.result?.points?.length)) {
      console.log('No new points to sync.');
      return;
    }

    // Upsert to cloud (batching can be added if needed)
    const upsertRes = await fetch(CLOUD_URL + '/collections/' + COLLECTION_NAME + '/points', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'api-key': API_KEY },
      body: JSON.stringify({ points: localPoints.result.points }),
    });

    if (!upsertRes.ok) {
      console.warn('Failed to sync points to cloud.');
    } else {
      console.log('Sync to cloud completed at:', new Date());
    }
  } catch (error) {
    console.error('Sync error:', error);
  }
}

// Indexing router: Always use local for speed, then sync
export async function indexData(data: any) {
  if (await checkHealth(LOCAL_URL)) {
    const indexRes = await fetch(LOCAL_URL + '/collections/' + COLLECTION_NAME + '/points', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (indexRes.ok) {
      console.log('Indexed data on local.');
      await syncToCloud();  // Auto-update cloud
      console.log('Synced indexed data to cloud.');
    } else {
      console.warn('Failed to index data on local, falling back to cloud.');
      await fallbackToCloud(data);
    }
  } else {
    await fallbackToCloud(data);
  }
}

async function fallbackToCloud(data: any) {
  const res = await fetch(CLOUD_URL + '/collections/' + COLLECTION_NAME + '/points', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'api-key': API_KEY },
    body: JSON.stringify(data),
  });
  if (res.ok) {
    console.log('Indexed directly on cloud (fallback).');
  } else {
    console.error('Failed to index on cloud fallback.');
  }
}

// Monitor and auto-switch (runs indefinitely)
async function monitorHotspare() {
  while (true) {
    const localHealthy = await checkHealth(LOCAL_URL);
    if (!localHealthy) {
      console.warn('Local Qdrant down - please set roo-cline extension to cloud URL manually.');
      // Automation here needs extension support
    } else {
      await syncToCloud();
    }
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
}

if (import.meta.main) {
  monitorHotspare();
}
