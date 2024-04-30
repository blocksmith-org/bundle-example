package main

import (
	"context"
	"fmt"
	"log"
	"meshnetwork-example/meshgateway"

	"github.com/ethereum/go-ethereum/core/types"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
)

func main() {
	url := "bsc-mesh-us.blocksmith.org:16060"
	token := "Basic xxx"
	conn, err := grpc.Dial(url, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatal("dial", err)
	}
	defer conn.Close()

	client := meshgateway.NewMeshgatewayClient(conn)
	SubscribeTx(client, token)
}

func SubscribeTx(client meshgateway.MeshgatewayClient, token string) {
	ctx := metadata.NewOutgoingContext(context.TODO(), metadata.Pairs("authorization", token))
	resp, err := client.SubscribeTx(ctx, &meshgateway.SubscribeTxReq{
		ChainId: 56,
	})
	if err != nil {
		return
	}

	for {
		data, err := resp.Recv()
		if err != nil {
			log.Fatal("recv tx", err)
		}

		tx := &types.Transaction{}
		err = tx.UnmarshalJSON([]byte(data.Tx))
		if err != nil {
			log.Fatal("unmarshal json", err)
		}

		fmt.Println("hash", tx.Hash())
	}
}
