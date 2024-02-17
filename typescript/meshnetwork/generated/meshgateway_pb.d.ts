// package: meshgateway
// file: meshgateway.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class SubscribeTxReq extends jspb.Message { 
    getChainid(): number;
    setChainid(value: number): SubscribeTxReq;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribeTxReq.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribeTxReq): SubscribeTxReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribeTxReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribeTxReq;
    static deserializeBinaryFromReader(message: SubscribeTxReq, reader: jspb.BinaryReader): SubscribeTxReq;
}

export namespace SubscribeTxReq {
    export type AsObject = {
        chainid: number,
    }
}

export class SubscribeTxResp extends jspb.Message { 
    getTx(): string;
    setTx(value: string): SubscribeTxResp;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribeTxResp.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribeTxResp): SubscribeTxResp.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribeTxResp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribeTxResp;
    static deserializeBinaryFromReader(message: SubscribeTxResp, reader: jspb.BinaryReader): SubscribeTxResp;
}

export namespace SubscribeTxResp {
    export type AsObject = {
        tx: string,
    }
}
