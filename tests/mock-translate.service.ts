export class MockTranslateService {
    instant(key: string) {
        return key;
    }
    get(key: string) {
        return { subscribe: (fn: any) => fn(key) };
    }
    use(lang: string) {
        return lang;
    }
    setDefaultLang(lang: string) {
        return lang;
    }
    onLangChange = { subscribe: () => {} };
}
