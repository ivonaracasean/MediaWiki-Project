export type PageDefn = string | {
    page: string;
    id?: string | string[];
};

export type MediaWikiConfig = {
    mediawiki: {
        url: string;
    };
    indexPages: {
        pages: PageDefn[];
    };
    pages: PageDefn[];
    ignorePages: string[];
};
