
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

class ApiDocGenerator {
  constructor(routes) {
    this.routes = routes;
    this.docsDir = path.join(__dirname, '../../docs');
    this.entities = this.extractEntities();
  }

  extractEntities() {
    // Extract unique entities from route paths (users, places, events, etc.)
    const entities = new Set();
    this.routes.forEach(route => {
      const entity = route.path.split('/')[1]; // Extract first part of path
      if (entity) entities.add(entity);
    });
    return Array.from(entities);
  }

  ensureDocsDirectoryExists() {
    if (!fs.existsSync(this.docsDir)) {
      fs.mkdirSync(this.docsDir, { recursive: true });
    }
  }

  generateDocs() {
    this.ensureDocsDirectoryExists();
    this.generateHtmlDocs();
    this.generatePdfDocs();
    console.log('Documentation generated successfully in the /docs directory!');
  }

  generateHtmlDocs() {
    const htmlFilePath = path.join(this.docsDir, 'api-documentation.html');
    
    // Start building the HTML content
    let htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JenCity API Documentation</title>
    <style>
        :root {
            --primary-color: #3498db;
            --secondary-color: #2c3e50;
            --accent-color: #e74c3c;
            --light-gray: #f5f5f5;
            --border-color: #ddd;
            --text-color: #333;
            --method-get: #61affe;
            --method-post: #49cc90;
            --method-put: #fca130;
            --method-delete: #f93e3e;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            color: var(--text-color);
            line-height: 1.6;
            background-color: #f9f9f9;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background-color: var(--secondary-color);
            color: white;
            padding: 20px;
            text-align: center;
            margin-bottom: 30px;
            border-radius: 5px;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .api-description {
            font-size: 1.2rem;
            margin-bottom: 20px;
        }
        
        .server-config {
            background-color: var(--light-gray);
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
            border: 1px solid var(--border-color);
        }
        
        .server-config h2 {
            margin-bottom: 10px;
            color: var(--secondary-color);
        }
        
        .server-form {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        
        .server-form input {
            padding: 8px 12px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            flex: 1;
            min-width: 120px;
        }
        
        .server-form button {
            padding: 8px 15px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .server-form button:hover {
            background-color: #2980b9;
        }
        
        .base-url {
            font-size: 1.1rem;
            padding: 10px;
            background-color: white;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            font-family: monospace;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .copy-btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        
        .copy-btn:hover {
            background-color: #2980b9;
        }
        
        .filter-container {
            margin-bottom: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
        }
        
        .filter-container select {
            padding: 8px 12px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            flex-grow: 1;
            max-width: 300px;
        }
        
        .endpoint-list {
            margin-bottom: 30px;
        }
        
        .endpoint {
            margin-bottom: 25px;
            background-color: white;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border: 1px solid var(--border-color);
        }
        
        .endpoint-header {
            display: flex;
            padding: 15px;
            background-color: #f5f7f9;
            border-bottom: 1px solid var(--border-color);
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .method {
            padding: 5px 10px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            min-width: 80px;
            text-align: center;
        }
        
        .method.get { background-color: var(--method-get); }
        .method.post { background-color: var(--method-post); }
        .method.put { background-color: var(--method-put); }
        .method.delete { background-color: var(--method-delete); }
        
        .endpoint-path {
            font-family: monospace;
            font-size: 1.1rem;
            flex-grow: 1;
            position: relative;
            padding: 5px 10px;
            background-color: white;
            border-radius: 4px;
            border: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .endpoint-body {
            padding: 15px;
        }
        
        .endpoint-description {
            margin-bottom: 15px;
            font-size: 1.1rem;
        }
        
        .params-section, .body-section, .response-section {
            margin-bottom: 20px;
        }
        
        .section-title {
            margin-bottom: 10px;
            color: var(--secondary-color);
            font-size: 1.2rem;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 5px;
        }
        
        .param-table, .response-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        
        .param-table th, .response-table th {
            background-color: #f5f7f9;
            text-align: left;
            padding: 8px 12px;
            border: 1px solid var(--border-color);
        }
        
        .param-table td, .response-table td {
            padding: 8px 12px;
            border: 1px solid var(--border-color);
        }
        
        .code-block {
            background-color: #f5f7f9;
            padding: 15px;
            border-radius: 4px;
            overflow: auto;
            font-family: monospace;
            position: relative;
            margin-bottom: 15px;
            border: 1px solid var(--border-color);
        }
        
        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            font-weight: bold;
            color: var(--secondary-color);
        }
        
        pre {
            margin: 0;
            white-space: pre-wrap;
        }
        
        code {
            font-family: monospace;
        }
        
        .response-status {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            margin-right: 10px;
            font-weight: bold;
            background-color: #e8f5e9;
            color: #388e3c;
        }
        
        footer {
            text-align: center;
            margin-top: 30px;
            color: #777;
            padding: 20px;
            border-top: 1px solid var(--border-color);
        }
        
        @media (max-width: 768px) {
            .endpoint-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .endpoint-path {
                width: 100%;
            }
            
            .server-form {
                flex-direction: column;
            }
        }
        
        .entity-title {
            margin: 30px 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--primary-color);
            color: var(--secondary-color);
        }
        
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>JenCity API Documentation</h1>
            <p class="api-description">Documentation complète des API pour l'application JenCity</p>
        </header>
        
        <div class="server-config">
            <h2>Configuration du Serveur</h2>
            <div class="server-form">
                <input type="text" id="serverHost" placeholder="Hôte (ex: localhost)" value="localhost">
                <input type="number" id="serverPort" placeholder="Port (ex: 3000)" value="3000">
                <button id="updateServerBtn">Mettre à jour</button>
            </div>
            <div class="base-url">
                <span id="baseUrlDisplay">http://localhost:3000/api</span>
                <button class="copy-btn" id="copyBaseUrlBtn">Copier</button>
            </div>
        </div>
        
        <div class="filter-container">
            <label for="entityFilter">Filtrer par entité:</label>
            <select id="entityFilter">
                <option value="all">Toutes les entités</option>
                ${this.entities.map(entity => `<option value="${entity}">${entity}</option>`).join('')}
            </select>
        </div>
        
        <div class="endpoint-list">
`;

    // Group routes by entity for easier filtering
    const routesByEntity = {};
    this.entities.forEach(entity => {
      routesByEntity[entity] = this.routes.filter(route => route.path.startsWith(`/${entity}`));
    });

    // Add endpoints grouped by entity
    this.entities.forEach(entity => {
      htmlContent += `
            <h2 class="entity-title" id="entity-${entity}">${entity.charAt(0).toUpperCase() + entity.slice(1)}</h2>
            <div class="entity-group" data-entity="${entity}">
      `;

      routesByEntity[entity].forEach(route => {
        const methodClass = route.method.toLowerCase();
        const routePath = route.path;
        const fullPath = `/api${routePath}`;
        
        htmlContent += `
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method ${methodClass}">${route.method.toUpperCase()}</span>
                        <div class="endpoint-path">
                            <span>${fullPath}</span>
                            <button class="copy-btn" onclick="copyToClipboard('${fullPath}')">Copier</button>
                        </div>
                    </div>
                    <div class="endpoint-body">
                        <div class="endpoint-description">
                            ${route.description}
                        </div>
        `;
        
        // Parameters section (if any)
        if (route.params && route.params.length > 0) {
          htmlContent += `
                        <div class="params-section">
                            <h3 class="section-title">Paramètres</h3>
                            <table class="param-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Type</th>
                                        <th>Obligatoire</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
          `;
          
          route.params.forEach(param => {
            htmlContent += `
                                    <tr>
                                        <td>${param.name}</td>
                                        <td>${param.type}</td>
                                        <td>${param.required ? 'Oui' : 'Non'}</td>
                                        <td>${param.description}</td>
                                    </tr>
            `;
          });
          
          htmlContent += `
                                </tbody>
                            </table>
                        </div>
          `;
        }
        
        // Request body section (if any)
        if (route.requestBody) {
          htmlContent += `
                        <div class="body-section">
                            <h3 class="section-title">Corps de la Requête</h3>
                            <div class="code-block">
                                <div class="code-header">
                                    <span>JSON</span>
                                    <button class="copy-btn" onclick="copyToClipboard('${JSON.stringify(route.requestBody, null, 2)}')">Copier</button>
                                </div>
                                <pre><code>${JSON.stringify(route.requestBody, null, 2)}</code></pre>
                            </div>
                        </div>
          `;
        }
        
        // Response section
        htmlContent += `
                        <div class="response-section">
                            <h3 class="section-title">Réponse</h3>
                            <div class="response-status">Status: ${route.response.status}</div>
                            <div class="code-block">
                                <div class="code-header">
                                    <span>JSON</span>
                                    <button class="copy-btn" onclick="copyToClipboard('${JSON.stringify(route.response, null, 2)}')">Copier</button>
                                </div>
                                <pre><code>${JSON.stringify(route.response, null, 2)}</code></pre>
                            </div>
                        </div>
                    </div>
                </div>
        `;
      });
      
      htmlContent += `
            </div>
      `;
    });

    // Complete the HTML
    htmlContent += `
        </div>
        
        <footer>
            <p>JenCity API Documentation - Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        </footer>
    </div>
    
    <script>
        // Copy to clipboard functionality
        function copyToClipboard(text) {
            const tempInput = document.createElement('textarea');
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Show a temporary "Copied!" message
            const activeButton = document.activeElement;
            const originalText = activeButton.textContent;
            activeButton.textContent = 'Copié!';
            setTimeout(() => {
                activeButton.textContent = originalText;
            }, 1500);
        }
        
        // Server configuration update
        document.getElementById('updateServerBtn').addEventListener('click', function() {
            const host = document.getElementById('serverHost').value || 'localhost';
            const port = document.getElementById('serverPort').value || '3000';
            const baseUrl = \`http://\${host}:\${port}/api\`;
            document.getElementById('baseUrlDisplay').textContent = baseUrl;
            
            // Update all endpoint paths with the new base URL
            const paths = document.querySelectorAll('.endpoint-path span');
            paths.forEach(pathEl => {
                const endpointPath = pathEl.textContent.split('/api')[1];
                pathEl.textContent = \`/api\${endpointPath}\`;
            });
        });
        
        // Copy base URL
        document.getElementById('copyBaseUrlBtn').addEventListener('click', function() {
            copyToClipboard(document.getElementById('baseUrlDisplay').textContent);
        });
        
        // Entity filtering
        document.getElementById('entityFilter').addEventListener('change', function() {
            const selectedEntity = this.value;
            const entityGroups = document.querySelectorAll('.entity-group');
            const entityTitles = document.querySelectorAll('.entity-title');
            
            if (selectedEntity === 'all') {
                entityGroups.forEach(group => group.classList.remove('hidden'));
                entityTitles.forEach(title => title.classList.remove('hidden'));
            } else {
                entityGroups.forEach(group => {
                    if (group.dataset.entity === selectedEntity) {
                        group.classList.remove('hidden');
                    } else {
                        group.classList.add('hidden');
                    }
                });
                
                entityTitles.forEach(title => {
                    if (title.id === \`entity-\${selectedEntity}\`) {
                        title.classList.remove('hidden');
                    } else {
                        title.classList.add('hidden');
                    }
                });
            }
        });
    </script>
</body>
</html>`;

    fs.writeFileSync(htmlFilePath, htmlContent);
    console.log(`HTML API documentation generated at: ${htmlFilePath}`);
  }

  generatePdfDocs() {
    const pdfFilePath = path.join(this.docsDir, 'api-documentation.pdf');
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: 'JenCity API Documentation',
        Author: 'JenCity',
        Subject: 'API Documentation',
        Keywords: 'API, documentation, JenCity',
      }
    });

    const stream = fs.createWriteStream(pdfFilePath);
    doc.pipe(stream);

    // Add document title
    doc.fontSize(24).fillColor('#2c3e50').text('JenCity API Documentation', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).fillColor('#555').text('Documentation complète des API pour l\'application JenCity', { align: 'center' });
    doc.moveDown(2);

    // Add timestamp
    const date = new Date();
    doc.fontSize(10).fillColor('#777').text(`Généré le ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR')}`, { align: 'right' });
    doc.moveDown(2);

    // Add server information
    doc.fontSize(16).fillColor('#2c3e50').text('Information du Serveur');
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor('#333').text(`URL de Base : http://localhost:3000/api`);
    doc.moveDown(2);

    // Iterate through entities and their routes
    this.entities.forEach(entity => {
      const entityRoutes = this.routes.filter(route => route.path.startsWith(`/${entity}`));
      
      // Add entity title
      doc.fontSize(18).fillColor('#3498db').text(`${entity.charAt(0).toUpperCase() + entity.slice(1)}`);
      doc.moveDown();

      // Add each route under this entity
      entityRoutes.forEach(route => {
        const methodColors = {
          get: '#61affe',
          post: '#49cc90',
          put: '#fca130',
          delete: '#f93e3e'
        };
        
        // Method and path
        doc.fontSize(14).fillColor(methodColors[route.method.toLowerCase()] || '#333')
          .text(`${route.method.toUpperCase()} /api${route.path}`);
        doc.moveDown(0.5);
        
        // Description
        doc.fontSize(11).fillColor('#333').text(`Description: ${route.description}`);
        doc.moveDown();
        
        // Parameters (if any)
        if (route.params && route.params.length > 0) {
          doc.fontSize(12).fillColor('#2c3e50').text('Paramètres:');
          doc.moveDown(0.5);
          
          route.params.forEach(param => {
            doc.fontSize(10).fillColor('#333')
              .text(`${param.name} (${param.type})${param.required ? ' - Obligatoire' : ''}: ${param.description}`);
          });
          doc.moveDown();
        }
        
        // Request body (if any)
        if (route.requestBody) {
          doc.fontSize(12).fillColor('#2c3e50').text('Corps de la Requête:');
          doc.moveDown(0.5);
          doc.fontSize(9).font('Courier').fillColor('#333')
            .text(JSON.stringify(route.requestBody, null, 2));
          doc.font('Helvetica');
          doc.moveDown();
        }
        
        // Response
        doc.fontSize(12).fillColor('#2c3e50').text('Réponse:');
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor('#388e3c').text(`Status: ${route.response.status}`);
        doc.moveDown(0.5);
        doc.fontSize(9).font('Courier').fillColor('#333')
          .text(JSON.stringify(route.response, null, 2));
        doc.font('Helvetica');
        
        doc.moveDown(2);
      });
    });

    // Finalize the PDF
    doc.end();
    console.log(`PDF API documentation generated at: ${pdfFilePath}`);
  }
}

module.exports = ApiDocGenerator;
