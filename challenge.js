'use strict';

const checkDogs = function (dogsJulia, dogsKate) {
  const newJulia = dogsJulia.slice(1, -2);
  const conbinedDogs = newJulia.concat(dogsKate);

  conbinedDogs.forEach((dogAge, index) => {
    const pos = index + 1;
    const dogType =
      dogAge >= 3
        ? `Dog number ${pos} is an adult, and is ${dogAge} years old`
        : `Dog number ${pos} is still a puppy `;

    console.log(dogType);
  });
};

const calcAverageHumanAge = ages => {
  const average = ages
    .map(age => (age > 2 && 16 + age * 4) || age * 2)
    .filter(age => age >= 18)
    .reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);
  return average;
};

const average1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const average2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(average1, average2);

const average = [5, 2, 4, 1, 15, 8, 3].reduce(
  (acc, cur, _, arr) => acc + cur / arr.length,
  0
);

console.log(average);

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
