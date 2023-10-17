describe('Basic thanos', function() {
    it('Visits the Thanos home page', function() {
      cy.visit(Cypress.env('thanos_url'))
      cy.task('log', 'skipping sso test...')
      cy.get('body').then(($body) => {
        if ($body.find('input[name="user"]').length != 0) {
          cy.task('log', 'detected login page, logging in with static username and password...')
          cy.get('input[name="user"]')
            .type('admin')
          cy.get('input[name="password"]')
            .type('prom-operator')
          cy.contains("Log in").click()
          cy.get('.page-dashboard')
          cy.task('log', 'app homepage has loaded successfully...')
        }
      })
      cy.wait(200)
      cy.get('div[class="cm-line"]')
        .type('kube_node_info{}')
  
      // Run a simple query
      cy.get('button[class="execute-btn btn btn-primary"]')
        .click({waitForAnimations: false})

      // An integration test with monitoring.prometheus
      if (Cypress.env('prometheus_integration_enabled')) {
        // Check Targets -- these are populated from the prometheus server
        cy.wait(1000)
        cy.visit(`${Cypress.env('thanos_url')}/targets`)
        cy.get('button[class="all btn btn-primary active"]').click()
        cy.get('button[class="btn btn-primary btn-xs"]').parent().contains(/monitoring\/.+-prometheus\/0/)  
        cy.get('button[class="btn btn-primary btn-xs"]').parent().contains(/monitoring\/.+-thanos-sidecar\/0/)
      }  
    })
})
