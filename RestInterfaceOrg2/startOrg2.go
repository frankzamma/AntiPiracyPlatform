package main

import (
	"RestInterfaceOrg2/web"
	"fmt"
	"github.com/joho/godotenv"
)

func main() {
	var envs map[string]string
	envs, err := godotenv.Read(".env")
	cryptoPath := envs["TEST_NETWORK_CA"]

	org2Config := web.OrgSetup{
		OrgName:      "Org2",
		MSPID:        "Org2MSP",
		CertPath:     cryptoPath + "org2.example.com\\users\\User1@org2.example.com\\msp\\signcerts\\User1@org2.example.com-cert.pem",
		KeyPath:      cryptoPath + "org2.example.com\\users\\User1@org2.example.com\\msp\\keystore\\",
		TLSCertPath:  cryptoPath + "org2.example.com\\peers\\peer0.org2.example.com\\tls\\ca.crt",
		PeerEndpoint: "localhost:9051",
		GatewayPeer:  "peer0.org2.example.com",
	}

	org2setup, err := web.Initialize(org2Config)
	if err != nil {
		fmt.Println("Error initializing setup for Org2: ", err)
	}
	web.Serve(web.OrgSetup(*org2setup), 3004)

}
