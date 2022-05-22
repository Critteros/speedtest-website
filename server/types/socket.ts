/*
Download Test:
Client --- RequestBytes(timestamp, dataAmount) --> Server
Server --- BytesReceived(clientTimeStamp, data) --> Client

Upload test:
Client --- RequestUpload(timestamp, data) --> Server
Server --- UploadComplete(timeDelta) --> Client

 */

export interface ServerToClientEvents {
  // receiveBytes: (timestamp: number, data: Buffer) => void;
  // uploadTime: (timestamp: number) => void;

  bytesReceived: (clientTimestamp: number, data: Buffer) => void;
  uploadComplete: (timeDelta: number) => void;
}

export interface ClientToServerEvents {
  // requestBytes: (count: number) => void;
  // uploadBytes: (data: Buffer) => void;

  requestBytes: (timestamp: number, dataAmount: number) => void;
  requestUpload: (timestamp: number, data: Buffer) => void;
}