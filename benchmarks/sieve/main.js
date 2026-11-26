const limit = 20000000;
const isPrime = new Uint8Array(limit).fill(1);
isPrime[0] = isPrime[1] = 0;
let count = 0;
for (let n = 2; n < limit; n++) {
  if (isPrime[n]) {
    count++;
    for (let m = n * n; m < limit; m += n) isPrime[m] = 0;
  }
}
console.log(count);
