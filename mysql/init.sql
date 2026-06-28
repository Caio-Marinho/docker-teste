CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    data_nacimento DATE,
    idade INT,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT,
    status_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE SET NULL
);

-- --- DADOS INICIAIS (SEED DATA) ---

-- 1. Departamentos
INSERT INTO departments (name) VALUES 
('Tecnologia'), 
('RH'), 
('Vendas'),
('Marketing'),
('Logística'),
('Financeiro'),
('Jurídico');

-- 2. Status
INSERT INTO statuses (name) VALUES 
('Pendente'), 
('Em Andamento'), 
('Concluído'), 
('Aguardando Revisão');

-- 3. Usuários
INSERT INTO users (name, email, data_nacimento, idade, department_id) VALUES 
('João Silva', 'joao@exemplo.com', '1990-05-15', 34, 1),
('Maria Souza', 'maria@exemplo.com', '1995-08-20', 28, 2),
('Carlos Oliveira', 'carlos@exemplo.com', '1988-11-10', 35, 3),
('Ana Costa', 'ana.costa@empresa.com', '1992-03-12', 32, 4),
('Pedro Santos', 'pedro.santos@empresa.com', '1985-07-25', 39, 5),
('Juliana Lima', 'juliana.lima@empresa.com', '1998-12-05', 25, 6),
('Roberto Dias', 'roberto.dias@empresa.com', '1980-01-30', 44, 7),
('Camila Rocha', 'camila.rocha@empresa.com', '1994-06-18', 30, 1);

-- 4. Atividades (Tasks)
INSERT INTO tasks (title, description, user_id, status_id) VALUES 
('Configurar Servidor', 'Instalar dependências e configurar Nginx', 1, 2),
('Entrevista Candidatos', 'Realizar triagem de currículos para vaga de dev', 2, 1),
('Reunião Mensal', 'Alinhar metas de vendas do trimestre', 3, 3),
('Campanha de Inverno', 'Lançamento da nova campanha nas redes sociais', 4, 2),
('Auditoria de Estoque', 'Conferência física dos itens do armazém central', 5, 1),
('Fechamento Mensal', 'Preparação do relatório de DRE de junho', 6, 4),
('Revisão de Contrato', 'Análise das cláusulas do novo fornecedor de nuvem', 7, 2),
('Refatoração de API', 'Migração dos endpoints de usuários para Python 3.13', 8, 1),
('Treinamento Interno', 'Workshop de boas práticas em segurança da informação', 1, 4),
('Pesquisa de Satisfação', 'Enviar formulário para clientes da base ativa', 4, 1);
