import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletar dados existentes (em ordem reversa das foreign keys)
  await knex('expenses').del();
  await knex('revenues').del();
  await knex('categories').del();
  await knex('users').del();

  // Criar usuários de teste
  const passwordHash = await bcrypt.hash('12345678', 10);
  const passwordHash2 = await bcrypt.hash('senha123', 10);
  const passwordHash3 = await bcrypt.hash('teste123', 10);

  const users = await knex('users')
    .insert([
      {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'maria@teste.com',
        name: 'Maria Silva',
        password_hash: passwordHash,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        email: 'joao@teste.com',
        name: 'João Santos',
        password_hash: passwordHash2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        email: 'ana@teste.com',
        name: 'Ana Costa',
        password_hash: passwordHash3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
    .returning('id');

  const mariaId = users[0].id;
  const joaoId = users[1].id;
  const anaId = users[2].id;

  // Criar categorias para Maria
  const mariaCategories = await knex('categories')
    .insert([
      {
        id: '10000000-0000-0000-0000-000000000001',
        user_id: mariaId,
        name: 'Alimentação',
        budget_max: 1500.00,
        color: '#FF6B6B',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '10000000-0000-0000-0000-000000000002',
        user_id: mariaId,
        name: 'Transporte',
        budget_max: 800.00,
        color: '#4ECDC4',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '10000000-0000-0000-0000-000000000003',
        user_id: mariaId,
        name: 'Lazer',
        budget_max: 500.00,
        color: '#95E1D3',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '10000000-0000-0000-0000-000000000004',
        user_id: mariaId,
        name: 'Saúde',
        budget_max: 600.00,
        color: '#F38181',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
    .returning('id');

  // Criar categorias para João
  const joaoCategories = await knex('categories')
    .insert([
      {
        id: '20000000-0000-0000-0000-000000000001',
        user_id: joaoId,
        name: 'Alimentação',
        budget_max: 2000.00,
        color: '#FF6B6B',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '20000000-0000-0000-0000-000000000002',
        user_id: joaoId,
        name: 'Moradia',
        budget_max: 3000.00,
        color: '#4ECDC4',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '20000000-0000-0000-0000-000000000003',
        user_id: joaoId,
        name: 'Educação',
        budget_max: 1000.00,
        color: '#95E1D3',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
    .returning('id');

  // Criar categorias para Ana
  const anaCategories = await knex('categories')
    .insert([
      {
        id: '30000000-0000-0000-0000-000000000001',
        user_id: anaId,
        name: 'Alimentação',
        budget_max: 1200.00,
        color: '#FF6B6B',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '30000000-0000-0000-0000-000000000002',
        user_id: anaId,
        name: 'Vestuário',
        budget_max: 800.00,
        color: '#4ECDC4',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
    .returning('id');

  // Criar receitas para Maria
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  await knex('revenues').insert([
    {
      id: '40000000-0000-0000-0000-000000000001',
      user_id: mariaId,
      name: 'Salário',
      amount: 5000.00,
      date: thisMonth.toISOString().split('T')[0],
      notes: 'Salário mensal',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '40000000-0000-0000-0000-000000000002',
      user_id: mariaId,
      name: 'Freelance',
      amount: 1500.00,
      date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Projeto de design',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '40000000-0000-0000-0000-000000000003',
      user_id: mariaId,
      name: 'Salário',
      amount: 5000.00,
      date: lastMonth.toISOString().split('T')[0],
      notes: 'Salário do mês anterior',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar receitas para João
  await knex('revenues').insert([
    {
      id: '50000000-0000-0000-0000-000000000001',
      user_id: joaoId,
      name: 'Salário',
      amount: 8000.00,
      date: thisMonth.toISOString().split('T')[0],
      notes: 'Salário mensal',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '50000000-0000-0000-0000-000000000002',
      user_id: joaoId,
      name: 'Investimentos',
      amount: 500.00,
      date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Dividendos',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar receitas para Ana
  await knex('revenues').insert([
    {
      id: '60000000-0000-0000-0000-000000000001',
      user_id: anaId,
      name: 'Salário',
      amount: 3500.00,
      date: thisMonth.toISOString().split('T')[0],
      notes: 'Salário mensal',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar despesas para Maria
  await knex('expenses').insert([
    {
      id: '70000000-0000-0000-0000-000000000001',
      user_id: mariaId,
      category_id: mariaCategories[0].id,
      name: 'Supermercado',
      amount: 450.00,
      date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Compra do mês',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '70000000-0000-0000-0000-000000000002',
      user_id: mariaId,
      category_id: mariaCategories[0].id,
      name: 'Restaurante',
      amount: 120.00,
      date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Jantar com amigos',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '70000000-0000-0000-0000-000000000003',
      user_id: mariaId,
      category_id: mariaCategories[1].id,
      name: 'Uber',
      amount: 35.00,
      date: today.toISOString().split('T')[0],
      notes: 'Viagem para o trabalho',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '70000000-0000-0000-0000-000000000004',
      user_id: mariaId,
      category_id: mariaCategories[2].id,
      name: 'Cinema',
      amount: 50.00,
      date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Ingressos',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '70000000-0000-0000-0000-000000000005',
      user_id: mariaId,
      category_id: mariaCategories[3].id,
      name: 'Consulta Médica',
      amount: 200.00,
      date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Check-up anual',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar despesas para João
  await knex('expenses').insert([
    {
      id: '80000000-0000-0000-0000-000000000001',
      user_id: joaoId,
      category_id: joaoCategories[0].id,
      name: 'Supermercado',
      amount: 650.00,
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Compra do mês',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '80000000-0000-0000-0000-000000000002',
      user_id: joaoId,
      category_id: joaoCategories[1].id,
      name: 'Aluguel',
      amount: 2500.00,
      date: thisMonth.toISOString().split('T')[0],
      notes: 'Aluguel do apartamento',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '80000000-0000-0000-0000-000000000003',
      user_id: joaoId,
      category_id: joaoCategories[2].id,
      name: 'Curso Online',
      amount: 299.00,
      date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Curso de programação',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar despesas para Ana
  await knex('expenses').insert([
    {
      id: '90000000-0000-0000-0000-000000000001',
      user_id: anaId,
      category_id: anaCategories[0].id,
      name: 'Supermercado',
      amount: 380.00,
      date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Compra do mês',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '90000000-0000-0000-0000-000000000002',
      user_id: anaId,
      category_id: anaCategories[1].id,
      name: 'Roupas',
      amount: 250.00,
      date: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Compra de roupas',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar receitas mensais para Maria
  await knex('monthly_revenues').insert([
    {
      id: '0a000000-0000-0000-0000-000000000001',
      user_id: mariaId,
      name: 'Salário',
      amount: 5000.00,
      day_of_month: 5,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0a000000-0000-0000-0000-000000000002',
      user_id: mariaId,
      name: 'Aluguel Recebido',
      amount: 1200.00,
      day_of_month: 10,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar receitas mensais para João
  await knex('monthly_revenues').insert([
    {
      id: '0b000000-0000-0000-0000-000000000001',
      user_id: joaoId,
      name: 'Salário',
      amount: 8000.00,
      day_of_month: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar despesas mensais para Maria
  await knex('monthly_expenses').insert([
    {
      id: '0c000000-0000-0000-0000-000000000001',
      user_id: mariaId,
      name: 'Aluguel',
      amount: 1500.00,
      day_of_month: 5,
      cancellation_link: 'https://example.com/cancelar-aluguel',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0c000000-0000-0000-0000-000000000002',
      user_id: mariaId,
      name: 'Netflix',
      amount: 45.90,
      day_of_month: 15,
      cancellation_link: 'https://www.netflix.com/cancelplan',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0c000000-0000-0000-0000-000000000003',
      user_id: mariaId,
      name: 'Academia',
      amount: 120.00,
      day_of_month: 10,
      cancellation_link: 'https://example.com/cancelar-academia',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar despesas mensais para João
  await knex('monthly_expenses').insert([
    {
      id: '0d000000-0000-0000-0000-000000000001',
      user_id: joaoId,
      name: 'Aluguel',
      amount: 2500.00,
      day_of_month: 1,
      cancellation_link: 'https://example.com/cancelar-aluguel',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0d000000-0000-0000-0000-000000000002',
      user_id: joaoId,
      name: 'Spotify',
      amount: 19.90,
      day_of_month: 20,
      cancellation_link: 'https://www.spotify.com/account/subscription',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar despesas mensais para Ana
  await knex('monthly_expenses').insert([
    {
      id: '0e000000-0000-0000-0000-000000000001',
      user_id: anaId,
      name: 'Aluguel',
      amount: 1000.00,
      day_of_month: 5,
      cancellation_link: 'https://example.com/cancelar-aluguel',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar despesas de simulação para Maria
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const nextMonthPlus3 = new Date(today.getFullYear(), today.getMonth() + 3, 1);
  
  await knex('simulation_expenses').insert([
    {
      id: '0f000000-0000-0000-0000-000000000001',
      user_id: mariaId,
      name: 'Viagem de Férias',
      amount: 3000.00,
      date: nextMonth.toISOString().split('T')[0],
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0f000000-0000-0000-0000-000000000002',
      user_id: mariaId,
      name: 'Curso de Inglês',
      amount: 500.00,
      date: nextMonth.toISOString().split('T')[0],
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar receitas de simulação para Maria
  await knex('simulation_revenues').insert([
    {
      id: '10000000-0000-0000-0000-000000000001',
      user_id: mariaId,
      name: 'Bônus Anual',
      amount: 2000.00,
      date: nextMonthPlus3.toISOString().split('T')[0],
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar compras no crédito de simulação para Maria
  await knex('simulation_credit_purchases').insert([
    {
      id: '11000000-0000-0000-0000-000000000001',
      user_id: mariaId,
      name: 'Notebook',
      amount: 3500.00,
      installments: 12,
      purchase_date: nextMonth.toISOString().split('T')[0],
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar desejos para Maria
  await knex('wishes').insert([
    {
      id: '12000000-0000-0000-0000-000000000001',
      user_id: mariaId,
      name: 'iPhone 15 Pro',
      purchase_link: 'https://www.apple.com/br/iphone-15-pro',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '12000000-0000-0000-0000-000000000002',
      user_id: mariaId,
      name: 'Viagem para Europa',
      purchase_link: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '12000000-0000-0000-0000-000000000003',
      user_id: mariaId,
      name: 'Smart TV 55"',
      purchase_link: 'https://example.com/smart-tv-55',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar desejos para João
  await knex('wishes').insert([
    {
      id: '13000000-0000-0000-0000-000000000001',
      user_id: joaoId,
      name: 'PlayStation 5',
      purchase_link: 'https://www.playstation.com/pt-br/ps5',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '13000000-0000-0000-0000-000000000002',
      user_id: joaoId,
      name: 'Monitor 4K',
      purchase_link: 'https://example.com/monitor-4k',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar itens da lista de compras para Maria
  await knex('shopping_list_items').insert([
    {
      id: '14000000-0000-0000-0000-000000000001',
      user_id: mariaId,
      name: 'Leite',
      price: 5.50,
      is_purchased: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '14000000-0000-0000-0000-000000000002',
      user_id: mariaId,
      name: 'Pão',
      price: 8.00,
      is_purchased: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '14000000-0000-0000-0000-000000000003',
      user_id: mariaId,
      name: 'Ovos',
      price: 12.00,
      is_purchased: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '14000000-0000-0000-0000-000000000004',
      user_id: mariaId,
      name: 'Arroz',
      price: 25.00,
      is_purchased: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '14000000-0000-0000-0000-000000000005',
      user_id: mariaId,
      name: 'Feijão',
      price: 8.50,
      is_purchased: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar itens da lista de compras para João
  await knex('shopping_list_items').insert([
    {
      id: '15000000-0000-0000-0000-000000000001',
      user_id: joaoId,
      name: 'Café',
      price: 15.00,
      is_purchased: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '15000000-0000-0000-0000-000000000002',
      user_id: joaoId,
      name: 'Açúcar',
      price: 4.50,
      is_purchased: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar mais receitas para Maria
  await knex('revenues').insert([
    {
      id: '40000000-0000-0000-0000-000000000004',
      user_id: mariaId,
      name: 'Venda de Produtos',
      amount: 800.00,
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Venda online',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '40000000-0000-0000-0000-000000000005',
      user_id: mariaId,
      name: 'Reembolso',
      amount: 150.00,
      date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Reembolso de compra',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Criar mais despesas para Maria
  await knex('expenses').insert([
    {
      id: '70000000-0000-0000-0000-000000000006',
      user_id: mariaId,
      category_id: mariaCategories[0].id,
      name: 'Padaria',
      amount: 45.00,
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Pão e doces',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '70000000-0000-0000-0000-000000000007',
      user_id: mariaId,
      category_id: mariaCategories[1].id,
      name: 'Combustível',
      amount: 200.00,
      date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Abastecimento',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Adicionar despesas para gerar notificações de orçamento
  // Categoria "Lazer" de Maria tem orçamento de 500.00
  // Vamos adicionar despesas que ultrapassem 80% (400.00) e até 100% (500.00)
  await knex('expenses').insert([
    {
      id: '70000000-0000-0000-0000-000000000008',
      user_id: mariaId,
      category_id: mariaCategories[2].id, // Lazer - orçamento 500.00
      name: 'Show de Música',
      amount: 350.00, // Total será 400.00 (80% do orçamento)
      date: thisMonth.toISOString().split('T')[0],
      notes: 'Ingresso para show',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '70000000-0000-0000-0000-000000000009',
      user_id: mariaId,
      category_id: mariaCategories[3].id, // Saúde - orçamento 600.00
      name: 'Plano de Saúde',
      amount: 500.00, // Total será 700.00 (excede o orçamento de 600.00)
      date: thisMonth.toISOString().split('T')[0],
      notes: 'Mensalidade do plano',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Adicionar mais despesas para gerar notificações de orçamento para Maria
  // Categoria "Alimentação" tem orçamento de 1500.00, já tem 570.00 gastos (450 + 120)
  await knex('expenses').insert([
    {
      id: '70000000-0000-0000-0000-000000000010',
      user_id: mariaId,
      category_id: mariaCategories[0].id, // Alimentação - orçamento 1500.00
      name: 'Feira Semanal',
      amount: 680.00, // Total será 1250.00 (83% do orçamento - warning)
      date: thisMonth.toISOString().split('T')[0],
      notes: 'Compra semanal de frutas e verduras',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '70000000-0000-0000-0000-000000000011',
      user_id: mariaId,
      category_id: mariaCategories[1].id, // Transporte - orçamento 800.00, já tem 235.00
      name: 'Manutenção do Carro',
      amount: 420.00, // Total será 655.00 (82% do orçamento - warning)
      date: thisMonth.toISOString().split('T')[0],
      notes: 'Revisão e troca de óleo',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Adicionar despesas para gerar notificações de orçamento para João
  // joaoCategories[0] = Alimentação (orçamento 2000.00, já tem 650.00)
  // joaoCategories[2] = Educação (orçamento 1000.00, já tem 299.00)
  await knex('expenses').insert([
    {
      id: '80000000-0000-0000-0000-000000000004',
      user_id: joaoId,
      category_id: joaoCategories[0].id, // Alimentação - orçamento 2000.00, já tem 650.00
      name: 'Restaurante Premium',
      amount: 1000.00, // Total será 1650.00 (82.5% do orçamento - warning)
      date: thisMonth.toISOString().split('T')[0],
      notes: 'Jantar em restaurante chique',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '80000000-0000-0000-0000-000000000005',
      user_id: joaoId,
      category_id: joaoCategories[2].id, // Educação - orçamento 1000.00, já tem 299.00
      name: 'Curso Avançado',
      amount: 550.00, // Total será 849.00 (84.9% do orçamento - warning)
      date: thisMonth.toISOString().split('T')[0],
      notes: 'Curso de especialização',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Adicionar despesas mensais com dias próximos para gerar notificações
  const currentDay = today.getDate();
  const tomorrow = currentDay + 1;
  const dayAfterTomorrow = currentDay + 2;
  const inThreeDays = currentDay + 3;

  await knex('monthly_expenses').insert([
    {
      id: '0c000000-0000-0000-0000-000000000004',
      user_id: mariaId,
      name: 'Conta de Luz',
      amount: 150.00,
      day_of_month: currentDay <= 28 ? currentDay : 28, // Hoje ou último dia do mês
      cancellation_link: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0c000000-0000-0000-0000-000000000005',
      user_id: mariaId,
      name: 'Internet',
      amount: 99.90,
      day_of_month: tomorrow <= 31 ? tomorrow : 31, // Amanhã ou último dia do mês
      cancellation_link: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0c000000-0000-0000-0000-000000000006',
      user_id: mariaId,
      name: 'Telefone',
      amount: 79.90,
      day_of_month: dayAfterTomorrow <= 31 ? dayAfterTomorrow : 31, // Em 2 dias
      cancellation_link: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0c000000-0000-0000-0000-000000000007',
      user_id: mariaId,
      name: 'Streaming Premium',
      amount: 29.90,
      day_of_month: inThreeDays <= 31 ? inThreeDays : 31, // Em 3 dias
      cancellation_link: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0c000000-0000-0000-0000-000000000008',
      user_id: mariaId,
      name: 'Seguro do Carro',
      amount: 250.00,
      day_of_month: currentDay <= 28 ? currentDay : 28, // Hoje
      cancellation_link: 'https://example.com/cancelar-seguro',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0c000000-0000-0000-0000-000000000009',
      user_id: mariaId,
      name: 'Plano de Saúde',
      amount: 350.00,
      day_of_month: tomorrow <= 31 ? tomorrow : 31, // Amanhã
      cancellation_link: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0c000000-0000-0000-0000-000000000010',
      user_id: mariaId,
      name: 'Academia Premium',
      amount: 180.00,
      day_of_month: dayAfterTomorrow <= 31 ? dayAfterTomorrow : 31, // Em 2 dias
      cancellation_link: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Adicionar despesas mensais para João com dias próximos
  await knex('monthly_expenses').insert([
    {
      id: '0d000000-0000-0000-0000-000000000003',
      user_id: joaoId,
      name: 'Condomínio',
      amount: 450.00,
      day_of_month: currentDay <= 28 ? currentDay : 28, // Hoje
      cancellation_link: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0d000000-0000-0000-0000-000000000004',
      user_id: joaoId,
      name: 'IPTU',
      amount: 320.00,
      day_of_month: tomorrow <= 31 ? tomorrow : 31, // Amanhã
      cancellation_link: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0d000000-0000-0000-0000-000000000005',
      user_id: joaoId,
      name: 'Seguro Residencial',
      amount: 150.00,
      day_of_month: dayAfterTomorrow <= 31 ? dayAfterTomorrow : 31, // Em 2 dias
      cancellation_link: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0d000000-0000-0000-0000-000000000006',
      user_id: joaoId,
      name: 'Assinatura de Software',
      amount: 89.90,
      day_of_month: inThreeDays <= 31 ? inThreeDays : 31, // Em 3 dias
      cancellation_link: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Adicionar despesas mensais para Ana com dias próximos
  await knex('monthly_expenses').insert([
    {
      id: '0e000000-0000-0000-0000-000000000002',
      user_id: anaId,
      name: 'Conta de Água',
      amount: 85.00,
      day_of_month: currentDay <= 28 ? currentDay : 28, // Hoje
      cancellation_link: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0e000000-0000-0000-0000-000000000003',
      user_id: anaId,
      name: 'Gás',
      amount: 65.00,
      day_of_month: tomorrow <= 31 ? tomorrow : 31, // Amanhã
      cancellation_link: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '0e000000-0000-0000-0000-000000000004',
      user_id: anaId,
      name: 'Assinatura de Revistas',
      amount: 45.00,
      day_of_month: dayAfterTomorrow <= 31 ? dayAfterTomorrow : 31, // Em 2 dias
      cancellation_link: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Adicionar mais despesas para Ana gerar notificações de orçamento
  // anaCategories[0] = Alimentação (orçamento 1200.00, já tem 380.00)
  // anaCategories[1] = Vestuário (orçamento 800.00, já tem 250.00)
  await knex('expenses').insert([
    {
      id: '90000000-0000-0000-0000-000000000003',
      user_id: anaId,
      category_id: anaCategories[0].id, // Alimentação - orçamento 1200.00, já tem 380.00
      name: 'Mercado Mensal',
      amount: 600.00, // Total será 980.00 (81.7% do orçamento - warning)
      date: thisMonth.toISOString().split('T')[0],
      notes: 'Compra mensal completa',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '90000000-0000-0000-0000-000000000004',
      user_id: anaId,
      category_id: anaCategories[1].id, // Vestuário - orçamento 800.00, já tem 250.00
      name: 'Roupas de Inverno',
      amount: 400.00, // Total será 650.00 (81.25% do orçamento - warning)
      date: thisMonth.toISOString().split('T')[0],
      notes: 'Compra de roupas para o inverno',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

