# sie-parser (WIP)

Parses sie files to JavaScript Object. This is still a WIP but I'll try to push updates when I got time.

Tried to keep the project in english but the variable names from the sie are in swedish as they are presented. This will be fixed onces I add support for sie5.

# Installation

`npm i sie-parser`

# Usage

Initialize the parser

```ts
import sieParser from 'sie-parser';

const sie = new sieParser('./myfile2parse.se');
```

# Functions

Get full parsed content

```ts
const sieObject = sie.sieObject;
```

Get verifications

```ts
// This will return array with all existing verifications
const verifications = sie.getVerifications()

/*
* Returns data as array on all verification with that series
* Exapmle of series A, B, C, D
*/
const verificationsSpecific = sie.getVerificationsData(series:string)
```

Get Accounts

```ts
// Returns array with all accounts with objects including { kontonr, kontonamn }
const accounts = sie.getAccount();
/*
Example output
[  
  {
    kontonr: '1010',
    kontonamn: 'Utvecklingsutgifter'
  },
  {
    kontonr: '1011',
    kontonamn: 'Balanserade utgifter för forskning och utveckling'
  }
]
*/

// if you wanna get more specific data your can use
const kontonr = '1010' || 1010;
// Options will filter the response data
const opts = {
  ib: false || true,
  ub: false || true,
  psaldo: false || true,
  konto: false || true,
};
// All options are optional if not manually set they default to false
const account = sie.getAccount(kontonr, opts);
/*
Example output
{
  kontonr: '1012',
  kontonamn: 'Balanserade utgifter för programvaror',
  IB: [],
  UB: [],
  PSALDO: []
}
*/
```

# Report issues

Please report all issues [here](https://github.com/techmdw/sie-parser/issues)!
