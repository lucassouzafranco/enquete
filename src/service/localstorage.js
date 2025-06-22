// Chaves para o localStorage
const STORAGE_KEYS = {
    VOTE_DATA: 'pokemon_vote_data',
    LAST_UPDATE: 'pokemon_last_update'
};

// Função para salvar os dados de votação no localStorage
export const saveVoteData = (voteData) => {
    try {
        const dataToSave = {
            voteData: voteData,
            timestamp: Date.now()
        };
        
        localStorage.setItem(STORAGE_KEYS.VOTE_DATA, JSON.stringify(dataToSave));
        localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());
        
        console.log('Dados de votação salvos no localStorage:', voteData);
    } catch (error) {
        console.error('Erro ao salvar dados no localStorage:', error);
    }
};

// Função para carregar os dados de votação do localStorage
export const loadVoteData = () => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEYS.VOTE_DATA);
        
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            console.log('Dados de votação carregados do localStorage:', parsedData.voteData);
            return parsedData.voteData;
        }
        
        // Retorna dados padrão se não houver dados salvos
        return {
            'Bulbasauro': 0,
            'Pikachu': 0,
            'Charmander': 0,
            'Squirtle': 0,
            'Eevee': 0
        };
    } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
        // Retorna dados padrão em caso de erro
        return {
            'Bulbasauro': 0,
            'Pikachu': 0,
            'Charmander': 0,
            'Squirtle': 0,
            'Eevee': 0
        };
    }
};

// Função para obter o timestamp da última atualização
export const getLastUpdateTime = () => {
    try {
        const timestamp = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
        return timestamp ? parseInt(timestamp) : null;
    } catch (error) {
        console.error('Erro ao obter timestamp da última atualização:', error);
        return null;
    }
};

// Função para limpar os dados do localStorage
export const clearVoteData = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.VOTE_DATA);
        localStorage.removeItem(STORAGE_KEYS.LAST_UPDATE);
        console.log('Dados de votação removidos do localStorage');
    } catch (error) {
        console.error('Erro ao limpar dados do localStorage:', error);
    }
};

// Função para verificar se há dados salvos
export const hasSavedData = () => {
    try {
        return localStorage.getItem(STORAGE_KEYS.VOTE_DATA) !== null;
    } catch (error) {
        console.error('Erro ao verificar dados salvos:', error);
        return false;
    }
};