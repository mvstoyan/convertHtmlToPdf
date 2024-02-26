/**
 * Function calculates the execution time.
 *
 * @returns {number} - execution time in milliseconds.
 */

const countExecutionTime = (startTime = Date.now()) => {
  const endTime = Date.now(); // Get current time when function execution ends
  return endTime - startTime || 0; // Return execution time in milliseconds, 0 if time is not provided
};

export default countExecutionTime;
