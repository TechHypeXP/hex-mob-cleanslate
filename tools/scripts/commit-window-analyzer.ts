import { $ } from 'bun';
import fs from 'fs';
import path from 'path';

// Define file categories based on user's input
const fileCategories: Record<string, string[]> = {
  scripts: ['tools/scripts/'],
  config: ['bunfig.toml', '.mocharc.js', 'babel.config.js', 'tsconfig.json'], // Assuming tsconfig.json is a config file
  docs: ['README.md', 'templates/readmes/', 'docs/'],
  src: ['apps/mobile/src/', 'packages/'], // Broadly categorize source files
  assets: ['apps/mobile/src/assets/'],
  logs: ['*.log'], // Assuming log files might be at the root or specific dirs
};

// Function to categorize a file path
function getFileCategory(filePath: string): string {
  for (const category in fileCategories) {
    for (const pattern of fileCategories[category]) {
      if (filePath.startsWith(pattern) || filePath.endsWith(pattern)) {
        return category;
      }
    }
  }
  return 'other'; // Default category
}

// Function to get file modification times
async function getFileMtimes(files: string[]): Promise<Map<string, number>> {
  const mtimes = new Map<string, number>();
  for (const file of files) {
    try {
      const stats = await fs.promises.stat(file);
      mtimes.set(file, stats.mtimeMs);
    } catch (error) {
      console.error(`Error stating file ${file}:`, error);
    }
  }
  return mtimes;
}

// Function to calculate cohesion for a given window and file data
function calculateCohesion(
  fileMtimes: Map<string, number>,
  windowMinutes: number
): { cohesion: number; filesPerCommit: number; categoryDistribution: Map<string, number> } {
  const bucketInterval = 15 * 60 * 1000; // 15 minutes in milliseconds
  const windowMs = windowMinutes * 60 * 1000;

  const commits: Map<number, Map<string, number>> = new Map(); // bucketTimestamp -> category -> count

  for (const [file, mtime] of fileMtimes.entries()) {
    const category = getFileCategory(file);
    const bucketStart = Math.floor(mtime / bucketInterval) * bucketInterval;

    if (!commits.has(bucketStart)) {
      commits.set(bucketStart, new Map());
    }
    const categoryCounts = commits.get(bucketStart)!;
    categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
  }

  let totalCohesionScore = 0;
  let totalFilesConsidered = 0;
  let totalCommitsConsidered = 0;
  let totalFilesPerCommitSum = 0;

  const sortedBucketTimestamps = Array.from(commits.keys()).sort((a, b) => a - b);

  for (let i = 0; i < sortedBucketTimestamps.length; i++) {
    let currentWindowStart = sortedBucketTimestamps[i];
    let currentWindowEnd = currentWindowStart + windowMs;
    let filesInWindow = 0;
    let categoryCountsInWindow: Map<string, number> = new Map();
    let commitsInWindow = 0;

    for (let j = i; j < sortedBucketTimestamps.length; j++) {
      const bucketTimestamp = sortedBucketTimestamps[j];
      if (bucketTimestamp < currentWindowEnd) {
        commitsInWindow++;
        const categoryCounts = commits.get(bucketTimestamp)!;
        let filesInBucket = 0;
        for (const [category, count] of categoryCounts.entries()) {
          categoryCountsInWindow.set(category, (categoryCountsInWindow.get(category) || 0) + count);
          filesInBucket += count;
        }
        filesInWindow += filesInBucket;
      } else {
        break; // Window exceeded
      }
    }

    if (commitsInWindow > 0) {
      let maxCategoryCount = 0;
      for (const count of categoryCountsInWindow.values()) {
        if (count > maxCategoryCount) {
          maxCategoryCount = count;
        }
      }
      const cohesion = filesInWindow > 0 ? maxCategoryCount / filesInWindow : 0;
      totalCohesionScore += cohesion;
      totalFilesPerCommitSum += filesInWindow / commitsInWindow;
      totalCommitsConsidered++;
    }
  }

  const averageCohesion = totalCommitsConsidered > 0 ? totalCohesionScore / totalCommitsConsidered : 0;
  const averageFilesPerCommit = totalCommitsConsidered > 0 ? totalFilesPerCommitSum / totalCommitsConsidered : 0;

  // Calculate category distribution for the entire dataset
  const overallCategoryDistribution: Map<string, number> = new Map();
  let totalFiles = 0;
  for (const [file, mtime] of fileMtimes.entries()) {
    const category = getFileCategory(file);
    overallCategoryDistribution.set(category, (overallCategoryDistribution.get(category) || 0) + 1);
    totalFiles++;
  }

  return {
    cohesion: averageCohesion,
    filesPerCommit: averageFilesPerCommit,
    categoryDistribution: overallCategoryDistribution,
  };
}

async function analyzeCommitWindows() {
  const repoRoot = (await $`git rev-parse --show-toplevel`.text()).trim();
  process.chdir(repoRoot);

  // Get modified and untracked files
  const filesOutput = await $`git ls-files -m -o --exclude-standard`.text();
  const files = filesOutput.trim().split('\n').filter(f => f.length > 0);

  if (files.length === 0) {
    console.log('✅ No modified or untracked files found.');
    return;
  }

  const fileMtimes = await getFileMtimes(files);

  const candidateWindows = [30, 45, 60, 90, 120];
  const scores: { window: number; score: number; cohesion: number; filesPerCommit: number; categoryDistribution: Map<string, number> }[] = [];

  for (const window of candidateWindows) {
    const { cohesion, filesPerCommit, categoryDistribution } = calculateCohesion(fileMtimes, window);
    // Score: weighted blend: 60% cohesion + 40% inverse average files/commit (prefer ≤20)
    // Inverse files/commit: higher score for fewer files per commit.
    // To avoid division by zero or very large numbers if filesPerCommit is small,
    // we can use a transformation like 1 / (1 + filesPerCommit) or a capped inverse.
    // Let's use a simple inverse, assuming filesPerCommit is generally > 0.
    // A higher score for fewer files per commit means we want to penalize large commits.
    // If filesPerCommit is 20, inverse is 0.05. If it's 10, inverse is 0.1.
    // Let's normalize this to be more comparable to cohesion (0-1 range).
    // A simple approach: max_files_per_commit = 30 (arbitrary, can be tuned)
    // inverse_files_score = max(0, 1 - filesPerCommit / max_files_per_commit)
    const maxFilesPerCommit = 30;
    const inverseFilesScore = Math.max(0, 1 - filesPerCommit / maxFilesPerCommit);

    const weightedScore = 0.6 * cohesion + 0.4 * inverseFilesScore;

    scores.push({
      window,
      score: weightedScore,
      cohesion,
      filesPerCommit,
      categoryDistribution,
    });
  }

  // Sort scores to find the best window
  scores.sort((a, b) => b.score - a.score);

  const bestWindow = scores[0];
  const recommendedWindow = bestWindow ? bestWindow.window : null;

  const outputData = {
    recommended: recommendedWindow,
    scores: scores.map(s => ({
      window: s.window,
      score: s.score,
      cohesion: s.cohesion,
      filesPerCommit: s.filesPerCommit,
      categoryDistribution: Object.fromEntries(s.categoryDistribution), // Convert Map to Object for JSON
    })),
  };

  // Write to .git-commit-window.json
  await fs.promises.writeFile('.git-commit-window.json', JSON.stringify(outputData, null, 2));

  // Print recommended window to stdout
  if (recommendedWindow) {
    console.log(`Recommended commit window: ${recommendedWindow} minutes`);
  } else {
    console.log('Could not determine a recommended commit window.');
  }
  console.log('Saved commit window analysis to .git-commit-window.json');
}

analyzeCommitWindows().catch(err => {
  console.error('Error during commit window analysis:', err);
  process.exit(1);
});