export interface GenericResp<T> {
  result: string;
  updateToken?: string;
  data: Array<T>;
  extradata: {
    iLenPag: string;
    iPagina: string;
    iTotal: number;
    iTotalPags: number;
  };
}
