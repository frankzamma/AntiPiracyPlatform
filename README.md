# AntiPiracyPlatform
Project of course "Sicurezza dei Dati" - Università degli Studi di Salerno

# Contributors
<a href="https://github.com/frankzamma/AntiPiracyPlatform/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=frankzamma/AntiPiracyPlatform" />
</a>

# Introduction
This repository contains an ideal implementation of an AntiPiracy Platform based on Web3, blockchain and AI.

# Prerequisites
To build and run this project, you shuold install:
- Hyperledger Fabric and its prerequisites (available at https://hyperledger-fabric.readthedocs.io/en/latest/getting_started.html))
- [Golang](https://go.dev/)
- [NodeJS](https://nodejs.org/en)
- [Goland](https://www.jetbrains.com/go/)
- [Phyton3](https://www.python.org/download/releases/3.0/) and all necessary modules (look at ML folder)
- [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) (Only for windows users)

# How To Run The Project
- Clone this repository
- Create a .env file into paths "RestInterfaceOrg1" and "RestInterfaceOrg2" with follow content:
  > TEST_NETWORK_CA=\path\to\fabric-samples\test-network\organizations\peerOrganizations\
  
  *Note*: Replace \path\to\ with your local path of fabric-samples
- Open a terminal into directory of cloned repository and run ./DeployContract.sh (If you use Windows, you should use WSL2 terminal for this purpose) and follow the istruction.
- Once you finish the previous step, open the cloned repository with Goland and run the main of "RestInterfaceOrg1" and  "RestInterfaceOrg2".
- Open a new terminal in ML path and run
   > flask run
- Open a new terminal in webapp/backend path and run
   > npm install
   
   > npm start
- Open a terminal in webapp/frontend path and run
   > npm install
   
   > npm start
   
If you complete all step without error you should see at http://localhost:3000/ the webapp




