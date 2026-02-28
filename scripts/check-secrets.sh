#!/bin/bash

# Blockchain Security - Secret Detection Script
# This script checks for potential secrets in staged files before commit

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🔍 Checking for secrets in staged files..."

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
    echo "✅ No staged files to check"
    exit 0
fi

# Patterns to detect (case-insensitive)
PATTERNS=(
    # API Keys and Tokens
    "api[_-]?key['\"]?\s*[:=]\s*['\"][a-zA-Z0-9]{20,}"
    "api[_-]?secret['\"]?\s*[:=]\s*['\"][a-zA-Z0-9]{20,}"
    "access[_-]?token['\"]?\s*[:=]\s*['\"][a-zA-Z0-9]{20,}"
    "secret[_-]?key['\"]?\s*[:=]\s*['\"][a-zA-Z0-9]{20,}"
    
    # Private Keys (Ethereum/Blockchain)
    "private[_-]?key['\"]?\s*[:=]\s*['\"]0x[a-fA-F0-9]{64}"
    "privateKey['\"]?\s*[:=]\s*['\"][a-fA-F0-9]{64}"
    "PRIVATE[_-]?KEY"
    
    # Mnemonic/Seed phrases
    "mnemonic['\"]?\s*[:=]"
    "seed[_-]?phrase"
    
    # AWS Credentials
    "AKIA[0-9A-Z]{16}"
    "aws[_-]?secret[_-]?access[_-]?key"
    
    # GitHub Tokens
    "ghp_[a-zA-Z0-9]{36}"
    "gho_[a-zA-Z0-9]{36}"
    "github[_-]?token"
    
    # Generic Secrets
    "password['\"]?\s*[:=]\s*['\"][^'\"]{8,}"
    "passwd['\"]?\s*[:=]\s*['\"][^'\"]{8,}"
    "bearer['\"]?\s+[a-zA-Z0-9\-._~+/]+=*"
)

FOUND_SECRETS=0

# Check each staged file
for file in $STAGED_FILES; do
    # Skip binary files and common safe files
    if [[ $file =~ \.(jpg|jpeg|png|gif|pdf|ico|woff|woff2|ttf|eot)$ ]]; then
        continue
    fi
    
    # Skip node_modules and build directories
    if [[ $file =~ ^(node_modules|.next|out|build)/ ]]; then
        continue
    fi
    
    # Check if file exists (might have been deleted)
    if [ ! -f "$file" ]; then
        continue
    fi
    
    # Check each pattern
    for pattern in "${PATTERNS[@]}"; do
        if grep -iE "$pattern" "$file" > /dev/null 2>&1; then
            if [ $FOUND_SECRETS -eq 0 ]; then
                echo -e "${RED}⚠️  Potential secrets detected!${NC}"
                echo ""
            fi
            echo -e "${RED}File: $file${NC}"
            echo -e "${YELLOW}Pattern matched: $pattern${NC}"
            grep -niE --color=always "$pattern" "$file" | head -3
            echo ""
            FOUND_SECRETS=1
        fi
    done
done

# Special check for .env files
if echo "$STAGED_FILES" | grep -qE "^\.env$|^\.env\.local$|^\.env\.production$"; then
    echo -e "${RED}❌ ERROR: .env file is being committed!${NC}"
    echo -e "${YELLOW}⚠️  .env files contain secrets and should NEVER be committed${NC}"
    echo ""
    echo "To fix:"
    echo "  git reset HEAD .env*"
    echo "  Make sure .env is in .gitignore (it should be)"
    exit 1
fi

if [ $FOUND_SECRETS -eq 1 ]; then
    echo -e "${RED}================================${NC}"
    echo -e "${RED}❌ COMMIT BLOCKED${NC}"
    echo -e "${RED}================================${NC}"
    echo ""
    echo "Potential secrets were detected in your staged files."
    echo ""
    echo "If these are false positives:"
    echo "  1. Verify the matches are not actual secrets"
    echo "  2. Use git commit --no-verify (NOT recommended)"
    echo ""
    echo "If these are real secrets:"
    echo "  1. Remove them from the files"
    echo "  2. Store them in .env or environment variables"
    echo "  3. Update .env.example with placeholder values"
    echo "  4. If already committed, rotate the keys immediately"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ No secrets detected${NC}"
exit 0
