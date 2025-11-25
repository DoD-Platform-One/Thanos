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

describe('Basic thanos', function() {

  it('Visits the Thanos home page', () => {
    cy.log('🌐 Visiting Thanos home page...');
    cy.visit(Cypress.env('thanos_url'), { failOnStatusCode: false });

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
  it('Simple Query', () => {
    cy.log('🌐 Opening Thanos URL for Simple Query...');
    cy.visit(Cypress.env('thanos_url'), { failOnStatusCode: false });

    cy.log('⌨️ Typing query: kube_node_info{}');
    cy.get('div[class="cm-line"]').type('kube_node_info{}');
    cy.get('button[class="execute-btn btn btn-primary"]').click({ waitForAnimations: false });
  });

  // An integration test with monitoring.prometheus
  if (Cypress.env('prometheus_integration_enabled')) {
    it('Prometheus Integration',
      {
        retries: {
          runMode: 10, // Reduced from 29 for faster pipeline
        },
      },
      () => {
        cy.log('🌐 Opening Prometheus integration pages...');
        cy.visit(`${Cypress.env('thanos_url')}/stores`, { failOnStatusCode: false });
        cy.wait(1000);

        cy.visit(`${Cypress.env('thanos_url')}/targets`, { failOnStatusCode: false });
        cy.get('button[class="all btn btn-primary active"]').click();
        cy.get('button[class="btn btn-primary btn-xs"]')
          .parent()
          .contains(/monitoring\/.+-prometheus\/0/);
        cy.get('button[class="btn btn-primary btn-xs"]')
          .parent()
          .contains(/monitoring\/.+-thanos-sidecar\/0/);
      }
    );
  }

  // An integration test with object storage enabled
  if (Cypress.env('objstorage_integration_enabled')) {
    it('Verify Thanos Bucket',
      {
        retries: {
          runMode: 5, // Reduced retries for faster feedback
        },
      },
      () => {
        cy.log('🔄 Starting Verify Thanos Bucket test...');

        // Ensure MinIO session is valid
        cy.session('minioSession', () => {
          cy.log('🌐 Visiting MinIO login page...');
          cy.visit(`${Cypress.env('minio_url')}`, { failOnStatusCode: false });
          cy.performMinioLogin('minio', 'minio123');
          cy.log('🔍 Waiting for MinIO dashboard...');
          cy.contains('Buckets', { timeout: 10000 }).should('exist');
        }, {
          validate: () => {
            cy.request({
              url: `${Cypress.env('minio_url')}/api/v1/session`,
              failOnStatusCode: false
            }).its('status').should('eq', 200);
          }
        });

        // Navigate to Thanos bucket only after successful login
        cy.log('🌐 Navigating to Thanos bucket...');
        cy.visit(`${Cypress.env('minio_url')}/browser/thanos`, {
          failOnStatusCode: false,
        });

        cy.log('⏳ Waiting for UI to render (12 seconds)...');
        cy.wait(12000);

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
  }

});