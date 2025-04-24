-- Supabase não usa CREATE DATABASE dessa forma, pois cada projeto já vem com um banco criado.
-- Portanto, ignoramos "CREATE DATABASE" e "USE".

-- Tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo TEXT CHECK (tipo IN ('admin', 'editor', 'usuario')) DEFAULT 'usuario',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de notícias
CREATE TABLE noticias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    resumo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    imagem VARCHAR(255),
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    autor_id INTEGER REFERENCES usuarios(id),
    categoria VARCHAR(50)
);

-- Tabela de jogadoras
CREATE TABLE jogadoras (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    apelido VARCHAR(50),
    data_nascimento DATE,
    posicao VARCHAR(50),
    clube_atual VARCHAR(100),
    biografia TEXT,
    imagem VARCHAR(255),
    destaque BOOLEAN DEFAULT FALSE
);

-- Tabela de clubes
CREATE TABLE clubes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    fundacao DATE,
    estadio VARCHAR(100),
    imagem VARCHAR(255)
);

-- Tabela de competições
CREATE TABLE competicoes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo TEXT CHECK (tipo IN ('nacional', 'internacional', 'estadual')) NOT NULL,
    temporada VARCHAR(20) NOT NULL,
    data_inicio DATE,
    data_fim DATE,
    descricao TEXT
);

-- Tabela de artigos acadêmicos
CREATE TABLE artigos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    instituicao VARCHAR(100),
    resumo TEXT NOT NULL,
    link VARCHAR(255) NOT NULL,
    data_publicacao DATE,
    palavras_chave VARCHAR(255)
);

-- Tabela de eventos
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    data_evento TIMESTAMP NOT NULL,
    local VARCHAR(255) NOT NULL,
    imagem VARCHAR(255),
    link_inscricao VARCHAR(255)
);

-- Tabela de galeria de fotos
CREATE TABLE galeria (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    imagem VARCHAR(255) NOT NULL,
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    categoria VARCHAR(50)
);