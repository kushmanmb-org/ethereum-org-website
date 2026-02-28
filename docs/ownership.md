# Ethereum.org Ownership & Governance

## Legal Ownership & Domain Registration

### Domain and Website Ownership

The **ethereum.org domain and website** are owned and operated by the **Ethereum Foundation** (Stiftung Ethereum), a non-profit organization based in Zug, Switzerland.

#### Domain Details

- **`.org` Domain**: The ethereum.org domain is registered and managed through a domain name system (DNS) provider on behalf of the Ethereum Foundation.
- **`.eth` Domain**: The Ethereum Foundation also owns the **ethereum.eth** domain, which is registered on Ethereum via the [Ethereum Name Service (ENS)](https://app.ens.domains/name/ethereum.eth).

#### Legal Entity Information

- **Organization**: Stiftung Ethereum (Ethereum Foundation)
- **Type**: Non-profit organization
- **Location**: Zug, Switzerland
- **Purpose**: Supporting Ethereum and related technologies
- **Website Operations**: Funds and supports ethereum.org operations

While the Ethereum Foundation owns the domain and funds the website operations, ethereum.org remains a **public, open-source resource** with contributions from thousands of community members worldwide. The website's source code is publicly available and anyone can contribute.

For more details on the legal operation of ethereum.org, please refer to:
- [About ethereum.org](/about#ownership)
- [Terms of Use](/terms-of-use/)
- [Ethereum Foundation](https://ethereum.foundation/)

---

## Repository & Project Governance

### Overview

Ethereum.org is an open-source community-driven project maintained by contributors worldwide. This document outlines the governance structure, maintainer roles, and decision-making processes for the ethereum.org website repository.

## Governance Model

### Decentralized Maintenance

Ethereum.org follows a decentralized governance model that reflects Ethereum's core values:

- **Open Contribution**: Anyone can propose changes through pull requests
- **Transparent Review**: All decisions are made publicly through GitHub
- **Consensus-Driven**: Major changes require agreement from core maintainers
- **Community First**: User feedback and community needs guide priorities

## Maintainer Roles

### Core Maintainers

Core maintainers have write access to the repository and are responsible for:

- Reviewing and merging pull requests
- Maintaining code quality and consistency
- Guiding technical direction
- Responding to security issues
- Managing releases and deployments

**Current Core Maintainers:**
- @wackerow
- @corwintines
- @pettinarip
- @minimalsm

### Specialized Maintainers

Specialized maintainers focus on specific areas:

#### Security
- @asanso - Consensus layer security
- @fredriksvantes - Bug bounty program

#### Wallet & User Experience
- @konopkja - Wallet integrations
- @minimalsm - New user onboarding

## Responsibilities

### Code Maintenance

**Who**: Core maintainers
**What**:
- Review PRs within 5 business days
- Ensure code follows style guides
- Maintain test coverage
- Update dependencies

### Content Review

**Who**: Core maintainers + community reviewers
**What**:
- Verify technical accuracy
- Check for clarity and accessibility
- Ensure proper localization support
- Review external links

### Community Management

**Who**: All maintainers
**What**:
- Respond to issues and discussions
- Welcome new contributors
- Facilitate community events
- Coordinate with translation teams

### Security

**Who**: Security maintainers + core team
**What**:
- Respond to security reports within 24 hours
- Coordinate vulnerability disclosures
- Maintain security documentation
- Review security-sensitive code

## Decision-Making Process

### Minor Changes
- **Examples**: Bug fixes, typos, small improvements
- **Process**: Single maintainer approval required
- **Timeline**: Can be merged immediately after approval

### Moderate Changes
- **Examples**: New components, significant refactors, content additions
- **Process**: Two maintainer approvals required
- **Timeline**: 2-3 days for review

### Major Changes
- **Examples**: Architecture changes, breaking changes, major features
- **Process**: Discussion + consensus from all core maintainers
- **Timeline**: 1-2 weeks for discussion and review

### Emergency Changes
- **Examples**: Security fixes, critical bugs, site outages
- **Process**: Any core maintainer can merge after testing
- **Timeline**: Immediate, with post-merge review

## Code Ownership (CODEOWNERS)

The `.github/CODEOWNERS` file defines automatic review assignments:

```
# Default owners for all files
*       @wackerow @corwintines @pettinarip @minimalsm

# Security-specific files
/src/data/consensus-bounty-hunters.json @asanso @fredriksvantes

# Wallet-specific files
/src/data/wallets/new-to-crypto.ts @konopkja @minimalsm
```

When you submit a PR that modifies these files, the specified owners are automatically requested for review.

## Becoming a Maintainer

### Eligibility Criteria

To become a maintainer, contributors should demonstrate:

1. **Consistent Contributions**: 10+ merged PRs over 3+ months
2. **Quality Work**: High-quality code and thoughtful reviews
3. **Community Engagement**: Helpful in discussions and issues
4. **Subject Expertise**: Deep knowledge in a specific area
5. **Alignment with Values**: Commitment to Ethereum.org's mission

### Process

1. **Nomination**: Current maintainers nominate candidates
2. **Discussion**: Core team discusses candidate's contributions
3. **Consensus**: All core maintainers must agree
4. **Onboarding**: New maintainer receives access and training

## Removing Maintainer Status

Maintainer status may be removed in cases of:

- Extended inactivity (6+ months)
- Violation of Code of Conduct
- Consistent poor judgment
- Personal request to step down

**Process**: Discussion among core maintainers → consensus decision → graceful transition

## Communication Channels

### GitHub
- **Primary**: Issues and pull requests
- **Use for**: Technical discussions, bug reports, feature requests

### Discord
- **Server**: [ethereum.org Discord](https://discord.gg/ethereum-org)
- **Use for**: Real-time collaboration, community questions

### Email
- **Security**: security@ethereum.org
- **General**: website@ethereum.org

## Conflict Resolution

If disagreements arise:

1. **Discussion**: Open dialogue in relevant GitHub issue/PR
2. **Mediation**: Core maintainers facilitate resolution
3. **Vote**: If consensus can't be reached, core maintainers vote
4. **Escalation**: Community input through RFC process

## Relationship with Ethereum Foundation

### Foundation's Role

The **Ethereum Foundation (Stiftung Ethereum)** is the legal owner and operator of ethereum.org:

#### What the Foundation Provides:
- **Legal Ownership**: Owns the ethereum.org domain (both .org and .eth)
- **Financial Support**: Funds website operations and infrastructure
- **Infrastructure & Hosting**: Provides technical infrastructure
- **Coordination**: Facilitates connections with other Ethereum initiatives
- **Domain Management**: Manages domain registration and DNS

#### What the Foundation Does NOT Control:
- **Content Decisions**: Maintainers and community drive content decisions
- **Day-to-Day Operations**: Maintainers operate independently
- **Editorial Direction**: Community feedback and consensus guide priorities
- **Code Contributions**: Open to all contributors without Foundation approval

### Governance Independence

While the Ethereum Foundation owns and funds ethereum.org:
- Repository maintainers make technical and content decisions
- Community contributions are valued and encouraged
- Governance follows decentralized, consensus-driven principles
- The project remains open-source and community-first

## Contributing to Governance

This governance model is a living document. To suggest improvements:

1. Open an issue with the `governance` label
2. Describe the proposed change
3. Engage in community discussion
4. Submit a PR with consensus

## Additional Resources

- [Contributing Guide](../CONTRIBUTING.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)
- [Review Process](./review-process.md)
- [Deploy Process](./deploy-process.md)
- [GitHub Issue Triage](./github-issue-triage-process.md)

---

**Last Updated**: February 2026
**Document Maintainers**: Core team
**Review Cycle**: Quarterly
