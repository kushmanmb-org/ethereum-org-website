# Governance Procedures

## Overview

This document defines the operational procedures for governing the ethereum.org repository, including decision-making processes, maintainer responsibilities, and community engagement protocols.

## Purpose

These procedures ensure:
- Transparent and consistent decision-making
- Efficient collaboration among maintainers
- Clear pathways for community participation
- Accountability and quality standards
- Alignment with Ethereum's decentralized values

## Decision-Making Procedures

### Classification of Changes

Every proposed change is classified to determine the approval process:

#### Minor Changes

**Definition:**
- Bug fixes (non-breaking)
- Typo corrections
- Documentation improvements
- Small UI/UX adjustments
- Dependency updates (patch versions)

**Procedure:**
1. Contributor submits PR
2. Automated checks run (lint, build, tests)
3. One maintainer reviews
4. Maintainer approves and merges
5. **Timeline**: 1-2 days

**Example:**
```
PR: Fix typo in staking documentation
Approver: Any core maintainer
Merge: Immediate after approval
```

#### Moderate Changes

**Definition:**
- New features (non-breaking)
- Significant refactoring
- New content sections
- Component additions
- Minor version dependency updates
- Design system updates

**Procedure:**
1. Contributor submits PR with detailed description
2. Automated checks run
3. First maintainer reviews code/content
4. Second maintainer reviews for different perspective
5. Both maintainers approve
6. Author or maintainer merges
7. **Timeline**: 2-5 days

**Example:**
```
PR: Add new wallet integration component
Approvers: @wackerow (code) + @minimalsm (UX)
Discussion: Ensure wallet meets inclusion criteria
Merge: After both approvals
```

#### Major Changes

**Definition:**
- Breaking changes
- Architecture modifications
- Major dependency upgrades
- New integrations with external services
- Changes to governance or processes
- Redesigns affecting multiple pages

**Procedure:**
1. Author creates discussion issue first
2. Core maintainers discuss asynchronously
3. Synchronous meeting if needed (scheduled within 1 week)
4. Consensus required from all core maintainers
5. PR submitted after consensus
6. All core maintainers review
7. Final approval from project lead
8. **Timeline**: 1-3 weeks

**Example:**
```
Issue: Proposal - Migrate to new framework version
Discussion: 1 week for feedback
Meeting: Core maintainers sync
Decision: Consensus documented
PR: Implementation after approval
Review: All core maintainers
Merge: After full consensus
```

#### Emergency Changes

**Definition:**
- Security vulnerabilities (critical)
- Site-breaking production issues
- Data loss prevention
- Legal/compliance requirements

**Procedure:**
1. Any core maintainer can merge immediately
2. Post-merge notification to all maintainers
3. Review by second maintainer within 24 hours
4. Post-mortem within 1 week
5. **Timeline**: Immediate

**Example:**
```
Issue: XSS vulnerability discovered
Action: Immediate fix by security maintainer
Notification: Alert all maintainers via Discord
Review: Second review within 24h
Post-mortem: Document and improve process
```

## Pull Request Procedures

### Submission Requirements

**All PRs Must Include:**

1. **Clear Title**
   - Format: `[Type] Brief description`
   - Types: Fix, Feature, Docs, Refactor, Chore, Security

2. **Description**
   - What changed and why
   - Related issue numbers
   - Testing performed
   - Screenshots (for UI changes)

3. **Checklist Completion**
   ```markdown
   - [ ] Code follows style guidelines
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] No secrets committed
   - [ ] Builds successfully
   - [ ] Self-reviewed code
   ```

### Review Standards

**Code Review Focus:**
- Correctness and functionality
- Code quality and maintainability
- Performance implications
- Security considerations
- Accessibility compliance
- Test coverage

**Content Review Focus:**
- Technical accuracy
- Clarity and readability
- Neutrality and objectivity
- Localization compatibility
- Link validity
- SEO optimization

### Review Timeline Expectations

| Change Type | Initial Response | Full Review | Merge Decision |
|------------|------------------|-------------|----------------|
| Minor | 24 hours | 48 hours | 2 days |
| Moderate | 48 hours | 5 days | 1 week |
| Major | 1 week | 2 weeks | 3 weeks |
| Emergency | Immediate | 24 hours | Immediate |

### Stale PR Management

**After 14 Days of Inactivity:**
- Bot labels PR as "stale"
- Author receives reminder notification

**After 30 Days of Inactivity:**
- Bot adds comment requesting updates
- Maintainer reviews if action needed

**After 60 Days of Inactivity:**
- PR may be closed
- Can be reopened if contributor returns
- Code preserved for future reference

## Issue Management Procedures

### Issue Triage

**New Issues:**
1. Auto-labeled based on template
2. Maintainer reviews within 3 days
3. Applies appropriate labels
4. Assigns to milestone if planned
5. Requests more info if needed

**Labels Applied:**
- **Type**: bug, feature, documentation, question
- **Priority**: critical, high, medium, low
- **Status**: needs-triage, ready, in-progress, blocked
- **Area**: content, code, design, infrastructure

### Issue Assignment

**Self-Assignment:**
- Contributors can self-assign issues
- Comment "I'd like to work on this"
- Maintainer assigns within 24 hours

**Maintainer Assignment:**
- Based on expertise and bandwidth
- Confirms assignment with assignee
- Sets expected timeline

### Issue Resolution

**Closing Criteria:**
- PR merged that resolves issue
- Issue determined to be not applicable
- Duplicate of existing issue
- Wontfix with explanation

**Reopening:**
- New information provided
- Original fix didn't work
- Issue recurred

## Maintainer Responsibilities

### Core Maintainer Duties

**Daily (Mon-Fri):**
- Monitor Discord for urgent issues
- Review notifications
- Respond to mentions

**Weekly:**
- Review new issues (3-5 hours)
- Review open PRs (5-10 hours)
- Participate in discussions
- Update project board

**Monthly:**
- Review analytics and metrics
- Update documentation
- Plan upcoming features
- Community engagement

**Quarterly:**
- Security audits
- Dependency updates
- Process improvements
- Maintainer sync meeting

### Specialized Maintainer Duties

**Security Maintainers:**
- Monitor security alerts
- Respond to vulnerability reports
- Coordinate security patches
- Maintain security documentation

**Content Maintainers:**
- Review content submissions
- Ensure technical accuracy
- Coordinate with translation team
- Update educational resources

**DevOps Maintainers:**
- Monitor deployments
- Maintain CI/CD pipelines
- Manage infrastructure
- Optimize build performance

### Maintainer Availability

**Expected Availability:**
- Respond to urgent issues within 24 hours
- Review assigned PRs within expected timeline
- Participate in quarterly sync meetings
- Give advance notice for extended absences (>2 weeks)

**Backup Coverage:**
- Core maintainers cover for each other
- Specialized areas have backup assignees
- Emergency contacts documented
- Escalation path defined

## Communication Procedures

### Communication Channels

**GitHub (Primary):**
- Issues: Bug reports, feature requests
- Discussions: Ideas, questions, proposals
- PRs: Code/content review
- Projects: Planning and tracking

**Discord (Secondary):**
- Real-time discussion
- Community support
- Maintainer coordination
- Urgent notifications

**Email (Sensitive):**
- Security vulnerabilities
- Private maintainer discussions
- Legal/compliance matters
- Sensitive user reports

### Meeting Procedures

**Quarterly Maintainer Sync:**
- Scheduled 2 weeks in advance
- Agenda shared 1 week before
- All core maintainers expected
- Notes published after meeting
- Action items tracked

**Ad-Hoc Meetings:**
- Scheduled when consensus needed
- Minimum 48 hours notice
- Clear agenda provided
- Optional attendance
- Summary shared with team

**Community Calls:**
- Monthly or as needed
- Open to all contributors
- Announced 1 week in advance
- Recorded and shared
- Q&A session included

### Notification Protocols

**Critical Issues:**
- Post in #urgent-alerts Discord channel
- Tag all core maintainers
- Send follow-up email if no response in 1 hour

**Security Issues:**
- Email security@ethereum.org
- Tag security maintainers in private channel
- Do not discuss publicly until resolved

**General Updates:**
- Post in appropriate Discord channel
- Tag relevant maintainers
- Update GitHub issue/PR

## Conflict Resolution Procedures

### Disagreements on Technical Decisions

**Step 1: Discussion**
- Parties present viewpoints in issue/PR
- Community feedback welcomed
- Goal: Find consensus

**Step 2: Mediation**
- Third-party maintainer mediates
- Review technical merits of each approach
- Consider long-term implications

**Step 3: Vote**
- If consensus not reached, core maintainers vote
- Simple majority (3/4) decides
- Decision documented with rationale

**Step 4: Project Lead Decision**
- In rare cases, project lead makes final call
- After all other steps exhausted
- With full explanation

### Code of Conduct Violations

**Minor Violations:**
- Private warning from maintainer
- Explanation of violation
- Expectation set for future

**Moderate Violations:**
- Temporary ban from repository
- Public statement if violation was public
- Path to reinstatement defined

**Severe Violations:**
- Permanent ban
- Reported to GitHub if appropriate
- Community notified if relevant

## Process Improvement

### Feedback Collection

**Quarterly Survey:**
- Sent to all contributors
- Feedback on processes
- Suggestions for improvement
- Pain points identified

**Continuous Feedback:**
- GitHub Discussions for process ideas
- Maintainer retrospectives
- Community input welcomed

### Process Updates

**Minor Updates:**
- One maintainer can update procedures
- Changes documented in commit
- Team notified via Discord

**Major Updates:**
- Discussion and consensus required
- Update version and date
- Announcement to community
- Training provided if needed

## Metrics and Reporting

### Key Performance Indicators

**Community Health:**
- New contributors per month
- Repeat contributors
- Issue resolution time
- PR merge time

**Quality Metrics:**
- Test coverage
- Build success rate
- Deployment frequency
- Error rates

**Engagement Metrics:**
- GitHub stars/forks
- Website traffic
- Community Discord activity
- Translation progress

### Monthly Reports

**Published Metrics:**
- PRs merged
- Issues closed
- New contributors
- Notable achievements
- Upcoming priorities

**Internal Metrics:**
- Maintainer workload
- Review bottlenecks
- Process efficiency
- Resource needs

## Appendices

### A. Quick Reference

| Action | Who | Timeline | Approvals |
|--------|-----|----------|-----------|
| Bug fix | Any contributor | 1-2 days | 1 maintainer |
| New feature | Any contributor | 1 week | 2 maintainers |
| Breaking change | Core team | 2-3 weeks | All core maintainers |
| Security fix | Security team | Immediate | 1 maintainer + post-review |
| Content update | Any contributor | 2-3 days | 1 maintainer |

### B. Escalation Path

1. **PR Author** → Maintainer assigned to review
2. **Maintainer** → Other core maintainers
3. **Core Maintainers** → Project lead
4. **Project Lead** → Ethereum Foundation (if needed)

### C. Templates

**Issue Templates**: `.github/ISSUE_TEMPLATE/`
**PR Template**: `.github/PULL_REQUEST_TEMPLATE.md`
**Meeting Agenda**: Available in wiki

## Related Documentation

- [Ownership & Governance](ownership.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)
- [Security Policy](../SECURITY.md)

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Feb 2026 | Initial comprehensive procedures | Core Maintainers |

**Last Updated**: February 2026

**Next Review**: May 2026

**Document Owners**: Core Maintainers

---

**These procedures are living documents. Feedback and improvements are always welcome.**
