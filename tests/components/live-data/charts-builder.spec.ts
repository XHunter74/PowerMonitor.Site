import { ChartsBuilder } from '../../../src/app/components/live-data/charts-builder';
import { ChartsConstants } from '../../../src/app/constants';

describe('ChartsBuilder', () => {
    describe('buildVoltageChart', () => {
        it('should return a voltage chart configuration', () => {
            const label = 'Voltage';
            const defaultVoltage = 220;
            const voltageLabel = 'V';

            const chart = ChartsBuilder.buildVoltageChart(label, defaultVoltage, voltageLabel);

            expect(chart).toEqual({
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
            });
        });
    });

    describe('buildAmperageChart', () => {
        it('should return an amperage chart configuration', () => {
            const label = 'Amperage';
            const defaultAmperage = 10;
            const amperageLabel = 'A';

            const chart = ChartsBuilder.buildAmperageChart(label, defaultAmperage, amperageLabel);

            expect(chart).toEqual({
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
            });
        });
    });

    describe('buildPowerChart', () => {
        it('should return a power chart configuration', () => {
            const label = 'Power';
            const defaultPower = 100;
            const powerLabel = 'W';

            const chart = ChartsBuilder.buildPowerChart(label, defaultPower, powerLabel);

            expect(chart).toEqual({
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
            });
        });
    });
});
