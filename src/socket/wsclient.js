import { processMessage } from './processMessage.js';

class WebSocketClient {
    constructor() {
        this.url = 'ws://localhost:5000/ws';
        this.socket = null;
        this._isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = Infinity; // Tentativas infinitas
        this.baseDelay = 1000; // 1 segundo inicial
        this.maxDelay = 60000; // 1 minuto máximo
        this.currentDelay = this.baseDelay;
    }

    connect() {
        try {
            console.log('Conectando ao WebSocket:', this.url);
            this.socket = new WebSocket(this.url);

            this.socket.onopen = () => {
                console.log('WebSocket conectado com sucesso!');
                this._isConnected = true;
                this.reconnectAttempts = 0;
                this.currentDelay = this.baseDelay; // Reset do delay
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('Mensagem recebida:', data);
                    processMessage(data);
                } catch (error) {
                    console.error('Erro ao processar mensagem:', error);
                }
            };

            this.socket.onclose = (event) => {
                console.log('WebSocket desconectado:', event.code, event.reason);
                this._isConnected = false;
                this.handleReconnect();
            };

            this.socket.onerror = (error) => {
                console.error('Erro no WebSocket:', error);
                this._isConnected = false;
            };

        } catch (error) {
            console.error('Erro ao conectar WebSocket:', error);
            this.handleReconnect();
        }
    }

    handleReconnect() {
        this.reconnectAttempts++;
        
        // Calcular delay com backoff exponencial
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
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this._isConnected = false;
        }
    }

    send(message) {
        if (this.socket && this._isConnected) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket não está conectado');
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
            isConnected: this._isConnected
        };
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
    status: () => wsClient.isConnected(),
    info: () => wsClient.getReconnectInfo()
};

export default wsClient;