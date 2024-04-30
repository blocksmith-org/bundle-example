package main

import (
	"context"
	"crypto/ecdsa"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"math/rand"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/rlp"
	"github.com/metachris/flashbotsrpc"
)

func main() {
	key := "xxx" //private key
	token := "Basic xxx"
	SendBundle(key, token)
}

func GetSigner(pk string) (*ecdsa.PrivateKey, common.Address) {
	privateKey, err := crypto.HexToECDSA(pk)
	if err != nil {
		return nil, common.Address{}
	}

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		return nil, common.Address{}
	}

	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)
	return privateKey, common.HexToAddress(fromAddress.String())
}

func SendBundle(key, token string) {
	pk, addr := GetSigner(key)
	rpc := flashbotsrpc.New("https://bsc-builder-us.blocksmith.org", func(rpc *flashbotsrpc.FlashbotsRPC) {
		rpc.Headers = map[string]string{
			"Authorization": token,
		}
	})
	client, _ := ethclient.Dial("https://binance.nodereal.io")

	nonce, err := client.NonceAt(context.TODO(), addr, nil)
	if err != nil {
		log.Fatal("get nonce", err)
	}

	tx := types.NewTx(&types.LegacyTx{
		Nonce:    nonce,
		GasPrice: big.NewInt(1000000000),
		Gas:      50000,
		To:       &addr,
		Value:    big.NewInt(int64(rand.Intn(10000))),
	})
	signedTx, err := types.SignTx(tx, types.NewEIP155Signer(big.NewInt(56)), pk)
	if err != nil {
		log.Fatal("sign tx error", err)
	}

	rawTxBytes, _ := rlp.EncodeToBytes(signedTx)
	txsList := []string{hexutil.Bytes(rawTxBytes).String()}
	num, err := client.BlockNumber(context.Background())
	if err != nil {
		log.Fatal("get block num error", err)
	}

	callRpc := flashbotsrpc.New("https://bsc-simulation.blocksmith.org", func(rpc *flashbotsrpc.FlashbotsRPC) {
		rpc.Headers = map[string]string{
			"Authorization": token,
		}
	})

	callBundleArgs := flashbotsrpc.FlashbotsCallBundleParam{
		Txs:              txsList,
		BlockNumber:      fmt.Sprintf("0x%x", num+2),
		StateBlockNumber: "latest",
	}

	callResult, err := callRpc.FlashbotsCallBundle(pk, callBundleArgs)
	if err != nil {
		log.Fatal("call bundle error", err)
	}

	fmt.Printf("%v\n", JSON(callResult))

	sendBundleArgs := flashbotsrpc.FlashbotsSendBundleRequest{
		Txs:         txsList,
		BlockNumber: fmt.Sprintf("0x%x", num+2),
	}

	result, err := rpc.FlashbotsSendBundle(pk, sendBundleArgs)
	if err != nil {
		log.Fatal("send bundle error", err)
	}

	fmt.Printf("%v\n", JSON(result))
}

func JSON(v interface{}) string {
	buf, _ := json.Marshal(v)
	return string(buf)
}
