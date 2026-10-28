#!/usr/bin/env bash
# Regression checks for the security fixes in this repo.
# Run from WorkSync/: npm run check:security
set -u
cd "$(dirname "$0")/.."

fail=0

if grep -rn "innerHTML\|dangerouslySetInnerHTML" src/; then
    echo "FAIL: HTML sink found in src/ (see above)"
    fail=1
else
    echo "OK: no innerHTML or dangerouslySetInnerHTML sinks in src/"
fi

hits=$(grep -rln "work-sync-server-eight\|VITE_API_BASE_URL" src/ || true)
if [ "$hits" = "src/api.js" ]; then
    echo "OK: API base URL is single-sourced in src/api.js"
else
    echo "FAIL: API base URL referenced outside src/api.js:"
    echo "$hits"
    fail=1
fi

if grep -rln "x-admin-token" src/ | grep -v "^src/api.js$"; then
    echo "FAIL: x-admin-token referenced outside src/api.js"
    fail=1
else
    echo "OK: x-admin-token is attached only in src/api.js"
fi

if grep -rn "import\.meta\.env\.VITE_ADMIN_TOKEN\s*=\|ADMIN_TOKEN\s*=\s*['\"][^'\"]" src/ | grep -v "import.meta.env.VITE_ADMIN_TOKEN ||"; then
    echo "FAIL: hardcoded admin token literal in src/"
    fail=1
else
    echo "OK: admin token comes from env, no literal value in src/"
fi

if grep -rn "localStorage\.\|sessionStorage\." src/; then
    echo "FAIL: web storage used in src/"
    fail=1
else
    echo "OK: no localStorage or sessionStorage use in src/"
fi

if grep -rn "BEGIN .*PRIVATE KEY\|sk-[A-Za-z0-9]\{20,\}" src/; then
    echo "FAIL: secret-looking literal in src/"
    fail=1
else
    echo "OK: no secret-looking literals in src/"
fi

if [ -f .env ] && git ls-files --error-unmatch .env >/dev/null 2>&1; then
    echo "FAIL: .env is tracked by git"
    fail=1
else
    echo "OK: .env is not tracked by git"
fi

if [ "$fail" -eq 0 ]; then
    echo "All security checks passed."
else
    echo "Security checks failed."
fi
exit "$fail"
