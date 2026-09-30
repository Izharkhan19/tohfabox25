const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (!filePath.endsWith('.jsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // 1. Add "use client"
    if (!content.startsWith('"use client"') && !content.startsWith("'use client'")) {
        content = '"use client";\n' + content;
        changed = true;
    }

    // 2. Replace react-router-dom usage
    if (content.includes('react-router-dom')) {
        let importsToAdd = [];
        
        if (/\bLink\b/.test(content)) {
            importsToAdd.push('import Link from "next/link";');
            // replace to= with href=
            content = content.replace(/<Link([^>]*?)to=/g, '<Link$1href=');
        }
        
        const navImports = [];
        if (/\buseNavigate\b/.test(content)) {
            navImports.push('useRouter');
            content = content.replace(/useNavigate\(/g, 'useRouter(');
            content = content.replace(/const navigate = useRouter\(\);?/g, 'const router = useRouter();');
            content = content.replace(/navigate\(/g, 'router.push(');
        }
        if (/\buseLocation\b/.test(content)) {
            navImports.push('usePathname');
            content = content.replace(/useLocation\(/g, 'usePathname(');
            // We can't automatically fix every location.* usage, but we can fix location.pathname
            content = content.replace(/location\.pathname/g, 'pathname');
            content = content.replace(/const location = /g, 'const pathname = ');
        }
        if (/\buseParams\b/.test(content)) {
            navImports.push('useParams');
        }
        
        // Navigation might be used as `Navigate` component instead of `useNavigate`
        if (/\bNavigate\b/.test(content) && !content.includes('useRouter')) {
            // Next.js doesn't have a <Navigate> component. It uses redirect() or useRouter()
            // We'll leave it as a comment for now or just replace it with an empty component
            // We can create a quick mock <Navigate> component if needed, or import redirect
        }

        if (navImports.length > 0) {
            importsToAdd.push(`import { ${navImports.join(', ')} } from "next/navigation";`);
        }

        // Replace react-router-dom import with our new imports
        content = content.replace(/import\s+\{([^}]*)\}\s+from\s+['"]react-router-dom['"];?/g, (match, p1) => {
            return importsToAdd.join('\n');
        });
        
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${filePath}`);
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
