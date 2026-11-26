#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
int main(void) {
    const long limit = 20000000;
    bool *is_prime = malloc(limit);
    for (long i = 0; i < limit; i++) is_prime[i] = i >= 2;
    long count = 0;
    for (long n = 2; n < limit; n++) {
        if (is_prime[n]) {
            count++;
            for (long m = n * n; m < limit; m += n) is_prime[m] = false;
        }
    }
    printf("%ld\n", count);
    free(is_prime);
    return 0;
}
