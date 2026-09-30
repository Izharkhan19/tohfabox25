const fs = require('fs');
let code = fs.readFileSync('src/Client/components/Layout.jsx', 'utf-8');

code = '"use client";\n' + code;
code = code.replace(/import \{ Outlet, Link, useLocation, useNavigate \} from "react-router-dom";/, 'import Link from "next/link";\nimport { usePathname, useRouter } from "next/navigation";');
code = code.replace(/export default function ClientLayout\(\) \{/, 'export default function ClientLayout({ children }) {');
code = code.replace(/<Outlet \/>/, '{children}');
code = code.replace(/const location = useLocation\(\);/, 'const pathname = usePathname();');
code = code.replace(/const navigate = useNavigate\(\);/, 'const router = useRouter();');
code = code.replace(/navigate\(/g, 'router.push(');
code = code.replace(/location\.pathname/g, 'pathname');
code = code.replace(/ to=\{/g, ' href={');
code = code.replace(/ to="/g, ' href="');
code = code.replace(/key=\{location\.pathname\}/, 'key={pathname}');

fs.writeFileSync('src/Client/components/Layout.jsx', code);
