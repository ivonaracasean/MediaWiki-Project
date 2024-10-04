import { loadConfig } from '../config/config';
import { processPage } from '../fetcher/fetcher';
import { saveContent } from '../storage/storage';
import { MediaWikiConfig } from '../types/interfaces';

export async function orchestrate() {
    const config: MediaWikiConfig = loadConfig();
    const baseUrl = config.mediawiki.url;

    let extractedData: Record<string, Record<string, any[]>> = {};

    for (const page of config.pages) {
        const pageContent = await processPage(page, baseUrl);
        const pageName = typeof page === 'string' ? page : page.page;
        extractedData[pageName] = pageContent;
    }

    for (const page of config.indexPages.pages) {
        const pageContent = await processPage(page, baseUrl);
        const pageName = typeof page === 'string' ? page : page.page;
        extractedData[pageName] = pageContent;
    }

    await saveContent(extractedData, 'mediawiki.json');
}
