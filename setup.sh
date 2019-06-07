#!/bin/bash

# Meta: text color settings
RED='\033[0;31m'
YELLOW='\033[1;33m'
LGREEN='\033[1;32m'
LBLUE='\033[1;34m'
LCYAN='\033[1;36m'
NC='\033[0m' # No Color

# set NPM config registry to default URI
echo -e "${YELLOW}SETUP[1]${NC} npm config to default registry\\n"
npm config set registry https://registry.npmjs.org

# Install global node_module `express`
echo -e "${YELLOW}SETUP[2]${NC} installing ${LGREEN}global express & all local dependency node_module${NC}\\n"
sudo npm install express -g
cd server && npm install --save && cd ../client && npm install --save && cd ..

# Copy video files to the /public
echo -e "\\n${YELLOW}SETUP[3]${NC} Copying videos to the file server in progress..."
echo -e "${RED}[!]${NC} Please provide the ${LGREEN}source${NC} that contains videos."
read -p 'Directory(of files only): ' copy_source
echo -e "\\nCopying ${LCYAN}$copy_source${NC} videos to file server's ${LGREEN}/public${NC} directory\\n...\\n"

#  Copy arguments definition
copy_dest="$(pwd)/server/public/videos/"

# Added handling to make dest directory writable
chmod 755 $copy_dest

# Exec copy command
cp -a $copy_source/. $copy_dest

# Capture internal IP's of this machine
COM_GET_IP=$(ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}')
echo -e "${RED}[MANUAL_SETUP]${NC} Send one of these IP's to ${LCYAN}Renato${NC}: \\n\\n${LGREEN}$COM_GET_IP${NC}\\n"

echo -e "------------------\\n"

echo -e "(1) Start server: "
echo -e "COMMAND: cd ${YELLOW}server${NC} && ${YELLOW}npm start${NC}\\n"

echo -e "(2) Configure video labels & seek:"
echo -e "COMMAND [new tab]: cd ${YELLOW}client${NC} && ${YELLOW}npm start${NC}"
echo -e "OPEN: ${LCYAN}localhost:3000/create/${NC}\\n"

echo -e "${YELLOW}Setup complete!${NC}"

# Display notification on completion
osascript -e 'display notification "Setup complete with the file server!" with title "Sprint review setup"'