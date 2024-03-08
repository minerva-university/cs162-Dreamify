/* 
Based on the ApiClient from the react mega tutorial: 
https://blog.miguelgrinberg.com/post/the-react-mega-tutorial-chapter-6-building-an-api-client
*/

import BaseApiClient from "./BaseApiClient";

// API client for the application
export default class ApiClient extends BaseApiClient {
  /**
   * Create a new child
   * @param {Object} payload - The payload to create a child
   * @param {string} payload.name - The name of the child
   * @param {string} payload.age_range - The age range of the child
   * @param {string} payload.sex - The sex of the child
   * @param {string} payload.sibling_relationship - The sibling relationship of the child
   * @param {string} payload.eye_color - The eye color of the child
   * @param {string} payload.hair_type - The hair type of the child
   * @param {string} payload.hair_color - The hair color of the child
   * @param {string} payload.skin_tone - The skin tone of the child
   * @param {string} payload.fav_animals - The favorite animals of the child (optional)
   * @param {string} payload.fav_activities - The favorite activities of the child (optional)
   * @param {string} payload.fav_shows - The favorite shows of the child (optional)
   * @returns {Promise<Object>} The response body
   * @throws {Error} If payload is not provided
   * @throws {Error} If the response is not ok
   * @example
   * const payload = {
   *  name: "Pablo",
   *  age_range: "4-6",
   *  sex: "Male",
   *  sibling_relationship: "Only",
   *  eye_color: "Brown",
   *  hair_type: "Curly",
   *  hair_color: "Black",
   *  skin_tone: "Light"
   * }
   * const response = await apiClient.postCreateChild(payload);
   */
  async postCreateChild(payload) {
    // Check if payload is provided and throw an error if not
    if (!payload) {
      throw new Error("Payload is required to create a child");
    }

    // Send the request
    const response = await this.post("children", payload);
    console.log(this.base_url);

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

  /**
   * Get a child's information
   * @param {string} childId - The ID of the child
   * @returns {Promise<Object>} The response body
   * @throws {Error} If childId is not provided
   * @throws {Error} If the response is not ok
   * @example
   * const childId = "1234";
   * const response = await apiClient.getChild(childId);
   */
  async getChild(childId) {
    // Check if childId is provided and throw an error if not
    if (!childId) {
      throw new Error("Child ID is required to fetch child information");
    }

    // Send the request
    const response = await this.get(`children?child_id=${childId}`);

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

  /**
   * Get all children of the current user
   * @returns {Promise<Object>} The response body
   * @throws {Error} If the response is not ok
   * @example
   * const response = await apiClient.getAllChildren();
   */
  async getAllChildren() {
    // Send the request
    const response = await this.get("children/all");

    // Parse the response
    if (response.ok) {
      return response.body;
      // If the response is not ok, throw an error
    } else {
      const errorMessage = response?.body?.errors
        ? response?.body?.errors
        : response?.body?.Error;
      throw new Error(`Error while fetching children: ${errorMessage}`);
    }
  }

  /**
   * Modify a child's information
   * @param {Object} payload - The payload to modify a child
   * @param {string} payload.child_id - The ID of the child (optional)
   * @param {string} payload.name - The name of the child (optional)
   * @param {string} payload.age_range - The age range of the child (optional)
   * @param {string} payload.sex - The sex of the child (optional)
   * @param {string} payload.sibling_relationship - The sibling relationship of the child (optional)
   * @param {string} payload.eye_color - The eye color of the child (optional)
   * @param {string} payload.hair_type - The hair type of the child (optional)
   * @param {string} payload.hair_color - The hair color of the child (optional)
   * @param {string} payload.skin_tone - The skin tone of the child (optional)
   * @param {string} payload.fav_animals - The favorite animals of the child (optional)
   * @param {string} payload.fav_activities - The favorite activities of the child (optional)
   * @param {string} payload.fav_shows - The favorite shows of the child (optional)
   * @returns {Promise<Object>} The response body
   * @throws {Error} If payload is not provided
   * @throws {Error} If the response is not ok
   * @example
   * const payload = {
   *  child_id: "83adfb09110747bc93575bd208a52d8b",
   *  name: "Pablo",
   *  age_range: "4-6",
   *  fav_animals: "Dogs, Cats"
   * }
   * const response = await apiClient.patchModifyChild(payload);
   */
  async patchModifyChild(payload) {
    // Check if payload is provided and throw an error if not
    if (!payload) {
      throw new Error("Payload is required to modify a child");
    }

    // Send the request
    const response = await this.patch("children", payload);

    // Parse the response
    if (response.ok) {
      return response.body;
      // If the response is not ok, throw an error
    } else {
      const errorMessage = response?.body?.errors
        ? response?.body?.errors
        : response?.body?.Error;
      throw new Error(`Error while modifying child: ${errorMessage}`);
    }
  }

  /**
   * Generate a story
   * @param {Object} payload - The payload to generate a story
   * @param {string} payload.child_id - The ID of the child
   * @param {string} payload.topic - The topic of the story
   * @param {string} payload.image_style - The image style of the story
   * @returns {Promise<Object>} The response body
   * @throws {Error} If payload is not provided
   * @throws {Error} If the response is not ok
   * @example
   * const payload = {
   *  child_id: "83adfb09110747bc93575bd208a52d8b",
   *  topic: "Adventure",
   *  image_style: "Cartoon"
   * }
   * const response = await apiClient.postGenerateStory(payload);
   */
  async postGenerateStory(payload) {
    // Check if payload is provided and throw an error if not
    if (!payload) {
      throw new Error("Payload is required to generate a story");
    }

    // Send the request
    const response = await this.post("stories/generate", payload);

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

  /**
   * Get all stories of a child
   * @param {string} childId - The ID of the child
   * @returns {Promise<Object>} The response body
   * @throws {Error} If childId is not provided
   * @throws {Error} If the response is not ok
   * @example
   * const childId = "83adfb09110747bc93575bd208a52d8b"
   * const response = await apiClient.getAllChildStories(childId);
   */
  async getAllChildStories(childId) {
    // Check if childId is provided and throw an error if not
    if (!childId) {
      throw new Error("Child ID is required to fetch child stories");
    }

    // Send the request
    const response = await this.get(
      `stories/child_stories?child_id=${childId}`
    );

    // Parse the response
    if (response.ok) {
      return response.body;
      // If the response is not ok, throw an error
    } else {
      const errorMessage = response?.body?.errors
        ? response?.body?.errors
        : response?.body?.Error;
      throw new Error(`Error while fetching child stories: ${errorMessage}`);
    }
  }

  /**
   * Get all chapters of a story
   * @param {string} storyId - The ID of the story
   * @returns {Promise<Object>} The response body
   * @throws {Error} If storyId is not provided
   * @throws {Error} If the response is not ok
   * @example
   * const storyId = "7d37c21e420a4e6187153deb4ef07d88"
   * const response = await apiClient.getAllStoryChapters(storyId);
   */
  async getAllStoryChapters(storyId) {
    // Check if storyId is provided and throw an error if not
    if (!storyId) {
      throw new Error("Story ID is required to fetch story chapters");
    }

    // Send the request
    const response = await this.get(`stories/chapters?story_id=${storyId}`);

    // Parse the response
    if (response.ok) {
      return response.body;
      // If the response is not ok, throw an error
    } else {
      const errorMessage = response?.body?.errors
        ? response?.body?.errors
        : response?.body?.Error;
      throw new Error(`Error while fetching story chapters: ${errorMessage}`);
    }
  }
}
