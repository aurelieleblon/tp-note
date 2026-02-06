const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/services/todosService");
const todosService = require("../src/services/todosService");

const apiKeyHeader = { "x-api-key": "secret_key" };

afterEach(() => {
  jest.clearAllMocks();
});

describe("Middleware API Key", () => {
  test("clé manquante → 401", async () => {
    const res = await request(app).get("/todos");
    expect(res.status).toBe(401);
  });

  test("clé invalide → 401", async () => {
    const res = await request(app)
      .get("/todos")
      .set("x-api-key", "wrong");
    expect(res.status).toBe(401);
  });

  test("clé valide → 200", async () => {
    todosService.getAll.mockResolvedValue([]);
    const res = await request(app)
      .get("/todos")
      .set(apiKeyHeader);
    expect(res.status).toBe(200);
  });
});


describe("GET /todos", () => {
  test("succès → 200", async () => {
    todosService.getAll.mockResolvedValue([{ id: 1, title: "Test", completed: false }]);
    const res = await request(app).get("/todos").set(apiKeyHeader);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("erreur serveur → 500", async () => {
    todosService.getAll.mockImplementation(() => { throw new Error("DB_CRASH"); });
    const res = await request(app).get("/todos").set(apiKeyHeader);
    expect(res.status).toBe(500);
  });
});


describe("GET /todos/:id", () => {
  test("succès → 200", async () => {
    todosService.getById.mockResolvedValue({ id: 1, title: "Test", completed: false });
    const res = await request(app).get("/todos/1").set(apiKeyHeader);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("completed");
    expect(typeof res.body.id).toBe("number");
    expect(typeof res.body.title).toBe("string");
    expect(typeof res.body.completed).toBe("boolean");
  });

  test("ressource inexistante → 404", async () => {
    todosService.getById.mockResolvedValue(null);
    const res = await request(app).get("/todos/999").set(apiKeyHeader);
    expect(res.status).toBe(404);
  });

  test("erreur serveur → 500", async () => {
    todosService.getById.mockImplementation(() => { throw new Error("DB_CRASH"); });
    const res = await request(app).get("/todos/1").set(apiKeyHeader);
    expect(res.status).toBe(500);
  });
});


describe("POST /todos", () => {
  test("succès → 201", async () => {
    todosService.create.mockResolvedValue({ id: 1, title: "Test", completed: false });
    const res = await request(app)
      .post("/todos")
      .set(apiKeyHeader)
      .send({ title: "Test", completed: false });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("completed");
  });

  test("création invalide (title manquant) → 400", async () => {
    todosService.create.mockImplementation(() => { throw new Error("TITLE_INVALID"); });
    const res = await request(app)
      .post("/todos")
      .set(apiKeyHeader)
      .send({ completed: true });
    expect(res.status).toBe(400);
  });

  test("création invalide (completed invalide) → 400", async () => {
    todosService.create.mockImplementation(() => { throw new Error("COMPLETED_INVALID"); });
    const res = await request(app)
      .post("/todos")
      .set(apiKeyHeader)
      .send({ title: "Test", completed: "oui" });
    expect(res.status).toBe(400);
  });

  test("création invalide (doublon de titre) → 400", async () => {
    todosService.create.mockImplementation(() => { throw new Error("DUPLICATE_TITLE"); });
    const res = await request(app)
      .post("/todos")
      .set(apiKeyHeader)
      .send({ title: "Test", completed: false });
    expect(res.status).toBe(400);
  });

  test("erreur serveur → 500", async () => {
    todosService.create.mockImplementation(() => { throw new Error("DB_CRASH"); });
    const res = await request(app)
      .post("/todos")
      .set(apiKeyHeader)
      .send({ title: "Test", completed: false });
    expect(res.status).toBe(500);
  });
});


describe("PUT /todos/:id", () => {
  test("succès → 200", async () => {
    todosService.update.mockResolvedValue({ id: 1, title: "Modifié", completed: true });
    const res = await request(app)
      .put("/todos/1")
      .set(apiKeyHeader)
      .send({ title: "Modifié", completed: true });
    expect(res.status).toBe(200);
  });

  test("mise à jour invalide (title manquant) → 400", async () => {
    todosService.update.mockImplementation(() => { throw new Error("TITLE_INVALID"); });
    const res = await request(app)
      .put("/todos/1")
      .set(apiKeyHeader)
      .send({ completed: true });
    expect(res.status).toBe(400);
  });

  test("mise à jour invalide (completed invalide) → 400", async () => {
    todosService.update.mockImplementation(() => { throw new Error("COMPLETED_INVALID"); });
    const res = await request(app)
      .put("/todos/1")
      .set(apiKeyHeader)
      .send({ title: "Test", completed: "oui" });
    expect(res.status).toBe(400);
  });

  test("mise à jour invalide (doublon de titre) → 400", async () => {
    todosService.update.mockImplementation(() => { throw new Error("DUPLICATE_TITLE"); });
    const res = await request(app)
      .put("/todos/1")
      .set(apiKeyHeader)
      .send({ title: "Déjà existant", completed: false });
    expect(res.status).toBe(400);
  });

  test("ressource inexistante → 404", async () => {
    todosService.update.mockResolvedValue(null);
    const res = await request(app)
      .put("/todos/999")
      .set(apiKeyHeader)
      .send({ title: "Test", completed: false });
    expect(res.status).toBe(404);
  });

  test("erreur serveur → 500", async () => {
    todosService.update.mockImplementation(() => { throw new Error("DB_CRASH"); });
    const res = await request(app)
      .put("/todos/1")
      .set(apiKeyHeader)
      .send({ title: "Test", completed: false });
    expect(res.status).toBe(500);
  });
});


describe("DELETE /todos/:id", () => {
  test("succès → 204", async () => {
    todosService.remove.mockResolvedValue(true);
    const res = await request(app)
      .delete("/todos/1")
      .set(apiKeyHeader);
    expect(res.status).toBe(204);
  });

  test("ressource inexistante → 404", async () => {
    todosService.remove.mockResolvedValue(false);
    const res = await request(app)
      .delete("/todos/999")
      .set(apiKeyHeader);
    expect(res.status).toBe(404);
  });

  test("erreur serveur → 500", async () => {
    todosService.remove.mockImplementation(() => { throw new Error("DB_CRASH"); });
    const res = await request(app)
      .delete("/todos/1")
      .set(apiKeyHeader);
    expect(res.status).toBe(500);
  });
});
