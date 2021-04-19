/// <reference types="Cypress" />

context('I am on the debezium-ui homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('the header appears', () => {
    cy.get('.pf-c-page__header').find('img').should('have.attr', 'src').should('include','debezium_logo_300px')
  })
  it('Check if able to connect backend and get connectors', () => {
    cy.intercept('/api/connectors/1').as('getConnector')
    cy.wait('@getConnector', { timeout: 50000 }).its('response.statusCode').should('eq', 200)
  })
  it('Find the Create a connector button and click', () => {
    cy.get('button.pf-c-button', { timeout: 50000 }).should('be.visible').and('contain', 'Create a connector').click();
  })
})