import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { processMessage } from './processMessage.js';

class WebSocketClient {
    constructor() {
        this.url = 'https://agregador-node.onrender.com/ws';
        this.topic = '/topic/aggregated';
        this.client = null;
        this._isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = Infinity; // Tentativas infinitas
        this.baseDelay = 1000; // 1 segundo inicial
        this.maxDelay = 60000; // 1 minuto máximo
        this.currentDelay = this.baseDelay;
    }

    connect() {
        try {
            console.log('Conectando ao WebSocket via SockJS:', this.url);
            
            this.client = new Client({
                webSocketFactory: () => new SockJS(this.url),
                debug: (str) => {
                    console.log('STOMP Debug:', str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });

            this.client.onConnect = (frame) => {
                console.log('SockJS/STOMP conectado com sucesso!', frame);
                this._isConnected = true;
                this.reconnectAttempts = 0;
                this.currentDelay = this.baseDelay; // Reset do delay
                
                // Inscrever no tópico
                this.subscribe();
            };

            this.client.onStompError = (frame) => {
                console.error('Erro STOMP:', frame);
                this._isConnected = false;
            };

            this.client.onWebSocketError = (error) => {
                console.error('Erro WebSocket:', error);
                this._isConnected = false;
            };

            this.client.onWebSocketClose = () => {
                console.log('Conexão WebSocket fechada');
                this._isConnected = false;
                this.handleReconnect();
            };

            this.client.activate();

        } catch (error) {
            console.error('Erro ao conectar SockJS:', error);
            this.handleReconnect();
        }
    }

    subscribe() {
        if (this.client && this.client.connected) {
            console.log('Inscrevendo no tópico:', this.topic);
            
            this.client.subscribe(this.topic, (message) => {
                try {
                    console.log('📨 === MENSAGEM RECEBIDA ===');
                    console.log('Headers:', message.headers);                    
                    const data = JSON.parse(message.body);
                    console.log(' Dados parseados:', data);
                    console.log('========================');
                    
                    processMessage(data);
                } catch (error) {
                    console.error('❌ Erro ao processar mensagem:', error);
                    console.error('📄 Conteúdo da mensagem:', message.body);
                }
            });
            
            console.log('✅ Inscrição realizada com sucesso! Aguardando mensagens...');
        }
    }

    handleReconnect() {
        this.reconnectAttempts++;
      
        if (this.currentDelay < this.maxDelay) {
            // Dobra o delay até atingir o máximo
            this.currentDelay = Math.min(this.currentDelay * 2, this.maxDelay);
        }
        // Após atingir 1 minuto, mantém o delay em 1 minuto
        
        const delayInSeconds = this.currentDelay / 1000;
        console.log(`Tentativa de reconexão ${this.reconnectAttempts} em ${delayInSeconds}s (delay atual: ${this.currentDelay}ms)`);
        
        setTimeout(() => {
            this.connect();
        }, this.currentDelay);
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this._isConnected = false;
        }
    }

    send(message) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: '/app/message',
                body: JSON.stringify(message)
            });
        } else {
            console.warn('SockJS não está conectado');
        }
    }

    getConnectionStatus() {
        return this._isConnected;
    }

    // Função simples que retorna true ou false
    isConnected() {
        return this._isConnected;
    }

    getReconnectInfo() {
        return {
            attempts: this.reconnectAttempts,
            currentDelay: this.currentDelay,
            isConnected: this._isConnected,
            url: this.url,
            topic: this.topic
        };
    }

    // Função de teste para simular mensagem do servidor
    testServerMessage(messageType = 'aggregated') {
        console.log(`🧪 Teste: Simulando mensagem do servidor (tipo: ${messageType})`);
        
        let testMessage;
        
        switch(messageType) {
            case 'aggregated':
                testMessage = {
                    candidates: [
                        {"name": "Romário", "votes": 150, "percentage": 31.7},
                        {"name": "João Silva", "votes": 89, "percentage": 18.8},
                        {"name": "Maria Santos", "votes": 234, "percentage": 49.5}
                    ],
                    totalVotes: 473,
                    timestamp: new Date().toISOString()
                };
                break;
                
            case 'vote_update':
                testMessage = {
                    type: "vote_update",
                    candidate: "Romário",
                    newVotes: 151,
                    increment: 1,
                    timestamp: new Date().toISOString()
                };
                break;
                
            case 'stats':
                testMessage = {
                    type: "stats",
                    totalVoters: 1200,
                    participation: 85.2,
                    lastUpdate: new Date().toISOString()
                };
                break;
                
            default:
                testMessage = {
                    message: "Mensagem de teste padrão",
                    timestamp: new Date().toISOString()
                };
        }
        
        console.log('📨 Mensagem de teste:', testMessage);
        processMessage(testMessage);
        console.log('✅ Mensagem processada! Verifique o dashboard');
    }

    // Função de teste para simular conexão
    testConnect() {
        console.log('🧪 Teste: Simulando conexão...');
        this._isConnected = true;
        console.log('✅ Status de conexão definido como TRUE');
        console.log('📊 Verifique o dashboard para ver "CONECTADO"');
    }

    // Função de teste para simular desconexão
    testDisconnect() {
        console.log('🧪 Teste: Simulando desconexão...');
        this._isConnected = false;
        console.log('❌ Status de conexão definido como FALSE');
        console.log('📊 Verifique o dashboard para ver "DESCONECTADO"');
    }

    // Função de teste para simular mensagem de voto
    testVote(candidateName = 'Romário', votes = 10) {
        console.log(`🧪 Teste: Simulando voto para ${candidateName} (+${votes} votos)`);
        const testMessage = {
            type: 'Iot',
            token: 'test-token',
            object: candidateName,
            valor: votes
        };
        console.log('📨 Mensagem de teste:', testMessage);
        processMessage(testMessage);
        console.log('✅ Voto processado! Verifique o dashboard');
    }
}

// Criar instância global do cliente WebSocket
const wsClient = new WebSocketClient();

// Conectar automaticamente quando o módulo for carregado
wsClient.connect();

// Expor funções de teste globalmente para uso no console
window.testWebSocket = {
    connect: () => wsClient.testConnect(),
    disconnect: () => wsClient.testDisconnect(),
    vote: (candidate, votes) => wsClient.testVote(candidate, votes),
    serverMessage: (type) => wsClient.testServerMessage(type),
    status: () => wsClient.isConnected(),
    info: () => wsClient.getReconnectInfo()
};

export default wsClient;