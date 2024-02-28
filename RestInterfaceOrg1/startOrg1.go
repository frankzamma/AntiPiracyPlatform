package main

import "fmt"

func main() {
	//Initialize setup for Org1
	//cryptoPath := "C:\\Users\\frank\\Desktop\\ProgettoSicurezzaDeiDati\\fabric-samples\\test-network\\organizations\\peerOrganizations\\"
	cryptoPath := "C:\\Users\\migli\\Desktop\\ProgettoSicurezza\\fabric-samples\\test-network\\organizations\\peerOrganizations\\"
	org1Config := web.OrgSetup{
		OrgName:      "Org1",
		MSPID:        "Org1MSP",
		CertPath:     cryptoPath + "org1.example.com\\users\\User1@org1.example.com\\msp\\signcerts\\User1@org1.example.com-cert.pem",
		KeyPath:      cryptoPath + "org1.example.com\\users\\User1@org1.example.com\\msp\\keystore\\",
		TLSCertPath:  cryptoPath + "org1.example.com\\peers\\peer0.org1.example.com\\tls\\ca.crt",
		PeerEndpoint: "localhost:7051",
		GatewayPeer:  "peer0.org1.example.com",
	}

	org1Setup, err := web.Initialize(org1Config)
	if err != nil {
		fmt.Println("Error initializing setup for Org1: ", err)
	}
	web.Serve(web.OrgSetup(*org1Setup), 3003)

}
