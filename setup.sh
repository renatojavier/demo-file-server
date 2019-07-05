#!/bin/bash

# Meta: text color settings
RED='\033[0;31m'
YELLOW='\033[1;33m'
LGREEN='\033[1;32m'
LBLUE='\033[1;34m'
NC='\033[0m' # No Color

# set NPM config registry to default URI
echo -e "${YELLOW}SETUP[1]${NC} npm config to default registry\\n"
npm config set registry https://registry.npmjs.org

# Install global node_module `express`
echo -e "${YELLOW}SETUP[2]${NC} installing ${LGREEN}express node_modules${NC}\\n"
sudo npm install express -g

# Copy video files to the /public
echo -e "\\n${YELLOW}SETUP[3]${NC} Copying videos to the file server in progress..."
echo -e "Please provide the ${LGREEN}source directory${NC} containing the whole videos:\\n"
read source_dir
echo -e "\\nCopying ${LBLUE}$source_dir${NC} videos to file server's ${LGREEN}/public${NC} directory\\n...\\n"

#  Copy arguments definition
copy_source='/Users/rcjavier/Desktop/Demo-recording/exports/' #temp
copy_dest="$(pwd)/server/public/videos/"

# Added handling to make dest directory writable
chmod 755 $copy_dest

# Exec copy command
cp -a $copy_source/. $copy_dest

# Capture internal IP's of this machine
COM_GET_IP=$(ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}')
echo -e "${YELLOW}[DONE]${NC} Send one of these IP's to ${LBLUE}Renato${NC}: \\n\\n${LGREEN}$COM_GET_IP${NC}\\n"

# Display notification on completion
osascript -e 'display notification "Setup done with the file server!" with title "Sprint review presentation"'