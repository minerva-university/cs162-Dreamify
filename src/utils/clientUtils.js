// Helper function to print errors
export function concatErrors(errors) {
  // Convert the errors object to a string
  let errorString = "";
  try {
    for (const key in errors) {
      if (Object.hasOwn(errors, key)) {
        errorString += `${key}: ${errors[key]}\n`;
      }
    }
  } catch (error) {
    return "Errors could not be parsed.";
  }

  // Return the error string
  return errorString;
}
