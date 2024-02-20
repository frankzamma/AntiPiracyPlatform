package smartcontract

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type Confirmed struct {
	ID         string  `json:"ID"`
	Request    Request `json:"name"`
	OperatorID string  `json:"OperatorID"`
}

type Request struct {
	ID          string   `json:"ID"`
	IpAddress   string   `json:"IpAddress"`
	Description string   `json:"Description"`
	HashImages  []string `json:"HashImages"`
	Verified    bool     `json:"Verified"`
}

// InitLedger Funzione aggiunta per simulare la presenza di qualche richiesta
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	requests := []Request{
		{ID: "01",
			IpAddress:   "192.168.0.1",
			Description: "Flusso video che mostra la partita Napoli-Salernitana",
			HashImages:  []string{"HashImg1", "HashImg2", "HashImg3"},
			Verified:    false,
		},
		{ID: "02",
			IpAddress:   "192.168.0.2",
			Description: "Flusso video che mostra la partita Milan-Salernitana",
			HashImages:  []string{"HashImg1", "HashImg2", "HashImg3"},
			Verified:    false,
		},
	}

	for _, request := range requests {
		requestJSON, err := json.Marshal(request)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(request.ID, requestJSON)
		if err != nil {
			return fmt.Errorf("failed to put to world state. %v", err)
		}
	}
	return nil
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
	id string, ipAddress string, description string, hashImages []string) error {

	exists, err := s.RequestExists(ctx, id)
	if err != nil {
		return err
	}

	if exists {
		return fmt.Errorf("e' presente già una richiesta con lo stesso ID %s", id)
	}

	request := Request{ID: id, IpAddress: ipAddress,
		Description: description,
		HashImages:  hashImages,
		Verified:    false}

	requestJSON, err := json.Marshal(request)

	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, requestJSON)
}

func (s *SmartContract) Confirm(ctx contractapi.TransactionContextInterface, idRichiesta string, operatorID string, confermaID string) error {

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

	// Crea l'oggetto Conferma
	conferma := Confirmed{
		ID:         confermaID,
		Request:    *richiesta,
		OperatorID: operatorID,
	}
	// Converte l'oggetto Conferma in JSON
	confermaJSON, err := json.Marshal(conferma)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(confermaID, confermaJSON)

}

func (s *SmartContract) GetRichiestaById(ctx contractapi.TransactionContextInterface, id string) (*Request, error) {
	requestJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
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
	// range query with empty string for startKey and endKey does an
	// open-ended query of all request in the chaincode namespace.
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
