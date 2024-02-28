package web

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/hyperledger/fabric-gateway/pkg/client"
	"net/http"
	"strings"
)

// Invoke handles chaincode invoke requests.
func (setup *OrgSetup) Invoke(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received Invoke request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}

	//fmt.Println(r)
	tokenString := r.Header.Get("authorization")

	secretKey := []byte("YOUR_SECRET_KEY")

	token, err := jwt.Parse(tokenString,
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return secretKey, nil
		})
	if err != nil {
		http.Error(w, "Failed to parse token: "+err.Error(), http.StatusUnauthorized)
		return
	}

	// Validate token
	if !token.Valid {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		http.Error(w, "Failed to decode token claims", http.StatusInternalServerError)
		return
	}

	if claims["OrgName"].(string) == "Org1" {
		chainCodeName := r.FormValue("chaincodeid")
		channelID := r.FormValue("channelid")
		function := r.FormValue("function")
		argsString := r.FormValue("args")

		args := strings.Split(argsString, ",")

		fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, args)
		network := setup.Gateway.GetNetwork(channelID)
		contract := network.GetContract(chainCodeName)
		txn_proposal, err := contract.NewProposal(function, client.WithArguments(args...))
		if err != nil {
			fmt.Fprintf(w, "Error creating txn proposal: %s", err)
			return
		}
		txn_endorsed, err := txn_proposal.Endorse()
		if err != nil {
			fmt.Fprintf(w, "Error endorsing txn: %s", err)
			return
		}
		txn_committed, err := txn_endorsed.Submit()
		if err != nil {
			fmt.Fprintf(w, "Error submitting transaction: %s", err)
			return
		}
		fmt.Fprintf(w, "Transaction ID : %s Response: %s", txn_committed.TransactionID(), txn_endorsed.Result())

	} else {
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
	}
}
