const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

describe("TinyApp Authorization Tests", () => {
  const serverUrl = "http://localhost:8080";

  it('should redirect "/" to "/login"', () => {
    return chai
      .request(serverUrl)
      .get("/")
      .then((res) => {
        expect(res).to.redirectTo(`${serverUrl}/login`);
        expect(res).to.have.status(302);
      });
  });

  it('should redirect "/urls/new" to "/login"', () => {
    return chai
      .request(serverUrl)
      .get("/urls/new")
      .then((res) => {
        expect(res).to.redirectTo(`${serverUrl}/login`);
        expect(res).to.have.status(302);
      });
  });

  it('should return 404 for non-existent URL', () => {
    return chai
      .request(serverUrl)
      .get("/urls/NOTEXISTS")
      .then((res) => {
        expect(res).to.have.status(404);
      });
  });

  it('should return 403 for unauthorized access to "/urls/b2xVn2"', () => {
    const agent = chai.request.agent(serverUrl);

    return agent
      .post("/login")
      .send({ email: "user2@example.com", password: "dishwasher-funk" })
      .then(() => {
        return agent.get("/urls/b2xVn2");
      })
      .then((res) => {
        expect(res).to.have.status(403);
        agent.close();
      });
  });
});