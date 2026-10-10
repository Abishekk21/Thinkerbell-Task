/**
 * Comprehensive Test Suite for apply_update
 * 
 * Tests all required validation scenarios in the correct order:
 * 1. Permission checks
 * 2. Request structure validation
 * 3. Settings validation
 * 4. Identity and version checks
 * 5. Successful updates
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { apply_update } from './applyUpdate.js';

// Test fixtures
const validCurrent = {
  deviceId: 'D01',
  siteId: 'S01',
  version: 3,
  settings: { language: 'en', volume: 2 }
};

const validActor = {
  siteId: 'S01',
  role: 'editor'
};

describe('Safe Device Settings Update - Core Tests', () => {
  
  // =================================================================
  // SUCCESSFUL UPDATE CASES
  // =================================================================
  
  describe('Successful Updates', () => {
    test('1. Partial volume update preserves existing language', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 4 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 200);
      assert.strictEqual(result.record.volume, undefined); // settings is nested
      assert.strictEqual(result.record.settings.volume, 4);
      assert.strictEqual(result.record.settings.language, 'en');
      assert.strictEqual(result.record.version, 4);
    });

    test('2. Language update preserves existing volume', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { language: 'hi' }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 200);
      assert.strictEqual(result.record.settings.language, 'hi');
      assert.strictEqual(result.record.settings.volume, 2);
      assert.strictEqual(result.record.version, 4);
    });

    test('3. Both settings can be updated together', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { language: 'kn', volume: 5 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 200);
      assert.strictEqual(result.record.settings.language, 'kn');
      assert.strictEqual(result.record.settings.volume, 5);
      assert.strictEqual(result.record.version, 4);
    });

    test('4. Version increments exactly once', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 3 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 200);
      assert.strictEqual(result.record.version, 4);
      assert.notStrictEqual(result.record.version, 5);
    });

    test('5. Original inputs remain unchanged', () => {
      const current = { ...validCurrent, settings: { ...validCurrent.settings } };
      const actor = { ...validActor };
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 4 }
      };

      apply_update(current, actor, request);

      // Verify no mutation
      assert.strictEqual(current.version, 3);
      assert.strictEqual(current.settings.volume, 2);
      assert.strictEqual(actor.role, 'editor');
      assert.strictEqual(request.settings.volume, 4);
    });
  });

  // =================================================================
  // PERMISSION CHECKS (Must be first)
  // =================================================================
  
  describe('Permission Checks', () => {
    test('6. Viewer receives FORBIDDEN', () => {
      const viewerActor = { siteId: 'S01', role: 'viewer' };
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 4 }
      };

      const result = apply_update(validCurrent, viewerActor, request);

      assert.strictEqual(result.status, 403);
      assert.strictEqual(result.error, 'FORBIDDEN');
    });

    test('7. Mismatched site receives FORBIDDEN', () => {
      const wrongSiteActor = { siteId: 'S02', role: 'editor' };
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 4 }
      };

      const result = apply_update(validCurrent, wrongSiteActor, request);

      assert.strictEqual(result.status, 403);
      assert.strictEqual(result.error, 'FORBIDDEN');
    });

    test('8. Unauthorized actor with malformed request still receives permission error first', () => {
      const viewerActor = { siteId: 'S01', role: 'viewer' };
      const badRequest = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 99 } // Invalid volume
      };

      const result = apply_update(validCurrent, viewerActor, badRequest);

      // Permission error comes before validation error
      assert.strictEqual(result.status, 403);
      assert.strictEqual(result.error, 'FORBIDDEN');
    });
  });

  // =================================================================
  // REQUEST STRUCTURE VALIDATION
  // =================================================================
  
  describe('Request Structure Validation', () => {
    test('9. Missing required property returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        settings: { volume: 4 }
        // Missing expectedVersion
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('10. Unexpected top-level property returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 4 },
        extraField: 'not allowed'
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('11. Empty device ID returns INVALID_INPUT', () => {
      const request = {
        deviceId: '',
        expectedVersion: 3,
        settings: { volume: 4 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('12a. Zero expected version returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 0,
        settings: { volume: 4 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('12b. Negative expected version returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: -1,
        settings: { volume: 4 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('12c. Fractional expected version returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3.5,
        settings: { volume: 4 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('12d. Boolean expected version returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: true,
        settings: { volume: 4 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('13. Empty settings object returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: {}
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('14. Null settings returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: null
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('15. Array settings returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: []
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });
  });

  // =================================================================
  // SETTINGS VALIDATION
  // =================================================================
  
  describe('Settings Validation', () => {
    test('16. Unsupported language returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { language: 'fr' }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('17a. Valid language "en" is accepted', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { language: 'en' }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 200);
    });

    test('17b. Valid language "hi" is accepted', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { language: 'hi' }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 200);
    });

    test('17c. Valid language "kn" is accepted', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { language: 'kn' }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 200);
    });

    test('18a. Volume value 0 is accepted', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 0 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 200);
      assert.strictEqual(result.record.settings.volume, 0);
    });

    test('18b. Volume value 5 is accepted', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 5 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 200);
      assert.strictEqual(result.record.settings.volume, 5);
    });

    test('19a. Volume below 0 returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: -1 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('19b. Volume above 5 returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 6 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('20. Fractional volume returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 2.5 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('21. Boolean volume returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: false }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('22. Unknown setting key returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { brightness: 5 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('23. Mixed valid and invalid settings returns INVALID_INPUT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 3, unknown: 'bad' }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });
  });

  // =================================================================
  // IDENTITY AND CONCURRENCY CHECKS
  // =================================================================
  
  describe('Identity and Concurrency', () => {
    test('24. Wrong device ID returns NOT_FOUND', () => {
      const request = {
        deviceId: 'D99',
        expectedVersion: 3,
        settings: { volume: 4 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 404);
      assert.strictEqual(result.error, 'NOT_FOUND');
    });

    test('25. Stale expected version returns CONFLICT', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 2, // Stale version
        settings: { volume: 4 }
      };

      const result = apply_update(validCurrent, validActor, request);

      assert.strictEqual(result.status, 409);
      assert.strictEqual(result.error, 'CONFLICT');
    });

    test('26. Invalid settings with stale version returns validation error first', () => {
      const request = {
        deviceId: 'D01',
        expectedVersion: 2, // Stale
        settings: { volume: 99 } // Invalid
      };

      const result = apply_update(validCurrent, validActor, request);

      // Validation error comes before conflict
      assert.strictEqual(result.status, 422);
      assert.strictEqual(result.error, 'INVALID_INPUT');
    });

    test('27. Two concurrent requests: second request conflicts after first succeeds', () => {
      const request1 = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 4 }
      };

      const request2 = {
        deviceId: 'D01',
        expectedVersion: 3, // Same version
        settings: { language: 'hi' }
      };

      // First request succeeds
      const result1 = apply_update(validCurrent, validActor, request1);
      assert.strictEqual(result1.status, 200);
      assert.strictEqual(result1.record.version, 4);

      // Second request uses the NEW current record (result1.record)
      const result2 = apply_update(result1.record, validActor, request2);
      
      // Second request conflicts because expectedVersion (3) != current version (4)
      assert.strictEqual(result2.status, 409);
      assert.strictEqual(result2.error, 'CONFLICT');
    });
  });

  // =================================================================
  // IMMUTABILITY VERIFICATION
  // =================================================================
  
  describe('Immutability', () => {
    test('All inputs remain unchanged on success', () => {
      const current = {
        deviceId: 'D01',
        siteId: 'S01',
        version: 3,
        settings: { language: 'en', volume: 2 }
      };
      const actor = { siteId: 'S01', role: 'editor' };
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 4 }
      };

      apply_update(current, actor, request);

      assert.deepStrictEqual(current, {
        deviceId: 'D01',
        siteId: 'S01',
        version: 3,
        settings: { language: 'en', volume: 2 }
      });
      assert.deepStrictEqual(actor, { siteId: 'S01', role: 'editor' });
      assert.deepStrictEqual(request, {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 4 }
      });
    });

    test('All inputs remain unchanged on error', () => {
      const current = {
        deviceId: 'D01',
        siteId: 'S01',
        version: 3,
        settings: { language: 'en', volume: 2 }
      };
      const actor = { siteId: 'S01', role: 'viewer' }; // Will fail permission
      const request = {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 4 }
      };

      apply_update(current, actor, request);

      assert.deepStrictEqual(current, {
        deviceId: 'D01',
        siteId: 'S01',
        version: 3,
        settings: { language: 'en', volume: 2 }
      });
      assert.deepStrictEqual(actor, { siteId: 'S01', role: 'viewer' });
      assert.deepStrictEqual(request, {
        deviceId: 'D01',
        expectedVersion: 3,
        settings: { volume: 4 }
      });
    });
  });
});
