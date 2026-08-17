const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function findAndReplaceImgTags(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            findAndReplaceImgTags(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('<img') && !content.includes('referrerPolicy="no-referrer"')) {
                // simple regex to add referrerPolicy="no-referrer" to <img tags
                const updatedContent = content.replace(/<img /g, '<img referrerPolicy="no-referrer" ');
                if (content !== updatedContent) {
                    fs.writeFileSync(fullPath, updatedContent, 'utf8');
                    console.log(`Updated: ${fullPath}`);
                }
            }
        }
    }
}

findAndReplaceImgTags(directoryPath);
console.log("Done adding referrerPolicy to images.");
