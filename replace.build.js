import { sync } from 'replace-in-file';
import { version } from "./package.json";
var buildVersion = version;
const options = {
    files: 'src/environments/environment.prod.ts',
    from: /version: '(.*)'/g,
    to: "version: '"+ buildVersion + "'",
    allowEmptyPaths: false,
};

try {
    let changedFiles = sync(options);
    if (changedFiles == 0) {
        throw "Please make sure that file '" + options.files + "' has \"version: ''\"";
    }
    console.log('Build version set: ' + buildVersion);
}
catch (error) {
    console.error('Error occurred:', error);
    throw error
}
