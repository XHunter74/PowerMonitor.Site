// This setup file suppresses jsdom 'not implemented' navigation errors in Jest
const originalError = console.error;

beforeAll(() => {
    console.error = (...args) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Not implemented: navigation (except hash changes)')
        ) {
            // Suppress jsdom navigation not implemented error
            return;
        }
        originalError(...args);
    };
});

afterAll(() => {
    console.error = originalError;
});
