import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/transports/streamable-http.js";
import { searchSharePointTool } from "./tools/searchSharePoint.js";
import http from "http";

const server = new Server(
  { name: "MacKenzie Graph MCP", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.tool(searchSharePointTool);

const port = Number(process.env.MCP_SERVER_PORT || 8080);
const transport = new StreamableHTTPServerTransport({ port });
await server.connect(transport);

// Tiny liveness endpoint for Azure health checks
const healthServer = http.createServer((_req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ ok: true, server: "mackenzie-mcp-server" }));
});
healthServer.listen(port + 1, "0.0.0.0", () => {
  console.log(`MCP server ready on http://0.0.0.0:${port}/  |  health: http://0.0.0.0:${port+1}/`);
});
