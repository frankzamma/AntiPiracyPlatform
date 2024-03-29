package main

import (
	"chaincode/smartcontract"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"log"
)

func main() {
	requestChaincode, err := contractapi.NewChaincode(&smartcontract.SmartContract{})
	if err != nil {
		log.Panicf("Error creating \"chaincode\": %v", err)
	}

	if err := requestChaincode.Start(); err != nil {
		log.Panicf("Error starting \"chaincode\" chaincode: %v", err)
	}
}
