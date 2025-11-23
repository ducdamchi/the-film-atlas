#!/bin/bash

echo "📦 Exporting local database..."

# Load environment variables from .env
set -a
source ../server/.env.local
set +a

# Export database
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > ../server/database-backup.sql

if [ $? -eq 0 ]; then
    echo "✅ Database exported to database-backup.sql"
else
    echo "❌ Database export failed"
    exit 1
fi