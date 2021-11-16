import { TypeSIE, TypeSIE_VER_EXPORT, TypeSIE_KONTO, TypeSIE_KONTO_EXPORT } from './typings/sie';
declare class sieParser {
    private sie;
    sieObject: TypeSIE;
    constructor(path: string);
    private string;
    private sieLineParser;
    private sieLines;
    private parse;
    getVerifications(): string[];
    getVerificationData(verification: string): TypeSIE_VER_EXPORT;
    getSeries(series: string): (TypeSIE_VER_EXPORT | undefined)[] | undefined;
    getSerieDateRange(dateStart: number, dateEnd: number, opt?: {
        timeType?: 'verdatum' | 'regdatum';
        serie?: string;
    }): (TypeSIE_VER_EXPORT | undefined)[] | undefined;
    getAccount(kontonr?: string | number, opts?: {
        ib?: boolean;
        ub?: boolean;
        psaldo?: boolean;
        konto?: boolean;
    }): TypeSIE_KONTO_EXPORT | TypeSIE_KONTO[] | undefined;
}
export = sieParser;
