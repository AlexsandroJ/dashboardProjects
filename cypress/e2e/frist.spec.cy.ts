describe('Página Inicial', () => {
  it('Deve carregar a página inicial', () => {
    cy.visit('/'); // Substitua pela URL da sua aplicação
    cy.contains('Dashboard'); // Verifica se o texto "Bem-vindo à página inicial" está presente
    cy.get('[data-cy=meu-botao]').click();
  });
  it('Deve clicar', () => {
    cy.visit('/');
    cy.get('[data-cy=meu-botao]').click();
  });

  it('Deve Nova Pagina', () => {
    cy.visit('/');
    cy.contains('Overview').click();
  });
});
