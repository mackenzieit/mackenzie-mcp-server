# MacKenzie MCP Server (calls your Azure Function)

This MCP server exposes a `search_sharepoint` tool that calls your existing Azure Function endpoint `/sp/search`.
Use it with **Agent Builder** via the MCP node (Remote).

## 1) Local run

```bash
npm i
cp .env.example .env
# edit .env: set FUNCTION_BASE_URL and CONNECTOR_API_KEY
npm run dev
```

You'll see:
- MCP server on `http://localhost:8080/`
- Health on `http://localhost:8081/`

## 2) Deploy to Azure App Service (Linux)

```bash
# variables
RG=MacKenzieMonthly
APP=mackenzie-mcp-server
REGION=eastus

az group create -n $RG -l $REGION

az appservice plan create -g $RG -n ${APP}-plan --sku B1 --is-linux
az webapp create -g $RG -p ${APP}-plan -n $APP --runtime "NODE:18-lts"

# App settings (match your Function values)
az webapp config appsettings set -g $RG -n $APP --settings \
  MCP_SERVER_PORT=8080 \    FUNCTION_BASE_URL=https://<YOUR-FUNC>.azurewebsites.net \    CONNECTOR_API_KEY=<SAME_VALUE_AS_FUNCTION>

# Build & deploy
npm ci
npm run build
zip -r deploy.zip dist package.json package-lock.json
az webapp deploy -g $RG -n $APP --type zip --src-path deploy.zip
```

After deploy:
- Health check: `https://$APP.azurewebsites.net:8081/` is *not* exposed; App Service only exposes the main port.
  If you need health checks, use Azure's default HTTP ping or add a dedicated endpoint behind the MCP transport.
  (The server logs "ready" on startup.)

## 3) Connect in Agent Builder

- Add an **MCP** node → **Remote**.
- **Server URL:** `https://$APP.azurewebsites.net/`
- No auth headers required (the MCP server is public). If you need to gate it, front with APIM or App Gateway.

You should see:
- Server name: *MacKenzie Graph MCP*
- Tool: `search_sharepoint`

In the Agent node/system prompt, add:
> When the user asks to find SharePoint files or documents, call `search_sharepoint` with a concise `q`.
