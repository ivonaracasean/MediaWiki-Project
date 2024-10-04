import axios from 'axios';
import { PageDefn } from '../types/interfaces';
import { extractContent } from '../parser/parser';

export async function fetchPageHtml(url: string): Promise<string> {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch page content from ${url}: ${(error as Error).message}`);
    }
}

export async function processPage(pageDefn: PageDefn, baseUrl: string): Promise<any[]> {
    const pageName = typeof pageDefn === 'string' ? pageDefn : pageDefn.page;
    const pageUrl = `${baseUrl}/${pageName}`;

    const html = await fetchPageHtml(pageUrl);

    return extractContent(pageDefn, html, baseUrl, pageName);
}

