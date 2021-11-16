import sieParser from 'sie-parser';

const sie = new sieParser(__dirname + '/techmdw.se');

console.log(sie.sieObject);
