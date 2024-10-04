import * as fs from 'fs';
import path from "node:path";

export async function saveContent(data: any[], filePath: string) {

    await fs.promises.mkdir(path.dirname(filePath), {recursive: true});
    for(const d of data)
        await fs.promises.appendFile(filePath, JSON.stringify(d) + '\n');

}
