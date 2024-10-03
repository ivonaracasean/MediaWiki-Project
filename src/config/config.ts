import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { MediaWikiConfig } from '../types/interfaces';

export function loadConfig(): MediaWikiConfig {
    try {
        const fileContents = fs.readFileSync('mediawiki.yaml', 'utf8');
        const config = yaml.load(fileContents) as MediaWikiConfig;

        console.log('Loaded Configuration:', config);

        return config;
    } catch (error) {
        throw new Error(`Failed to load or parse the configuration file: ${(error as Error).message}`);
    }
}
