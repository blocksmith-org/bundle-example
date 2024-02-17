import grpc from "grpc";
import { meshgatewayClient } from "./generated/meshgateway_grpc_pb";
import { SubscribeTxReq, SubscribeTxResp } from "./generated/meshgateway_pb";

const client = new meshgatewayClient(
  "bsc-mesh-us.blocksmith.org:16060",
  grpc.credentials.createInsecure()
);

const request = new SubscribeTxReq();
request.setChainid(56);

const metadata = new grpc.Metadata();
metadata.add("Authorization", "Basic XXX");

const stream = client.subscribeTx(request, metadata);

stream.on("data", (response: SubscribeTxResp) => {
  const obj = response.getTx();
  const tx = JSON.parse(obj);
  console.log(tx);
});

stream.on("end", () => {
  console.log("Stream ended");
});
