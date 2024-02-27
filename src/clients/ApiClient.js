/* 
Based on the ApiClient from the react mega tutorial: 
https://blog.miguelgrinberg.com/post/the-react-mega-tutorial-chapter-6-building-an-api-client
*/

// Base class for API clients to be inherited from
class BaseApiClient {
  constructor() {
    this.base_url = "/api/";
  }

  // Send a request to the server
  async request(options) {
    let query = new URLSearchParams(options.query || {}).toString();
    if (query !== "") {
      query = "?" + query;
    }

    // Send the request
    let response;
    try {
      response = await fetch(this.base_url + options.url + query, {
        method: options.method,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : null,
      });
    } catch (error) {
      response = {
        ok: false,
        status: 500,
        json: async () => {
          return {
            code: 500,
            message: "The server is unresponsive",
            description: error.toString(),
          };
        },
      };
    }

    // Parse the response
    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null,
    };
  }

  // Convenience methods for different request types
  async get(url, query, options) {
    return this.request({ method: "GET", url, query, ...options });
  }

  async post(url, body, options) {
    return this.request({ method: "POST", url, body, ...options });
  }

  async put(url, body, options) {
    return this.request({ method: "PUT", url, body, ...options });
  }

  async delete(url, options) {
    return this.request({ method: "DELETE", url, ...options });
  }
}

// API client for the application
export default class ApiClient extends BaseApiClient {
  // Generate a story
  async postGenerateStory(payload) {
    // Send the request
    const response = await this.post("generate/story", payload);

    // Parse the response
    if (response.ok) {
      return response.body;
      // If the response is not ok, throw an error
    } else {
      const errorMessage = response?.body?.errors
        ? response?.body?.errors
        : response?.body?.Error;
      throw new Error(`Error while generating story: ${errorMessage}`);
    }
  }

  async getChild(child_id) {
    // Check if child_id is provided and throw an error if not
    if (!child_id) {
      throw new Error("'child_id' is required to fetch child information");
    }

    // Send the request
    const response = await this.get(`children?child_id=${child_id}`);

    // Parse the response
    if (response.ok) {
      return response.body;
      // If the response is not ok, throw an error
    } else {
      const errorMessage = response?.body?.errors
        ? response?.body?.errors
        : response?.body?.Error;
      throw new Error(
        `Error while fetching child information: ${errorMessage}`
      );
    }
  }

  // Create a child
  async postCreateChild(payload) {
    // Send the request
    const response = await this.post("children", payload);

    // Parse the response
    if (response.ok) {
      return response.body;
      // If the response is not ok, throw an error
    } else {
      const errorMessage = response?.body?.errors
        ? response?.body?.errors
        : response?.body?.Error;
      throw new Error(`Error while creating child: ${errorMessage}`);
    }
  }

  // Get the currently active parent information
  async getCurrentParent() {
    // Send the request
    const response = await this.get("parent");

    // Parse the response
    if (response.ok) {
      return response.body;

      // If the response is not ok, throw an error
    } else {
      const errorMessage = response?.body?.errors
        ? response?.body?.errors
        : response?.body?.Error;
      throw new Error(
        `Error while fetching current parent information: ${errorMessage}`
      );
    }
  }

  // Create a parent
  async postCreateParent(payload) {
    // Send the request
    const response = await this.post("parent", payload);

    // Parse the response
    if (response.ok) {
      return response.body;

      // If the response is not ok, throw an error
    } else {
      const errorMessage = response?.body?.errors
        ? response?.body?.errors
        : response?.body?.Error;
      throw new Error(`Error while creating parent: ${errorMessage}`);
    }
  }
}
