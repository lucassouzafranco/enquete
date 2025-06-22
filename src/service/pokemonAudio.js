// Mapeamento de nomes dos Pokémon para os arquivos de áudio locais
const POKEMON_AUDIO_MAP = {
    'Bulbasauro': 'bulbasaur',
    'Charmander': 'charmander',
    'Squirtle': 'squirtle',
    'Pikachu': 'pikachu',
    'Eevee': 'eevee'
};

// Cache para os áudios carregados
const audioCache = {};

// Função para obter a URL do áudio local de um Pokémon
export const getPokemonAudioUrl = (pokemonName) => {
    const pokemonId = POKEMON_AUDIO_MAP[pokemonName];
    if (!pokemonId) {
        console.warn(`Pokémon não encontrado: ${pokemonName}`);
        return null;
    }
    
    // Retorna o caminho para o arquivo local na pasta public
    return `/sounds/${pokemonId}.mp3`;
};

// Função para carregar e tocar o áudio de um Pokémon
export const playPokemonAudio = async (pokemonName) => {
    try {
        console.log(`Tentando tocar áudio do ${pokemonName}...`);

        // Verifica se já está no cache
        if (audioCache[pokemonName]) {
            console.log(`Usando áudio em cache para ${pokemonName}`);
            audioCache[pokemonName].currentTime = 0;
            await audioCache[pokemonName].play();
            return;
        }

        // Carrega o áudio local
        const audioUrl = getPokemonAudioUrl(pokemonName);
        if (!audioUrl) {
            console.warn(`URL de áudio não encontrada para ${pokemonName}`);
            return;
        }
        
        console.log(`Carregando áudio local: ${audioUrl}`);
        
        const audio = new Audio(audioUrl);
        
        // Adiciona listeners para debug
        audio.addEventListener('loadstart', () => console.log(`Iniciando carregamento do áudio de ${pokemonName}`));
        audio.addEventListener('canplay', () => {
            console.log(`Áudio de ${pokemonName} pronto para tocar`);
            // Adiciona ao cache quando estiver pronto
            audioCache[pokemonName] = audio;
        });
        audio.addEventListener('error', (e) => {
            console.error(`Erro no áudio de ${pokemonName}:`, e);
            // Fallback para voz sintética se o áudio local falhar
            useSyntheticVoice(pokemonName);
        });
        
        // Toca o áudio
        await audio.play();
        
        console.log(`Áudio do ${pokemonName} tocado com sucesso`);
    } catch (error) {
        console.error(`Erro ao tocar áudio do ${pokemonName}:`, error);
        // Fallback para voz sintética
        useSyntheticVoice(pokemonName);
    }
};

// Função para criar uma voz sintética que soe como um Pokémon (fallback)
const createPokemonVoice = (pokemonName) => {
    try {
        // Verifica se o navegador suporta Web Speech API
        if (!window.speechSynthesis) {
            console.warn('Web Speech API não suportada');
            return null;
        }

        // Cancela qualquer fala anterior
        window.speechSynthesis.cancel();

        // Cria a fala
        const utterance = new SpeechSynthesisUtterance(pokemonName);
        
        // Configurações para soar como Pokémon
        utterance.rate = 0.8; // Mais lento
        utterance.pitch = 1.2; // Tom mais alto
        utterance.volume = 0.7; // Volume moderado
        
        // Tenta usar uma voz feminina (soa mais como Pokémon)
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.lang.includes('pt') || voice.lang.includes('en')
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        return utterance;
    } catch (error) {
        console.error('Erro ao criar voz do Pokémon:', error);
        return null;
    }
};

// Função para usar voz sintética como fallback
const useSyntheticVoice = (pokemonName) => {
    console.log(`Usando voz sintética como fallback para ${pokemonName}`);
    
    const utterance = createPokemonVoice(pokemonName);
    if (utterance) {
        audioCache[pokemonName] = { type: 'speech', utterance: utterance };
        window.speechSynthesis.speak(utterance);
        console.log(`Voz sintética criada para ${pokemonName}`);
    } else {
        // Último recurso: beep
        createSimpleBeep(pokemonName);
    }
};

// Função para pré-carregar todos os áudios
export const preloadAllPokemonAudio = async () => {
    const pokemonNames = Object.keys(POKEMON_AUDIO_MAP);
    
    console.log('Pré-carregando áudios locais dos Pokémon...');
    
    for (const pokemonName of pokemonNames) {
        try {
            const audioUrl = getPokemonAudioUrl(pokemonName);
            if (audioUrl) {
                const audio = new Audio(audioUrl);
                audio.preload = 'auto';
                
                audio.addEventListener('canplay', () => {
                    audioCache[pokemonName] = audio;
                    console.log(`Áudio local do ${pokemonName} carregado`);
                });
                
                audio.addEventListener('error', (e) => {
                    console.error(`Erro ao carregar áudio local do ${pokemonName}:`, e);
                });
            }
        } catch (error) {
            console.error(`Erro ao carregar áudio local do ${pokemonName}:`, error);
        }
    }
    
    console.log('Pré-carregamento de áudios locais concluído');
};

// Função para parar todos os áudios
export const stopAllPokemonAudio = () => {
    Object.values(audioCache).forEach(audio => {
        if (audio && !audio.paused && audio.type !== 'speech') {
            audio.pause();
            audio.currentTime = 0;
        }
    });
    
    // Para vozes sintéticas
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
};

// Função para verificar se um áudio está carregado
export const isAudioLoaded = (pokemonName) => {
    return audioCache[pokemonName] !== undefined;
};

// Função para criar um beep simples como último recurso
const createSimpleBeep = (pokemonName) => {
    try {
        console.log(`Criando beep simples para ${pokemonName}...`);
        
        // Cria um contexto de áudio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Configura o som
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Frequências diferentes para cada Pokémon
        const frequencies = {
            'Bulbasauro': 440,  // A4
            'Charmander': 523,  // C5
            'Squirtle': 659,    // E5
            'Pikachu': 784,     // G5
            'Eevee': 880        // A5
        };
        
        oscillator.frequency.setValueAtTime(frequencies[pokemonName] || 440, audioContext.currentTime);
        oscillator.type = 'sine';
        
        // Configura o volume
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        // Toca o som
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        console.log(`Beep criado para ${pokemonName}`);
    } catch (error) {
        console.error(`Erro ao criar beep para ${pokemonName}:`, error);
    }
}; 