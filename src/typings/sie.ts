export interface TypeSIE {
  ADRESS?: TypeSIE_ADRESS;
  BKOD?: string;
  DIM?: TypeSIE_DIM[];
  ENHET?: TypeSIE_ENHET;
  FLAGGA?: string;
  FNAM?: string;
  FNR?: string;
  FORMAT?: string;
  FTYP?: string;
  GEN?: TypeSIE_GEN;
  IB?: TypeSIE_IB[];
  KONTO?: TypeSIE_KONTO[];
  KPTYP?: string;
  KTYP?: TypeSIE_KTYP;
  OBJECT?: TypeSIE_OBJECT[];
  OIB?: TypeSIE_OIB_OUB;
  OMFATTN?: string;
  ORGNR?: TypeSIE_ORGNR;
  OUB?: TypeSIE_OIB_OUB;
  PBUDGET?: TypeSIE_PBUDGET[];
  PROGRAM?: TypeSIE_PROGRAM;
  PROSA?: string;
  PSALDO?: TypeSIE_PSALDO[];
  RAR?: TypeSIE_RAR[];
  RES?: TypeSIE_RES[];
  SIETYP?: string;
  SRU?: TypeSIE_SRU[];
  TAXAR?: string;
  UB?: TypeSIE_UB[];
  UNDERDIM?: TypeSIE_UNDERDIM[];
  VALUTA?: string;
  VER: TypeSIE_VER;
}

interface TypeSIE_ADRESS {
  kontakt: string;
  utdelningsadr: string;
  postadr: string;
  tel: string;
}

interface TypeSIE_DIM {
  dimensionsnr: string;
  namn: string;
}

interface TypeSIE_UNDERDIM {
  dimensionsnr: string;
  namn: string;
  superdimension: string;
}

interface TypeSIE_ENHET {
  kontonr: string;
  enhet: string;
}

interface TypeSIE_GEN {
  datum: string;
  sign: string;
}

interface TypeSIE_IB {
  årsnr: string;
  konto: string;
  saldo: string;
  kvantitet: string;
}

export interface TypeSIE_KONTO {
  kontonr?: string;
  kontonamn?: string;
}

interface TypeSIE_KTYP {
  kontonr: string;
  kontotyp: string;
}

interface TypeSIE_OBJECT {
  dimensionsnr: string;
  objektnr: string;
  objektnamn: string;
}

interface TypeSIE_OIB_OUB {
  årsnr: string;
  konto: string;
  objectspecifikation: TypeSIE_Objectspecifikation;
  saldo: string;
  kvantitet?: string;
}

interface TypeSIE_ORGNR {
  orgnr?: string;
  förvnr?: string;
  verknr?: string;
}

interface TypeSIE_PBUDGET {
  årsnr: string;
  period: string;
  konto: string;
  objectspecifikation: TypeSIE_Objectspecifikation;
  saldo: string;
  kvantitet?: string;
}

interface TypeSIE_PROGRAM {
  programnamn: string;
  verision: string;
}

interface TypeSIE_PSALDO {
  årsnr: string;
  period: string;
  konto: string;
  objectspecifikation: TypeSIE_Objectspecifikation;
  saldo: string;
  kvantitet?: string;
}

interface TypeSIE_RAR {
  årsnr: string;
  start: string;
  slut: string;
}

interface TypeSIE_RES {
  års: string;
  konto: string;
  saldo: string;
  kvantitet: string;
}

interface TypeSIE_SRU {
  konto: string;
  'SRU-kod': string;
}

interface TypeSIE_UB {
  årsnr: string;
  konto: string;
  saldo: string;
  kvantitet: string;
}

interface TypeSIE_Objectspecifikation {
  dimensionsnr?: string;
  objektnr?: string;
}

interface TypeSIE_VER {
  [name: string]: TypeSIE_VER_EXPORT;
}

export interface TypeSIE_VER_EXPORT {
  serie?: string;
  vernr?: string;
  verdatum?: string;
  vertext?: string;
  regdatum?: string;
  sign?: string;
  TRANS: TypesSIE_TRANS[];
  BTRANS: TypesSIE_TRANS[];
  RTRANS: TypesSIE_TRANS[];
}

export interface TypeSIE_KONTO_EXPORT {
  kontonr?: string;
  kontonamn?: string;
  IB?: TypeSIE_IB[];
  UB?: TypeSIE_UB[];
  PSALDO?: TypeSIE_PSALDO[];
}

interface TypesSIE_TRANS {
  kontonr?: string;
  object?: string;
  belop?: string;
  transdat?: string;
  transtext?: string;
  kvantitet?: string;
  sign?: string;
}
