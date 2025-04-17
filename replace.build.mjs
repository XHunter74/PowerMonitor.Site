import { replaceInFileSync } from 'replace-in-file';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const buildVersion = packageJson.version;

const options = {
    files: 'src/environments/environment.prod.ts',
    from: /version: '(.*)'/g,
    to: "version: '" + buildVersion + "'",
    allowEmptyPaths: false,
};

try {
    let changedFiles = replaceInFileSync(options);
    if (changedFiles == 0) {
        throw "Please make sure that file '" + options.files + "' has \"version: ''\"";
    }
    console.log('Build version set: ' + buildVersion);
} catch (error) {
    console.error('Error occurred:', error);
    throw error;
}
