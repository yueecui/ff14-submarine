declare global {
    interface Window {
        mw?: {
            config: {
                get(key: string): any;
            };
        };
        DATA?: {
            [key: string]: any;
        };
    }
}

export {};
