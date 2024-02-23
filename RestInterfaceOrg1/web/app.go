package web

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/hyperledger/fabric-gateway/pkg/client"
)

// OrgSetup: struct che permette di gestire il setup del server
type OrgSetup struct {
	OrgName      string
	MSPID        string
	CryptoPath   string
	CertPath     string
	KeyPath      string
	TLSCertPath  string
	PeerEndpoint string
	GatewayPeer  string
	Gateway      client.Gateway
}

func Serve(setups OrgSetup, port int16) {
	http.HandleFunc("/query", setups.Query)
	http.HandleFunc("/invoke", setups.Invoke)
	fmt.Println("Listening (http://localhost:" + strconv.Itoa(int(port)) + "/)...")
	if err := http.ListenAndServe(":"+strconv.Itoa(int(port)), nil); err != nil {
		fmt.Println(err)
	}
}
