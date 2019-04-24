export interface ISystemInfo {
    manufacturer: string;
    model: string;
    platform: string;
    distro: string;
    cpuManufacturer: string;
    cpuBrand: string;
    cpuSpeed: string;
    cpuCores: string;
    systemUptime: ISystemUptime
}

export interface ISystemUptime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}