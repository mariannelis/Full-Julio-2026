const path = require("path");
const { readCsv } = require("utils/csv");

const PERSON_FILE = path.join(
  __dirname,
  "../models/persons.csv"
);

function formatPerson(person) {
  return {
    Id: Number(person.Id),
    Name: person.Name,
    Surname: person.Surname,
    IsTeacher: person.IsTeacher === "true",
    Birthdate: person.Birthdate
  };
}

async function getAll() {
  const persons = await readCsv(PERSON_FILE);

  return persons.map(formatPerson);
}

async function getById(id) {
  const persons = await getAll();

  const person = persons.find(
    (person) => person.Id === Number(id)
  );

  return person;
}

module.exports = {
  getAll,
  getById
};