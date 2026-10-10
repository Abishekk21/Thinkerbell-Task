/**
 * Safe Device Settings Update - Core Implementation
 * 
 * Implements apply_update(current, actor, request) with immutable updates
 * and strict validation order as per assessment requirements.
 */

/**
 * Validates actor permissions
 * @param {Object} current - Current device record
 * @param {Object} actor - Authenticated actor
 * @returns {Object|null} Error object if validation fails, null if passes
 */
function validatePermission(current, actor) {
  // Check 1: Actor must be an editor
  if (actor.role !== 'editor') {
    return { status: 403, error: 'FORBIDDEN' };
  }

  // Check 2: Actor's siteId must match current record's siteId
  if (actor.siteId !== current.siteId) {
    return { status: 403, error: 'FORBIDDEN' };
  }

  return null;
}

/**
 * Validates request structure
 * @param {Object} request - Update request
 * @returns {Object|null} Error object if validation fails, null if passes
 */
function validateRequestStructure(request) {
  // Must be a non-null object
  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    return { status: 422, error: 'INVALID_INPUT' };
  }

  // Check for exactly three top-level properties
  const keys = Object.keys(request);
  if (keys.length !== 3) {
    return { status: 422, error: 'INVALID_INPUT' };
  }

  // Must contain exactly deviceId, expectedVersion, settings
  if (!keys.includes('deviceId') || !keys.includes('expectedVersion') || !keys.includes('settings')) {
    return { status: 422, error: 'INVALID_INPUT' };
  }

  // deviceId must be a non-empty string
  if (typeof request.deviceId !== 'string' || request.deviceId.length === 0) {
    return { status: 422, error: 'INVALID_INPUT' };
  }

  // expectedVersion must be a positive integer (not boolean)
  if (typeof request.expectedVersion === 'boolean') {
    return { status: 422, error: 'INVALID_INPUT' };
  }
  if (!Number.isInteger(request.expectedVersion) || request.expectedVersion <= 0) {
    return { status: 422, error: 'INVALID_INPUT' };
  }

  // settings must be a non-null, non-array object
  if (!request.settings || typeof request.settings !== 'object' || Array.isArray(request.settings)) {
    return { status: 422, error: 'INVALID_INPUT' };
  }

  // settings must contain at least one property
  if (Object.keys(request.settings).length === 0) {
    return { status: 422, error: 'INVALID_INPUT' };
  }

  return null;
}

/**
 * Validates settings values
 * @param {Object} settings - Settings object from request
 * @returns {Object|null} Error object if validation fails, null if passes
 */
function validateSettings(settings) {
  const validLanguages = ['en', 'hi', 'kn'];
  const allowedKeys = ['language', 'volume'];

  for (const key of Object.keys(settings)) {
    // Check for unknown keys
    if (!allowedKeys.includes(key)) {
      return { status: 422, error: 'INVALID_INPUT' };
    }

    const value = settings[key];

    if (key === 'language') {
      // Language must be one of the valid values
      if (!validLanguages.includes(value)) {
        return { status: 422, error: 'INVALID_INPUT' };
      }
    }

    if (key === 'volume') {
      // Volume must be an integer from 0 to 5 inclusive
      // Reject booleans explicitly
      if (typeof value === 'boolean') {
        return { status: 422, error: 'INVALID_INPUT' };
      }
      // Reject null
      if (value === null) {
        return { status: 422, error: 'INVALID_INPUT' };
      }
      // Must be an integer
      if (!Number.isInteger(value)) {
        return { status: 422, error: 'INVALID_INPUT' };
      }
      // Must be in range 0-5
      if (value < 0 || value > 5) {
        return { status: 422, error: 'INVALID_INPUT' };
      }
    }
  }

  return null;
}

/**
 * Validates identity and version
 * @param {Object} current - Current device record
 * @param {Object} request - Update request
 * @returns {Object|null} Error object if validation fails, null if passes
 */
function validateIdentityAndVersion(current, request) {
  // Check device ID match
  if (request.deviceId !== current.deviceId) {
    return { status: 404, error: 'NOT_FOUND' };
  }

  // Check version match (optimistic concurrency control)
  if (request.expectedVersion !== current.version) {
    return { status: 409, error: 'CONFLICT' };
  }

  return null;
}

/**
 * Main function: Apply settings update to a device record
 * 
 * @param {Object} current - Current device record
 * @param {Object} actor - Authenticated actor with role and siteId
 * @param {Object} request - Update request with deviceId, expectedVersion, and settings
 * @returns {Object} Result with status code and either updated record or error
 */
export function apply_update(current, actor, request) {
  // Validation Step 1: Permission (must be first)
  const permissionError = validatePermission(current, actor);
  if (permissionError) {
    return permissionError;
  }

  // Validation Step 2: Request structure
  const structureError = validateRequestStructure(request);
  if (structureError) {
    return structureError;
  }

  // Validation Step 3: Settings validation
  const settingsError = validateSettings(request.settings);
  if (settingsError) {
    return settingsError;
  }

  // Validation Step 4: Identity and version (after all other validation)
  const identityError = validateIdentityAndVersion(current, request);
  if (identityError) {
    return identityError;
  }

  // Success: Create new record without mutating inputs
  const updatedRecord = {
    deviceId: current.deviceId,
    siteId: current.siteId,
    version: current.version + 1,
    settings: {
      ...current.settings,
      ...request.settings
    }
  };

  return {
    status: 200,
    record: updatedRecord
  };
}
