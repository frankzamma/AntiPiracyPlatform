package smartcontract

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"strings"
)

type SmartContract struct {
	contractapi.Contract
}

type Request struct {
	ID                   string          `json:"ID"`
	IpAddress            string          `json:"IpAddress"`
	Description          string          `json:"Description"`
	Category             int             `json:"Category"`
	HashImage            string          `json:"HashImages"`
	PathImage            string          `json:"PathImages"`
	Verified             bool            `json:"Verified"`
	Confirmed            map[string]bool `json:"Confirmed"`
	SenderOrganizationID string          `json:"SenderOrganizationID"`
}

type OperatorRequest struct {
	ID                   string `json:"ID"`
	IpAddress            string `json:"IpAddress"`
	Description          string `json:"Description"`
	Category             int    `json:"Category"`
	HashImage            string `json:"HashImages"`
	PathImage            string `json:"PathImages"`
	Verified             bool   `json:"Verified"`
	Confirmed            bool   `json:"Confirmed"`
	SenderOrganizationID string `json:"SenderOrganizationID"`
}

func (r *Request) UpdateConfirmed(opId string) {
	r.Confirmed[opId] = true
}

// RequestExists returns true when request with given ID exists in world state
func (s *SmartContract) RequestExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	requestJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return requestJSON != nil, nil
}

func (s *SmartContract) AddRequest(ctx contractapi.TransactionContextInterface,
	id string, ipAddress string, description string, hashImage string, pathImage string, verified bool,
	actualOperatorsString string, category int, requesterID string) error {

	exists, err := s.RequestExists(ctx, id)
	if err != nil {
		return err
	}

	if exists {
		return fmt.Errorf("e' presente già una richiesta con lo stesso ID %s", id)
	}

	mapOp := make(map[string]bool)

	actualOperators := strings.Split(actualOperatorsString, ";")
	for _, v := range actualOperators {
		mapOp[v] = false
	}

	request := Request{ID: id,
		IpAddress:            ipAddress,
		Description:          description,
		PathImage:            pathImage,
		HashImage:            hashImage,
		Verified:             verified,
		Category:             category,
		Confirmed:            mapOp,
		SenderOrganizationID: requesterID,
	}

	requestJSON, err := json.Marshal(request)

	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, requestJSON)
}

func (s *SmartContract) Confirm(ctx contractapi.TransactionContextInterface, idRichiesta string, operatorID string) error {
	exists, err := s.RequestExists(ctx, idRichiesta)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("richiesta con ID %s non trovata", idRichiesta)
	}

	// Recupera l'oggetto Request tramite l'ID
	richiesta, err := s.GetRichiestaById(ctx, idRichiesta)
	if err != nil {
		return err
	}

	(richiesta).UpdateConfirmed(operatorID)

	richiestaJson, err := json.Marshal(richiesta)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(richiesta.ID, richiestaJson)

}

func (s *SmartContract) GetRichiestaById(ctx contractapi.TransactionContextInterface, id string) (*Request, error) {
	requestJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("errore di lettura dallo stato: %v", err)
	}

	if requestJSON == nil {
		return nil, fmt.Errorf("richiesta con ID %s non trovata", id)
	}

	var request Request
	err = json.Unmarshal(requestJSON, &request)
	if err != nil {
		return nil, err
	}

	return &request, nil
}

func (s *SmartContract) GetAllRequest(ctx contractapi.TransactionContextInterface) ([]*Request, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var requests []*Request
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var request Request
		err = json.Unmarshal(queryResponse.Value, &request)
		if err != nil {
			return nil, err
		}
		requests = append(requests, &request)
	}

	return requests, nil
}

func (s *SmartContract) GetRequestByOp(ctx contractapi.TransactionContextInterface, idOp string) ([]*OperatorRequest, error) {
	requests, err := s.GetAllRequest(ctx)
	if err != nil {
		return nil, err
	}

	var operatorRequests []*OperatorRequest
	for _, request := range requests {
		operatorRequest := OperatorRequest{
			ID:                   request.ID,
			IpAddress:            request.IpAddress,
			Description:          request.Description,
			PathImage:            request.PathImage,
			HashImage:            request.HashImage,
			Verified:             request.Verified,
			Category:             request.Category,
			Confirmed:            request.Confirmed[idOp],
			SenderOrganizationID: request.SenderOrganizationID,
		}

		operatorRequests = append(operatorRequests, &operatorRequest)

	}

	return operatorRequests, nil

}

func (s *SmartContract) GetRequestNotConfirmedByOp(ctx contractapi.TransactionContextInterface, idOp string) ([]*OperatorRequest, error) {
	requests, err := s.GetAllRequest(ctx)
	if err != nil {
		return nil, err
	}

	var operatorRequests []*OperatorRequest
	for _, request := range requests {
		if !request.Confirmed[idOp] {
			operatorRequest := OperatorRequest{
				ID:                   request.ID,
				IpAddress:            request.IpAddress,
				Description:          request.Description,
				PathImage:            request.PathImage,
				HashImage:            request.HashImage,
				Verified:             request.Verified,
				Category:             request.Category,
				Confirmed:            request.Confirmed[idOp],
				SenderOrganizationID: request.SenderOrganizationID,
			}

			operatorRequests = append(operatorRequests, &operatorRequest)
		}

	}

	return operatorRequests, nil

}
