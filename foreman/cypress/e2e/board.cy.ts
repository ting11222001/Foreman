describe('Kanban board', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('shows three columns', () => {
    cy.get('[data-testid="column-todo"]').should('exist')         // in BoardColumn           
    cy.get('[data-testid="column-inprogress"]').should('exist')   // in BoardColumn
    cy.get('[data-testid="column-done"]').should('exist')         // in BoardColumn
  })

  it('requires a task name to save', () => {
    cy.get('[data-testid="btn-add-task"]').click()
    cy.get('[data-testid="modal"]').should('be.visible')
    cy.get('[data-testid="btn-save"]').click()
    cy.get('[data-testid="title-error"]').should('contain', 'Task name is required')
  })

  it('adds a task and shows it on the board', () => {
    cy.get('[data-testid="btn-add-task"]').click()                  // in App
    cy.get('[data-testid="input-title"]').type('Fix login bug')     // in TaskModal
    cy.get('[data-testid="btn-save"]').click()                      // in TaskModal
    cy.get('[data-testid="modal"]').should('not.exist')             // in TaskModal
    cy.get('[data-testid="column-todo"]').should('contain', 'Fix login bug') // in BoardColumn
  })

  it('opens edit modal when a card is clicked', () => {
  // First create a task
  cy.get('[data-testid="btn-add-task"]').click()          // in App
  cy.get('[data-testid="input-title"]').type('Click me')  // in TaskModal
  cy.get('[data-testid="btn-save"]').click()              // in TaskModal

  // Click the card
  cy.get('[data-testid="column-todo"] .card').first().click()   // in BoardColumn > TaskCard
  cy.get('[data-testid="modal"]').should('be.visible')          // in TaskModal
})

it('deletes a task when delete button is clicked', () => {
  cy.get('[data-testid="btn-add-task"]').click()          // in App
  cy.get('[data-testid="input-title"]').type('Delete me') // in TaskModal
  cy.get('[data-testid="btn-save"]').click()              // in TaskModal

  cy.get('[data-testid="column-todo"] .card').first()     // in BoardColumn > TaskCard
    .find('.delete-btn').click()                          // in TaskCard

  cy.get('[data-testid="column-todo"]').should('not.contain', 'Delete me')
})

  it.skip('persists tasks after page reload', () => {
    cy.get('[data-testid="btn-add-task"]').click()
    cy.get('[data-testid="input-title"]').type('Persistent task')
    cy.get('[data-testid="btn-save"]').click()
    cy.reload()
    cy.get('[data-testid="column-todo"]').should('contain', 'Persistent task')
  })
})
