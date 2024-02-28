package main

import (
	"RestInterfaceOrg2/web"
	"fmt"
)

func main() {
	//Initialize setup for Org1
	cryptoPath := "C:\\Users\\frank\\Desktop\\ProgettoSicurezzaDeiDati\\fabric-samples\\test-network\\organizations\\peerOrganizations\\"
	//cryptoPath := "C:\\Users\\migli\\Desktop\\ProgettoSicurezza\\fabric-samples\\test-network\\organizations\\peerOrganizations\\"
	org1Config := web.OrgSetup{
		OrgName:      "Org2",
		MSPID:        "Org2MSP",
		CertPath:     cryptoPath + "org2.example.com\\users\\User1@org2.example.com\\msp\\signcerts\\User1@org2.example.com-cert.pem",
		KeyPath:      cryptoPath + "org2.example.com\\users\\User1@org2.example.com\\msp\\keystore\\",
		TLSCertPath:  cryptoPath + "org2.example.com\\peers\\peer0.org2.example.com\\tls\\ca.crt",
		PeerEndpoint: "localhost:7051",
		GatewayPeer:  "peer0.org2.example.com",
	}

	org1Setup, err := web.Initialize(org1Config)
	if err != nil {
		fmt.Println("Error initializing setup for Org2: ", err)
	}
	web.Serve(web.OrgSetup(*org1Setup), 3004)

}
