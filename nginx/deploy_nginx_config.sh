#!/bin/bash

# Variables
CONFIG_FILE_PATH="./nginx/nginx-http.conf"
DESTINATION_DIR="/etc/nginx/conf.d/"
NGINX_SERVICE="nginx"

# Copy the custom Nginx configuration file to the Nginx configuration directory
echo "Deploying custom Nginx configuration..."
sudo cp "$CONFIG_FILE_PATH" "$DESTINATION_DIR"

# Test Nginx configuration for syntax errors
echo "Testing Nginx configuration..."
sudo nginx -t

# If the test is successful, reload Nginx to apply the new configuration
if [ $? -eq 0 ]; then
    echo "Nginx configuration test passed, reloading Nginx..."
    sudo systemctl reload $NGINX_SERVICE
    echo "Nginx reloaded successfully."
else
    echo "Nginx configuration test failed. Please check the configuration file for errors."
    exit 1
fi

# Output the status of Nginx service
echo "Nginx service status:"
sudo systemctl status $NGINX_SERVICE