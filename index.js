const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('github_token');
    const projectName = core.getInput('project_name');
    const latestCommit = core.getInput('latest_commit');
    const deploymentURL = core.getInput('deployment_url');
    const branchPreviewURL = core.getInput('branch_preview_url');

    const octokit = github.getOctokit(token);
    const context = github.context;

    if (!context.payload.pull_request) {
      console.log("No pull request found. Skipping comment.");
      return;
    }

    const prNumber = context.payload.pull_request.number;

    const message = `
## 🚀 Deploying ${projectName} with ⚡ Cloudflare Pages

| **Latest commit:** | \`${latestCommit}\` |
|--------------------|----------------------|
| **Status:**        | ✅ Deploy successful |
| **Preview URL:**   | [${deploymentURL}](${deploymentURL}) |
| **Branch Preview URL:** | [${branchPreviewURL}](${branchPreviewURL}) |
`;

    const { data } = await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: prNumber,
      body: message
    });

    core.setOutput('comment_id', data.id);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
