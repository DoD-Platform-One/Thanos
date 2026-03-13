// cypress/e2e/basic_thanos.cy.js

// ---- Global fail handler with logging ----
let capturedError = null;
Cypress.on('fail', (error) => {
  cy.log(`❌ Test step failed: ${error.message}`);
  capturedError = error;
  return false; // Allow test to continue for video capture
});

afterEach(() => {
  if (capturedError) {
    const err = capturedError;
    capturedError = null;
    throw err; // Re-throw error so pipeline fails
  }
});

/**
 * Checks for and clicks the license acknowledgment button using its text content.
 * Uses cy.contains() for the most reliable text-based targeting.
 */
const acknowledgeLicense = () => {
  const acknowledgeButtonText = 'Acknowledge';

  cy.log('🔎 Checking for license banner...');
  cy.get('body').then(($body) => {
    // Check if the body text contains the button label.
    if ($body.text().includes(acknowledgeButtonText)) {
      cy.log('🚨 Acknowledge banner detected, clicking...');

      // Use cy.contains to find the element with the text and click it.
      // We use { timeout: 500 } to prevent unnecessary waiting if it's not immediately ready.
      // { force: true } is sometimes needed if a modal overlay temporarily blocks the button.
      cy.contains(acknowledgeButtonText, { timeout: 500 }).click({ force: true });

      cy.log('✅ License acknowledged.');
    } else {
      cy.log('ℹ️ Acknowledge button not present (proceeding).');
    }
  });
};

describe('Basic thanos', function() {
  let thanosUrl = '';
  let minioUrl = '';
  let prometheusIntegrationEnabled = false;
  let objstorageIntegrationEnabled = false;

  before(function() {
    cy.env(['thanos_url', 'minio_url', 'prometheus_integration_enabled', 'objstorage_integration_enabled'])
      .then((envVars) => {
        thanosUrl = envVars.thanos_url;
        minioUrl = envVars.minio_url;
        prometheusIntegrationEnabled = envVars.prometheus_integration_enabled === true || envVars.prometheus_integration_enabled === 'true';
        objstorageIntegrationEnabled = envVars.objstorage_integration_enabled === true || envVars.objstorage_integration_enabled === 'true';
      });
  });

  it('Visits the Thanos home page', function() {
    cy.log('🌐 Visiting Thanos home page...');
    cy.visit(thanosUrl, { failOnStatusCode: false });

    acknowledgeLicense();

    cy.get('body').then(($body) => {
      if ($body.find('input[name="user"]').length !== 0) {
        cy.log('🔑 Login form detected, logging in...');
        cy.get('input[name="user"]').type('admin');
        cy.get('input[name="password"]').type('prom-operator');
        cy.contains("Log in").click();
        cy.get('.page-dashboard', { timeout: 10000 }).should('exist');
      } else {
        cy.log('✅ No login required.');
      }
    });
  });

  // Run a simple query
  it('Simple Query', function() {
    cy.log('🌐 Opening Thanos URL for Simple Query...');
    cy.visit(thanosUrl, { failOnStatusCode: false });

    acknowledgeLicense();

    cy.log('⌨️ Typing query: kube_node_info{}');
    cy.get('div[class="cm-line"]').type('kube_node_info{}');
    cy.get('button[class="execute-btn btn btn-primary"]').click({ waitForAnimations: false });
  });

  // An integration test with monitoring.prometheus
  it('Prometheus Integration',
    {
      retries: {
        runMode: 10,
      },
    },
    function() {
      if (!prometheusIntegrationEnabled) {
        return this.skip();
      }

      cy.log('🌐 Opening Prometheus integration pages...');
      cy.visit(`${thanosUrl}/stores`, { failOnStatusCode: false });

      acknowledgeLicense();

      cy.wait(1000);
      cy.visit(`${thanosUrl}/targets`, { failOnStatusCode: false });

      acknowledgeLicense();

      cy.get('button[class="all btn btn-primary active"]').click();
      cy.get('button[class="btn btn-primary btn-xs"]')
        .parent()
        .contains(/monitoring\/.+-prometheus\/0/);
      cy.get('button[class="btn btn-primary btn-xs"]')
        .parent()
        .contains(/monitoring\/.+-thanos-sidecar\/0/);
    }
  );

  // An integration test with object storage enabled
  it('Verify Thanos Bucket',
    {
      retries: {
        runMode: 5,
      },
    },
    function() {
      if (!objstorageIntegrationEnabled) {
        return this.skip();
      }

      cy.log('🔄 Starting Verify Thanos Bucket test...');

      // Ensure MinIO session is valid
      cy.session('minioSession', () => {
        cy.log('🌐 Visiting MinIO login page...');
        cy.visit(`${minioUrl}`, { failOnStatusCode: false });
        cy.performMinioLogin('minio', 'minio123');
        cy.log('🔍 Waiting for MinIO dashboard...');
        cy.contains('Buckets', { timeout: 10000 }).should('exist');
      }, {
        validate: () => {
          cy.request({
            url: `${minioUrl}/api/v1/session`,
            failOnStatusCode: false
          }).its('status').should('eq', 200);
        }
      });

      // Navigate to Thanos bucket only after successful login
      cy.log('🌐 Navigating to Thanos bucket...');
      cy.visit(`${minioUrl}/browser/thanos`, {
        failOnStatusCode: false,
      });

      cy.log('⏳ Waiting for UI to render (12 seconds)...');
      cy.wait(12000);

      // --- CRITICAL FIX: Acknowledge License AFTER the UI load ---
      acknowledgeLicense();
      // ----------------------------------------------------------

      cy.screenshot('before-bucket-click');
      cy.get('div[class="ReactVirtualized__Table__row rowLine canClick  "]', { timeout: 15000 })
        .should('exist')
        .first()
        .click()
        .then(() => {
          cy.log('✅ Successfully clicked bucket row.');
        });
    }
  );
});
