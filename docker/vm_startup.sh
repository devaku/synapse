#!/bin/bash
# Setup VM

echo "Downloading Docker"
curl -fsSL https://get.docker.com -o install-docker.sh

echo "Installing Docker"
sudo sh install-docker.sh

echo "Adding user into docker group"
sudo usermod -aG docker $USER