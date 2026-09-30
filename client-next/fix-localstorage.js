const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // Replace localStorage.getItem(foo) with (typeof window !== 'undefined' ? localStorage.getItem(foo) : null)
    // Only if not already wrapped
    if (content.includes('localStorage.getItem') && !content.includes('typeof window')) {
        content = content.replace(/localStorage\.getItem\(([^)]+)\)/g, "(typeof window !== 'undefined' ? localStorage.getItem($1) : null)");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Fixed localStorage in ' + filePath);
    }
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            walk(fullPath);
        } else {
            processFile(fullPath);
        }
    });
}

walk('./src');
