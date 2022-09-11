import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { ServerInjectResponse } from "@hapi/hapi";
import * as fs from "fs";
import * as path from "path";
import { sign } from "jsonwebtoken";
import FormData from "form-data";
import { Test } from "./Test";
import { getUUID } from "../src/server/utils/index";
import routes from "../src/server/routes/file";
import { IFileResponse, IOutputOk } from "../src/server/interfaces";

describe("File", () => {
  let test: Test;
  let form: FormData;
  const file = fs.readFileSync(path.resolve("test/file/selfie.jpeg"));
  const userToken = sign({ userId: getUUID() }, String(process.env['UA_SECRET']), {
    expiresIn: Number(process.env['UA_LIFETIME']),
  });

  beforeAll(async () => {
    test = await new Test().start(routes);
    void test.authenticate(userToken);
    form = new FormData();
    form.append("file", file, { filename: "selfie.jpeg" });
  });

  afterAll(async () => {
    await test.stop();
  });

  describe("Different File Types Uploading", () => {
    let res: ServerInjectResponse;

    it("should upload jpeg", async () => {
      const file = fs.readFileSync(path.resolve("test/file/selfie.jpeg"));
      const form = new FormData();
      form.append("file", file, { filename: "selfie.jpeg" });
      res = await test.$post("/api/files", undefined, form);
      expect(res.statusCode).toBe(200);
    });

    it("should upload sig", async () => {
      const file = fs.readFileSync(path.resolve("test/file/test.sig"));
      const form = new FormData();
      form.append("file", file, { filename: "test.sig" });
      res = await test.$post("/api/files", undefined, form);
      expect(res.statusCode).toBe(200);
    });

    it("shouldn't upload doc", async () => {
      const file = fs.readFileSync(path.resolve("test/file/test.doc"));
      const form = new FormData();
      form.append("file", file, { filename: "test.doc" });
      res = await test.$post("/api/files", undefined, form);
      expect(res.statusCode).toBe(403);
    });
  });

  describe("Routes", () => {
    let res: ServerInjectResponse;
    let fileId: string;

    it("should receive file list", async () => {
      res = await test.$get("/api/files", {
        limit: "10",
        offset: "0",
      });
      expect(res.statusCode).toBe(200);
    });

    it("should upload file", async () => {
      res = await test.$post("/api/files", undefined, form);
      expect(res.statusCode).toBe(200);
      fileId = (res.result as IOutputOk<IFileResponse>).result.id;
    });

    it("should receive file", async () => {
      res = await test.$get(`/api/files/${fileId}`);
      expect(res.statusCode).toBe(200);
    });

    it("should receive file info", async () => {
      res = await test.$get(`/api/files/${fileId}/info`);
      expect(res.statusCode).toBe(200);
    });

    it("should edit file", async () => {
      res = await test.$put(`/api/files/${fileId}`, undefined, { public: true, });
      expect(res.statusCode).toBe(200);
    });

    it("should delete file", async () => {
      res = await test.$delete(`/api/files/${fileId}`);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("Check access", () => {
    let res: ServerInjectResponse;
    let fileId: string;
    const secondUserToken = sign(
      { userId: getUUID() },
      String(process.env['UA_SECRET']),
      { expiresIn: Number(process.env['UA_LIFETIME']) }
    );
    const adminToken = sign(
      { userId: getUUID() },
      String(process.env['AA_SECRET']),
      { expiresIn: Number(process.env['AA_LIFETIME']) }
    );

    beforeAll(async () => {
      res = await test.$post("/api/files", undefined, form);
      fileId = (res.result as IOutputOk<IFileResponse>).result.id;
      void test.logout();
    });

    it("should receive file under admin access", async () => {
      void test.authenticate(adminToken);
      res = await test.$get(`/api/files/${fileId}`);
      expect(res.statusCode).toBe(200);
    });

    it("should edit file under admin access", async () => {
      void test.authenticate(adminToken);
      res = await test.$put(`/api/files/${fileId}`, undefined, { name: "new name.sig" });
      expect(res.statusCode).toBe(200);
    });

    it("shouldn't receive file under secondUser access", async () => {
      void test.authenticate(secondUserToken);
      res = await test.$get(`/api/files/${fileId}`);
      expect(res.statusCode).toBe(403);
    });
  });

  describe.skip("Public file", () => {
    let res: ServerInjectResponse;
    let publicFileId: string;
    let privateFileId: string;

    beforeAll(async () => {
      void test.authenticate(userToken);
      const publicForm = new FormData();
      publicForm.append("file", file, { filename: "selfie.jpeg" });
      res = await test.$post("/api/files", undefined, publicForm);
      publicFileId = (res.result as IOutputOk<IFileResponse>).result.id;
      const privateForm = new FormData();
      privateForm.append("file", file, { filename: "selfie.jpeg" });
      res = await test.$post("/api/files", undefined, privateForm);
      privateFileId = (res.result as IOutputOk<IFileResponse>).result.id;
      void test.logout();
    });

    it("should receive public file", async () => {
      res = await test.$get(`/api/files/${publicFileId}`);
      expect(res.statusCode).toBe(200);
    });

    it("shouldn't receive private file", async () => {
      res = await test.$get(`/api/files/${privateFileId}`);
      expect(res.statusCode).toBe(403);
    });
  });
});
