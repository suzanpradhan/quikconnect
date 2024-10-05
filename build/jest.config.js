"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    verbose: true,
    transform: {
        '^.+\\.ts?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '@/(.*)': ['<rootDir>/src/$1'],
    },
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map