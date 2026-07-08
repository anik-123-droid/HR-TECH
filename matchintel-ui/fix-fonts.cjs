const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src', 'pages'));
let modifiedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let lines = content.split('\n');
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
        // If line has <div or <span and font-display
        if (/(<div|<span|<p|<td|<a|<button)/.test(lines[i]) && lines[i].includes('font-display')) {
            // Remove 'font-display ' or ' font-display'
            lines[i] = lines[i].replace(/\s?font-display\s?/, ' ').replace(/ {2,}/g, ' ');
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(file, lines.join('\n'), 'utf8');
        modifiedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Modified ${modifiedCount} files.`);
