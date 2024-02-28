package web

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
)

// Query handles chaincode query requests.
func (setup OrgSetup) Query(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received Query request")

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
		queryParams := r.URL.Query()
		chainCodeName := queryParams.Get("chaincodeid")
		channelID := queryParams.Get("channelid")
		function := queryParams.Get("function")
		args := r.URL.Query()["args"]
		fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, args)
		network := setup.Gateway.GetNetwork(channelID)
		contract := network.GetContract(chainCodeName)
		evaluateResponse, err := contract.EvaluateTransaction(function, args...)
		if err != nil {
			fmt.Fprintf(w, "Error: %s", err)
			return
		}
		fmt.Fprintf(w, "Response: %s", evaluateResponse)
	} else {
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
	}
}
