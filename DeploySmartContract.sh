#!/bin/bash
cd chaincode

dirSave=$PWD

GO111MODULE=on go mod vendor

echo -n "Inserire directory di network.sh: "
read directoryExec

cd $directoryExec

./network.sh down
./network.sh up createChannel

export FABRIC_CFG_PATH=$PWD/../config/
export PATH=${PWD}/../bin:$PATH

./network.sh deployCC -ccn requestManage -ccp $dirSave -ccl go

echo "Nome Chaincode: requestManage "