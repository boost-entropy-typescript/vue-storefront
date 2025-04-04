import { Request, Response } from "express";
import { prepareApiFunction } from "../../../src/handlers";
import { IntegrationsLoaded } from "../../../src/types";

describe("[middleware-handlers] prepareApiFunction", () => {
  const integrationName = "ct";
  const functionName = "getProduct";
  const apiFunction = jest.fn();
  const api = { [functionName]: apiFunction };
  const createApiClient = jest.fn(() => ({ api }));

  const integrations = {
    [integrationName]: {
      apiClient: { createApiClient },
    },
  } as unknown as IntegrationsLoaded;
  const req = {
    params: { integrationName, functionName },
  } as unknown as Request;
  const res = {
    status: jest.fn(),
    send: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    res.locals = {
      alokai: {
        metadata: {},
      },
    };
  });

  describe("if integration is configured", () => {
    it("adds api function to res.locals", async () => {
      await prepareApiFunction(integrations)(req, res, next);

      expect(res.locals).toEqual(expect.objectContaining({ apiFunction }));
    });

    it("calls next middleware", async () => {
      await prepareApiFunction(integrations)(req, res, next);

      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith();
    });
  });
});
