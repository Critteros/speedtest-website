export interface ServerToClientEvents {
  receiveBytes: (timestamp: number, data: Buffer) => void;
  uploadTime: (timestamp: number) => void;
}

export interface ClientToServerEvents {
  requestBytes: (count: number) => void;
  uploadBytes: (count: number) => void;
}