import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { MediaWikiConfig } from '../types/interfaces';
import { validateMediaWikiConfig } from './validations';

export function loadConfig(): MediaWikiConfig {
    try {
        const fileContents = fs.readFileSync('mediawiki.yaml', 'utf8');
        const config = yaml.load(fileContents) as MediaWikiConfig;

        const validationErrors = validateMediaWikiConfig(config);
        if (validationErrors.length > 0) {
            throw new Error(`Configuration validation failed with errors: ${validationErrors.join(', ')}`);
        }

        return config;
    } catch (error) {
        throw new Error(`Failed to load or parse the configuration file: ${(error as Error).message}`);
    }
}
