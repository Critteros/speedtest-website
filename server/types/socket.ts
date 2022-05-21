export interface ServerToClientEvents {
  receiveBytes: (data: Buffer) => void;
  uploadTime: (timestamp: Date) => void;
}

export interface ClientToServerEvents {
  requestBytes: (count: number) => void;
  uploadBytes: (count: number) => void;
}