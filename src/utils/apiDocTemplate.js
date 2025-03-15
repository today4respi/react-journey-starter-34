
// This is a simplified version to fix the template string issue
const fs = require('fs');
const path = require('path');

function generateDocTemplate(apiRoutes, entityDefinitions) {
  // Create the base HTML structure
  let html = `
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
        
        /* Entity diagram styles */
        .entity-diagram {
            margin: 30px 0;
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: 1px solid var(--border-color);
        }
        
        .diagram-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .diagram-title {
            font-size: 1.5rem;
            color: var(--secondary-color);
        }
        
        .diagram-controls {
            display: flex;
            gap: 10px;
        }
        
        .diagram-btn {
            padding: 8px 15px;
            background-color: var(--light-gray);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s;
        }
        
        .diagram-btn:hover {
            background-color: var(--primary-color);
            color: white;
        }
        
        .diagram-btn.active {
            background-color: var(--primary-color);
            color: white;
        }
        
        .diagram-container {
            overflow: auto;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background-color: #fcfcfc;
            min-height: 400px;
            padding: 10px;
        }
        
        .diagram-svg {
            min-width: 100%;
            min-height: 400px;
        }
        
        .entity-box {
            stroke: var(--secondary-color);
            stroke-width: 2;
            fill: white;
            rx: 5;
            ry: 5;
        }
        
        .entity-title-bg {
            fill: var(--secondary-color);
            rx: 5;
            ry: 5;
        }
        
        .entity-title-text {
            fill: white;
            font-weight: bold;
            text-anchor: middle;
            dominant-baseline: middle;
        }
        
        .entity-field {
            fill: var(--text-color);
            text-anchor: start;
            dominant-baseline: middle;
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }
        
        .field-type {
            fill: #777;
            text-anchor: end;
            dominant-baseline: middle;
            font-family: 'Courier New', monospace;
            font-size: 11px;
        }
        
        .entity-relation {
            stroke: var(--primary-color);
            stroke-width: 2;
            fill: none;
            marker-end: url(#arrowhead);
        }
        
        .relation-text {
            fill: var(--primary-color);
            font-size: 12px;
            text-anchor: middle;
            dominant-baseline: hanging;
        }
        
        .entity-table {
            margin-top: 30px;
            width: 100%;
            border-collapse: collapse;
        }
        
        .entity-table th {
            background-color: var(--secondary-color);
            color: white;
            padding: 10px;
            text-align: left;
        }
        
        .entity-table td {
            padding: 8px 10px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .entity-table tr:nth-child(even) {
            background-color: var(--light-gray);
        }
        
        /* Rest of the styles */
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
  `;

  // Add the entity diagram
  html += `
        <div class="entity-diagram">
            <div class="diagram-header">
                <h2 class="diagram-title"><i class="fas fa-project-diagram"></i> Modèle de Données</h2>
                <div class="diagram-controls">
                    <button class="diagram-btn active" id="view-diagram">Diagramme</button>
                    <button class="diagram-btn" id="view-tables">Tables</button>
                    <button class="diagram-btn" id="view-relations">Relations</button>
                </div>
            </div>
            <div class="diagram-container">
                <svg id="entity-diagram-svg" class="diagram-svg"></svg>
            </div>
            
            <div id="entity-tables" class="entity-table-container" style="display: none;">
                <table class="entity-table">
                    <thead>
                        <tr>
                            <th>Table</th>
                            <th>Champs</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody id="entity-table-body">
                        <!-- Tables will be generated here by JavaScript -->
                    </tbody>
                </table>
            </div>
            
            <div id="entity-relations" class="entity-table-container" style="display: none;">
                <table class="entity-table">
                    <thead>
                        <tr>
                            <th>De</th>
                            <th>Relation</th>
                            <th>Vers</th>
                            <th>Via</th>
                        </tr>
                    </thead>
                    <tbody id="relation-table-body">
                        <!-- Relations will be generated here by JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
  `;

  // Server configuration
  html += `
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
  `;

  // Extract unique entities from routes
  const entities = new Set();
  apiRoutes.forEach(route => {
    const entity = route.path.split('/')[1];
    if (entity) entities.add(entity);
  });

  // Add entity options
  entities.forEach(entity => {
    html += `                    <option value="${entity}">${entity.charAt(0).toUpperCase() + entity.slice(1)}</option>
    `;
  });

  html += `
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

  // Group routes by entity
  const routesByEntity = {};
  entities.forEach(entity => {
    routesByEntity[entity] = apiRoutes.filter(route => route.path.startsWith(`/${entity}`));
  });

  // Add endpoints grouped by entity
  entities.forEach(entity => {
    const entityEndpoints = routesByEntity[entity];
    const entityIcon = getEntityIcon(entity);
    
    html += `
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
      
      html += `
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
        html += `
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
          html += `
                                    <tr>
                                        <td>${param.name}</td>
                                        <td>${param.type}</td>
                                        <td>${param.required ? '<i class="fas fa-check" style="color: var(--success-color);"></i>' : '<i class="fas fa-times" style="color: var(--accent-color);"></i>'}</td>
                                        <td>${param.description}</td>
                                    </tr>
          `;
        });
        
        html += `
                                </tbody>
                            </table>
                        </div>
        `;
      }
      
      // Create tabs for request/response
      html += `
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
      html += `
                        <div id="request-${route.method}-${routePath.replace(/\//g, '-')}" class="tab-content ${route.requestBody ? 'active' : ''}">
      `;
      
      // Request body section (if any)
      if (route.requestBody) {
        html += `
                            <div class="body-section">
                                <h3 class="section-title"><i class="fas fa-file-code"></i> Corps de la Requête</h3>
                                <div class="code-block">
                                    <div class="code-header">
                                        <span>JSON</span>
                                        <button class="copy-btn" onclick="copyToClipboard('${JSON.stringify(route.requestBody, null, 2).replace(/'/g, "\\'")}')">
                                            <i class="fas fa-copy"></i> Copier
                                        </button>
                                    </div>
                                    <pre><code>${JSON.stringify(route.requestBody, null, 2)}</code></pre>
                                </div>
                            </div>
        `;
      } else {
        html += `
                            <div class="body-section">
                                <p>Aucun corps de requête nécessaire pour cette méthode.</p>
                            </div>
        `;
      }
      
      html += `
                        </div>
      `;
      
      // Response tab content
      html += `
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
      
      html += `
                                <div class="response-status ${statusClass}">
                                    <i class="fas fa-${route.response.status < 300 ? 'check-circle' : (route.response.status < 400 ? 'exclamation-triangle' : 'times-circle')}"></i>
                                    Status: ${route.response.status}
                                </div>
                                <div class="code-block">
                                    <div class="code-header">
                                        <span>JSON</span>
                                        <button class="copy-btn" onclick="copyToClipboard('${JSON.stringify(route.response, null, 2).replace(/'/g, "\\'")}')">
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
    
    html += `
            </div>
    `;
  });

  // Complete the HTML
  html += `
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
        // Global variables for the entity diagram
        const entityDefinitions = ${JSON.stringify(entityDefinitions)};
        
        // Initialize the diagram when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            // Set up entity diagram
            initializeEntityDiagram();
            
            // Set up view toggle buttons
            document.getElementById('view-diagram').addEventListener('click', function() {
                document.getElementById('entity-diagram-svg').parentNode.style.display = 'block';
                document.getElementById('entity-tables').style.display = 'none';
                document.getElementById('entity-relations').style.display = 'none';
                
                document.querySelectorAll('.diagram-btn').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
            
            document.getElementById('view-tables').addEventListener('click', function() {
                document.getElementById('entity-diagram-svg').parentNode.style.display = 'none';
                document.getElementById('entity-tables').style.display = 'block';
                document.getElementById('entity-relations').style.display = 'none';
                
                document.querySelectorAll('.diagram-btn').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                generateEntityTables();
            });
            
            document.getElementById('view-relations').addEventListener('click', function() {
                document.getElementById('entity-diagram-svg').parentNode.style.display = 'none';
                document.getElementById('entity-tables').style.display = 'none';
                document.getElementById('entity-relations').style.display = 'block';
                
                document.querySelectorAll('.diagram-btn').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                generateRelationTables();
            });
        });
        
        function initializeEntityDiagram() {
            const svg = document.getElementById('entity-diagram-svg');
            
            // Define the SVG namespace
            const svgNS = "http://www.w3.org/2000/svg";
            
            // Clear existing content
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }
            
            // Add marker definition for arrows
            const defs = document.createElementNS(svgNS, "defs");
            svg.appendChild(defs);
            
            const marker = document.createElementNS(svgNS, "marker");
            marker.setAttribute("id", "arrowhead");
            marker.setAttribute("markerWidth", "10");
            marker.setAttribute("markerHeight", "7");
            marker.setAttribute("refX", "10");
            marker.setAttribute("refY", "3.5");
            marker.setAttribute("orient", "auto");
            defs.appendChild(marker);
            
            const polygon = document.createElementNS(svgNS, "polygon");
            polygon.setAttribute("points", "0 0, 10 3.5, 0 7");
            polygon.setAttribute("fill", "#3498db");
            marker.appendChild(polygon);
            
            // Calculate layout
            const padding = 30;
            const entityWidth = 220;
            const entityHeaderHeight = 40;
            const fieldHeight = 25;
            const hSpacing = 100;
            const vSpacing = 70;
            
            let maxCols = Math.min(3, entityDefinitions.length);
            let cols = Math.min(maxCols, entityDefinitions.length);
            let rows = Math.ceil(entityDefinitions.length / cols);
            
            // Calculate total width and height
            const totalWidth = cols * entityWidth + (cols - 1) * hSpacing + 2 * padding;
            
            // Positioning variables
            const entityPositions = {};
            const entitySizes = {};
            
            // First pass: create entity boxes and calculate their positions and sizes
            entityDefinitions.forEach((entity, index) => {
                const col = index % cols;
                const row = Math.floor(index / cols);
                
                const x = padding + col * (entityWidth + hSpacing);
                const fields = entity.fields || [];
                const entityHeight = entityHeaderHeight + fields.length * fieldHeight + 10;
                
                let y = padding + row * (vSpacing);
                
                // Maximum height for an entity in a row
                const rowEntities = entityDefinitions.slice(row * cols, Math.min((row + 1) * cols, entityDefinitions.length));
                const maxHeightInRow = Math.max(...rowEntities.map(e => (e.fields || []).length)) * fieldHeight + entityHeaderHeight + 10;
                
                y += row * maxHeightInRow;
                
                entityPositions[entity.name] = { x, y };
                entitySizes[entity.name] = { width: entityWidth, height: entityHeight };
                
                // Create the entity box
                const entityBox = document.createElementNS(svgNS, "rect");
                entityBox.setAttribute("x", x);
                entityBox.setAttribute("y", y);
                entityBox.setAttribute("width", entityWidth);
                entityBox.setAttribute("height", entityHeight);
                entityBox.setAttribute("class", "entity-box");
                svg.appendChild(entityBox);
                
                // Create the entity title background
                const titleBg = document.createElementNS(svgNS, "rect");
                titleBg.setAttribute("x", x);
                titleBg.setAttribute("y", y);
                titleBg.setAttribute("width", entityWidth);
                titleBg.setAttribute("height", entityHeaderHeight);
                titleBg.setAttribute("class", "entity-title-bg");
                svg.appendChild(titleBg);
                
                // Create the entity title
                const titleText = document.createElementNS(svgNS, "text");
                titleText.setAttribute("x", x + entityWidth / 2);
                titleText.setAttribute("y", y + entityHeaderHeight / 2);
                titleText.setAttribute("class", "entity-title-text");
                titleText.textContent = entity.name;
                svg.appendChild(titleText);
                
                // Add fields
                fields.forEach((field, fieldIndex) => {
                    const fieldY = y + entityHeaderHeight + fieldIndex * fieldHeight + fieldHeight / 2 + 5;
                    
                    // Field name
                    const fieldText = document.createElementNS(svgNS, "text");
                    fieldText.setAttribute("x", x + 10);
                    fieldText.setAttribute("y", fieldY);
                    fieldText.setAttribute("class", "entity-field");
                    fieldText.textContent = field.isPrimary ? "* " + field.name : field.name;
                    svg.appendChild(fieldText);
                    
                    // Field type
                    const typeText = document.createElementNS(svgNS, "text");
                    typeText.setAttribute("x", x + entityWidth - 10);
                    typeText.setAttribute("y", fieldY);
                    typeText.setAttribute("class", "field-type");
                    typeText.textContent = field.type;
                    svg.appendChild(typeText);
                });
            });
            
            // Calculate total diagram height based on entity positions and sizes
            let maxBottom = 0;
            Object.keys(entityPositions).forEach(entityName => {
                const pos = entityPositions[entityName];
                const size = entitySizes[entityName];
                const bottom = pos.y + size.height;
                if (bottom > maxBottom) maxBottom = bottom;
            });
            
            const totalHeight = maxBottom + padding;
            
            // Set SVG dimensions
            svg.setAttribute("width", totalWidth);
            svg.setAttribute("height", totalHeight);
            svg.setAttribute("viewBox", "0 0 " + totalWidth + " " + totalHeight);
            
            // Second pass: draw relations
            entityDefinitions.forEach(entity => {
                if (!entity.relations) return;
                
                entity.relations.forEach(relation => {
                    const sourcePos = entityPositions[entity.name];
                    const targetPos = entityPositions[relation.entity];
                    
                    if (!sourcePos || !targetPos) return;
                    
                    const sourceSize = entitySizes[entity.name];
                    const targetSize = entitySizes[relation.entity];
                    
                    // Calculate edge points
                    const sourceX = sourcePos.x + sourceSize.width / 2;
                    const sourceY = sourcePos.y + sourceSize.height / 2;
                    const targetX = targetPos.x + targetSize.width / 2;
                    const targetY = targetPos.y + targetSize.height / 2;
                    
                    // Determine connection points on entity boxes
                    let startX, startY, endX, endY;
                    
                    // Simple logic: connect from sides or top/bottom based on relative positions
                    if (Math.abs(sourceX - targetX) > Math.abs(sourceY - targetY)) {
                        // Connect horizontally
                        if (sourceX < targetX) {
                            // Source is to the left of target
                            startX = sourcePos.x + sourceSize.width;
                            startY = sourcePos.y + sourceSize.height / 2;
                            endX = targetPos.x;
                            endY = targetPos.y + targetSize.height / 2;
                        } else {
                            // Source is to the right of target
                            startX = sourcePos.x;
                            startY = sourcePos.y + sourceSize.height / 2;
                            endX = targetPos.x + targetSize.width;
                            endY = targetPos.y + targetSize.height / 2;
                        }
                    } else {
                        // Connect vertically
                        if (sourceY < targetY) {
                            // Source is above target
                            startX = sourcePos.x + sourceSize.width / 2;
                            startY = sourcePos.y + sourceSize.height;
                            endX = targetPos.x + targetSize.width / 2;
                            endY = targetPos.y;
                        } else {
                            // Source is below target
                            startX = sourcePos.x + sourceSize.width / 2;
                            startY = sourcePos.y;
                            endX = targetPos.x + targetSize.width / 2;
                            endY = targetPos.y + targetSize.height;
                        }
                    }
                    
                    // Create the relation line with a control point for a curve
                    const midX = (startX + endX) / 2;
                    const midY = (startY + endY) / 2;
                    
                    const path = document.createElementNS(svgNS, "path");
                    path.setAttribute("d", "M" + startX + "," + startY + " Q" + midX + "," + midY + " " + endX + "," + endY);
                    path.setAttribute("class", "entity-relation");
                    path.setAttribute("marker-end", "url(#arrowhead)");
                    svg.appendChild(path);
                    
                    // Add relation type text
                    const relationText = document.createElementNS(svgNS, "text");
                    relationText.setAttribute("x", midX);
                    relationText.setAttribute("y", midY - 10);
                    relationText.setAttribute("class", "relation-text");
                    relationText.textContent = relation.type;
                    svg.appendChild(relationText);
                });
            });
        }
        
        function generateEntityTables() {
            const tableBody = document.getElementById('entity-table-body');
            tableBody.innerHTML = '';
            
            entityDefinitions.forEach(entity => {
                if (!entity.fields) return;
                
                // Group rows by entity with a header row
                const headerRow = document.createElement('tr');
                headerRow.style.backgroundColor = '#f0f0f0';
                
                const entityNameCell = document.createElement('td');
                entityNameCell.colSpan = 4;
                entityNameCell.style.fontWeight = 'bold';
                entityNameCell.textContent = entity.name;
                headerRow.appendChild(entityNameCell);
                
                tableBody.appendChild(headerRow);
                
                // Add field rows
                entity.fields.forEach(field => {
                    const row = document.createElement('tr');
                    
                    const tableCell = document.createElement('td');
                    tableCell.textContent = '';
                    row.appendChild(tableCell);
                    
                    const fieldCell = document.createElement('td');
                    fieldCell.textContent = field.isPrimary ? "* " + field.name : field.name;
                    row.appendChild(fieldCell);
                    
                    const typeCell = document.createElement('td');
                    typeCell.textContent = field.type;
                    row.appendChild(typeCell);
                    
                    const descCell = document.createElement('td');
                    descCell.textContent = field.description || '';
                    if (field.isPrivate) {
                        descCell.textContent += ' (Privé)';
                    }
                    if (field.reference) {
                        descCell.textContent += ' (Référence: ' + field.reference + ')';
                    }
                    row.appendChild(descCell);
                    
                    tableBody.appendChild(row);
                });
            });
        }
        
        function generateRelationTables() {
            const relationBody = document.getElementById('relation-table-body');
            relationBody.innerHTML = '';
            
            entityDefinitions.forEach(entity => {
                if (!entity.relations) return;
                
                entity.relations.forEach(relation => {
                    const row = document.createElement('tr');
                    
                    const fromCell = document.createElement('td');
                    fromCell.textContent = entity.name;
                    row.appendChild(fromCell);
                    
                    const relationCell = document.createElement('td');
                    relationCell.textContent = relation.type;
                    row.appendChild(relationCell);
                    
                    const toCell = document.createElement('td');
                    toCell.textContent = relation.entity;
                    row.appendChild(toCell);
                    
                    const viaCell = document.createElement('td');
                    viaCell.textContent = relation.via || '';
                    row.appendChild(viaCell);
                    
                    relationBody.appendChild(row);
                });
            });
        }
        
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
            const baseUrl = 'http://' + host + ':' + port + '/api';
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
                    if (title.id === 'entity-' + selectedEntity) {
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
                const counterElement = document.querySelector('#entity-' + entityName + ' .endpoint-counter');
                
                if (counterElement) {
                    counterElement.textContent = '(' + visibleEndpoints + ' endpoints)';
                }
            });
        }
    </script>
</body>
</html>`;

  return html;
}

// Helper function to get the icon class for an entity
function getEntityIcon(entity) {
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

module.exports = { generateDocTemplate };
