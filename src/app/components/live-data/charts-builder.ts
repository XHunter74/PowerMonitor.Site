import { ChartsConstants } from '../../constants';

export class ChartsBuilder {
    public static buildVoltageChart(label: string, defaultVoltage: number, voltageLabel: string) {
        return {
            type: 'Gauge',
            data: [[label, { v: defaultVoltage, f: `${defaultVoltage} ${voltageLabel}` }]],
            options: {
                width: 200,
                height: 200,
                redFrom: 0,
                redTo: ChartsConstants.voltageChart.nominalMin,
                greenFrom: ChartsConstants.voltageChart.nominalMin,
                greenTo: ChartsConstants.voltageChart.nominalMax,
                yellowFrom: ChartsConstants.voltageChart.nominalMax,
                yellowTo: ChartsConstants.voltageChart.maxVoltage,
                min: 0,
                max: ChartsConstants.voltageChart.maxVoltage,
                yellowColor: '#DC3912',
            },
        };
    }

    public static buildAmperageChart(
        label: string,
        defaultAmperage: number,
        amperageLabel: string,
    ) {
        return {
            type: 'Gauge',
            data: [[label, { v: defaultAmperage, f: `${defaultAmperage} ${amperageLabel}` }]],
            options: {
                width: 200,
                height: 200,
                greenFrom: 0,
                greenTo: ChartsConstants.amperageChart.nominalMax,
                redFrom: ChartsConstants.amperageChart.nominalMax,
                redTo: ChartsConstants.amperageChart.maxAmperage,
                min: 0,
                max: ChartsConstants.amperageChart.maxAmperage,
            },
        };
    }

    public static buildPowerChart(label: string, defaultPower: number, powerLabel: string) {
        return {
            type: 'Gauge',
            data: [[label, { v: defaultPower, f: `${defaultPower} ${powerLabel}` }]],
            options: {
                width: 200,
                height: 200,
                greenFrom: 0,
                greenTo: ChartsConstants.powerChart.nominalMax,
                redFrom: ChartsConstants.powerChart.nominalMax,
                redTo: ChartsConstants.powerChart.maxPower,
                min: 0,
                max: ChartsConstants.powerChart.maxPower,
            },
        };
    }
}
