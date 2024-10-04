import * as fs from 'fs';

export async function saveContent(data: Record<string, Record<string, any[]>>, filePath: string) {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) {
                reject(`Failed to save content to ${filePath}: ${err}`);
            } else {
                console.log(`Extracted content saved to ${filePath}`);
                resolve();
            }
        });
    });
}
