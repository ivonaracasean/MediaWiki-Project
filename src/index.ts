import { loadConfig } from './config/config';
import { PageDefn, MediaWikiConfig} from "./types/interfaces";
import {validateMediaWikiConfig} from "./config/validations";

// Function to process each page based on the PageDefn type
function processPage(pageDefn: PageDefn) {
    if (typeof pageDefn === 'string') {
        // Handle the case where pageDefn is just a string
        console.log(`Processing page: ${pageDefn}`);
        console.log('No specific sections to process. Processing the entire page.');
    } else {
        // Handle the case where pageDefn is an object with page and optional id
        console.log(`Processing page: ${pageDefn.page}`);

        if (pageDefn.id) {
            if (Array.isArray(pageDefn.id)) {
                console.log(`Sections to process: ${pageDefn.id.join(', ')}`);
            } else {
                console.log(`Single section to process: ${pageDefn.id}`);
            }
        } else {
            console.log('No specific sections to process. Processing the entire page.');
        }
    }
}

function main() {
    try {
        // Load the YAML configuration
        const config: any = loadConfig();

        const validationErrors = validateMediaWikiConfig(config);

        if (validationErrors.length > 0) {
            console.log('Configuration validation failed with errors:', validationErrors);
        } else {
            // Process individual pages from the config.pages array
            config.pages.forEach((page: PageDefn) => {
                processPage(page);
            });

            // Process index pages from the config.indexPages.pages array
            config.indexPages.pages.forEach((page: PageDefn) => {
                processPage(page);
            });

            // const ignorePages = config.ignorePages;
            //
            // // Log the parsed configuration
            // console.log('Parsed Configuration:', config);
            // console.log('Parsed Ignored Pages:', ignorePages);
        }
    } catch (error) {
        console.error('Error processing pages:', error);
    }
}

main();
