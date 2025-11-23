#!/bin/bash

echo "📥 Importing database on EC2..."

# Load environment variables
set -a
source ../server/.env.production
set +a

# Check if backup file exists
if [ ! -f "../server/database-backup.sql" ]; then
    echo "❌ database-backup.sql not found. Transfer it first with 'npm run migrate' from local machine."
    exit 1
fi

echo "🗃️ Importing into database: $DB_NAME"

# Drops old database if it exists
mysql -u $DB_USER -p$DB_PASSWORD -e "DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME;"

# Import the database
mysql -u $DB_USER -p$DB_PASSWORD  $DB_NAME < ../server/database-backup.sql

if [ $? -eq 0 ]; then
    echo "✅ Database imported successfully!"
    
    # Clean up backup file
    rm ../server/database-backup.sql
    echo "🧹 Backup file cleaned up"
    
    # Verify import
    echo "📊 Verifying import..."
    mysql -u $DB_USER -p$DB_PASSWORD  -e "USE $DB_NAME; SHOW TABLES;" 2>/dev/null
    
    echo "🎉 Database migration complete!"
else
    echo "❌ Database import failed"
    exit 1
fi