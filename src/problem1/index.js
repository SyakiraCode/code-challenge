var sum_to_n_a = function (n) {
    var sum = 0;
    for (let i = 0; i <= n; i++) {
        sum += i;
    }
    return sum;
};

var sum_to_n_b = function (n) {
    return Array(n).fill(0).map((val, i) => i + 1)
        .reduce((total, current) => total + current, 0)
};

var sum_to_n_c = function (n) {
    return ((n * (n + 1)) / 2)
};

console.log('Answer a = ', sum_to_n_a(5))
console.log('Answer b = ', sum_to_n_b(5))
console.log('Answer c = ', sum_to_n_c(5))