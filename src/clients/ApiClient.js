/* 
Based on the ApiClient from the react mega tutorial: 
https://blog.miguelgrinberg.com/post/the-react-mega-tutorial-chapter-6-building-an-api-client
*/

import BaseApiClient from "./BaseApiClient";

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
