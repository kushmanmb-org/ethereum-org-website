# Managing Repository Rulesets

## Overview

Repository rulesets provide declarative branch protection and governance policies for the ethereum.org codebase. This document explains how to manage and apply these rulesets.

## What are Rulesets?

GitHub Repository Rulesets are a modern way to manage branch protection rules and repository policies. They offer:

- **Version Control**: Ruleset definitions can be stored in the repository
- **Consistency**: Apply the same rules across multiple branches or repositories
- **Flexibility**: Fine-grained control over who can bypass rules
- **Transparency**: Clear visibility into what protections are in place

## Available Rulesets

The repository includes three pre-configured rulesets:

1. **Master Branch** (`.github/rulesets/master-branch.json`)
   - Strictest protection for production
   - Requires code owner approval
   - Requires all CI checks to pass
   - Enforces linear history

2. **Staging Branch** (`.github/rulesets/staging-branch.json`)
   - Protection for release candidates
   - Requires code owner approval
   - Requires CI checks to pass
   - Allows merge commits

3. **Dev Branch** (`.github/rulesets/dev-branch.json`)
   - Basic protection for development
   - Requires 1 approval
   - Requires Node.js CI to pass
   - More flexible for iteration

## Applying Rulesets

### Prerequisites

- Repository admin permissions
- GitHub CLI installed (optional, for API method)

### Method 1: GitHub Web Interface (Recommended)

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Rules** → **Rulesets**
3. Click **New ruleset** → **New branch ruleset**
4. Fill in the configuration based on the JSON file:
   - **Name**: Copy from `name` field
   - **Enforcement status**: Set to "Active" (or "Evaluate" for testing)
   - **Target branches**: Add the branch pattern (e.g., `master`, `staging`, `dev`)
   - **Rules**: Configure each rule according to the JSON `rules` array

5. Click **Create** to save the ruleset

### Method 2: GitHub REST API

Use the GitHub REST API to programmatically create rulesets:

```bash
# Install GitHub CLI if not already installed
# See: https://cli.github.com/

# Authenticate
gh auth login

# Create ruleset from JSON file
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/kushmanmb-org/ethereum-org-website/rulesets \
  --input .github/rulesets/master-branch.json

# Repeat for other rulesets
gh api --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/kushmanmb-org/ethereum-org-website/rulesets \
  --input .github/rulesets/staging-branch.json

gh api --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/kushmanmb-org/ethereum-org-website/rulesets \
  --input .github/rulesets/dev-branch.json
```

### Method 3: Infrastructure as Code

For teams using Terraform or similar tools:

```hcl
# Example Terraform configuration
resource "github_repository_ruleset" "master" {
  repository = "ethereum-org-website"
  name       = "Master Branch Protection"
  target     = "branch"
  enforcement = "active"

  conditions {
    ref_name {
      include = ["refs/heads/master"]
      exclude = []
    }
  }

  rules {
    pull_request {
      required_approving_review_count = 1
      dismiss_stale_reviews_on_push   = true
      require_code_owner_review       = true
    }
    # ... additional rules
  }
}
```

## Testing Rulesets

Before activating a ruleset, test it in "Evaluate" mode:

1. Create or update the ruleset with `"enforcement": "evaluate"`
2. The ruleset will run but not block operations
3. Review the audit log to see what would have been blocked
4. Once confident, change enforcement to "active"

## Modifying Existing Rulesets

### To Update via UI:

1. Go to **Settings** → **Rules** → **Rulesets**
2. Click on the ruleset name
3. Click **Edit**
4. Make your changes
5. Click **Save changes**

### To Update via API:

```bash
# Get ruleset ID
gh api /repos/kushmanmb-org/ethereum-org-website/rulesets \
  | jq '.[] | select(.name=="Master Branch Protection") | .id'

# Update the ruleset (replace RULESET_ID)
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/kushmanmb-org/ethereum-org-website/rulesets/RULESET_ID \
  --input .github/rulesets/master-branch.json
```

## Understanding Rule Types

### Pull Request Rules
- `required_approving_review_count`: Minimum number of approvals
- `dismiss_stale_reviews_on_push`: Reset approvals on new commits
- `require_code_owner_review`: Must have approval from CODEOWNERS
- `require_last_push_approval`: Require approval after last push
- `required_review_thread_resolution`: All comments must be resolved

### Status Check Rules
- `required_status_checks`: Array of required CI/CD checks
- `strict_required_status_checks_policy`: Branch must be up-to-date

### Protection Rules
- `deletion`: Prevents branch deletion
- `non_fast_forward`: Prevents force pushes
- `required_linear_history`: Requires linear Git history (no merge commits)

## Bypass Actors

Bypass actors can override ruleset requirements. Use sparingly:

```json
"bypass_actors": [
  {
    "actor_id": 1,
    "actor_type": "RepositoryRole",
    "bypass_mode": "always"
  }
]
```

**Actor Types:**
- `Team`: GitHub team
- `RepositoryRole`: Repository role (e.g., admin)
- `OrganizationAdmin`: Org admins

⚠️ **Warning**: Avoid bypass actors on production branches unless absolutely necessary.

## Troubleshooting

### Issue: "Required status check is not run"

**Solution**: Ensure the workflow:
1. Runs on the target branch
2. Has run at least once
3. Uses the exact name in the ruleset

### Issue: "No code owners found"

**Solution**: 
1. Verify `.github/CODEOWNERS` file exists
2. Check file patterns match changed files
3. Ensure code owners have repository access

### Issue: "Cannot merge due to ruleset"

**Solution**:
1. Check all required reviews are approved
2. Ensure all status checks pass
3. Resolve all review conversations
4. Verify branch is up-to-date (if strict mode enabled)

## Best Practices

1. **Start with Evaluate Mode**: Test new rulesets before enforcing
2. **Document Changes**: Update ruleset JSON files when making changes
3. **Minimize Bypasses**: Only allow bypasses for emergency situations
4. **Regular Review**: Audit rulesets quarterly to ensure they're still appropriate
5. **Clear Communication**: Notify team before activating new rulesets
6. **Align with Workflow**: Ensure rulesets support the Gitflow workflow

## Related Documentation

- [Deploy Process](./deploy-process.md)
- [Review Process](./review-process.md)
- [CODEOWNERS](../.github/CODEOWNERS)
- [GitHub Rulesets Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)

## Getting Help

If you encounter issues with rulesets:
1. Check the troubleshooting section above
2. Review GitHub's official documentation
3. Contact repository maintainers in Discord (#website-dev)
4. Open an issue if you find bugs in ruleset configurations
