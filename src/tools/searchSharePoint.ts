import axios from "axios";

export const searchSharePointTool = {
  name: "search_sharepoint",
  description: "Search SharePoint files by keyword via Azure Function.",
  inputSchema: {
    type: "object",
    properties: {
      q: { type: "string", description: "Query text" }
    },
    required: ["q"]
  },
  handler: async (args: any) => {
    const q = String(args?.q ?? "").trim();
    if (!q) return { error: "q required" };

    const base = process.env.FUNCTION_BASE_URL;
    const key = process.env.CONNECTOR_API_KEY;
    if (!base || !key) {
      return { error: "Server not configured: set FUNCTION_BASE_URL and CONNECTOR_API_KEY" };
    }

    const r = await axios.get(`${base}/sp/search`, {
      params: { q },
      headers: { "x-api-key": key },
      validateStatus: () => true,
      timeout: 15000
    });

    if (r.status >= 300) {
      return { error: `Function ${r.status}`, details: r.data };
    }
    return r.data;
  }
};
