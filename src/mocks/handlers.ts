import { rest } from "msw";
import OpenAPIBackend, { Document, Request } from "openapi-backend";
import definition from "../api/api.swagger.json";

const baseApi = process.env.REACT_APP_BASE_API;

const api: OpenAPIBackend = new OpenAPIBackend({
  definition: (definition as unknown) as Document,
  handlers: {
    notFound(backendContext, res, ctx) {
      return res(ctx.status(404));
    },
    async notImplemented(backendContext, res, ctx) {
      const { status, mock } = await api.mockResponseForOperation(backendContext.operation.operationId || "");
      return res(ctx.status(status), ctx.json(mock));
    },
  },
});

export const handlers = [
  rest.get(`${baseApi}/*`, (req, res, ctx) => api.handleRequest((req as unknown) as Request, res, ctx)),
  rest.post(`${baseApi}/*`, (req, res, ctx) => api.handleRequest((req as unknown) as Request, res, ctx)),
  rest.put(`${baseApi}/*`, (req, res, ctx) => api.handleRequest((req as unknown) as Request, res, ctx)),
  rest.delete(`${baseApi}/*`, (req, res, ctx) => api.handleRequest((req as unknown) as Request, res, ctx)),
];
