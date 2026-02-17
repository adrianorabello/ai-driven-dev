#!/bin/bash

# Base URL
API_URL="http://localhost:8080/api"

# Helper function to extract token
get_token() {
    echo $1 | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4
}

echo "1. Login as User"
USER_LOGIN_RES=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com", "password":"user123"}')
USER_TOKEN=$(get_token "$USER_LOGIN_RES")

if [ -z "$USER_TOKEN" ]; then
    echo "User Login Failed"
    exit 1
fi

echo "2. Get Products"
PRODUCTS_RES=$(curl -s -X GET $API_URL/products \
  -H "Authorization: Bearer $USER_TOKEN")

echo $PRODUCTS_RES
