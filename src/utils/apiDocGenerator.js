
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
            --success-color: #4caf50;
            --success-bg: #e8f5e9;
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
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid var(--border-color);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .server-config h2 {
            margin-bottom: 15px;
            color: var(--secondary-color);
            border-bottom: 2px solid var(--primary-color);
            padding-bottom: 8px;
        }
        
        .server-form {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            flex-wrap: wrap;
            align-items: center;
        }
        
        .server-form input {
            padding: 10px 15px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            flex: 1;
            min-width: 120px;
            font-size: 1rem;
            transition: border-color 0.3s, box-shadow 0.3s;
        }
        
        .server-form input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }
        
        .server-form button {
            padding: 10px 18px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .server-form button:hover {
            background-color: #2980b9;
            transform: translateY(-2px);
        }
        
        .server-form button:active {
            transform: translateY(0);
        }
        
        .base-url {
            font-size: 1.1rem;
            padding: 15px;
            background-color: var(--light-gray);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .copy-btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background-color 0.3s;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .copy-btn:hover {
            background-color: #2980b9;
        }
        
        .filter-container {
            margin-bottom: 25px;
            padding: 15px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border: 1px solid var(--border-color);
        }
        
        .filter-title {
            margin-bottom: 10px;
            color: var(--secondary-color);
            font-weight: 600;
        }
        
        .filter-options {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
        }
        
        .filter-container select {
            padding: 10px 15px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background-color: white;
            flex-grow: 1;
            max-width: 300px;
            font-size: 1rem;
            transition: border-color 0.3s, box-shadow 0.3s;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232c3e50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 10px center;
            padding-right: 30px;
        }
        
        .filter-container select:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }
        
        .endpoint-list {
            margin-bottom: 40px;
        }
        
        .endpoint {
            margin-bottom: 25px;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: 1px solid var(--border-color);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .endpoint:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .endpoint-header {
            display: flex;
            padding: 15px;
            background-color: #f5f7f9;
            border-bottom: 1px solid var(--border-color);
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
        }
        
        .method {
            padding: 6px 12px;
            border-radius: 6px;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            min-width: 80px;
            text-align: center;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
        }
        
        .method.get { background-color: var(--method-get); }
        .method.post { background-color: var(--method-post); }
        .method.put { background-color: var(--method-put); }
        .method.delete { background-color: var(--method-delete); }
        
        .endpoint-path {
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            flex-grow: 1;
            position: relative;
            padding: 8px 15px;
            background-color: white;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .endpoint-body {
            padding: 20px;
        }
        
        .endpoint-description {
            margin-bottom: 20px;
            font-size: 1.1rem;
            color: #444;
            line-height: 1.7;
        }
        
        .params-section, .body-section, .response-section {
            margin-bottom: 25px;
        }
        
        .section-title {
            margin-bottom: 15px;
            color: var(--secondary-color);
            font-size: 1.2rem;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .section-title i {
            color: var(--primary-color);
        }
        
        .param-table, .response-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .param-table th, .response-table th {
            background-color: #f5f7f9;
            text-align: left;
            padding: 10px 15px;
            border: 1px solid var(--border-color);
            color: var(--secondary-color);
            font-weight: 600;
        }
        
        .param-table td, .response-table td {
            padding: 10px 15px;
            border: 1px solid var(--border-color);
        }
        
        .param-table tr:nth-child(even), .response-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        
        .code-block {
            background-color: #f5f7f9;
            padding: 15px;
            border-radius: 6px;
            overflow: auto;
            font-family: 'Courier New', monospace;
            position: relative;
            margin-bottom: 20px;
            border: 1px solid var(--border-color);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-weight: 600;
            color: var(--secondary-color);
            padding-bottom: 8px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        pre {
            margin: 0;
            white-space: pre-wrap;
            font-size: 0.95rem;
            line-height: 1.6;
        }
        
        code {
            font-family: 'Courier New', monospace;
        }
        
        .response-status {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            margin-right: 10px;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .status-success {
            background-color: var(--success-bg);
            color: var(--success-color);
        }
        
        .status-error {
            background-color: #ffebee;
            color: #d32f2f;
        }
        
        .status-warning {
            background-color: #fff8e1;
            color: #ff8f00;
        }
        
        footer {
            text-align: center;
            margin-top: 40px;
            color: #777;
            padding: 20px;
            border-top: 1px solid var(--border-color);
            font-size: 0.9rem;
        }
        
        .entity-title {
            margin: 40px 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--primary-color);
            color: var(--secondary-color);
            font-size: 1.8rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .entity-icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--primary-color);
            color: white;
            border-radius: 50%;
        }
        
        .hidden {
            display: none;
        }
        
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--secondary-color);
            color: white;
            padding: 12px 25px;
            border-radius: 6px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast i {
            font-size: 1.2rem;
        }
        
        .endpoint-counter {
            font-size: 0.9rem;
            color: #666;
            margin-left: 10px;
        }
        
        .try-btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 15px;
            cursor: pointer;
            font-size: 0.9rem;
            margin-left: 10px;
            transition: background-color 0.3s;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .try-btn:hover {
            background-color: #2980b9;
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
            
            .method {
                width: 100%;
                text-align: center;
            }
        }
        
        /* Tabs for request/response */
        .tabs {
            display: flex;
            margin-bottom: 15px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .tab {
            padding: 8px 15px;
            cursor: pointer;
            border: 1px solid transparent;
            border-bottom: none;
            border-radius: 6px 6px 0 0;
            margin-right: 5px;
            transition: all 0.3s;
        }
        
        .tab.active {
            background-color: #f5f7f9;
            border-color: var(--border-color);
            font-weight: 600;
            color: var(--primary-color);
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        /* Icons for endpoints */
        .entity-users-icon::before { content: "\\f007"; }
        .entity-places-icon::before { content: "\\f3c5"; }
        .entity-events-icon::before { content: "\\f073"; }
        .entity-messages-icon::before { content: "\\f4ad"; }
        .entity-reviews-icon::before { content: "\\f005"; }
        .entity-reservations-icon::before { content: "\\f145"; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1><i class="fas fa-code"></i> JenCity API Documentation</h1>
            <p class="api-description">Documentation complète des API pour l'application JenCity</p>
        </header>
        
        <div class="server-config">
            <h2><i class="fas fa-server"></i> Configuration du Serveur</h2>
            <div class="server-form">
                <input type="text" id="serverHost" placeholder="Hôte (ex: localhost)" value="localhost">
                <input type="number" id="serverPort" placeholder="Port (ex: 3000)" value="3000">
                <button id="updateServerBtn"><i class="fas fa-sync-alt"></i> Mettre à jour</button>
            </div>
            <div class="base-url">
                <span id="baseUrlDisplay">http://localhost:3000/api</span>
                <button class="copy-btn" id="copyBaseUrlBtn"><i class="fas fa-copy"></i> Copier</button>
            </div>
        </div>
        
        <div class="filter-container">
            <div class="filter-title"><i class="fas fa-filter"></i> Filtrer les API</div>
            <div class="filter-options">
                <select id="entityFilter">
                    <option value="all">Toutes les entités</option>
                    ${this.entities.map(entity => `<option value="${entity}">${entity.charAt(0).toUpperCase() + entity.slice(1)}</option>`).join('')}
                </select>
                <select id="methodFilter">
                    <option value="all">Toutes les méthodes</option>
                    <option value="get">GET</option>
                    <option value="post">POST</option>
                    <option value="put">PUT</option>
                    <option value="delete">DELETE</option>
                </select>
            </div>
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
      const entityEndpoints = routesByEntity[entity];
      const entityIcon = this.getEntityIcon(entity);
      
      htmlContent += `
            <h2 class="entity-title" id="entity-${entity}">
                <span class="entity-icon"><i class="${entityIcon}"></i></span>
                ${entity.charAt(0).toUpperCase() + entity.slice(1)}
                <span class="endpoint-counter">(${entityEndpoints.length} endpoints)</span>
            </h2>
            <div class="entity-group" data-entity="${entity}">
      `;

      entityEndpoints.forEach(route => {
        const methodClass = route.method.toLowerCase();
        const routePath = route.path;
        const fullPath = `/api${routePath}`;
        
        htmlContent += `
                <div class="endpoint" data-method="${methodClass}">
                    <div class="endpoint-header">
                        <span class="method ${methodClass}">${route.method.toUpperCase()}</span>
                        <div class="endpoint-path">
                            <span>${fullPath}</span>
                            <button class="copy-btn" onclick="copyToClipboard('${fullPath}')"><i class="fas fa-copy"></i> Copier</button>
                        </div>
                        <button class="try-btn" onclick="prepareForPostman('${route.method.toUpperCase()}', '${fullPath}')">
                            <i class="fas fa-play"></i> Tester dans Postman
                        </button>
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
                            <h3 class="section-title"><i class="fas fa-list-ul"></i> Paramètres</h3>
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
                                        <td>${param.required ? '<i class="fas fa-check" style="color: var(--success-color);"></i>' : '<i class="fas fa-times" style="color: var(--accent-color);"></i>'}</td>
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
        
        // Create tabs for request/response
        htmlContent += `
                        <div class="tabs">
                            <div class="tab ${route.requestBody ? 'active' : ''}" onclick="switchTab(this, 'request-${route.method}-${routePath.replace(/\//g, '-')}')">
                                <i class="fas fa-paper-plane"></i> Requête
                            </div>
                            <div class="tab ${!route.requestBody ? 'active' : ''}" onclick="switchTab(this, 'response-${route.method}-${routePath.replace(/\//g, '-')}')">
                                <i class="fas fa-reply"></i> Réponse
                            </div>
                        </div>
        `;
        
        // Request body tab content
        htmlContent += `
                        <div id="request-${route.method}-${routePath.replace(/\//g, '-')}" class="tab-content ${route.requestBody ? 'active' : ''}">
        `;
        
        // Request body section (if any)
        if (route.requestBody) {
          htmlContent += `
                            <div class="body-section">
                                <h3 class="section-title"><i class="fas fa-file-code"></i> Corps de la Requête</h3>
                                <div class="code-block">
                                    <div class="code-header">
                                        <span>JSON</span>
                                        <button class="copy-btn" onclick="copyToClipboard('${JSON.stringify(route.requestBody, null, 2)}')">
                                            <i class="fas fa-copy"></i> Copier
                                        </button>
                                    </div>
                                    <pre><code>${JSON.stringify(route.requestBody, null, 2)}</code></pre>
                                </div>
                            </div>
          `;
        } else {
          htmlContent += `
                            <div class="body-section">
                                <p>Aucun corps de requête nécessaire pour cette méthode.</p>
                            </div>
          `;
        }
        
        htmlContent += `
                        </div>
        `;
        
        // Response tab content
        htmlContent += `
                        <div id="response-${route.method}-${routePath.replace(/\//g, '-')}" class="tab-content ${!route.requestBody ? 'active' : ''}">
                            <div class="response-section">
                                <h3 class="section-title"><i class="fas fa-reply-all"></i> Réponse</h3>
        `;
                            
        // Add status class based on response status code
        let statusClass = 'status-success';
        if (route.response.status >= 400) {
          statusClass = 'status-error';
        } else if (route.response.status >= 300) {
          statusClass = 'status-warning';
        }
        
        htmlContent += `
                                <div class="response-status ${statusClass}">
                                    <i class="fas fa-${route.response.status < 300 ? 'check-circle' : (route.response.status < 400 ? 'exclamation-triangle' : 'times-circle')}"></i>
                                    Status: ${route.response.status}
                                </div>
                                <div class="code-block">
                                    <div class="code-header">
                                        <span>JSON</span>
                                        <button class="copy-btn" onclick="copyToClipboard('${JSON.stringify(route.response, null, 2)}')">
                                            <i class="fas fa-copy"></i> Copier
                                        </button>
                                    </div>
                                    <pre><code>${JSON.stringify(route.response, null, 2)}</code></pre>
                                </div>
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
            <p>Version 1.0</p>
        </footer>
    </div>
    
    <div id="toast" class="toast">
        <i class="fas fa-check-circle"></i>
        <span id="toast-message"></span>
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
            
            // Show toast notification
            showToast('API copiée avec succès!');
        }
        
        // Toast notification
        function showToast(message) {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toast-message');
            
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
        
        // Prepare for Postman
        function prepareForPostman(method, url) {
            const baseUrl = document.getElementById('baseUrlDisplay').textContent;
            const fullUrl = baseUrl.substring(0, baseUrl.indexOf('/api')) + url;
            
            // Create Postman collection JSON
            const postmanCollection = {
                "info": {
                    "name": "JenCity API - " + url,
                    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
                },
                "item": [
                    {
                        "name": method + " " + url,
                        "request": {
                            "method": method,
                            "header": [
                                {
                                    "key": "Content-Type",
                                    "value": "application/json"
                                }
                            ],
                            "url": {
                                "raw": fullUrl,
                                "protocol": fullUrl.startsWith("https") ? "https" : "http",
                                "host": fullUrl.replace(/^https?:\\/\\//, '').split('/')[0].split(':')[0].split('.'),
                                "port": baseUrl.split(':')[2] ? baseUrl.split(':')[2].split('/')[0] : "",
                                "path": fullUrl.replace(/^https?:\\/\\/[^\\/]+/, '').split('/').filter(p => p)
                            }
                        }
                    }
                ]
            };
            
            // Create a data URI for the Postman collection
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(postmanCollection));
            
            // Create a link to download the collection
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "JenCity_API_" + url.replace(/\\//g, '_') + ".postman_collection.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            
            showToast('Collection Postman créée!');
        }
        
        // Server configuration update
        document.getElementById('updateServerBtn').addEventListener('click', function() {
            const host = document.getElementById('serverHost').value || 'localhost';
            const port = document.getElementById('serverPort').value || '3000';
            const baseUrl = \`http://\${host}:\${port}/api\`;
            document.getElementById('baseUrlDisplay').textContent = baseUrl;
            
            showToast('Configuration du serveur mise à jour!');
        });
        
        // Copy base URL
        document.getElementById('copyBaseUrlBtn').addEventListener('click', function() {
            copyToClipboard(document.getElementById('baseUrlDisplay').textContent);
        });
        
        // Switch tabs
        function switchTab(tabElement, contentId) {
            // Remove active class from all tabs in the same group
            const tabContainer = tabElement.parentElement;
            const tabs = tabContainer.querySelectorAll('.tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            tabElement.classList.add('active');
            
            // Hide all tab content in the same endpoint
            const endpoint = tabContainer.closest('.endpoint');
            const tabContents = endpoint.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show the selected tab content
            document.getElementById(contentId).classList.add('active');
        }
        
        // Entity filtering
        document.getElementById('entityFilter').addEventListener('change', function() {
            applyFilters();
        });
        
        // Method filtering
        document.getElementById('methodFilter').addEventListener('change', function() {
            applyFilters();
        });
        
        function applyFilters() {
            const selectedEntity = document.getElementById('entityFilter').value;
            const selectedMethod = document.getElementById('methodFilter').value;
            
            const entityGroups = document.querySelectorAll('.entity-group');
            const entityTitles = document.querySelectorAll('.entity-title');
            const endpoints = document.querySelectorAll('.endpoint');
            
            // First, handle entity filtering
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
            
            // Then, handle method filtering
            if (selectedMethod !== 'all') {
                endpoints.forEach(endpoint => {
                    if (endpoint.dataset.method === selectedMethod) {
                        endpoint.classList.remove('hidden');
                    } else {
                        endpoint.classList.add('hidden');
                    }
                });
            } else {
                endpoints.forEach(endpoint => endpoint.classList.remove('hidden'));
            }
            
            // Update endpoint counters
            updateEndpointCounters();
        }
        
        function updateEndpointCounters() {
            const entityGroups = document.querySelectorAll('.entity-group:not(.hidden)');
            
            entityGroups.forEach(group => {
                const entityName = group.dataset.entity;
                const visibleEndpoints = group.querySelectorAll('.endpoint:not(.hidden)').length;
                const counterElement = document.querySelector(\`#entity-\${entityName} .endpoint-counter\`);
                
                if (counterElement) {
                    counterElement.textContent = \`(\${visibleEndpoints} endpoints)\`;
                }
            });
        }
    </script>
</body>
</html>`;

    fs.writeFileSync(htmlFilePath, htmlContent);
    console.log(`HTML API documentation generated at: ${htmlFilePath}`);
  }

  getEntityIcon(entity) {
    const icons = {
      users: 'fas fa-users',
      places: 'fas fa-map-marker-alt',
      events: 'fas fa-calendar-alt',
      messages: 'fas fa-comments',
      reviews: 'fas fa-star',
      reservations: 'fas fa-ticket-alt'
    };
    
    return icons[entity] || 'fas fa-code';
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
