import { concatErrors } from "../utils/clientUtils";
import BaseApiClient from "./BaseApiClient";

export default class AuthClient extends BaseApiClient {
  /**
   * Register a new user.
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} email
   * @param {string} password
   * @throws {Error} If the input is invalid or the request fails
   * @returns {Promise<void>}
   * @example
   * await auth.register("John", "Doe", "john.doe@example.com", "password");
   */
  async register(firstName, lastName, email, password) {
    // Validate the input and throw an error if it's invalid
    if (!firstName || !lastName || !email || !password) {
      throw new Error(
        "Error while registering: First name, last name, email and password are required"
      );
    }

    // Set the payload and make a request to the server
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };
    const response = await this.post("auth/register", payload);

    // If the request was not successful, throw an error
    if (!response.ok) {
      const errorMessage =
        response?.body?.Error ||
        response?.body?.error ||
        concatErrors(response?.body?.errors);
      throw new Error(`Error while registering: ${errorMessage}`);
    }
  }

  /**
   * Log in a user.
   * @param {string} email
   * @param {string} password
   * @throws {Error} If the input is invalid or the request fails
   * @returns {Promise<void>}
   * @example
   * await auth.login("john.doe@example.com", "password");
   */
  async login(email, password) {
    // Validate the input and throw an error if it's invalid
    if (!email || !password) {
      throw new Error(
        "Error while logging in: Email and password are required"
      );
    }

    // Set the payload and make a request to the server
    const payload = { email, password };
    const response = await this.post("auth/login", payload);

    // If the request was successful, save the access token to the local storage
    if (response.ok) {
      localStorage.setItem("access_token", response.body.access_token);
      // If the request was not successful, throw an error
    } else {
      const errorMessage =
        response?.body?.Error ||
        response?.body?.error ||
        concatErrors(response?.body?.errors);
      throw new Error(`Error while logging in: ${errorMessage}`);
    }
  }

  /**
   * Get the currently authenticated user.
   * @returns {Promise<object>} The currently authenticated user
   * @throws {Error} If the request fails
   * @example
   * const user = await auth.getCurrentUser();
   */
  async getCurrentParent() {
    // Make a request to the server
    const response = await this.get("auth/current_parent");

    // If the request was successful, return the response or throw an error
    if (response.ok) {
      return response.body;
    } else {
      const errorMessage =
        response?.body?.Error ||
        response?.body?.error ||
        concatErrors(response?.body?.errors);
      throw new Error(`Error while getting the current user: ${errorMessage}`);
    }
  }
}
