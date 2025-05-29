export class MockTranslateService {
    instant(key: string) {
        return key;
    }
    get(key: string) {
        return { subscribe: (fn: any) => fn(key) };
    }
    use(lang: string) {
        // Return an observable with subscribe, like the real TranslateService
        return {
            subscribe: (fn: any) => {
                fn(lang);
                return { unsubscribe: () => {} };
            },
        };
    }
    setDefaultLang(lang: string) {
        return lang;
    }
    onLangChange = { subscribe: () => {} };
}
