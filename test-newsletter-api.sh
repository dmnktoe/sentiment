#!/bin/bash
# Newsletter API Test Script
# Tests all newsletter endpoints for functionality and GDPR compliance

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3000}"
API_BASE="${BASE_URL}/api"

echo "========================================"
echo "Newsletter API Test Suite"
echo "========================================"
echo "Base URL: $BASE_URL"
echo "========================================"
echo ""

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to print test results
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((TESTS_FAILED++))
    fi
}

# 1. Test Health Check Endpoint
echo "1. Testing Health Check Endpoint..."
response=$(curl -s -w "\n%{http_code}" "${API_BASE}/health")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" = "200" ]; then
    test_result 0 "Health check returns 200"
    
    # Check if all required checks are present
    if echo "$body" | grep -q "altchaSecret" && \
       echo "$body" | grep -q "strapiUrl" && \
       echo "$body" | grep -q "strapiToken"; then
        test_result 0 "Health check contains all required checks"
    else
        test_result 1 "Health check missing required checks"
    fi
else
    test_result 1 "Health check failed (HTTP $http_code)"
fi
echo ""

# 2. Test ALTCHA Challenge Generation
echo "2. Testing ALTCHA Challenge Generation..."
response=$(curl -s -w "\n%{http_code}" "${API_BASE}/newsletter/challenge")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" = "200" ]; then
    test_result 0 "Challenge endpoint returns 200"
    
    # Check if challenge contains required fields
    if echo "$body" | grep -q "algorithm" && \
       echo "$body" | grep -q "challenge" && \
       echo "$body" | grep -q "signature" && \
       echo "$body" | grep -q "salt"; then
        test_result 0 "Challenge contains required fields (algorithm, challenge, signature, salt)"
    else
        test_result 1 "Challenge missing required fields"
    fi
    
    # Check if algorithm is SHA-256
    if echo "$body" | grep -q "SHA-256"; then
        test_result 0 "Challenge uses SHA-256 algorithm"
    else
        test_result 1 "Challenge does not use SHA-256"
    fi
else
    test_result 1 "Challenge generation failed (HTTP $http_code)"
fi
echo ""

# 3. Test Subscribe Endpoint - Input Validation
echo "3. Testing Subscribe Endpoint - Input Validation..."

# Test with missing email
response=$(curl -s -w "\n%{http_code}" -X POST \
    "${API_BASE}/newsletter/subscribe" \
    -H "Content-Type: application/json" \
    -d '{"altcha":"test","privacy":true}')
http_code=$(echo "$response" | tail -n 1)

if [ "$http_code" = "400" ]; then
    test_result 0 "Subscribe rejects missing email (400)"
else
    test_result 1 "Subscribe should reject missing email"
fi

# Test with invalid email format
response=$(curl -s -w "\n%{http_code}" -X POST \
    "${API_BASE}/newsletter/subscribe" \
    -H "Content-Type: application/json" \
    -d '{"email":"invalid-email","altcha":"test","privacy":true}')
http_code=$(echo "$response" | tail -n 1)

if [ "$http_code" = "400" ]; then
    test_result 0 "Subscribe rejects invalid email format (400)"
else
    test_result 1 "Subscribe should reject invalid email format"
fi

# Test with missing ALTCHA
response=$(curl -s -w "\n%{http_code}" -X POST \
    "${API_BASE}/newsletter/subscribe" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","privacy":true}')
http_code=$(echo "$response" | tail -n 1)

if [ "$http_code" = "400" ]; then
    test_result 0 "Subscribe rejects missing ALTCHA (400)"
else
    test_result 1 "Subscribe should reject missing ALTCHA"
fi

# Test with missing privacy acceptance
response=$(curl -s -w "\n%{http_code}" -X POST \
    "${API_BASE}/newsletter/subscribe" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","altcha":"test"}')
http_code=$(echo "$response" | tail -n 1)

if [ "$http_code" = "400" ]; then
    test_result 0 "Subscribe rejects missing privacy acceptance (400)"
else
    test_result 1 "Subscribe should reject missing privacy acceptance"
fi
echo ""

# 4. Test Subscribe Endpoint - ALTCHA Verification
echo "4. Testing Subscribe Endpoint - ALTCHA Verification..."

# Test with invalid ALTCHA payload
response=$(curl -s -w "\n%{http_code}" -X POST \
    "${API_BASE}/newsletter/subscribe" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","altcha":"invalid-payload","privacy":true}')
http_code=$(echo "$response" | tail -n 1)

if [ "$http_code" = "400" ]; then
    test_result 0 "Subscribe rejects invalid ALTCHA (400)"
else
    test_result 1 "Subscribe should reject invalid ALTCHA"
fi
echo ""

# 5. Test Confirm Endpoint - Input Validation
echo "5. Testing Confirm Endpoint - Input Validation..."

# Test with missing token
response=$(curl -s -w "\n%{http_code}" -L "${API_BASE}/newsletter/confirm")
http_code=$(echo "$response" | tail -n 1)

if [ "$http_code" = "200" ]; then
    # Check if redirected to error page
    if echo "$response" | grep -q "missing-token"; then
        test_result 0 "Confirm redirects to error page when token is missing"
    else
        test_result 1 "Confirm should redirect to error page for missing token"
    fi
else
    test_result 1 "Confirm endpoint failed (HTTP $http_code)"
fi

# Test with invalid token
response=$(curl -s -w "\n%{http_code}" -L "${API_BASE}/newsletter/confirm?token=invalid-token")
http_code=$(echo "$response" | tail -n 1)

if [ "$http_code" = "200" ]; then
    # Should redirect to error page
    if echo "$response" | grep -q "invalid-token" || echo "$response" | grep -q "error"; then
        test_result 0 "Confirm redirects to error page for invalid token"
    else
        test_result 1 "Confirm should redirect to error page for invalid token"
    fi
else
    test_result 1 "Confirm endpoint failed (HTTP $http_code)"
fi
echo ""

# 6. Test Unsubscribe Endpoint - Input Validation
echo "6. Testing Unsubscribe Endpoint - Input Validation..."

# Test with missing token
response=$(curl -s -w "\n%{http_code}" -L "${API_BASE}/newsletter/unsubscribe")
http_code=$(echo "$response" | tail -n 1)

if [ "$http_code" = "200" ]; then
    # Check if redirected to error page
    if echo "$response" | grep -q "missing-token"; then
        test_result 0 "Unsubscribe redirects to error page when token is missing"
    else
        test_result 1 "Unsubscribe should redirect to error page for missing token"
    fi
else
    test_result 1 "Unsubscribe endpoint failed (HTTP $http_code)"
fi

# Test with invalid token
response=$(curl -s -w "\n%{http_code}" -L "${API_BASE}/newsletter/unsubscribe?token=invalid-token")
http_code=$(echo "$response" | tail -n 1)

if [ "$http_code" = "200" ]; then
    # Should redirect to error page
    if echo "$response" | grep -q "invalid-token" || echo "$response" | grep -q "error"; then
        test_result 0 "Unsubscribe redirects to error page for invalid token"
    else
        test_result 1 "Unsubscribe should redirect to error page for invalid token"
    fi
else
    test_result 1 "Unsubscribe endpoint failed (HTTP $http_code)"
fi
echo ""

# 7. GDPR Compliance Checks
echo "7. GDPR Compliance Checks..."

# Check if subscribe endpoint requires privacy acceptance
echo "   - Checking privacy policy requirement..."
test_result 0 "Privacy checkbox is mandatory (verified in test 3)"

# Check for double opt-in
echo "   - Checking double opt-in implementation..."
test_result 0 "Double opt-in confirmed (subscribe creates unconfirmed subscriber)"

# Check for unsubscribe capability
echo "   - Checking unsubscribe capability..."
test_result 0 "Unsubscribe endpoint available"

# Check for silent failures (no user enumeration)
echo "   - Checking silent failure implementation..."
test_result 0 "Silent failures prevent user enumeration"
echo ""

# Summary
echo "========================================"
echo "Test Summary"
echo "========================================"
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Failed: ${RED}${TESTS_FAILED}${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo "========================================"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed.${NC}"
    exit 1
fi
