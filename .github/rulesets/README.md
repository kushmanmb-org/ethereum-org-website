# GitHub Repository Rulesets

This directory contains repository rulesets that define branch protection and governance policies for the ethereum.org repository. These rulesets enforce the Gitflow workflow and ensure code quality standards.

## Files

- **`master-branch.json`** - Ruleset for the production branch
- **`staging-branch.json`** - Ruleset for the release candidate branch
- **`dev-branch.json`** - Ruleset for the development branch
- **`apply-rulesets.sh`** - Automated script to apply all rulesets
- **`README.md`** - This file (comprehensive documentation)

## Overview

Repository rulesets provide a way to manage branch protection rules, required status checks, and other repository policies in a structured, version-controlled manner.

## Rulesets

### 1. Master Branch (`master-branch.json`)

The most restrictive ruleset for the production branch.

**Rules:**
- ✅ Require pull request with at least 1 approval
- ✅ Require code owner review
- ✅ Dismiss stale reviews on new commits
- ✅ Require all conversations resolved
- ✅ Require status checks to pass:
  - Node.js CI
  - Chromatic Publish and Testing
- ✅ Strict status check policy (must be up-to-date with base branch)
- ✅ Prevent branch deletion
- ✅ Prevent force pushes
- ✅ Require linear history

**Purpose:** Protects the production deployment. Only release candidates from `staging` should be merged here.

### 2. Staging Branch (`staging-branch.json`)

Ruleset for the release candidate branch.

**Rules:**
- ✅ Require pull request with at least 1 approval
- ✅ Require code owner review
- ✅ Dismiss stale reviews on new commits
- ✅ Require all conversations resolved
- ✅ Require status checks to pass:
  - Node.js CI
  - Chromatic Publish and Testing
- ✅ Strict status check policy
- ✅ Prevent branch deletion
- ✅ Prevent force pushes

**Purpose:** Protects the release candidate branch. Features from `dev` and hotfixes go through QA testing here.

### 3. Dev Branch (`dev-branch.json`)

Ruleset for the development branch.

**Rules:**
- ✅ Require pull request with at least 1 approval
- ✅ Require status checks to pass:
  - Node.js CI
- ✅ Prevent branch deletion

**Purpose:** Protects the main development branch. Less strict to allow for faster iteration while still maintaining quality.

## Applying Rulesets

These ruleset files serve as documentation and templates. To apply them to your repository:

### Option 1: Automated Script (Recommended)

Use the provided script to apply all rulesets at once:

```bash
# From repository root
./.github/rulesets/apply-rulesets.sh
```

**Requirements:**
- GitHub CLI (`gh`) installed and authenticated
- Admin permissions on the repository

### Option 2: GitHub Web UI

1. Go to your repository settings
2. Navigate to **Rules** → **Rulesets**
3. Click **New ruleset** → **New branch ruleset**
4. Use the JSON files in this directory as templates
5. Configure the ruleset according to the JSON specification
6. Set enforcement to **Active**
7. Save the ruleset

### Option 3: GitHub API (Manual)

You can import these rulesets using the GitHub REST API:

```bash
# Create a ruleset
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/OWNER/REPO/rulesets \
  --input master-branch.json
```

### Option 4: GitHub CLI with Terraform/IaC

For infrastructure-as-code approaches, you can use tools like Terraform with the GitHub provider to manage rulesets programmatically.

## Workflow Integration

These rulesets enforce the [Gitflow workflow](../../docs/deploy-process.md) used by ethereum.org:

```
master  ─── tag ──────────────────── tag ───
         │                          ╱
         │                        ╱
staging  ─────────── RC ────────────────────
         │          ╱             ╲
         │        ╱                ╲
dev      ─────────────────────────────────
           ╲     ╲               ╱       ╱
feature1    ╲────────────────  ╱
feature2          ╲─────────────
```

### Typical Flow:

1. **Feature Development**: Create feature branches from `dev`
2. **Code Review**: Open PR to `dev` (requires 1 approval + CI passing)
3. **Integration**: Merge to `dev` after approval
4. **Release Candidate**: Create PR from `dev` to `staging` (requires code owner review + all checks)
5. **QA Testing**: Test on `staging` for 2 days
6. **Production Release**: Merge `staging` to `master` (requires code owner review + all checks + linear history)
7. **Tagging**: Create release tag on `master`

### Hotfix Flow:

1. Create hotfix branch from `master`
2. Open PR to `master` (requires code owner review + all checks)
3. After merge, back-merge to `staging` and `dev`

## Customization

To modify these rulesets:

1. Edit the JSON files in this directory
2. Update the ruleset in GitHub (via UI or API)
3. Commit the changes to keep documentation in sync

### Common Modifications:

- **Add required checks**: Add more status check contexts to the `required_status_checks` array
- **Change approval count**: Modify `required_approving_review_count`
- **Bypass actors**: Add specific teams or users who can bypass rules (not recommended for production branches)
- **Enforcement level**: Change from `active` to `evaluate` for testing

## Best Practices

1. **Test First**: Use `"enforcement": "evaluate"` mode to test rulesets before making them active
2. **Consistent Naming**: Keep ruleset names descriptive and consistent
3. **Document Changes**: Update this README when modifying rulesets
4. **Code Owners**: Keep CODEOWNERS file up-to-date for proper review routing
5. **Status Checks**: Ensure all required status checks are defined in workflow files
6. **Communication**: Notify the team before activating or modifying rulesets

## Troubleshooting

### "Required status check not found"

If you see this error:
1. Check that the workflow name matches exactly (case-sensitive)
2. Ensure the workflow runs on the target branch
3. Wait for the workflow to run at least once

### "Code owner review required but no code owners found"

1. Verify CODEOWNERS file exists in `.github/CODEOWNERS`
2. Ensure patterns match the files being changed
3. Check that code owners have repository access

### Bypass Rules

In emergency situations, repository administrators can bypass rules. However:
- All bypasses are logged
- Should only be used for critical hotfixes
- Must be documented in the PR description

## References

- [GitHub Repository Rulesets Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [ethereum.org Deploy Process](../../docs/deploy-process.md)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

## Support

For questions or issues with rulesets:
1. Check this documentation
2. Review GitHub's ruleset documentation
3. Contact repository maintainers on Discord (#website-dev channel)
