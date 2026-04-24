describe('Kanban board', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('shows three columns', () => {
    cy.get('[data-testid="column-todo"]').should('exist')
    cy.get('[data-testid="column-inprogress"]').should('exist')
    cy.get('[data-testid="column-done"]').should('exist')
  })

  it('requires a task name to save', () => {
    cy.get('[data-testid="btn-add-task"]').click()
    cy.get('[data-testid="modal"]').should('be.visible')
    cy.get('[data-testid="btn-save"]').click()
    cy.get('[data-testid="title-error"]').should('contain', 'Task name is required')
  })

  it('adds a task and shows it on the board', () => {
    cy.get('[data-testid="btn-add-task"]').click()
    cy.get('[data-testid="input-title"]').type('Fix login bug')
    cy.get('[data-testid="btn-save"]').click()
    cy.get('[data-testid="modal"]').should('not.exist')
    cy.get('[data-testid="column-todo"]').should('contain', 'Fix login bug')
  })

  it.skip('persists tasks after page reload', () => {
    cy.get('[data-testid="btn-add-task"]').click()
    cy.get('[data-testid="input-title"]').type('Persistent task')
    cy.get('[data-testid="btn-save"]').click()
    cy.reload()
    cy.get('[data-testid="column-todo"]').should('contain', 'Persistent task')
  })
})
