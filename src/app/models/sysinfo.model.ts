export interface ISystemInfo {
    version: string;
    manufacturer: string;
    model: string;
    platform: string;
    distro: string;
    cpuManufacturer: string;
    cpuBrand: string;
    cpuSpeed: string;
    cpuCores: string;
    systemUptime: ISystemUptime;
    systemDateTimeStr: string;
}

export interface ISystemUptime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}
