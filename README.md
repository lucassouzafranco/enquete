# Sistema de Votação Distribuído

Este projeto, desenvolvido por um grupo de alunos da UFV, implementa um sistema de votação que aplica conceitos de **Sistemas Distribuídos**. Ele foi projetado para demonstrar como diferentes componentes podem interagir em um ambiente distribuído para coletar, agregar e armazenar votos de forma eficiente e centralizada.

---

## Organização do Projeto

O sistema é composto pelos seguintes módulos principais:

* **`urna`**: Este é o **front-end principal** do sistema. Ele inclui:
    * Uma interface para os eleitores registrarem seus votos.
    * Um **dashboard** para monitoramento da fila de votação.
* **`agregador`**: Atuando como um **nó distribuído**, o agregador é responsável por:
    * Coletar os dados da fila de mensagens (onde os votos são inicialmente enviados).
    * Agregar esses dados.
    * Encaminhá-los para o **nó central** (`core`).
    * *O link para o repositório do nó central (core) será inserido aqui quando disponível.*
* **`core`**: Este é o **nó central** onde os votos são armazenados de forma centralizada. Ele serve como o repositório final para todos os votos, sendo compartilhado por diversos grupos que utilizam o mesmo sistema.

---

## Como Executar

Para colocar o sistema em funcionamento, siga os passos abaixo:

1.  **Pré-requisitos**: Certifique-se de ter o **Docker** e o **Docker Compose** instalados em seu ambiente.
2.  **Execução**: Navegue até o diretório raiz do projeto e execute o arquivo de orquestração `docker-compose.yml` utilizando o seguinte comando:

    ```bash
    sudo docker-compose up --build
    ```

Ao executar o comando, três contêineres serão criados e inicializados:

* Um contêiner para o sistema de mensageria (**RabbitMQ**), responsável pela comunicação entre os componentes.
* Um contêiner para o **backend da urna**, que gerencia a lógica de votação.
* Um contêiner para o **nó coletor (`agregador`)**, que processa e encaminha os votos para o nó central.

---

