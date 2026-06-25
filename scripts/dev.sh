#!/bin/bash
# Local development start script for Tenant Admin Platform
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:8000}
PORT=${PORT:-3001}
echo "Starting Tenant Admin Platform on port $PORT connected to $NEXT_PUBLIC_API_URL"
NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL npx next dev -p $PORT
