export const tools = {

  web_search: async ({ query }) => {

    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
    );

    const data = await res.json();

    return data.AbstractText || "No results found.";
  },

  calculator: async ({ expression }) => {

    try {
      return eval(expression).toString();
    } catch {
      return "Invalid expression";
    }
  },

  memory_search: async ({ query }) => {

    return `Memory search placeholder: ${query}`;
  },

};