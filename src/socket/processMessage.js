// Estado global dos votos
let voteData = {
    'Bulbasauro': 0,
    'Pikachu': 0,
    'Charmander': 0,
    'Squirtle': 0,
    'Eevee': 0
};

// Mapeamento de objetos para candidatos
const objectToCandidate = {
    'Bulbasauro': 'Bulbasauro',
    'Pikachu': 'Pikachu',
    'Charmander': 'Charmander',
    'Squirtle': 'Squirtle',
    'Eevee': 'Eevee'
};

let updateUICallback = null;
let updateVotedCardCallback = null;

let userVotedCandidate = null;

export function processMessage(data) {
    try {
        // Novo formato aninhado
        if (data && Array.isArray(data.dadosAgregados)) {
            console.log("Recebido 'dadosAgregados'. Procurando por 'votacao_teste_thales'...");

            // Encontra o objeto de votação da nossa enquete
            const ourPollData = data.dadosAgregados.find(item => item.type === 'votacao_teste_thales');

            if (ourPollData && Array.isArray(ourPollData.lista)) {
                console.log("Enquete 'votacao_teste_thales' encontrada. Processando a lista de votos...");
                let hasChanges = false;

                ourPollData.lista.forEach(item => {
                    const candidateName = item.objectIdentifier;
                    const newTotalVotes = item.somatorio;

                    // Verifica se o candidato existe no nosso sistema
                    if (voteData.hasOwnProperty(candidateName)) {
                        // Verifica se o total de votos realmente mudou para evitar re-renderizações desnecessárias
                        if (voteData[candidateName] !== newTotalVotes) {
                            console.log(`Atualizando votos para ${candidateName}: de ${voteData[candidateName]} para ${newTotalVotes}`);
                            voteData[candidateName] = newTotalVotes;
                            hasChanges = true;
                        }
                    } else {
                        // Ignora candidatos que não fazem parte da nossa votação
                        console.warn(`Candidato da lista ('${candidateName}') não faz parte desta enquete e será ignorado.`);
                    }
                });

                if (hasChanges) {
                    console.log('Dados de votação atualizados:', voteData);
                    if (updateUICallback) {
                        updateUICallback(voteData);
                    }
                    if (updateVotedCardCallback && userVotedCandidate) {
                        updateVotedCardCallback(userVotedCandidate, voteData);
                    }
                } else {
                    console.log('Nenhuma mudança detectada nos totais de votos para "votacao_teste_thales".');
                }
            } else {
                 console.log("Nenhum dado para a enquete 'votacao_teste_thales' encontrado na mensagem.");
            }
        }
        // Mantém o formato antigo para compatibilidade com testes manuais
        else if (data.type === 'Iot' && data.object && data.valor !== undefined) {
            const candidate = objectToCandidate[data.object];
            
            if (candidate) {
                voteData[candidate] += data.valor;
                console.log(`Voto (incremental de teste) recebido para ${candidate}: +${data.valor} (Total: ${voteData[candidate]})`);
                if (updateUICallback) {
                    updateUICallback(voteData);
                }
                if (updateVotedCardCallback && userVotedCandidate) {
                    updateVotedCardCallback(userVotedCandidate, voteData);
                }
            } else {
                console.warn('Candidato de teste não encontrado:', data.object);
            }
        }
        // Lida com o formato antigo de lista plana
        else if ((data.type === 'voto' || data.type === 'iot') && Array.isArray(data.lista)) {
             console.log('Recebida lista de votos agregados (formato antigo). Processando...');
             let hasChanges = false;
 
             data.lista.forEach(item => {
                 const candidateName = item.objectIdentifier;
                 const newTotalVotes = item.somatorio;
 
                 if (voteData.hasOwnProperty(candidateName)) {
                     if (voteData[candidateName] !== newTotalVotes) {
                         console.log(`Atualizando votos para ${candidateName}: de ${voteData[candidateName]} para ${newTotalVotes}`);
                         voteData[candidateName] = newTotalVotes;
                         hasChanges = true;
                     }
                 } else {
                     console.warn(`Candidato da lista não encontrado no sistema: '${candidateName}'`);
                 }
             });
 
             if (hasChanges) {
                 console.log('Dados de votação atualizados:', voteData);
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