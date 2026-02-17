#!/bin/bash

# Base URL
API_URL="http://localhost:8080/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Helper function to extract token
get_token() {
    echo $1 | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4
}

# Helper function to extract ID
get_id() {
    echo $1 | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2
}

echo "1. Login as User"
USER_LOGIN_RES=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com", "password":"user123"}')
USER_TOKEN=$(get_token "$USER_LOGIN_RES")

if [ -z "$USER_TOKEN" ]; then
    echo -e "${RED}User Login Failed${NC}"
    exit 1
else
    echo -e "${GREEN}User Login Success${NC}"
fi

echo "2. Login as Admin"
ADMIN_LOGIN_RES=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com", "password":"admin123"}')
ADMIN_TOKEN=$(get_token "$ADMIN_LOGIN_RES")

if [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${RED}Admin Login Failed${NC}"
    exit 1
else
    echo -e "${GREEN}Admin Login Success${NC}"
fi

echo "3. User Creates Order"
# Assuming product ID 1 exists (from DataSeeder)
ORDER_RES=$(curl -s -X POST $API_URL/orders \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items": [{"productId": 1, "quantity": 2}]}')
ORDER_ID=$(get_id "$ORDER_RES")

if [ -z "$ORDER_ID" ]; then
    echo -e "${RED}Order Creation Failed${NC}"
    echo $ORDER_RES
    exit 1
else
    echo -e "${GREEN}Order Created with ID: $ORDER_ID${NC}"
fi

echo "3.1. User Gets Order Details"
GET_ORDER_RES=$(curl -s -X GET $API_URL/orders/$ORDER_ID \
  -H "Authorization: Bearer $USER_TOKEN")

if [[ $GET_ORDER_RES == *"id":$ORDER_ID* ]]; then
    echo -e "${GREEN}Get Order Details Success${NC}"
else
    echo -e "${RED}Get Order Details Failed${NC}"
    echo "Response: $GET_ORDER_RES"
    exit 1
fi

echo "4. User Updates Order"
UPDATE_RES=$(curl -s -X PUT $API_URL/orders/$ORDER_ID \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items": [{"productId": 1, "quantity": 5}]}')

# Check if update was successful (basic check for now)
if [[ $UPDATE_RES == *"\"quantity\":5"* ]]; then
    echo -e "${GREEN}Order Update Success${NC}"
else
    echo -e "${RED}Order Update Failed${NC}"
    echo $UPDATE_RES
fi

echo "5. User Deletes Order"
DELETE_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $API_URL/orders/$ORDER_ID \
  -H "Authorization: Bearer $USER_TOKEN")

if [ "$DELETE_CODE" -eq 204 ] || [ "$DELETE_CODE" -eq 200 ]; then
    echo -e "${GREEN}Order Delete Success (Code: $DELETE_CODE)${NC}"
else
    echo -e "${RED}Order Delete Failed (Code: $DELETE_CODE)${NC}"
fi

echo "6. User Creates Another Order (for Admin test)"
ORDER2_RES=$(curl -s -X POST $API_URL/orders \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items": [{"productId": 1, "quantity": 3}]}')
ORDER2_ID=$(get_id "$ORDER2_RES")
echo -e "${GREEN}Order 2 Created with ID: $ORDER2_ID${NC}"

echo "7. Admin Updates User's Order"
ADMIN_UPDATE_RES=$(curl -s -X PUT $API_URL/orders/$ORDER2_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items": [{"productId": 1, "quantity": 10}]}')

if [[ $ADMIN_UPDATE_RES == *"\"quantity\":10"* ]]; then
    echo -e "${GREEN}Admin Update Success${NC}"
else
    echo -e "${RED}Admin Update Failed${NC}"
    echo $ADMIN_UPDATE_RES
fi

echo "8. Admin Deletes User's Order"
ADMIN_DELETE_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $API_URL/orders/$ORDER2_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN")

if [ "$ADMIN_DELETE_CODE" -eq 204 ] || [ "$ADMIN_DELETE_CODE" -eq 200 ]; then
    echo -e "${GREEN}Admin Delete Success (Code: $ADMIN_DELETE_CODE)${NC}"
else
    echo -e "${RED}Admin Delete Failed (Code: $ADMIN_DELETE_CODE)${NC}"
fi

echo "Verification Complete"
