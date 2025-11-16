# MacKenzie MCP Server (No-build JS)

This version requires **no build tools**. Upload the zip to Azure App Service and set three app settings:
- MCP_SERVER_PORT=8080
- FUNCTION_BASE_URL=https://<YOUR-FUNC>.azurewebsites.net
- CONNECTOR_API_KEY=<same x-api-key your Function expects>

Start command: `npm start` (App Service does this automatically for Node apps).
