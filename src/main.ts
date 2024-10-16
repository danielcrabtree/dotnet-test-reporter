import { processTestResults } from './results';
import { processTestCoverage } from './coverage';
import { getInputs, publishComment, setFailed } from './utils';
import { formatCoverageMarkdown } from './formatting/markdown';
import { formatResultHtml } from './formatting/html';

const run = async (): Promise<void> => {
  try {
    const {
      token,
      title,
      resultsPath,
      coveragePath,
      coverageType,
      coverageThreshold,
      postNewComment,
      allowFailedTests,
      showFailedTestsOnly,
      showTestOutput
    } = getInputs();

    let comment = '';

    const testResult = await processTestResults(resultsPath, allowFailedTests);
    comment += formatResultHtml(testResult, showFailedTestsOnly, showTestOutput);

    if (coveragePath) {
      const testCoverage = await processTestCoverage(coveragePath, coverageType, coverageThreshold);
      comment += testCoverage ? formatCoverageMarkdown(testCoverage, coverageThreshold) : '';
    }

    await publishComment(token, title, comment, postNewComment);
  } catch (error) {
    setFailed((error as Error).message);
  }
};

run();
