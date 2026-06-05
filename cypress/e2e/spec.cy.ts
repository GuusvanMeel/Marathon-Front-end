function login() {

    cy.get('input[type="email"]').type('test@test.com')
    cy.get('input[type="password"]').type('test123')
    cy.get('button[type="submit"]').click()
    cy.contains('Logout').should('exist')


}

describe('Authentication', () => {
  it('redirects unauthenticated users to login', () => {
    cy.visit('http://localhost:5173/')

    cy.url().should('include', '/login')
    cy.get('body').should('not.contain', 'Logout')
  })
  it('logs in with a user', () => {
    cy.visit('http://localhost:5173/')
    login();

    cy.url().should('eq', 'http://localhost:5173/')
  })
  it('logs the user out', () => {
    cy.visit('http://localhost:5173/')
    login();
    cy.contains('Logout').click();
    cy.url().should('contain', '/login')
  })
})

describe('Trainingplans', () => {
  it('Go to trainingplans page', () => {

    cy.visit('http://localhost:5173/')
    login();
    cy.get('nav').contains('Training Plans').click()

    cy.url().should('include', '/trainingplans')
  })
  it('Load the trainingplans', () => {
    cy.visit('http://localhost:5173/')
    login();

    cy.get('nav').contains('Training Plans').click()

    cy.url().should('include', '/trainingplans')
    cy.contains('Refresh Data').click();
    cy.contains('Amsterdam Marathon').should('exist')
    cy.contains('Goal Race').should('exist')
    cy.contains('Overall Completion').should('exist')
    cy.contains('Create item for today').should('exist')
    cy.contains('Open Full Plan').should('exist')

  })
})
