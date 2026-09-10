const fs = require('fs');
const path = require('path');
const versionFile = path.join(__dirname, '../.version.json');
const currentVersion = require(versionFile);
const { execFile } = require('child_process');

currentVersion.build = currentVersion.build + 1;
console.log(JSON.stringify(currentVersion), '<== Current version');
try {
    console.log('writing back to file:', versionFile);
    fs.writeFileSync(versionFile, JSON.stringify(currentVersion));
    console.log('Done');

    const message = `[skip ci] update build number to: ${currentVersion.build}`;

    execFile('git', ['config', 'user.email', 'okjool2012@gmail.com'], (err) => {
        if (err) { console.error('git config failed:', err); return; }
        execFile('git', ['commit', '-am', message], (err2, stdout2) => {
            if (err2) { console.error('git commit failed:', err2); return; }
            console.log('Committed:', stdout2);
            execFile('git', ['push'], (err3, stdout3) => {
                if (err3) { console.error('git push failed:', err3); return; }
                console.log('Pushed:', stdout3);
            });
        });
    });
} catch(err) {
    console.log(err, '<== Unable to increment version');
}
