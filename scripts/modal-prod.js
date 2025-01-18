import { spawn } from 'child_process';

const servers = [
    { name: 'server', command: 'python', args: ['-m', 'modal', 'deploy', 'server.py'], cwd: 'modal' },
    { name: 'scrape', command: 'python', args: ['-m', 'modal', 'deploy', 'scrape.py'], cwd: 'modal' },
    { name: 'upsert', command: 'python', args: ['-m', 'modal', 'deploy', 'upsert.py'], cwd: 'modal' },
];

servers.forEach(({ name, command, args, cwd }) => {
    const process = spawn(command, args, { cwd, stdio: 'inherit' });

    process.on('close', (code) => {
        console.log(`[${name}] exited with code ${code}`);
    });

    process.on('error', (err) => {
        console.error(`[${name}] error:`, err);
    });
});
