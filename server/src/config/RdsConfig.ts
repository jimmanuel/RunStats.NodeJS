export interface IRdsConfig {
    getHostname() : Promise<string>;
    getUsername() : Promise<string>;
    getPassword() : Promise<string>;
}
