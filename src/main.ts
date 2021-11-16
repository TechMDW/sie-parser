import { readFileSync } from 'fs';
import {
  TypeSIE,
  TypeSIE_VER_EXPORT,
  TypeSIE_KONTO,
  TypeSIE_KONTO_EXPORT,
} from './typings/sie';

class sieParser {
  private sie: string[];
  public sieObject: TypeSIE;
  constructor(path: string) {
    const buffer = readFileSync(`${path}`);
    const parsed = this.string(buffer);
    this.sie = this.sieLines(parsed);
    this.sieObject = this.parse();
  }

  private string(buffer: Buffer) {
    // Thanks @piksel for this function ;)
    const mapUTF8 =
      'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ';

    return Array.from(buffer)
      .map((b) =>
        b < 128 ? String.fromCharCode(b) : mapUTF8.substr(b - 128, 1)
      )
      .join('');
  }

  private sieLineParser(str: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    let inBrackets = false;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (str[i] === ' ' && !inQuotes && !inBrackets) {
        result.push(current);
        current = '';
      } else {
        current += str[i];
      }
    }
    result.push(current);
    return result;
  }

  private sieLines(str: string): string[] {
    return str.split('\n');
  }

  private parse(): TypeSIE {
    const sie: TypeSIE = { VER: {} };
    let inBrackets = false;
    let currentBracketName = '';
    for (let i = 0; i < this.sie.length; i++) {
      const e = this.sie[i];
      const values = this.sieLineParser(e.trim());
      const indexProp = values[0].replace('#', '');
      if (e[0] === '{') {
        inBrackets = true;
        continue;
      }
      if (e[0] === '}') {
        inBrackets = false;
        continue;
      }
      if (indexProp === 'VER') {
        const objectName = values[1] + values[2];
        currentBracketName = objectName;
        sie.VER[objectName] = {
          serie: values[1],
          vernr: values[2],
          verdatum: values[3],
          vertext: values[4],
          regdatum: values[5],
          sign: values[6],
          TRANS: [],
          RTRANS: [],
          BTRANS: [],
        };
        continue;
      }
      if (inBrackets && indexProp === 'TRANS') {
        sie.VER[currentBracketName].TRANS.push({
          kontonr: values[1],
          object: values[2],
          belop: values[3],
          transdat: values[4],
          kvantitet: values[5],
          sign: values[6],
        });
        continue;
      }
      if (inBrackets && indexProp === 'RTRANS') {
        sie.VER[currentBracketName].RTRANS.push({
          kontonr: values[1],
          object: values[2],
          belop: values[3],
          transdat: values[4],
          kvantitet: values[5],
          sign: values[6],
        });
        continue;
      }
      switch (indexProp) {
        case 'ADRESS':
          sie.ADRESS = {
            kontakt: values[1],
            postadr: values[2],
            tel: values[3],
            utdelningsadr: values[4],
          };
          break;
        case 'BKOD':
          sie.BKOD = values[1];
          break;
        case 'DIM':
          if (!sie.DIM) sie.DIM = [];
          sie.DIM?.push({
            dimensionsnr: values[1],
            namn: values[2],
          });
          break;
        case 'ENHET':
          sie.ENHET = {
            kontonr: values[1],
            enhet: values[2],
          };
          break;
        case 'FLAGGA':
          sie.FLAGGA = values[1];
          break;
        case 'FNAMN':
          sie.FNAM = values[1];
          break;
        case 'FNR':
          sie.FNR = values[1];
          break;
        case 'FORMAT':
          sie.FORMAT = values[1];
          break;
        case 'FTYP':
          sie.FTYP = values[1];
          break;
        case 'GEN':
          sie.GEN = {
            datum: values[1],
            sign: values[2],
          };
          break;
        case 'IB':
          if (!sie.IB) sie.IB = [];
          sie.IB?.push({
            årsnr: values[1],
            konto: values[2],
            saldo: values[3],
            kvantitet: values[4],
          });
          break;
        case 'KONTO':
          if (!sie.KONTO) sie.KONTO = [];
          sie.KONTO?.push({
            kontonr: values[1],
            kontonamn: values[2],
          });
          break;
        case 'KPTYP':
          sie.KPTYP = values[1];
          break;
        case 'KTYP':
          sie.KTYP = {
            kontonr: values[1],
            kontotyp: values[2],
          };
          break;
        case 'OBJECT':
          sie.OBJECT?.push({
            dimensionsnr: values[1],
            objektnr: values[2],
            objektnamn: values[3],
          });
          break;
        case 'OIB':
          {
            // TODO: Test this function with real SIE files
            const [dimensionsnr, objektnr] = values[3]
              .replace('"', ' ')
              .trim()
              .split(' ');

            sie.OIB = {
              årsnr: values[1],
              konto: values[2],
              objectspecifikation: { dimensionsnr, objektnr },
              saldo: values[4],
              kvantitet: values[5],
            };
          }
          break;
        case 'OMFATTN':
          sie.OMFATTN = values[1];
          break;
        case 'ORGNR':
          sie.ORGNR = {
            orgnr: values[1],
            förvnr: values[2],
            verknr: values[3],
          };
          break;
        case 'OUB':
          {
            // TODO: Test this function with real SIE files
            const [dimensionsnr, objektnr] = values[3]
              .replace('"', ' ')
              .trim()
              .split(' ');

            sie.OUB = {
              årsnr: values[1],
              konto: values[2],
              objectspecifikation: { dimensionsnr, objektnr },
              saldo: values[4],
              kvantitet: values[5],
            };
          }
          break;
        case 'PBUDGET':
          {
            // TODO: Test this function wsith real SIE files
            if (!sie.PBUDGET) sie.PBUDGET = [];
            const [dimensionsnr, objektnr] = values[4]
              .replace('"', ' ')
              .trim()
              .split(' ');

            sie.PBUDGET.push({
              årsnr: values[1],
              period: values[2],
              konto: values[3],
              objectspecifikation: { dimensionsnr, objektnr },
              saldo: values[5],
              kvantitet: values[6],
            });
          }
          break;
        case 'PROGRAM':
          sie.PROGRAM = {
            programnamn: values[1],
            verision: values[2],
          };
          break;
        case 'PROSA':
          sie.PROSA = values[1];
          break;
        case 'PSALDO':
          {
            if (!sie.PSALDO) sie.PSALDO = [];
            const [dimensionsnr, objektnr] = values[4]
              .replace('"', ' ')
              .trim()
              .split(' ');

            sie.PSALDO.push({
              årsnr: values[1],
              period: values[2],
              konto: values[3],
              objectspecifikation: {
                dimensionsnr: dimensionsnr !== '{}' ? dimensionsnr : undefined,
                objektnr,
              },
              saldo: values[5],
              kvantitet: values[6],
            });
          }
          break;
        case 'RAR':
          if (!sie.RAR) sie.RAR = [];
          sie.RAR?.push({
            årsnr: values[1],
            start: values[2],
            slut: values[3],
          });
          break;
        case 'RES':
          if (!sie.RES) sie.RES = [];
          sie.RES?.push({
            års: values[1],
            konto: values[2],
            saldo: values[3],
            kvantitet: values[4],
          });
          break;
        case 'SIETYP':
          sie.SIETYP = values[1];
          break;
        case 'SRU':
          if (!sie.SRU) sie.SRU = [];
          sie.SRU?.push({
            konto: values[1],
            'SRU-kod': values[2],
          });
          break;
        case 'TAXAR':
          sie.TAXAR = values[1];
          break;
        case 'UB':
          if (!sie.UB) sie.UB = [];
          sie.UB.push({
            årsnr: values[1],
            konto: values[2],
            saldo: values[3],
            kvantitet: values[4],
          });
          break;
        case 'UNDERDIM':
          if (!sie.UNDERDIM) sie.UNDERDIM = [];
          sie.UNDERDIM.push({
            dimensionsnr: values[1],
            namn: values[2],
            superdimension: values[3],
          });
          break;
        case 'VALUTA':
          sie.VALUTA = values[1];
          break;
        default:
          break;
      }
    }
    return sie;
  }
  public getVerifications(): string[] {
    const element = this.sieObject.VER;
    return Object.keys(element);
  }

  public getVerificationData(verification: string): TypeSIE_VER_EXPORT {
    const element = this.sieObject.VER[verification];
    return element;
  }

  public getSeries(series: string) {
    const element = Object.keys(this.sieObject.VER).map((key) => {
      const e = this.sieObject.VER[key];
      if (e.serie === series.toUpperCase()) return e;
    });
    const filteredElement = element.filter((e) => e !== undefined);
    if (filteredElement.length === 0) return undefined;
    return filteredElement;
  }

  public getSerieDateRange(
    dateStart: number,
    dateEnd: number,
    opt?: {
      timeType?: 'verdatum' | 'regdatum';
      serie?: string;
    }
  ) {
    if (dateStart.toString().length !== 8)
      throw Error('Invalid dateStart length');
    if (dateEnd.toString().length !== 8)
      throw Error('Invalid dateStart length');

    const element = Object.keys(this.sieObject.VER).map((key) => {
      const e = this.sieObject.VER[key];

      const time =
        !opt?.timeType || opt.timeType !== 'regdatum'
          ? Number(e.verdatum)
          : Number(e.regdatum);

      if (!time) return undefined;

      if (time <= dateEnd && time >= dateStart) {
        if (opt?.serie) {
          if (e.serie === opt.serie.toUpperCase()) {
            return e;
          }
          return undefined;
        }
        return e;
      }
    });
    const filteredElement = element.filter((e) => e !== undefined);
    if (filteredElement.length === 0) return undefined;
    return filteredElement;
  }

  public getAccount(
    kontonr?: string | number,
    opts?: { ib?: boolean; ub?: boolean; psaldo?: boolean; konto?: boolean }
  ): TypeSIE_KONTO_EXPORT | TypeSIE_KONTO[] | undefined {
    if (!kontonr) {
      const element = this.sieObject.KONTO;
      return element;
    }
    let returnObj: TypeSIE_KONTO_EXPORT = {};
    kontonr = kontonr.toString();
    const kontoDesc: TypeSIE_KONTO | undefined = this.sieObject.KONTO?.find(
      (e) => e.kontonr === kontonr
    );
    if (!kontoDesc) return undefined;

    if (opts?.konto !== false) {
      returnObj = { ...kontoDesc };
    }
    if (opts?.ib !== false) {
      returnObj.IB = this.sieObject.IB?.filter((e) => e.konto === kontonr);
    }
    if (opts?.ub !== false) {
      returnObj.UB = this.sieObject.UB?.filter((e) => e.konto === kontonr);
    }
    if (opts?.psaldo !== false) {
      returnObj.PSALDO = this.sieObject.PSALDO?.filter(
        (e) => e.konto === kontonr
      );
    }
    return returnObj;
  }
}

export = sieParser;
