import { saveVoteData, loadVoteData } from '../service/localstorage.js';

// Estado global dos votos
let voteData = {
    'Bulbasauro': 0,
    'Pikachu': 0,
    'Charmander': 0,
    'Squirtle': 0,
    'Eevee': 0
};

// Mapeamento de nomes da API para nomes do sistema
const apiToSystemNames = {
    'bulbasaur': 'Bulbasauro',
    'pikachu': 'Pikachu',
    'charmander': 'Charmander',
    'squirtle': 'Squirtle',
    'eevee': 'Eevee'
};

let updateUICallback = null;
let updateVotedCardCallback = null;

let userVotedCandidate = null;

export function processMessage(data) {
    try {
        // Novo formato aninhado
        if (data && Array.isArray(data.dadosAgregados)) {
            console.log("Recebido 'dadosAgregados'. Procurando por 'pokemon'...");

            // Encontra o objeto de votação dos Pokémon
            const pokemonData = data.dadosAgregados.find(item => item.type === 'pokemon');

            if (pokemonData && Array.isArray(pokemonData.lista)) {
                console.log("Dados de Pokémon encontrados. Processando a lista de votos...");
                let hasChanges = false;

                pokemonData.lista.forEach(item => {
                    const apiName = item.objectIdentifier;
                    const newTotalVotes = item.somatorio;
                    const systemName = apiToSystemNames[apiName];

                    // Verifica se o Pokémon existe no nosso sistema
                    if (systemName && voteData.hasOwnProperty(systemName)) {
                        // Verifica se o total de votos realmente mudou para evitar re-renderizações desnecessárias
                        if (voteData[systemName] !== newTotalVotes) {
                            console.log(`Atualizando votos para ${systemName} (${apiName}): de ${voteData[systemName]} para ${newTotalVotes}`);
                            voteData[systemName] = newTotalVotes;
                            hasChanges = true;
                        }
                    } else {
                        // Ignora Pokémon que não fazem parte da nossa votação
                        console.warn(`Pokémon da lista ('${apiName}') não faz parte desta enquete e será ignorado.`);
                    }
                });

                if (hasChanges) {
                    console.log('Dados de votação atualizados:', voteData);
                    // Salva os dados no localStorage
                    saveVoteData(voteData);
                    
                    if (updateUICallback) {
                        updateUICallback(voteData);
                    }
                    if (updateVotedCardCallback && userVotedCandidate) {
                        updateVotedCardCallback(userVotedCandidate, voteData);
                    }
                } else {
                    console.log('Nenhuma mudança detectada nos totais de votos para "pokemon".');
                }
            } else {
                 console.log("Nenhum dado para 'pokemon' encontrado na mensagem.");
            }
        }
        // Mantém o formato antigo para compatibilidade com testes manuais
        else if (data.type === 'Iot' && data.object && data.valor !== undefined) {
            const candidate = apiToSystemNames[data.object];
            
            if (candidate) {
                voteData[candidate] += data.valor;
                console.log(`Voto (incremental de teste) recebido para ${candidate}: +${data.valor} (Total: ${voteData[candidate]})`);
                // Salva os dados no localStorage
                saveVoteData(voteData);
                
                if (updateUICallback) {
                    updateUICallback(voteData);
                }
                if (updateVotedCardCallback && userVotedCandidate) {
                    updateVotedCardCallback(userVotedCandidate, voteData);
                }
            } else {
                console.warn('Pokémon de teste não encontrado:', data.object);
            }
        }
        // Lida com o formato antigo de lista plana
        else if ((data.type === 'voto' || data.type === 'iot') && Array.isArray(data.lista)) {
             console.log('Recebida lista de votos agregados (formato antigo). Processando...');
             let hasChanges = false;
 
             data.lista.forEach(item => {
                 const apiName = item.objectIdentifier;
                 const newTotalVotes = item.somatorio;
                 const systemName = apiToSystemNames[apiName];
 
                 if (systemName && voteData.hasOwnProperty(systemName)) {
                     if (voteData[systemName] !== newTotalVotes) {
                         console.log(`Atualizando votos para ${systemName} (${apiName}): de ${voteData[systemName]} para ${newTotalVotes}`);
                         voteData[systemName] = newTotalVotes;
                         hasChanges = true;
                     }
                 } else {
                     console.warn(`Pokémon da lista não encontrado no sistema: '${apiName}'`);
                 }
             });
 
             if (hasChanges) {
                 console.log('Dados de votação atualizados:', voteData);
                 // Salva os dados no localStorage
                 saveVoteData(voteData);
                 
                 if (updateUICallback) {
                     updateUICallback(voteData);
                 }
                 if (updateVotedCardCallback && userVotedCandidate) {
                     updateVotedCardCallback(userVotedCandidate, voteData);
                 }
             } else {
                 console.log('Nenhuma mudança detectada nos totais de votos.');
             }
        }
        else {
            console.log('Mensagem recebida, mas o formato não corresponde a nenhum dos padrões esperados:', data);
        }
    } catch (error) {
        console.error('Erro fatal ao processar mensagem:', error);
    }
}

// Função para definir o callback de atualização da UI do GraphCard
export function setUpdateUICallback(callback) {
    updateUICallback = callback;
}

// Função para definir o callback de atualização da UI do VotedCard
export function setUpdateVotedCardCallback(callback) {
    updateVotedCardCallback = callback;
}

// Função para definir o candidato votado pelo usuário
export function setUserVotedCandidate(candidate) {
    userVotedCandidate = candidate;
    // Atualizar imediatamente se houver callback
    if (updateVotedCardCallback && candidate) {
        updateVotedCardCallback(candidate, voteData);
    }
}

// Função para inicializar os dados do localStorage
export function initializeVoteData() {
    try {
        console.log('Inicializando dados de votação...');
        const savedData = loadVoteData();
        
        if (savedData && typeof savedData === 'object') {
            // Verifica se todos os Pokémon estão presentes
            const requiredPokemon = ['Bulbasauro', 'Pikachu', 'Charmander', 'Squirtle', 'Eevee'];
            const hasAllPokemon = requiredPokemon.every(pokemon => 
                savedData.hasOwnProperty(pokemon) && typeof savedData[pokemon] === 'number'
            );
            
            if (hasAllPokemon) {
                voteData = { ...savedData };
                console.log('Dados de votação inicializados do localStorage:', voteData);
                
                // Força atualização da UI se houver callbacks configurados
                if (updateUICallback) {
                    console.log('Forçando atualização da UI com dados carregados');
                    updateUICallback(voteData);
                }
                
                return true;
            } else {
                console.warn('Dados salvos incompletos, usando dados padrão');
            }
        } else {
            console.log('Nenhum dado salvo encontrado, usando dados padrão');
        }
        
        // Usa dados padrão se não houver dados válidos
        voteData = {
            'Bulbasauro': 0,
            'Pikachu': 0,
            'Charmander': 0,
            'Squirtle': 0,
            'Eevee': 0
        };
        
        console.log('Dados de votação inicializados com valores padrão:', voteData);
        return false;
        
    } catch (error) {
        console.error('Erro ao inicializar dados de votação:', error);
        
        // Em caso de erro, usa dados padrão
        voteData = {
            'Bulbasauro': 0,
            'Pikachu': 0,
            'Charmander': 0,
            'Squirtle': 0,
            'Eevee': 0
        };
        
        return false;
    }
}

// Função para obter os dados atuais de votação
export function getVoteData() {
    return { ...voteData };
}

// Função para calcular porcentagens baseadas nos votos
export function calculatePercentages() {
    const total = Object.values(voteData).reduce((sum, votes) => sum + votes, 0);
    
    if (total === 0) {
        return {
            'Bulbasauro': 0,
            'Pikachu': 0,
            'Charmander': 0,
            'Squirtle': 0,
            'Eevee': 0
        };
    }
    
    return {
        'Bulbasauro': Math.round((voteData['Bulbasauro'] / total) * 100),
        'Pikachu': Math.round((voteData['Pikachu'] / total) * 100),
        'Charmander': Math.round((voteData['Charmander'] / total) * 100),
        'Squirtle': Math.round((voteData['Squirtle'] / total) * 100),
        'Eevee': Math.round((voteData['Eevee'] / total) * 100)
    };
}

// Função para obter o total de votos
export function getTotalVotes() {
    return Object.values(voteData).reduce((sum, votes) => sum + votes, 0);
}

// Função para obter dados específicos de um candidato
export function getCandidateData(candidateName) {
    const total = getTotalVotes();
    const candidateVotes = voteData[candidateName] || 0;
    const percentage = total > 0 ? Math.round((candidateVotes / total) * 100) : 0;
    
    return {
        votes: candidateVotes,
        percentage: percentage,
        totalVotes: total
    };
} 