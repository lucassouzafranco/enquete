declare module '../service/pokemonAudio.js' {
    export function getPokemonAudioUrl(pokemonName: string): string | null;
    export function playPokemonAudio(pokemonName: string): Promise<void>;
    export function preloadAllPokemonAudio(): Promise<void>;
    export function stopAllPokemonAudio(): void;
    export function isAudioLoaded(pokemonName: string): boolean;
} 