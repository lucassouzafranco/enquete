// Estado global dos votos
let voteData = {
    'Romário': 0,
    'Prefeito de Sorocaba': 0,
    'Pastor Mirim': 0,
    'Pedro Damaso': 0,
    'Tiririca': 0
};

// Mapeamento de objetos para candidatos
const objectToCandidate = {
    'Romário': 'Romário',
    'Prefeito de Sorocaba': 'Prefeito de Sorocaba',
    'Pastor Mirim': 'Pastor Mirim',
    'Pedro Damaso': 'Pedro Damaso',
    'Tiririca': 'Tiririca'
};

let updateUICallback = null;
let updateVotedCardCallback = null;

let userVotedCandidate = null;

export function processMessage(data) {
    try {
        if (data.type === 'Iot' && data.object && data.valor !== undefined) {
            const candidate = objectToCandidate[data.object];
            
            if (candidate) {
                voteData[candidate] += data.valor;
                console.log(`Voto recebido para ${candidate}: +${data.valor} (Total: ${voteData[candidate]})`);
                if (updateUICallback) {
                    updateUICallback(voteData);
                }
                if (updateVotedCardCallback && userVotedCandidate) {
                    updateVotedCardCallback(userVotedCandidate, voteData);
                }
            } else {
                console.warn('Candidato não encontrado:', data.object);
            }
        } else {
            console.log('Mensagem recebida (não é voto):', data);
        }
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
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
            'Romário': 0,
            'Prefeito de Sorocaba': 0,
            'Pastor Mirim': 0,
            'Pedro Damaso': 0,
            'Tiririca': 0
        };
    }
    
    return {
        'Romário': Math.round((voteData['Romário'] / total) * 100),
        'Prefeito de Sorocaba': Math.round((voteData['Prefeito de Sorocaba'] / total) * 100),
        'Pastor Mirim': Math.round((voteData['Pastor Mirim'] / total) * 100),
        'Pedro Damaso': Math.round((voteData['Pedro Damaso'] / total) * 100),
        'Tiririca': Math.round((voteData['Tiririca'] / total) * 100)
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