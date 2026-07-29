const personService = require(
  "services/person.service"
);

async function list(req, res) {
  try {
    const persons = await personService.getAll();

    res.json({
      total: persons.length,
      data: persons
    });
  } catch (error) {
    res.status(500).json({
      error: "No se pudo leer el archivo CSV"
    });
  }
}

async function getById(req, res) {
  try {
    const person = await personService.getById(
      req.params.id
    );

    if (!person) {
      return res.status(404).json({
        error: "Persona no encontrada"
      });
    }

    res.json(person);
  } catch (error) {
    res.status(500).json({
      error: "No se pudo buscar la persona"
    });
  }
}

module.exports = {
  list,
  getById
};