// Base class for API clients to be inherited from

export default class BaseApiClient {
  // Note: originally it was planned to use proxy instead of CORS,
  // however, Mykhailo and now also Flambeau and Billy have a weird
  // issue with the proxy not working properly,
  // so we have to use CORS instead
  constructor() {
    // Set the base URL based on the environment
    if (process.env.REACT_APP_MODE === "production") {
      this.base_url = process.env.REACT_APP_API_SUFFIX;
    } else {
      this.base_url = `${process.env.REACT_APP_HOST}${process.env.REACT_APP_API_SUFFIX}`;
    }
  }

  // Send a request to the server
  async request(options) {
    let query = new URLSearchParams(options.query || {}).toString();
    if (query !== "") {
      query = "?" + query;
    }

    // Retrieve the access token from storage
    const token = localStorage.getItem("access_token");

    // Send the request
    let response;
    try {
      response = await fetch(this.base_url + options.url + query, {
        method: options.method,
        headers: {
          "Content-Type": "application/json",

          // Include the authorization token if it's available
          ...(token ? { Authorization: `Bearer ${token}` } : null),

          // Include the additional headers
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

  async patch(url, body, options) {
    return this.request({ method: "PATCH", url, body, ...options });
  }

  async delete(url, options) {
    return this.request({ method: "DELETE", url, ...options });
  }
}
