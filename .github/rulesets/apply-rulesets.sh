#!/bin/bash

# Script to apply GitHub repository rulesets
# Requires: GitHub CLI (gh) to be installed and authenticated

set -e

REPO="kushmanmb-org/ethereum-org-website"
RULESETS_DIR=".github/rulesets"

echo "🔐 GitHub Repository Rulesets Setup"
echo "===================================="
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub."
    echo "Please run: gh auth login"
    exit 1
fi

echo "✓ GitHub CLI is installed and authenticated"
echo ""

# Function to create a ruleset
apply_ruleset() {
    local file=$1
    local name=$(basename "$file" .json)
    
    echo "📋 Applying ruleset: $name"
    
    if gh api \
        --method POST \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        "/repos/$REPO/rulesets" \
        --input "$file" > /dev/null 2>&1; then
        echo "✅ Successfully applied $name"
    else
        echo "⚠️  Failed to apply $name (may already exist or require admin permissions)"
    fi
    echo ""
}

# Check if running from repository root
if [ ! -d "$RULESETS_DIR" ]; then
    echo "❌ Error: Must be run from repository root"
    echo "Current directory: $(pwd)"
    exit 1
fi

echo "This script will apply the following rulesets to $REPO:"
echo "  1. Master Branch Protection"
echo "  2. Staging Branch Protection"
echo "  3. Dev Branch Protection"
echo ""
echo "⚠️  Note: You must have admin permissions on the repository."
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

echo ""

# Apply each ruleset
apply_ruleset "$RULESETS_DIR/master-branch.json"
apply_ruleset "$RULESETS_DIR/staging-branch.json"
apply_ruleset "$RULESETS_DIR/dev-branch.json"

echo "===================================="
echo "✨ Ruleset application complete!"
echo ""
echo "To verify, visit:"
echo "https://github.com/$REPO/settings/rules"
echo ""
echo "Note: If any rulesets failed to apply, they may already exist."
echo "You can update them manually through the GitHub UI."
