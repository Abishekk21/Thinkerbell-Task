/**
 * TestRunner - Integrated test suite UI
 * Runs all apply_update tests in the browser
 */

import { useState } from 'react';
import { apply_update } from '../core/applyUpdate';

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

// Test suite definition
const testSuites = [
  {
    name: 'Successful Updates',
    tests: [
      {
        name: 'Partial volume update preserves existing language',
        fn: () => {
          const request = { deviceId: 'D01', expectedVersion: 3, settings: { volume: 4 } };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
          if (result.record.settings.volume !== 4) throw new Error('Volume not updated');
          if (result.record.settings.language !== 'en') throw new Error('Language not preserved');
        }
      },
      {
        name: 'Language update preserves existing volume',
        fn: () => {
          const request = { deviceId: 'D01', expectedVersion: 3, settings: { language: 'hi' } };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
          if (result.record.settings.language !== 'hi') throw new Error('Language not updated');
          if (result.record.settings.volume !== 2) throw new Error('Volume not preserved');
        }
      },
      {
        name: 'Both settings can be updated together',
        fn: () => {
          const request = { deviceId: 'D01', expectedVersion: 3, settings: { language: 'kn', volume: 5 } };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
          if (result.record.settings.language !== 'kn') throw new Error('Language not updated');
          if (result.record.settings.volume !== 5) throw new Error('Volume not updated');
        }
      },
      {
        name: 'Version increments exactly once',
        fn: () => {
          const request = { deviceId: 'D01', expectedVersion: 3, settings: { volume: 3 } };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 200) throw new Error(`Expected 200, got ${result.status}`);
          if (result.record.version !== 4) throw new Error(`Expected version 4, got ${result.record.version}`);
        }
      },
      {
        name: 'Original inputs remain unchanged',
        fn: () => {
          const current = { ...validCurrent, settings: { ...validCurrent.settings } };
          const request = { deviceId: 'D01', expectedVersion: 3, settings: { volume: 4 } };
          apply_update(current, validActor, request);
          if (current.version !== 3) throw new Error('Current was mutated');
          if (current.settings.volume !== 2) throw new Error('Current settings were mutated');
        }
      }
    ]
  },
  {
    name: 'Permission Checks',
    tests: [
      {
        name: 'Viewer receives FORBIDDEN',
        fn: () => {
          const viewerActor = { siteId: 'S01', role: 'viewer' };
          const request = { deviceId: 'D01', expectedVersion: 3, settings: { volume: 4 } };
          const result = apply_update(validCurrent, viewerActor, request);
          if (result.status !== 403) throw new Error(`Expected 403, got ${result.status}`);
          if (result.error !== 'FORBIDDEN') throw new Error(`Expected FORBIDDEN, got ${result.error}`);
        }
      },
      {
        name: 'Mismatched site receives FORBIDDEN',
        fn: () => {
          const wrongSiteActor = { siteId: 'S02', role: 'editor' };
          const request = { deviceId: 'D01', expectedVersion: 3, settings: { volume: 4 } };
          const result = apply_update(validCurrent, wrongSiteActor, request);
          if (result.status !== 403) throw new Error(`Expected 403, got ${result.status}`);
        }
      },
      {
        name: 'Permission error comes before validation error',
        fn: () => {
          const viewerActor = { siteId: 'S01', role: 'viewer' };
          const badRequest = { deviceId: 'D01', expectedVersion: 3, settings: { volume: 99 } };
          const result = apply_update(validCurrent, viewerActor, badRequest);
          if (result.status !== 403) throw new Error(`Expected 403 (permission), got ${result.status}`);
        }
      }
    ]
  },
  {
    name: 'Request Structure Validation',
    tests: [
      {
        name: 'Missing required property',
        fn: () => {
          const request = { deviceId: 'D01', settings: { volume: 4 } };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 422) throw new Error(`Expected 422, got ${result.status}`);
        }
      },
      {
        name: 'Unexpected top-level property',
        fn: () => {
          const request = { deviceId: 'D01', expectedVersion: 3, settings: { volume: 4 }, extra: 'bad' };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 422) throw new Error(`Expected 422, got ${result.status}`);
        }
      },
      {
        name: 'Empty device ID',
        fn: () => {
          const request = { deviceId: '', expectedVersion: 3, settings: { volume: 4 } };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 422) throw new Error(`Expected 422, got ${result.status}`);
        }
      },
      {
        name: 'Boolean expected version',
        fn: () => {
          const request = { deviceId: 'D01', expectedVersion: true, settings: { volume: 4 } };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 422) throw new Error(`Expected 422, got ${result.status}`);
        }
      },
      {
        name: 'Empty settings object',
        fn: () => {
          const request = { deviceId: 'D01', expectedVersion: 3, settings: {} };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 422) throw new Error(`Expected 422, got ${result.status}`);
        }
      }
    ]
  },
  {
    name: 'Settings Validation',
    tests: [
      {
        name: 'Unsupported language',
        fn: () => {
          const request = { deviceId: 'D01', expectedVersion: 3, settings: { language: 'fr' } };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 422) throw new Error(`Expected 422, got ${result.status}`);
        }
      },
      {
        name: 'Valid languages accepted (en, hi, kn)',
        fn: () => {
          const langs = ['en', 'hi', 'kn'];
          for (const lang of langs) {
            const request = { deviceId: 'D01', expectedVersion: 3, settings: { language: lang } };
            const result = apply_update(validCurrent, validActor, request);
            if (result.status !== 200) throw new Error(`Language ${lang} should be valid`);
          }
        }
      },
      {
        name: 'Volume 0 and 5 accepted',
        fn: () => {
          const request1 = { deviceId: 'D01', expectedVersion: 3, settings: { volume: 0 } };
          const result1 = apply_update(validCurrent, validActor, request1);
          if (result1.status !== 200 || result1.record.settings.volume !== 0) throw new Error('Volume 0 should be valid');

          const request2 = { deviceId: 'D01', expectedVersion: 3, settings: { volume: 5 } };
          const result2 = apply_update(validCurrent, validActor, request2);
          if (result2.status !== 200 || result2.record.settings.volume !== 5) throw new Error('Volume 5 should be valid');
        }
      },
      {
        name: 'Volume outside range rejected',
        fn: () => {
          const request1 = { deviceId: 'D01', expectedVersion: 3, settings: { volume: -1 } };
          const result1 = apply_update(validCurrent, validActor, request1);
          if (result1.status !== 422) throw new Error('Volume -1 should be rejected');

          const request2 = { deviceId: 'D01', expectedVersion: 3, settings: { volume: 6 } };
          const result2 = apply_update(validCurrent, validActor, request2);
          if (result2.status !== 422) throw new Error('Volume 6 should be rejected');
        }
      },
      {
        name: 'Fractional volume rejected',
        fn: () => {
          const request = { deviceId: 'D01', expectedVersion: 3, settings: { volume: 2.5 } };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 422) throw new Error('Fractional volume should be rejected');
        }
      },
      {
        name: 'Boolean volume rejected',
        fn: () => {
          const request = { deviceId: 'D01', expectedVersion: 3, settings: { volume: false } };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 422) throw new Error('Boolean volume should be rejected');
        }
      },
      {
        name: 'Unknown setting key rejected',
        fn: () => {
          const request = { deviceId: 'D01', expectedVersion: 3, settings: { brightness: 5 } };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 422) throw new Error('Unknown key should be rejected');
        }
      }
    ]
  },
  {
    name: 'Identity and Concurrency',
    tests: [
      {
        name: 'Wrong device ID returns NOT_FOUND',
        fn: () => {
          const request = { deviceId: 'D99', expectedVersion: 3, settings: { volume: 4 } };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 404) throw new Error(`Expected 404, got ${result.status}`);
          if (result.error !== 'NOT_FOUND') throw new Error(`Expected NOT_FOUND, got ${result.error}`);
        }
      },
      {
        name: 'Stale version returns CONFLICT',
        fn: () => {
          const request = { deviceId: 'D01', expectedVersion: 2, settings: { volume: 4 } };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 409) throw new Error(`Expected 409, got ${result.status}`);
          if (result.error !== 'CONFLICT') throw new Error(`Expected CONFLICT, got ${result.error}`);
        }
      },
      {
        name: 'Validation error comes before conflict',
        fn: () => {
          const request = { deviceId: 'D01', expectedVersion: 2, settings: { volume: 99 } };
          const result = apply_update(validCurrent, validActor, request);
          if (result.status !== 422) throw new Error(`Expected 422 (validation), got ${result.status}`);
        }
      },
      {
        name: 'Concurrent updates conflict correctly',
        fn: () => {
          const request1 = { deviceId: 'D01', expectedVersion: 3, settings: { volume: 4 } };
          const result1 = apply_update(validCurrent, validActor, request1);
          if (result1.status !== 200) throw new Error('First update should succeed');

          const request2 = { deviceId: 'D01', expectedVersion: 3, settings: { language: 'hi' } };
          const result2 = apply_update(result1.record, validActor, request2);
          if (result2.status !== 409) throw new Error('Second update should conflict');
        }
      }
    ]
  }
];

function TestRunner() {
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = () => {
    setIsRunning(true);
    setResults(null);

    setTimeout(() => {
      const suiteResults = [];
      let totalTests = 0;
      let totalPassed = 0;
      let totalFailed = 0;

      for (const suite of testSuites) {
        const suiteResult = {
          name: suite.name,
          tests: []
        };

        for (const test of suite.tests) {
          totalTests++;
          try {
            test.fn();
            suiteResult.tests.push({ name: test.name, passed: true });
            totalPassed++;
          } catch (error) {
            suiteResult.tests.push({ name: test.name, passed: false, error: error.message });
            totalFailed++;
          }
        }

        suiteResults.push(suiteResult);
      }

      setResults({
        suites: suiteResults,
        totalTests,
        totalPassed,
        totalFailed
      });
      setIsRunning(false);
    }, 100);
  };

  return (
    <>
      <div className="card-body p-4">
        {!results && !isRunning && (
          <div className="text-center py-4">
            <i className="bi bi-code-slash fs-1 text-primary mb-3 d-block"></i>
            <p className="text-muted mb-0">
              Click &quot;Run All Tests&quot; to execute the complete test suite in the browser.
            </p>
            <p className="text-muted small mt-2 mb-0">
              {testSuites.reduce((sum, suite) => sum + suite.tests.length, 0)} tests ready to run
            </p>
          </div>
        )}

        {isRunning && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Running tests...</span>
            </div>
            <p className="text-muted mb-0">Running tests...</p>
          </div>
        )}

        {results && (
          <div>
            {/* Summary */}
            <div className="alert alert-info mb-4">
              <div className="row text-center">
                <div className="col-4">
                  <div className="h3 mb-0">{results.totalTests}</div>
                  <div className="small text-muted">Total</div>
                </div>
                <div className="col-4">
                  <div className="h3 mb-0 text-success">{results.totalPassed}</div>
                  <div className="small text-muted">Passed</div>
                </div>
                <div className="col-4">
                  <div className="h3 mb-0 text-danger">{results.totalFailed}</div>
                  <div className="small text-muted">Failed</div>
                </div>
              </div>
            </div>

            {/* Test Suites */}
            {results.suites.map((suite, idx) => (
              <div key={idx} className="mb-4">
                <h6 className="text-secondary mb-3 fw-semibold">
                  <i className="bi bi-folder2-open me-2"></i>
                  {suite.name}
                </h6>
                <ul className="list-group list-group-flush">
                  {suite.tests.map((test, testIdx) => (
                    <li 
                      key={testIdx} 
                      className={`list-group-item d-flex justify-content-between align-items-start ${
                        test.passed ? 'list-group-item-success' : 'list-group-item-danger'
                      }`}
                    >
                      <div className="flex-grow-1">
                        <i className={`bi ${test.passed ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'} me-2`}></i>
                        {test.name}
                        {!test.passed && test.error && (
                          <div className="small text-danger mt-1 ms-4">
                            <strong>Error:</strong> {test.error}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Run Tests Button - Positioned at bottom */}
      <div className="card-footer bg-dark border-0 d-flex justify-content-between align-items-center p-3">
        <span className="text-white-50 small">
          <i className="bi bi-info-circle me-1"></i>
          Click to execute all {testSuites.reduce((sum, suite) => sum + suite.tests.length, 0)} tests
        </span>
        <button
          className="btn btn-primary px-4"
          onClick={runTests}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Running Tests...
            </>
          ) : (
            <>
              <i className="bi bi-play-fill me-2"></i>
              Run All Tests
            </>
          )}
        </button>
      </div>
    </>
  );
}

export default TestRunner;
