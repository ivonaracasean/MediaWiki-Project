import { MediaWikiConfig, PageDefn } from "../types/interfaces";

type ValidateFn<T> = (t: T) => string[];

export const validatePageDefn: (pageDefn: PageDefn, path: string) => string[] = (pageDefn, path) => {
    if (typeof pageDefn === 'string') {
        return [];
    }

    if (typeof pageDefn !== 'object' || pageDefn === null) {
        return [`${path} must be a valid string or object, but got: ${JSON.stringify(pageDefn)}`];
    }

    return [
        ...(typeof pageDefn.page !== 'string' ? [`${path}.page must be a valid string, but got: ${JSON.stringify(pageDefn.page)}`] : []),
        ...(pageDefn.id !== undefined
                ? Array.isArray(pageDefn.id)
                    ? pageDefn.id.flatMap((idValue, index) =>
                        typeof idValue !== 'string'
                            ? [`${path}.id[${index}] must be a valid string, but got: ${JSON.stringify(idValue)}`]
                            : []
                    )
                    : typeof pageDefn.id !== 'string'
                        ? [`${path}.id must be a string or an array of strings, but got: ${JSON.stringify(pageDefn.id)}`]
                        : []
                : []
        ),
    ];
};

// Validation for the mediawiki section with detailed error messages
export const validateMediaWiki: ValidateFn<MediaWikiConfig['mediawiki']> = (mediawiki) => {
    if (!mediawiki) {
        return ["Expected 'mediawiki' section, but it is missing."];
    }
    if (typeof mediawiki.url !== 'string') {
        return [`mediawiki.url must be a valid string, but got: ${JSON.stringify(mediawiki?.url)}`];
    }
    return [];
};

// Validation for the indexPages section with detailed error messages
export const validateIndexPages: ValidateFn<MediaWikiConfig['indexPages']> = (indexPages) => {
    if (!indexPages) {
        return ["Expected 'indexPages' section, but it is missing."];
    }
    if (!Array.isArray(indexPages.pages)) {
        return [`indexPages.pages must be an array of PageDefn, but got: ${JSON.stringify(indexPages?.pages)}`];
    }

    return indexPages.pages.flatMap((page: PageDefn, index: number) => {
        const path = `indexPages.pages[${index}]`;
        return validatePageDefn(page, path);
    });
};

// Validation for the ignorePages section with detailed error messages
export const validateIgnorePages: ValidateFn<MediaWikiConfig['ignorePages']> = (ignorePages) => {
    if (!ignorePages) {
        return ["Expected 'ignorePages' section, but it is missing."];
    }
    if (!Array.isArray(ignorePages)) {
        return [`ignorePages must be an array of strings, but got: ${JSON.stringify(ignorePages)}`];
    }

    return ignorePages.flatMap((page, index) => {
        if (typeof page !== 'string') {
            return [`ignorePages[${index}] must be a string, but got: ${JSON.stringify(page)}`];
        }
        return [];
    });
};

// Validation for the pages section with detailed error messages
export const validatePages: ValidateFn<MediaWikiConfig['pages']> = (pages) => {
    if (!pages) {
        return ["Expected 'pages' section, but it is missing."];
    }
    if (!Array.isArray(pages)) {
        return [`pages must be an array of PageDefn, but got: ${JSON.stringify(pages)}`];
    }

    return pages.flatMap((page: PageDefn, index: number) => {
        const path = `pages[${index}]`;
        return validatePageDefn(page, path);
    });
};

// Full validation for MediaWikiConfig with detailed error messages, including misnamed section detection
export const validateMediaWikiConfig: ValidateFn<MediaWikiConfig> = (config: any) => {
    const expectedSections = ['mediawiki', 'pages', 'indexPages', 'ignorePages'];
    const actualSections = Object.keys(config);

    // Check for misnamed sections by comparing actual with expected sections
    const misnamedSections = actualSections.filter(section => !expectedSections.includes(section));

    const misnamedErrors = misnamedSections.map(misnamed => {
        return `Found unexpected section '${misnamed}', did you mean one of: ${expectedSections.join(', ')}?`;
    });

    // Validate existing sections
    const sectionErrors = [
        ...(config.mediawiki ? validateMediaWiki(config.mediawiki) : ["Expected 'mediawiki' section, but it is missing."]),
        ...(config.pages ? validatePages(config.pages) : ["Expected 'pages' section, but it is missing."]),
        ...(config.indexPages ? validateIndexPages(config.indexPages) : ["Expected 'indexPages' section, but it is missing."]),
        ...(config.ignorePages ? validateIgnorePages(config.ignorePages) : ["Expected 'ignorePages' section, but it is missing."]),
    ];

    // Combine misnamed errors with section errors
    return [...misnamedErrors, ...sectionErrors];
};
