
const generateDocTemplate = (routes, entities) => {
  // Get unique entities from routes
  const uniqueEntities = [...new Set(routes.map(route => {
    const parts = route.path.split('/');
    return parts[1]; // First part after initial slash
  }))];

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JenCity API Documentation</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.2/vis-network.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vis-data/7.1.4/vis-data.min.js"></script>
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
        
        /* Diagram styles */
        .diagram-container {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid var(--border-color);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
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
            margin: 0;
        }
        
        .diagram-tabs {
            display: flex;
            gap: 10px;
        }
        
        .diagram-tab {
            padding: 8px 16px;
            background-color: #f5f7f9;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .diagram-tab.active {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        
        #diagram-canvas {
            height: 600px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            margin-bottom: 20px;
        }
        
        .table-entities, .relationship-list {
            display: none;
        }
        
        .entity-card {
            border: 1px solid var(--border-color);
            border-radius: 6px;
            margin-bottom: 20px;
            overflow: hidden;
        }
        
        .entity-header {
            background-color: var(--secondary-color);
            color: white;
            padding: 10px 15px;
            font-size: 1.2rem;
        }
        
        .entity-body {
            padding: 15px;
        }
        
        .entity-field {
            padding: 8px 0;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
        }
        
        .entity-field:last-child {
            border-bottom: none;
        }
        
        .field-name {
            font-weight: 600;
        }
        
        .field-type {
            color: #666;
            background-color: #f5f7f9;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.9rem;
        }
        
        .relationship-item {
            background-color: white;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .relationship-type {
            background-color: var(--primary-color);
            color: white;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.9rem;
        }
        
        .diagram-loading {
            text-align: center;
            padding: 20px;
            font-size: 1.2rem;
            color: #666;
        }
        
        .diagram-controls {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .diagram-controls button {
            padding: 8px 15px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .diagram-controls button:hover {
            background-color: #2980b9;
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
        
        /* Code Tabs */
        .code-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .code-tab {
            padding: 5px 10px;
            background-color: #eee;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        
        .code-tab.active {
            background-color: var(--primary-color);
            color: white;
        }
        
        .code-content {
            display: none;
        }
        
        .code-content.active {
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1><i class="fas fa-code"></i> JenCity API Documentation</h1>
            <p class="api-description">Documentation complète des API pour l'application JenCity</p>
        </header>
        
        <!-- Class Diagram -->
        <div class="diagram-container">
            <div class="diagram-header">
                <h2 class="diagram-title"><i class="fas fa-project-diagram"></i> Diagramme de Classe</h2>
                <div class="diagram-tabs">
                    <div class="diagram-tab active" data-tab="diagram">Diagramme</div>
                    <div class="diagram-tab" data-tab="entities">Tables</div>
                    <div class="diagram-tab" data-tab="relationships">Relations</div>
                </div>
            </div>
            
            <!-- Diagram Tab -->
            <div class="diagram-content active" id="diagram-content">
                <div class="diagram-controls">
                    <button id="zoom-in"><i class="fas fa-search-plus"></i> Zoom In</button>
                    <button id="zoom-out"><i class="fas fa-search-minus"></i> Zoom Out</button>
                    <button id="reset-view"><i class="fas fa-sync"></i> Reset View</button>
                </div>
                <div id="diagram-canvas"></div>
            </div>
            
            <!-- Tables Tab -->
            <div class="diagram-content table-entities" id="entities-content">
                <div class="entity-list">
                    ${entities.map(entity => `
                    <div class="entity-card">
                        <div class="entity-header">
                            ${entity.name}
                        </div>
                        <div class="entity-body">
                            ${entity.fields.map(field => `
                            <div class="entity-field">
                                <span class="field-name">${field.name}${field.isPrimary ? ' <i class="fas fa-key" title="Primary Key"></i>' : ''}</span>
                                <span class="field-type">${field.type}</span>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Relationships Tab -->
            <div class="diagram-content relationship-list" id="relationships-content">
                ${entities.map(entity => 
                    entity.relations ? 
                    entity.relations.map(relation => `
                    <div class="relationship-item">
                        <div class="relationship-entities">
                            <strong>${entity.name}</strong> <i class="fas fa-arrow-right"></i> <strong>${relation.entity}</strong>
                        </div>
                        <div class="relationship-details">
                            <span class="relationship-type">${relation.type}</span>
                            <span>via ${relation.via}</span>
                        </div>
                    </div>
                    `).join('') : '').join('')}
            </div>
        </div>
        
        <!-- Server Configuration -->
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
        
        <!-- API Filtering -->
        <div class="filter-container">
            <div class="filter-title"><i class="fas fa-filter"></i> Filtrer les API</div>
            <div class="filter-options">
                <select id="entityFilter">
                    <option value="all">Toutes les entités</option>
                    ${uniqueEntities.map(entity => `<option value="${entity}">${entity.charAt(0).toUpperCase() + entity.slice(1)}</option>`).join('')}
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
        
        <!-- API Endpoints -->
        <div class="endpoint-list">
            ${uniqueEntities.map(entity => {
                const entityRoutes = routes.filter(route => route.path.startsWith('/'+entity));
                return `
                <h2 class="entity-title" id="entity-${entity}">
                    <span class="entity-icon"><i class="fas ${entity === 'users' ? 'fa-users' : 
                                                 entity === 'places' ? 'fa-map-marker-alt' : 
                                                 entity === 'events' ? 'fa-calendar-alt' : 
                                                 entity === 'messages' ? 'fa-comments' : 
                                                 entity === 'reviews' ? 'fa-star' : 
                                                 entity === 'reservations' ? 'fa-ticket-alt' : 'fa-code'}"></i></span>
                    ${entity.charAt(0).toUpperCase() + entity.slice(1)}
                    <span class="endpoint-counter">(${entityRoutes.length} endpoints)</span>
                </h2>
                <div class="entity-group" data-entity="${entity}">
                    ${entityRoutes.map(route => {
                        const methodClass = route.method.toLowerCase();
                        const path = route.path;
                        
                        let curlCommand = "curl -X " + route.method.toUpperCase() + " \"http://localhost:3000/api" + path + "\"";
                        
                        if (route.requestBody) {
                            curlCommand += " -H \"Content-Type: application/json\" -d '" + JSON.stringify(route.requestBody) + "'";
                        }
                        
                        return `
                        <div class="endpoint" data-method="${methodClass}">
                            <div class="endpoint-header">
                                <span class="method ${methodClass}">${route.method.toUpperCase()}</span>
                                <div class="endpoint-path">
                                    <span>/api${path}</span>
                                    <button class="copy-btn" onclick="copyToClipboard('/api${path}')">
                                        <i class="fas fa-copy"></i> Copier
                                    </button>
                                </div>
                                <button class="try-btn" onclick="prepareForPostman('${route.method.toUpperCase()}', '/api${path}')">
                                    <i class="fas fa-play"></i> Tester dans Postman
                                </button>
                            </div>
                            <div class="endpoint-body">
                                <div class="endpoint-description">
                                    ${route.description}
                                </div>
                                
                                ${route.params && route.params.length > 0 ? `
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
                                            ${route.params.map(param => `
                                            <tr>
                                                <td>${param.name}</td>
                                                <td>${param.type}</td>
                                                <td>${param.required ? '<i class="fas fa-check" style="color: var(--success-color);"></i>' : '<i class="fas fa-times" style="color: var(--accent-color);"></i>'}</td>
                                                <td>${param.description}</td>
                                            </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                                ` : ''}
                                
                                <div class="code-tabs">
                                    <div class="code-tab active" onclick="switchCodeTab(this, 'curl-${methodClass}-${path.replace(/\//g, '-')}')">cURL</div>
                                    <div class="code-tab" onclick="switchCodeTab(this, 'fetch-${methodClass}-${path.replace(/\//g, '-')}')">Fetch</div>
                                    <div class="code-tab" onclick="switchCodeTab(this, 'axios-${methodClass}-${path.replace(/\//g, '-')}')">Axios</div>
                                </div>
                                
                                <div id="curl-${methodClass}-${path.replace(/\//g, '-')}" class="code-content active">
                                    <div class="code-block">
                                        <div class="code-header">
                                            <span>cURL</span>
                                            <button class="copy-btn" onclick="copyToClipboard(\`${curlCommand}\`)">
                                                <i class="fas fa-copy"></i> Copier
                                            </button>
                                        </div>
                                        <pre><code>${curlCommand}</code></pre>
                                    </div>
                                </div>
                                
                                <div id="fetch-${methodClass}-${path.replace(/\//g, '-')}" class="code-content">
                                    <div class="code-block">
                                        <div class="code-header">
                                            <span>JavaScript (Fetch API)</span>
                                            <button class="copy-btn" onclick="copyToClipboard(document.querySelector('#fetch-${methodClass}-${path.replace(/\//g, '-')} pre code').textContent)">
                                                <i class="fas fa-copy"></i> Copier
                                            </button>
                                        </div>
                                        <pre><code>${getFetchCode(route)}</code></pre>
                                    </div>
                                </div>
                                
                                <div id="axios-${methodClass}-${path.replace(/\//g, '-')}" class="code-content">
                                    <div class="code-block">
                                        <div class="code-header">
                                            <span>JavaScript (Axios)</span>
                                            <button class="copy-btn" onclick="copyToClipboard(document.querySelector('#axios-${methodClass}-${path.replace(/\//g, '-')} pre code').textContent)">
                                                <i class="fas fa-copy"></i> Copier
                                            </button>
                                        </div>
                                        <pre><code>${getAxiosCode(route)}</code></pre>
                                    </div>
                                </div>
                                
                                <!-- Tabs for request/response -->
                                <div class="tabs">
                                    <div class="tab ${route.requestBody ? 'active' : ''}" onclick="switchTab(this, 'request-${methodClass}-${path.replace(/\//g, '-')}')">
                                        <i class="fas fa-paper-plane"></i> Requête
                                    </div>
                                    <div class="tab ${!route.requestBody ? 'active' : ''}" onclick="switchTab(this, 'response-${methodClass}-${path.replace(/\//g, '-')}')">
                                        <i class="fas fa-reply"></i> Réponse
                                    </div>
                                </div>
                                
                                <!-- Request Body Tab -->
                                <div id="request-${methodClass}-${path.replace(/\//g, '-')}" class="tab-content ${route.requestBody ? 'active' : ''}">
                                    ${route.requestBody ? `
                                    <div class="body-section">
                                        <h3 class="section-title"><i class="fas fa-file-code"></i> Corps de la Requête</h3>
                                        <div class="code-block">
                                            <div class="code-header">
                                                <span>JSON</span>
                                                <button class="copy-btn" onclick="copyToClipboard(JSON.stringify(${JSON.stringify(route.requestBody)}, null, 2))">
                                                    <i class="fas fa-copy"></i> Copier
                                                </button>
                                            </div>
                                            <pre><code>${JSON.stringify(route.requestBody, null, 2)}</code></pre>
                                        </div>
                                    </div>
                                    ` : `
                                    <div class="body-section">
                                        <p>Aucun corps de requête nécessaire pour cette méthode.</p>
                                    </div>
                                    `}
                                </div>
                                
                                <!-- Response Tab -->
                                <div id="response-${methodClass}-${path.replace(/\//g, '-')}" class="tab-content ${!route.requestBody ? 'active' : ''}">
                                    <div class="response-section">
                                        <h3 class="section-title"><i class="fas fa-reply-all"></i> Réponse</h3>
                                        
                                        ${(() => {
                                            let statusClass = 'status-success';
                                            if (route.response.status >= 400) {
                                                statusClass = 'status-error';
                                            } else if (route.response.status >= 300) {
                                                statusClass = 'status-warning';
                                            }
                                            
                                            return `
                                            <div class="response-status ${statusClass}">
                                                <i class="fas fa-${route.response.status < 300 ? 'check-circle' : (route.response.status < 400 ? 'exclamation-triangle' : 'times-circle')}"></i>
                                                Status: ${route.response.status}
                                            </div>
                                            `;
                                        })()}
                                        
                                        <div class="code-block">
                                            <div class="code-header">
                                                <span>JSON</span>
                                                <button class="copy-btn" onclick="copyToClipboard(JSON.stringify(${JSON.stringify(route.response)}, null, 2))">
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
                    }).join('')}
                </div>
                `;
            }).join('')}
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
        // Network diagram visualization
        document.addEventListener('DOMContentLoaded', function() {
            // Create data for the diagram
            const nodes = new vis.DataSet(${JSON.stringify(entities.map((entity, index) => ({
                id: entity.name,
                label: entity.name,
                shape: 'box',
                color: {
                    background: '#3498db',
                    border: '#2980b9',
                    highlight: {
                        background: '#2980b9',
                        border: '#1c6ea4'
                    }
                },
                font: { color: 'white' }
            })))});
            
            // Create edges from relationships
            const edges = new vis.DataSet(
                ${JSON.stringify(entities.flatMap(entity => 
                    entity.relations ? 
                    entity.relations.map(relation => ({
                        from: entity.name,
                        to: relation.entity,
                        label: relation.type,
                        arrows: relation.type.includes('hasMany') ? 'to' : (relation.type.includes('belongsTo') ? 'from' : 'to, from'),
                        color: { color: '#3498db' },
                        font: { align: 'middle' }
                    })) : []
                ))}
            );
            
            // Create a network
            const container = document.getElementById('diagram-canvas');
            const data = { nodes, edges };
            const options = {
                nodes: {
                    shape: 'box',
                    margin: 10,
                    widthConstraint: {
                        maximum: 150
                    }
                },
                edges: {
                    smooth: {
                        type: 'cubicBezier',
                        forceDirection: 'horizontal',
                        roundness: 0.5
                    }
                },
                layout: {
                    hierarchical: {
                        direction: 'LR',
                        sortMethod: 'directed',
                        nodeSpacing: 150,
                        levelSeparation: 150
                    }
                },
                physics: {
                    hierarchicalRepulsion: {
                        nodeDistance: 200
                    }
                }
            };
            const network = new vis.Network(container, data, options);
            
            // Zoom controls
            document.getElementById('zoom-in').addEventListener('click', function() {
                const scale = network.getScale() * 1.2;
                network.moveTo({ scale: scale });
            });
            
            document.getElementById('zoom-out').addEventListener('click', function() {
                const scale = network.getScale() * 0.8;
                network.moveTo({ scale: scale });
            });
            
            document.getElementById('reset-view').addEventListener('click', function() {
                network.fit();
            });
            
            // Tab switching
            const diagramTabs = document.querySelectorAll('.diagram-tab');
            diagramTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs
                    diagramTabs.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    this.classList.add('active');
                    
                    // Hide all content
                    document.querySelectorAll('.diagram-content').forEach(content => {
                        content.classList.remove('active');
                        
                        if (this.dataset.tab === 'diagram') {
                            document.getElementById('diagram-content').classList.add('active');
                        } else if (this.dataset.tab === 'entities') {
                            document.getElementById('entities-content').style.display = 'block';
                            document.getElementById('entities-content').classList.add('active');
                        } else if (this.dataset.tab === 'relationships') {
                            document.getElementById('relationships-content').style.display = 'block';
                            document.getElementById('relationships-content').classList.add('active');
                        }
                    });
                });
            });
        });
        
        // Copy to clipboard functionality
        function copyToClipboard(text) {
            const tempInput = document.createElement('textarea');
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Show toast notification
            showToast('Copié avec succès!');
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
        
        // Switch code tabs
        function switchCodeTab(tabElement, contentId) {
            // Remove active class from all tabs in the same group
            const tabContainer = tabElement.parentElement;
            const tabs = tabContainer.querySelectorAll('.code-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            tabElement.classList.add('active');
            
            // Hide all tab content in the same endpoint
            const endpoint = tabContainer.closest('.endpoint-body');
            const tabContents = endpoint.querySelectorAll('.code-content');
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
};

// Helper function to generate Fetch code examples
const getFetchCode = (route) => {
  const { method, path, requestBody } = route;
  const url = \`http://localhost:3000/api\${path}\`;
  
  let code = \`const response = await fetch('\${url}', {
  method: '\${method.toUpperCase()}',\`;
  
  if (requestBody) {
    code += \`
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(\${JSON.stringify(requestBody, null, 2)}),\`;
  }
  
  code += \`
});\n
const data = await response.json();
console.log(data);\`;
  
  return code;
};

// Helper function to generate Axios code examples
const getAxiosCode = (route) => {
  const { method, path, requestBody } = route;
  const url = \`http://localhost:3000/api\${path}\`;
  
  let code = \`import axios from 'axios';\n\n\`;
  
  code += \`try {
  const response = await axios.\${method.toLowerCase()}('\${url}'`;
  
  if (requestBody && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put')) {
    code += \`, \${JSON.stringify(requestBody, null, 2)}\`;
  }
  
  code += \`);\n
  console.log(response.data);
} catch (error) {
  console.error('Error:', error);
}\`;
  
  return code;
};

module.exports = { generateDocTemplate };
