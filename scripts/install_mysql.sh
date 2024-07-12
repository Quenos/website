#!/bin/bash

# Update package list
sudo apt update

# Install MySQL Server
sudo apt install -y mysql-server

# Start MySQL service
sudo systemctl start mysql

# Enable MySQL to start on boot
sudo systemctl enable mysql

# Secure MySQL installation
sudo mysql_secure_installation

# Print MySQL version
mysql --version

echo "MySQL installation completed."
