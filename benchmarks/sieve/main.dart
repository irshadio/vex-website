void main() {
  const limit = 20000000;
  final isPrime = List<bool>.generate(limit, (i) => i >= 2);
  var count = 0;
  for (var n = 2; n < limit; n++) {
    if (isPrime[n]) {
      count++;
      for (var m = n * n; m < limit; m += n) {
        isPrime[m] = false;
      }
    }
  }
  print(count);
}
