import { faker } from '@faker-js/faker';

let id = 1;

export function createRandomData() {
  return {
    id: id++,
    name: faker.person.fullName(), // Updated method
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 60 }),
    workExperience: faker.number.int({ min: 1, max: 40 }),
    position: faker.person.jobTitle(),
  };
}
