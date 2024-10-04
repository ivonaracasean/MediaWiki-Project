import * as cheerio from 'cheerio';
import { PageDefn } from '../types/interfaces';

export function extractContent(pageDefn: PageDefn, html: string, baseUrl: string, pageName: string): Record<string, any[]> {
    const $ = cheerio.load(html);
    let extractedData: Record<string, any[]> = {};

    if (typeof pageDefn === 'object' && pageDefn.id) {
        const sections = Array.isArray(pageDefn.id) ? pageDefn.id : [pageDefn.id];

        sections.forEach((sectionId) => {
            const section = $(`#${sectionId}`);

            if (section.length) {
                let sectionContent = '';
                let parentBlock = section.parent();
                let sibling = parentBlock.next();

                // Traverse to collect content
                while (sibling.length && !(sibling.is('h1, h2, h3, h4, h5, h6'))) {
                    if (sibling.is('p, div, ul, ol')) {
                        sectionContent += sibling.text().trim() + '\n\n';
                    }
                    sibling = sibling.next();
                }

                const sectionUrl = `${baseUrl}/${pageName}#${sectionId}`;
                const sectionData = {
                    text: sectionContent.trim(),
                    url: sectionUrl,
                    _index: "mediawiki",
                    _id: `${pageName}#${sectionId}`
                };

                if (!extractedData[pageName]) {
                    extractedData[pageName] = [];
                }
                extractedData[pageName].push(sectionData);
            } else {
                console.warn(`Section with ID ${sectionId} not found`);
            }
        });
    } else {
        const fullPageContent = $('body').text().trim();
        extractedData[pageName] = [
            {
                text: fullPageContent,
                url: baseUrl,
                _index: "mediawiki",
                _id: `${pageName}#fullContent`
            }
        ];
    }

    return extractedData;
}
