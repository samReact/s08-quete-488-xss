const request = require("supertest");
// let { createMessage } = require("./data-interface");
const dataInterface = require("./data-interface");

// const mockFunc = jest.mock(createMessage);

const app = require("./app");
const agent = request.agent(app);

describe("app", () => {
  describe("when authenticated", () => {
    beforeEach(async () => {
      await agent
        .post("/login")
        .send("username=randombrandon&password=randompassword");
    });

    describe("POST /messages", () => {
      describe("with non-empty content", () => {
        describe("with JavaScript code in personalWebsiteURL", () => {
          it("responds with error", async done => {
            await agent
              .post("/messages")
              .send(
                "content=hello guys&personalWebsiteURL=javascript:alert('Hacked!');"
              )
              .expect("Content-Type", "application/json; charset=utf-8")
              .expect(400);
            done();
          });
          it("not call createMessage function", async done => {
            const mockFunc = (dataInterface.createMessage = jest.fn());
            await agent
              .post("/messages")
              .send(
                "content=hello guys&personalWebsiteURL=javascript:alert('Hacked!');"
              )
              .expect(400);
            expect(mockFunc).toHaveBeenCalledTimes(0);
            done();
          });
        });

        describe("with HTTP URL in personalWebsiteURL", () => {
          it("responds with success", async done => {
            await agent
              .post("/messages")
              .send(
                "content=hello guys&personalWebsiteURL=https://www.google.fr"
              )
              .expect("Content-Type", "application/json; charset=utf-8")
              .expect(201);
            done();
          });
          it("call createMessage function", async done => {
            const mockFunc = (dataInterface.createMessage = jest.fn());
            await agent
              .post("/messages")
              .send(
                "content=hello guys&personalWebsiteURL=https://www.google.fr"
              )
              .expect(201);
            expect(mockFunc).toHaveBeenCalledTimes(1);
            done();
          });
        });
      });
    });
  });
});
