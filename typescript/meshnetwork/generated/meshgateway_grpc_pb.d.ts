// package: meshgateway
// file: meshgateway.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as meshgateway_pb from "./meshgateway_pb";

interface ImeshgatewayService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    subscribeTx: ImeshgatewayService_ISubscribeTx;
}

interface ImeshgatewayService_ISubscribeTx extends grpc.MethodDefinition<meshgateway_pb.SubscribeTxReq, meshgateway_pb.SubscribeTxResp> {
    path: "/meshgateway.meshgateway/SubscribeTx";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<meshgateway_pb.SubscribeTxReq>;
    requestDeserialize: grpc.deserialize<meshgateway_pb.SubscribeTxReq>;
    responseSerialize: grpc.serialize<meshgateway_pb.SubscribeTxResp>;
    responseDeserialize: grpc.deserialize<meshgateway_pb.SubscribeTxResp>;
}

export const meshgatewayService: ImeshgatewayService;

export interface ImeshgatewayServer {
    subscribeTx: grpc.handleServerStreamingCall<meshgateway_pb.SubscribeTxReq, meshgateway_pb.SubscribeTxResp>;
}

export interface ImeshgatewayClient {
    subscribeTx(request: meshgateway_pb.SubscribeTxReq, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<meshgateway_pb.SubscribeTxResp>;
    subscribeTx(request: meshgateway_pb.SubscribeTxReq, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<meshgateway_pb.SubscribeTxResp>;
}

export class meshgatewayClient extends grpc.Client implements ImeshgatewayClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public subscribeTx(request: meshgateway_pb.SubscribeTxReq, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<meshgateway_pb.SubscribeTxResp>;
    public subscribeTx(request: meshgateway_pb.SubscribeTxReq, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<meshgateway_pb.SubscribeTxResp>;
}
