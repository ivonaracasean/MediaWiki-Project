import { loadConfig } from '../config/config';
import { processPage } from '../fetcher/fetcher';
import { saveContent } from '../storage/storage';
import { MediaWikiConfig } from '../types/interfaces';

export async function orchestrate() {
    const config: MediaWikiConfig = loadConfig();
    const baseUrl = config.mediawiki.url;

    let extractedData: any[] = [];

    const allPages = [...config.pages, ...config.indexPages.pages];

    for (const page of allPages) {
        const pageContent = await processPage(page, baseUrl);
        extractedData = extractedData.concat(pageContent);
    }

    await saveContent(extractedData, 'mediawiki.json');
}
