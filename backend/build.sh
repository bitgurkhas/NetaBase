#!/bin/bash

echo "Installing dependencies"
pip install -r requirements.txt

echo "Migrating"
python manage.py migrate

echo "Collectingf statics"
python manage.py collectstatic --no-input
exec "$@"