import {
    validateMediaWikiConfig,
    validatePageDefn,
    validateMediaWiki,
    validatePages
} from '../config/validations';
import { MediaWikiConfig, PageDefn } from '../types/interfaces';

describe('Validation Tests', () => {
    describe('validatePageDefn', () => {
        it('should return no errors for valid PageDefn with string', () => {
            const page: PageDefn = 'Philosophy_of_science';
            const errors = validatePageDefn(page, 'pages[0]');
            expect(errors).toEqual([]);
        });

        it('should return errors for invalid PageDefn object with invalid id', () => {
            const page: PageDefn = { page: 'Philosophy of science', id: [123 as any] };
            const errors = validatePageDefn(page, 'pages[0]');
            expect(errors).toEqual([
                'pages[0].id[0] must be a valid string, but got: 123',
            ]);
        });

        it('should return errors for invalid PageDefn object with missing page', () => {
            const page: PageDefn = { page: 123 } as any;
            const errors = validatePageDefn(page, 'pages[0]');
            expect(errors).toEqual([
                'pages[0].page must be a valid string, but got: 123',
            ]);
        });
    });

    describe('validateMediaWiki', () => {
        it('should return no errors for a valid mediawiki section', () => {
            const mediawiki = { url: 'https://example.com' };
            const errors = validateMediaWiki(mediawiki);
            expect(errors).toEqual([]);
        });

        it('should return an error for an invalid mediawiki URL', () => {
            const mediawiki = { url: 12345 };
            const errors = validateMediaWiki(mediawiki as any);
            expect(errors).toEqual([
                'mediawiki.url must be a valid string, but got: 12345',
            ]);
        });

        it('should return an error for a missing mediawiki section', () => {
            const errors = validateMediaWiki(undefined as any);
            expect(errors).toEqual(["Expected 'mediawiki' section, but it is missing."]);
        });
    });

    describe('validatePages', () => {
        it('should return no errors for valid pages section', () => {
            const pages = [
                { page: 'Vienna', id: ['toc-History', 'toc-Culture'] },
                'Philosophy_of_science'
            ];
            const errors = validatePages(pages);
            expect(errors).toEqual([]);
        });

        it('should return errors for invalid id in pages section', () => {
            const pages = [
                { page: 'Vienna', id: ['toc-History', 123] },
            ];
            const errors = validatePages(pages as any);
            expect(errors).toEqual([
                'pages[0].id[1] must be a valid string, but got: 123',
            ]);
        });

        it('should return an error for a missing pages section', () => {
            const errors = validatePages(undefined as any);
            expect(errors).toEqual(["Expected 'pages' section, but it is missing."]);
        });
    });

    describe('validateMediaWikiConfig', () => {
        it('should return no errors for a valid configuration', () => {
            const config: MediaWikiConfig = {
                mediawiki: { url: 'https://example.com' },
                indexPages: { pages: ['Karl Popper'] },
                pages: [{ page: 'Vienna', id: ['toc-History', 'toc-Geography'] }],
                ignorePages: ['n-mainpage-description'],
            };
            const errors = validateMediaWikiConfig(config);
            expect(errors).toEqual([]);
        });

        it('should return errors for misnamed sections and invalid fields', () => {
            const config = {
                wrongMediawiki: { url: 12345 }, // Misnamed section
                incorrectPages: [
                    { page: 'Philosophy of science', id: [4884] }, // Invalid id
                ],
                ignorePages: [12345], // Invalid ignorePages
            };
            const errors = validateMediaWikiConfig(config as any);
            expect(errors).toEqual([
                "Found unexpected section 'wrongMediawiki', did you mean one of: mediawiki, pages, indexPages, ignorePages?",
                "Found unexpected section 'incorrectPages', did you mean one of: mediawiki, pages, indexPages, ignorePages?",
                "Expected 'mediawiki' section, but it is missing.",
                "Expected 'pages' section, but it is missing.",
                "Expected 'indexPages' section, but it is missing.",
                "ignorePages[0] must be a string, but got: 12345",
            ]);
        });
    });
});
