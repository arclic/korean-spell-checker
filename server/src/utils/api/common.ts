export enum axiosErrorType {
  "instanceError",
  "requestError",
  "messageError",
}

export enum statusType {
  "ok",
  "error",
}

export type requestQueryType = {
  color_blindness: number;
  q: string;
  where?: string;
  _?: number;
  _callback?: string;
};

export type returnType = {
  status: statusType;
  data?: string;
  error?: string;
};
