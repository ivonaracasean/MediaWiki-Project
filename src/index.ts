import { orchestrate } from './controller/orchestrator';

async function main() {
    try {
        await orchestrate();
    } catch (error) {
        console.error('Error in application workflow:', error);
    }
}

main();

