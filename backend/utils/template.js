import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const loadTemplate = async (templateName,  replacements = {}) => {
    try {
        const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
        let html = await fs.promises.readFile(templatePath, 'utf-8');
        
        
        for (const [key, value] of Object.entries(replacements)) {
            html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
        
        return html;
    } catch (error) {
        console.error('Error loading template:', error);
        throw error;
    }
};