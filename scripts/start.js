import { spawn } from 'child_process';
import { writeFile, readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');

async function updateEnvFile(ngrokUrl) {
    const envPath = join(rootDir, 'website', '.env');
    try {
        // Read existing contents or start with empty string
        let contents = '';
        if (existsSync(envPath)) {
            contents = await readFile(envPath, 'utf-8');
        }

        // Remove any existing UPSTASH_WORKFLOW_URL line
        contents = contents.split('\n')
            .filter(line => !line.startsWith('UPSTASH_WORKFLOW_URL='))
            .join('\n');

        // Add the new URL
        contents = contents.trim() + `\nUPSTASH_WORKFLOW_URL=${ngrokUrl}\n`;

        // Write back to file
        await writeFile(envPath, contents, 'utf-8');
        console.log('Updated .env file with ngrok URL:', ngrokUrl);
    } catch (error) {
        console.error('Failed to update .env file:', error);
    }
}

function startProcess(command, args, cwd, name) {
    // Set encoding for Python processes
    const options = {
        cwd: join(rootDir, cwd),
        shell: true,
        stdio: 'pipe',
        // Add encoding for Windows compatibility
        env: {
            ...globalThis.process.env,
            PYTHONIOENCODING: 'utf-8',
            PYTHONUTF8: '1'
        }
    };

    const process = spawn(command, args, options);

    process.stdout.setEncoding('utf-8');
    process.stderr.setEncoding('utf-8');

    process.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`[${name}] ${output}`);
        
        if (name === 'ngrok') {
            console.log('[debug] Checking ngrok output:', output);
            // Look for URL in ngrok output format
            const match = output.match(/url=(https:\/\/[^"\s]+\.ngrok-free\.app)/);
            if (match && match[1]) {
                console.log('[debug] Found ngrok URL:', match[1]);
                updateEnvFile(match[1]);
            }
        }
    });

    process.stderr.on('data', (data) => {
        console.error(`[${name}] ${data.toString()}`);
    });

    process.on('error', (error) => {
        console.error(`[${name}] Failed to start:`, error);
    });

    return process;
}

// Start all processes
console.log('Starting development environment...');

const processes = [
    startProcess('pnpm', ['dev'], 'website', 'website'),
    startProcess('python', ['-m', 'modal', 'serve', 'scrape.py'], 'modal', 'modal-scrape'),
    startProcess('python', ['-m', 'modal', 'serve', 'upsert.py'], 'modal', 'modal-upsert'),
    startProcess('ngrok', ['http', '8001', '--log=stdout'], '.', 'ngrok')
];

// Handle script termination
process.on('SIGINT', () => {
    console.log('\nShutting down all processes...');
    processes.forEach(proc => proc.kill());
    process.exit(0);
}); 