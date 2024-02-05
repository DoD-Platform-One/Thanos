describe('Basic thanos', function() {

  it('Visits the Thanos home page', () => {

    cy.visit(Cypress.env('thanos_url'))
    cy.get('body').then(($body) => {
      if ($body.find('input[name="user"]').length != 0) {
        cy.get('input[name="user"]').type('admin')
        cy.get('input[name="password"]').type('prom-operator')
        cy.contains("Log in").click()
        cy.get('.page-dashboard')
      }
    })
  })

  // Run a simple query
  it('Simple Query', () => {
    cy.visit(Cypress.env('thanos_url'))    
    cy.get('div[class="cm-line"]').type('kube_node_info{}')
    cy.get('button[class="execute-btn btn btn-primary"]').click({ waitForAnimations: false })
  })

  // An integration test with monitoring.prometheus
  if (Cypress.env('prometheus_integration_enabled')) {

    it('Prometheus Integration',
      {
        retries: {
          runMode: 29,
        },
      },
      () => {
        // visit stores
        cy.visit(`${Cypress.env('thanos_url')}/stores`)
        cy.wait(1000)

        // Check Targets -- these are populated from the prometheus server
        cy.visit(`${Cypress.env('thanos_url')}/targets`)
        cy.get('button[class="all btn btn-primary active"]').click()
        cy.get('button[class="btn btn-primary btn-xs"]').parent().contains(/monitoring\/.+-prometheus\/0/)
        cy.get('button[class="btn btn-primary btn-xs"]').parent().contains(/monitoring\/.+-thanos-sidecar\/0/)
      })
  }

  // An integration test with object storage enabled
  if (Cypress.env('objstorage_integration_enabled')) {

    it('Verify Thanos Bucket',
      {
        retries: {
          runMode: 179,
        },
      },
      () => {
        // visit minio
        cy.session('minioSession', () => {
          cy.visit(`${Cypress.env('minio_url')}`)
          cy.performMinioLogin('minio', 'minio123')
        })

        // Check there is at least one entry  
        cy.visit(`${Cypress.env('minio_url')}/browser/thanos`)
        cy.get('div[class="ReactVirtualized__Table__row rowLine canClick  "]').first().click()
      })
  }


})
