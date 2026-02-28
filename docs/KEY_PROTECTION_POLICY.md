# Key Protection Policy

## Overview

This document establishes comprehensive policies and procedures for protecting API keys, secrets, credentials, and other sensitive data within the ethereum.org repository.

## Policy Statement

**All contributors must follow these key protection policies to maintain the security and integrity of the ethereum.org project.**

## Scope

This policy applies to:
- All contributors (maintainers, reviewers, community contributors)
- All code, configuration, and documentation files
- Development, staging, and production environments
- All API keys, tokens, passwords, and sensitive configuration

## Key Protection Requirements

### 1. Never Commit Secrets

**PROHIBITED ACTIONS:**
- ❌ Committing `.env` files containing actual secrets
- ❌ Hardcoding API keys, tokens, or passwords in source code
- ❌ Storing secrets in configuration files tracked by git
- ❌ Committing private keys, certificates, or credentials
- ❌ Including secrets in commit messages or PR descriptions
- ❌ Sharing secrets in GitHub issues or discussions

**REQUIRED ACTIONS:**
- ✅ Use environment variables for all secrets
- ✅ Store secrets only in `.env` (which is in `.gitignore`)
- ✅ Use `.env.example` with placeholder values for documentation
- ✅ Keep production secrets in secure deployment platforms (Netlify, Vercel)
- ✅ Rotate any accidentally exposed keys immediately

### 2. Environment Variable Usage

#### Naming Conventions

**Client-Side Variables (Browser Exposed):**
```bash
NEXT_PUBLIC_API_KEY=your_public_key_here
```
- Prefix with `NEXT_PUBLIC_`
- **⚠️ WARNING**: These are exposed to browsers
- Only use for truly public, non-sensitive values
- Examples: Public API endpoints, feature flags

**Server-Side Variables (Secure):**
```bash
GITHUB_TOKEN_READ_ONLY=ghp_secret_token_here
DATABASE_URL=postgresql://user:pass@host/db
INTERNAL_API_KEY=sk_secret_key_here
```
- No special prefix
- Accessible only in server-side code
- Use for all sensitive secrets

#### Usage Guidelines

1. **Check `.env.example`** before adding new variables
2. **Document all variables** with clear descriptions
3. **Update docs/api-keys.md** when adding new API integrations
4. **Test with mock data** when keys are unavailable (set `USE_MOCK_DATA=true`)

### 3. Pre-Commit Protection

#### Git Hooks (Husky)

We use Husky to prevent accidental secret commits:

**Configured Hooks:**
- `pre-commit`: Runs secret detection before allowing commits
- `commit-msg`: Validates commit message format
- `pre-push`: Additional checks before pushing

**To Enable:**
```bash
npm install  # Automatically sets up Husky hooks
```

**Manual Check:**
```bash
# Check for secrets before committing
npm run check-secrets

# Or use git-secrets (if installed)
git secrets --scan
```

### 4. Secret Scanning

#### Automated Scanning

**GitHub Secret Scanning:**
- Enabled on the repository
- Automatically detects exposed secrets
- Notifies security maintainers immediately
- Blocks known secret patterns

**Dependency Scanning:**
- Dependabot alerts for vulnerable packages
- Regular security audits via `npm audit`
- Automated PRs for security updates

#### Manual Scanning

Before committing sensitive changes:
```bash
# Scan for potential secrets
npm run lint

# Check specific files
git diff --cached | grep -iE '(api[_-]?key|secret|password|token|private)'
```

### 5. Incident Response

#### If You Accidentally Commit a Secret

**IMMEDIATE ACTIONS (Within 1 Hour):**

1. **Rotate the Key Immediately**
   - Go to the service provider (GitHub, Algolia, etc.)
   - Generate a new key
   - Invalidate/delete the exposed key
   - Update deployment environments with new key

2. **Notify Security Team**
   ```
   Email: security@ethereum.org
   Subject: [URGENT] Accidentally Exposed API Key in Commit [commit-hash]
   ```

3. **Remove from Git History**
   ```bash
   # For recent commits (not yet pushed)
   git reset HEAD~1
   git add .
   git commit -m "Fix: Remove exposed secrets"

   # For pushed commits - contact maintainers
   # DO NOT force push without coordination
   ```

4. **Document the Incident**
   - Create private issue with details
   - Note which key was exposed
   - Confirm rotation completed
   - Review how to prevent recurrence

**FOLLOW-UP ACTIONS (Within 24 Hours):**

1. Verify new keys are working in all environments
2. Monitor for unauthorized usage of old keys
3. Review git history to ensure complete removal
4. Update this policy if gaps were identified

### 6. Key Management Best Practices

#### Storage

**Local Development:**
- Store in `.env` file (never committed)
- Use password manager for backup
- Don't share `.env` files via Slack, email, etc.

**Production/Staging:**
- Store in deployment platform (Netlify, Vercel)
- Use environment-specific keys (dev ≠ production)
- Implement principle of least privilege
- Enable key rotation schedules

#### Access Control

**Who Can Access Production Keys:**
- Core maintainers only
- Logged in secure credential store
- Requires 2FA for access
- Audit trail maintained

**Key Permission Levels:**
- **Read-only keys**: For public data access (preferred)
- **Write keys**: Only when necessary, restricted scope
- **Admin keys**: Never used in application code

#### Key Rotation Schedule

| Key Type | Rotation Frequency | Owner |
|----------|-------------------|--------|
| GitHub Read-Only Tokens | Every 90 days | Core Maintainers |
| API Keys (Algolia, etc.) | Every 180 days | Core Maintainers |
| Service Account Keys | Every 90 days | DevOps Lead |
| Webhook Secrets | Every 180 days | Core Maintainers |
| Emergency Access Keys | Every 30 days | Security Team |

### 7. Third-Party Services

#### Approved Services

When adding new API integrations:

1. **Security Review Required** for all new services
2. **Documentation Required** in `docs/api-keys.md`
3. **Maintainer Approval** for production access

**Current Approved Services:**
- GitHub API (repository data)
- Algolia (search functionality)
- Netlify (hosting/deployment)
- Crowdin (translations)
- Matomo (analytics)
- Sentry (error tracking)

#### Service-Specific Guidelines

**GitHub API:**
- Use personal access tokens with minimal scopes
- Prefer read-only access
- Set expiration dates (90 days max)

**Algolia:**
- Separate keys for search vs. indexing
- Use secured API key for frontend
- Admin key only server-side

**Netlify:**
- Environment variables in Netlify dashboard
- Separate deploy keys per environment
- Enable deploy notifications

### 8. Code Review Requirements

#### For Contributors

When submitting PRs that involve:
- New API integrations
- Environment variable changes
- Authentication/authorization code
- External service connections

**Required:**
- Clear documentation of what keys are needed
- Updated `.env.example` with placeholders
- Security considerations section in PR description
- Confirmation that no secrets are committed

#### For Reviewers

**Security Checklist:**
- [ ] No hardcoded secrets in code
- [ ] `.env.example` updated appropriately
- [ ] `NEXT_PUBLIC_` used correctly (not for secrets)
- [ ] Documentation updated in relevant files
- [ ] New dependencies from trusted sources
- [ ] No secrets in test fixtures or mocks
- [ ] API keys have appropriate scopes/permissions

### 9. Education and Training

#### New Contributor Onboarding

All new contributors must:
1. Read this policy
2. Review `docs/api-keys.md`
3. Set up pre-commit hooks
4. Complete security checklist

#### Ongoing Training

- Quarterly security reminders
- Updates when policy changes
- Security incidents review (anonymized)
- Best practices in maintainer meetings

### 10. Compliance and Auditing

#### Regular Audits

**Monthly:**
- Review `.env.example` accuracy
- Check for unused environment variables
- Verify git hooks are functioning

**Quarterly:**
- Rotate keys per schedule
- Audit access to production keys
- Review and update this policy
- Scan git history for exposed secrets

**Annually:**
- Comprehensive security review
- Update all production keys
- Review third-party service integrations
- Security training refresh

#### Metrics

Track and report:
- Number of secret exposures (target: 0)
- Key rotation compliance rate (target: 100%)
- Time to respond to incidents (target: <1 hour)
- Pre-commit hook effectiveness

## Policy Violations

### Severity Levels

**Level 1 - Low Severity:**
- Exposed non-sensitive configuration
- Missing documentation
- First-time minor oversight

**Level 2 - Medium Severity:**
- Exposed API key with limited scope
- Committed `.env` with dummy/test data
- Repeated minor violations

**Level 3 - High Severity:**
- Exposed production API keys
- Committed private keys or credentials
- Intentional policy violation
- Failure to respond to incident

### Consequences

**Level 1:**
- Warning and education
- Required policy review

**Level 2:**
- Temporary suspension of commit access
- Required security training
- Enhanced review of future PRs

**Level 3:**
- Immediate suspension of access
- Security team investigation
- Potential permanent ban for intentional violations

**For All Levels:**
- Immediate key rotation required
- Incident documentation
- Review of related commits

## Related Documentation

- [API Keys & Configuration Guide](api-keys.md)
- [Security Policy](../SECURITY.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)

## Policy Updates

This policy is reviewed quarterly and updated as needed.

**Last Updated**: February 2026

**Next Review**: May 2026

**Policy Owners**: Security maintainers (@asanso, @fredriksvantes) and core maintainers

## Questions and Support

- **General Questions**: Discord - [ethereum.org Discord](https://discord.gg/ethereum-org)
- **Security Concerns**: security@ethereum.org
- **Policy Clarification**: Open an issue or discussion on GitHub

---

**By contributing to ethereum.org, you agree to follow this Key Protection Policy.**
