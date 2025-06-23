#!/usr/bin/env node

const SockJS = require('sockjs-client');
const { Client } = require('@stomp/stompjs');
global.WebSocket = require('ws');

const client = new Client({
  webSocketFactory: () => new SockJS('https://agregador-node.onrender.com/ws'),
  debug: (msg) => console.log('[DEBUG]', msg),
  reconnectDelay: 5000,
  onConnect: () => {
    console.log('[INFO] Conectado!');

    client.subscribe('/topic/aggregated', (msg) => {
      try {
        const body = JSON.parse(msg.body);

        // 'dadosAgregados' é um array, vamos filtrar o objeto do tipo pokemon
        if (body.dadosAgregados && Array.isArray(body.dadosAgregados)) {
          const pokemonData = body.dadosAgregados.find(item => item.type === 'pokemon');
          if (pokemonData) {
            console.log('[POKEMON DATA]', JSON.stringify(pokemonData, null, 2));
          } else {
            console.log('[INFO] Nenhum dado do tipo "pokemon" encontrado.');
          }
        } else {
          console.log('[ERRO] dadosAgregados ausente ou não é array.');
        }

      } catch (err) {
        console.error('[ERRO JSON]', err.message);
      }
    });
  },
  onStompError: (frame) => {
    console.error('[ERRO STOMP]', frame.headers['message']);
    console.error(frame.body);
  }
});

client.activate();

