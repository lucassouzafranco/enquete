# 🗳️ Sistema de Votação Distribuído

Este projeto, desenvolvido por alunos da **Universidade Federal de Viçosa (UFV)**, implementa um **Sistema de Votação Distribuído** utilizando conceitos modernos de **Sistemas Distribuídos**, mensageria e orquestração de contêineres com Docker Swarm. Ele tem como objetivo simular um ambiente escalável de coleta, agregação e armazenamento de votos em uma infraestrutura distribuída.

---

## 📐 Arquitetura do Sistema

A arquitetura completa do sistema está representada no seguinte diagrama:

📷 **[Ver imagem da arquitetura](./arquitetura.png)** 


### Componentes:

* **Frontend (Interface Web)**:

  * Desenvolvido por **INTEGRANTE 1** e **INTEGRANTE 2**.
  * Disponível online via Vercel: [https://enquete-jade.vercel.app/](https://enquete-jade.vercel.app/)
  * Esta aplicação permite ao usuário final interagir com o sistema e registrar votos.

* **Urna API**:

  * Principal ponto de entrada para o sistema.
  * Expõe uma API REST que recebe os votos e os publica em uma fila RabbitMQ.
  * Está em execução sob **Docker Swarm** com **4 réplicas**, garantindo alta disponibilidade e escalabilidade.

* **Agregador**:

  * Funciona como um **nó intermediário distribuído**.
  * Consome os votos da fila RabbitMQ, processa/valida os dados e os envia ao nó central (`core`).
  * O script `muitos.sh` pode ser usado para simular a carga, enviando múltiplos votos ao core.
  * Arquivos importantes:

    * `consume.py`, `send_to_core.py`: lógica principal de consumo e envio.

* **Core**:

  * Nó central e único responsável pelo armazenamento definitivo dos votos.
  * Compartilhado por múltiplos grupos.
  * O link para este repositório será adicionado em breve.

* **RabbitMQ (Broker de Mensagens)**:

  * Responsável por fazer o desacoplamento entre a recepção e o processamento dos votos.
  * Contêiner independente orquestrado pelo `docker-compose`.

---

## 🚀 Como Executar

### Pré-requisitos

* Docker
* Docker Compose
* (Opcional) Docker Swarm, caso queira replicar o comportamento escalável da `urna_api`

### Execução com Docker Compose

A partir do diretório raiz, execute:

```bash
sudo docker-compose up --build
```

Isso irá levantar:

* RabbitMQ
* API da urna (backend)
* Agregador

---

## 📁 Estrutura do Projeto

```
├── agregador
│   ├── agregador.py
│   ├── consume.py
│   ├── send_to_core.py
│   ├── muitos.sh             # Script para envio massivo de votos
│   └── database/
│       └── Dockerfile
│
├── broker/
│   └── rabbitmq_setup.sh     # Configuração inicial do RabbitMQ
│
└── urna/
    ├── publish.py            # Envio de mensagens à fila
    ├── urna_api.py           # API principal em Flask
    └── Dockerfile
```

---

## 💻 Frontend (Interface Web)

A aplicação web que permite aos eleitores registrar seus votos está disponível em:

🔗 [https://enquete-jade.vercel.app/](https://enquete-jade.vercel.app/)

Essa interface foi desenvolvida por:

* **INTEGRANTE 1**
* **INTEGRANTE 2**

---

## 🧠 Backend

A infraestrutura backend, incluindo a API da urna, o agregador e os scripts de integração com RabbitMQ e o core, foi desenvolvida por:

* **INTEGRANTE 3**
* **INTEGRANTE 4**
* **INTEGRANTE 5**



