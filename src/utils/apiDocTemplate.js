
// API Documentation Template
const generateDocTemplate = (routes, entities) => {
  // Base styles and shared utilities  
  const baseUrl = '/api';
  
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JenCity API Documentation</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
      :root {
        --primary: #3498db;
        --primary-dark: #2980b9;
        --secondary: #2ecc71;
        --dark: #34495e;
        --danger: #e74c3c;
        --warning: #f39c12;
        --light: #f5f5f5;
        --gray: #95a5a6;
        --white: #ffffff;
        --border: #e0e0e0;
        --success: #27ae60;
        --code-bg: #f8f9fa;
      }
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f8f9fa;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      
      header {
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        color: white;
        padding: 30px 0;
        margin-bottom: 30px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      
      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      h1 {
        font-size: 2.5rem;
        margin-bottom: 10px;
        text-align: center;
      }
      
      .subtitle {
        font-size: 1.2rem;
        opacity: 0.9;
        margin-bottom: 20px;
        text-align: center;
      }
      
      .api-stats {
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
        margin-top: 20px;
      }
      
      .stat-item {
        background-color: rgba(255,255,255,0.2);
        padding: 10px 20px;
        border-radius: 50px;
        display: flex;
        align-items: center;
        backdrop-filter: blur(5px);
      }
      
      .stat-item i {
        margin-right: 10px;
      }
      
      .tabs {
        display: flex;
        justify-content: center;
        margin: 30px 0;
        gap: 10px;
      }
      
      .tab {
        padding: 10px 20px;
        background-color: var(--white);
        border: 1px solid var(--border);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .tab:hover {
        background-color: var(--light);
      }
      
      .tab.active {
        background-color: var(--primary);
        color: white;
        border-color: var(--primary);
      }
      
      .tab-content {
        display: none;
      }
      
      .tab-content.active {
        display: block;
      }
      
      .entity-diagram {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 40px;
      }
      
      .entities-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
        margin-bottom: 40px;
      }
      
      .entity-card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        width: calc(33.333% - 20px);
        min-width: 300px;
        margin-bottom: 20px;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .entity-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0,0,0,0.1);
      }
      
      .entity-header {
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        color: white;
        padding: 15px;
      }
      
      .entity-header h3 {
        margin: 0;
        font-size: 1.3rem;
      }
      
      .entity-body {
        padding: 15px;
      }
      
      .entity-field {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid var(--border);
      }
      
      .entity-field:last-child {
        border-bottom: none;
      }
      
      .field-name {
        font-weight: 500;
        display: flex;
        align-items: center;
      }
      
      .field-type {
        color: var(--gray);
        font-size: 0.9rem;
      }
      
      .primary-key {
        background-color: var(--primary);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.7rem;
        margin-left: 8px;
      }
      
      .optional-field {
        background-color: var(--warning);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.7rem;
        margin-left: 8px;
      }
      
      .private-field {
        background-color: var(--danger);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.7rem;
        margin-left: 8px;
      }
      
      .relations-section {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px dashed var(--border);
      }
      
      .relation {
        display: flex;
        align-items: center;
        margin: 8px 0;
        padding: 8px;
        background-color: var(--light);
        border-radius: 4px;
      }
      
      .relation-type {
        font-size: 0.8rem;
        background-color: var(--secondary);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        margin-right: 10px;
      }
      
      .relationship-diagram {
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        overflow: auto;
      }
      
      #diagram-container {
        min-height: 500px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .api-section {
        margin: 40px 0;
      }
      
      .section-title {
        font-size: 2rem;
        color: var(--dark);
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid var(--primary);
      }
      
      .endpoint-list {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 30px;
      }
      
      .endpoint-card {
        background-color: var(--white);
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        overflow: hidden;
        width: calc(50% - 15px);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      @media (max-width: 768px) {
        .endpoint-card {
          width: 100%;
        }
      }
      
      .endpoint-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      
      .endpoint-header {
        display: flex;
        padding: 15px;
        align-items: center;
        border-bottom: 1px solid var(--border);
      }
      
      .http-method {
        font-weight: bold;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        text-transform: uppercase;
        min-width: 60px;
        text-align: center;
        margin-right: 15px;
      }
      
      .get {
        background-color: #61affe;
        color: white;
      }
      
      .post {
        background-color: #49cc90;
        color: white;
      }
      
      .put {
        background-color: #fca130;
        color: white;
      }
      
      .delete {
        background-color: #f93e3e;
        color: white;
      }
      
      .endpoint-path {
        font-family: 'Courier New', Courier, monospace;
        font-weight: 500;
        flex-grow: 1;
      }
      
      .endpoint-body {
        padding: 15px;
      }
      
      .endpoint-description {
        margin-bottom: 15px;
        color: #555;
      }
      
      .params-section, .request-body-section, .response-section {
        margin-top: 15px;
      }
      
      .section-heading {
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 10px;
        color: var(--dark);
        display: flex;
        align-items: center;
      }
      
      .section-heading i {
        margin-right: 8px;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
        font-size: 0.9rem;
      }
      
      th {
        background-color: var(--light);
        text-align: left;
        padding: 10px;
        border: 1px solid var(--border);
      }
      
      td {
        padding: 10px;
        border: 1px solid var(--border);
      }
      
      .param-name, .body-field {
        font-family: 'Courier New', Courier, monospace;
        font-weight: 600;
      }
      
      .param-required {
        color: var(--danger);
        font-weight: 500;
      }
      
      pre {
        background-color: var(--code-bg);
        padding: 15px;
        border-radius: 4px;
        overflow: auto;
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.9rem;
        position: relative;
      }
      
      .copy-button {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: var(--dark);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        font-size: 0.8rem;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s ease;
      }
      
      .copy-button:hover {
        opacity: 1;
      }
      
      .try-it-button {
        background-color: var(--primary);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 15px;
        cursor: pointer;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        transition: background-color 0.3s ease;
        margin-top: 10px;
      }
      
      .try-it-button i {
        margin-right: 8px;
      }
      
      .try-it-button:hover {
        background-color: var(--primary-dark);
      }
      
      .search-container {
        margin: 20px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .search-box {
        display: flex;
        flex-grow: 1;
        max-width: 500px;
      }
      
      .search-input {
        flex-grow: 1;
        padding: 10px 15px;
        border: 1px solid var(--border);
        border-radius: 4px 0 0 4px;
        font-size: 1rem;
      }
      
      .search-button {
        background-color: var(--primary);
        color: white;
        border: none;
        border-radius: 0 4px 4px 0;
        padding: 0 15px;
        cursor: pointer;
      }
      
      .filter-controls {
        display: flex;
        gap: 10px;
      }
      
      .filter-button {
        padding: 8px 15px;
        background-color: var(--white);
        border: 1px solid var(--border);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .filter-button.active {
        background-color: var(--primary);
        color: white;
        border-color: var(--primary);
      }
      
      .back-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary);
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
      }
      
      .back-to-top.visible {
        opacity: 1;
        visibility: visible;
      }
      
      .back-to-top:hover {
        background-color: var(--primary-dark);
        transform: translateY(-3px);
      }
      
      footer {
        text-align: center;
        margin-top: 50px;
        padding: 20px;
        color: var(--gray);
        font-size: 0.9rem;
      }
      
      /* Canvas for drawing relationships */
      canvas {
        width: 100%;
        height: 100%;
      }
      
      /* Environmental selector */
      .env-selector {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        gap: 10px;
      }
      
      .env-button {
        padding: 8px 15px;
        background-color: var(--white);
        border: 1px solid var(--border);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .env-button.active {
        background-color: var(--secondary);
        color: white;
        border-color: var(--secondary);
      }
      
      /* Animation for the diagram */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .fade-in {
        animation: fadeIn 0.5s ease-in-out;
      }
      
      /* For the entity relationship diagram */
      .entity-relation-diagram {
        width: 100%;
        padding: 20px;
        overflow: auto;
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      
      .relation-line {
        stroke: var(--dark);
        stroke-width: 2;
      }
      
      .relation-arrow {
        fill: var(--dark);
      }
      
      .entity-box {
        stroke: var(--primary);
        stroke-width: 2;
        fill: white;
      }
      
      .entity-title {
        fill: var(--primary-dark);
        font-weight: bold;
        font-size: 14px;
      }
      
      .entity-field-text {
        fill: var(--dark);
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <header>
      <div class="header-content">
        <h1>JenCity API Documentation</h1>
        <p class="subtitle">Explore and integrate with the JenCity Tourist Guide API</p>
        
        <div class="api-stats">
          <div class="stat-item">
            <i class="fas fa-cogs"></i>
            <span>${routes.length} Endpoints</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-database"></i>
            <span>${entities.length} Entities</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-code"></i>
            <span>REST API</span>
          </div>
        </div>
      </div>
    </header>
    
    <div class="container">
      <div class="tabs">
        <div class="tab active" data-tab="diagram">Diagramme UML des Classes</div>
        <div class="tab" data-tab="tables">Tables</div>
        <div class="tab" data-tab="relations">Relations</div>
      </div>
      
      <div class="tab-content active" id="diagram">
        <div class="entity-diagram">
          <h2>Diagramme des Entités</h2>
          <div id="diagram-container" class="relationship-diagram">
            <canvas id="relationshipCanvas" width="1000" height="800"></canvas>
          </div>
        </div>
      </div>
      
      <div class="tab-content" id="tables">
        <div class="entities-container">
          ${entities.map(entity => `
            <div class="entity-card">
              <div class="entity-header">
                <h3>${entity.name}</h3>
              </div>
              <div class="entity-body">
                ${entity.fields.map(field => `
                  <div class="entity-field">
                    <div class="field-name">
                      ${field.name}
                      ${field.isPrimary ? '<span class="primary-key">PK</span>' : ''}
                      ${field.isOptional ? '<span class="optional-field">Optional</span>' : ''}
                      ${field.isPrivate ? '<span class="private-field">Private</span>' : ''}
                    </div>
                    <div class="field-type">${field.type}</div>
                  </div>
                `).join('')}
                
                <div class="relations-section">
                  <h4>Relations:</h4>
                  ${entity.relations && entity.relations.length > 0 ? entity.relations.map(relation => `
                    <div class="relation">
                      <span class="relation-type">${relation.type}</span>
                      <span>${relation.entity} via ${relation.via}</span>
                    </div>
                  `).join('') : '<div>Aucune relation</div>'}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="tab-content" id="relations">
        <div class="entity-relation-diagram">
          <h2 style="text-align: center; margin-bottom: 20px;">Relations Entre Entités</h2>
          
          <table>
            <thead>
              <tr>
                <th>Entité Source</th>
                <th>Relation</th>
                <th>Entité Cible</th>
                <th>Via</th>
              </tr>
            </thead>
            <tbody>
              ${entities.flatMap(entity => 
                (entity.relations || []).map(relation => `
                  <tr>
                    <td>${entity.name}</td>
                    <td>${relation.type}</td>
                    <td>${relation.entity}</td>
                    <td>${relation.via}</td>
                  </tr>
                `)
              ).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="search-container">
        <div class="search-box">
          <input type="text" id="searchInput" class="search-input" placeholder="Rechercher un endpoint...">
          <button class="search-button" id="searchButton">
            <i class="fas fa-search"></i>
          </button>
        </div>
        
        <div class="filter-controls">
          <button class="filter-button active" data-method="all">Tous</button>
          <button class="filter-button" data-method="get">GET</button>
          <button class="filter-button" data-method="post">POST</button>
          <button class="filter-button" data-method="put">PUT</button>
          <button class="filter-button" data-method="delete">DELETE</button>
        </div>
      </div>
      
      <div class="env-selector">
        <button class="env-button active" data-env="development">Développement</button>
        <button class="env-button" data-env="production">Production</button>
      </div>
      
      <section class="api-section">
        <h2 class="section-title">API Endpoints</h2>
        
        <div class="endpoint-list">
          ${routes.map(route => {
            const path = route.path;
            const method = route.method.toLowerCase();
            
            // Create curl command
            let curlCommand = \`curl -X \${route.method.toUpperCase()} "http://localhost:3000\${baseUrl}\${path}"\`;
            if (method === 'post' || method === 'put') {
              curlCommand += ` -H "Content-Type: application/json" -d '${JSON.stringify(route.requestBody || {}, null, 2)}'`;
            }
            
            // Create Postman URL (to be used with "try it" button)
            let postmanUrl = \`https://api.postman.com/collections/import?input=url&collection=\${encodeURIComponent(JSON.stringify({
              info: {
                name: \`\${route.method.toUpperCase()} \${path}\`,
                schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
              },
              item: [
                {
                  name: \`\${route.method.toUpperCase()} \${path}\`,
                  request: {
                    method: route.method.toUpperCase(),
                    url: {
                      raw: \`http://localhost:3000\${baseUrl}\${path}\`,
                      protocol: "http",
                      host: ["localhost"],
                      port: "3000",
                      path: [\`api\`, ...path.split('/').filter(p => p !== '')]
                    },
                    header: method === 'post' || method === 'put' ? [
                      {
                        key: "Content-Type",
                        value: "application/json"
                      }
                    ] : [],
                    body: method === 'post' || method === 'put' ? {
                      mode: "raw",
                      raw: JSON.stringify(route.requestBody || {}, null, 2),
                      options: {
                        raw: {
                          language: "json"
                        }
                      }
                    } : undefined
                  }
                }
              ]
            }))}\`;
            
            return `
            <div class="endpoint-card" data-method="${method}">
              <div class="endpoint-header">
                <div class="http-method ${method}">${method}</div>
                <div class="endpoint-path">${path}</div>
              </div>
              <div class="endpoint-body">
                <div class="endpoint-description">${route.description}</div>
                
                ${route.params && route.params.length > 0 ? `
                <div class="params-section">
                  <div class="section-heading">
                    <i class="fas fa-link"></i> Path Parameters
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Type</th>
                        <th>Requis</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${route.params.map(param => `
                        <tr>
                          <td class="param-name">${param.name}</td>
                          <td>${param.type}</td>
                          <td>${param.required ? '<span class="param-required">Oui</span>' : 'Non'}</td>
                          <td>${param.description}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
                ` : ''}
                
                ${route.requestBody ? `
                <div class="request-body-section">
                  <div class="section-heading">
                    <i class="fas fa-paper-plane"></i> Request Body
                  </div>
                  <pre><code>${JSON.stringify(route.requestBody, null, 2)}</code><button class="copy-button" data-clipboard-text='${JSON.stringify(route.requestBody).replace(/'/g, "\\'").replace(/"/g, '\\"')}'>Copier</button></pre>
                </div>
                ` : ''}
                
                <div class="response-section">
                  <div class="section-heading">
                    <i class="fas fa-reply"></i> Response (${route.response.status})
                  </div>
                  <pre><code>${JSON.stringify(route.response, null, 2)}</code><button class="copy-button" data-clipboard-text='${JSON.stringify(route.response).replace(/'/g, "\\'").replace(/"/g, '\\"')}'>Copier</button></pre>
                </div>
                
                <div class="code-example">
                  <div class="section-heading">
                    <i class="fas fa-terminal"></i> Example Request (cURL)
                  </div>
                  <pre><code>${curlCommand}</code><button class="copy-button" data-clipboard-text="${curlCommand.replace(/"/g, '\\"')}">Copier</button></pre>
                  
                  <a href="${postmanUrl}" target="_blank" class="try-it-button">
                    <i class="fas fa-paper-plane"></i> Tester dans Postman
                  </a>
                </div>
              </div>
            </div>
          `}).join('')}
        </div>
      </section>
    </div>
    
    <div class="back-to-top" id="backToTop">
      <i class="fas fa-arrow-up"></i>
    </div>
    
    <footer>
      <p>JenCity API Documentation | Version 1.0 | &copy; 2023 JenCity</p>
    </footer>
    
    <script>
      // Tabs functionality
      const tabs = document.querySelectorAll('.tab');
      const tabContents = document.querySelectorAll('.tab-content');
      
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const tabId = tab.getAttribute('data-tab');
          
          // Remove active class from all tabs and contents
          tabs.forEach(t => t.classList.remove('active'));
          tabContents.forEach(c => c.classList.remove('active'));
          
          // Add active class to current tab and content
          tab.classList.add('active');
          document.getElementById(tabId).classList.add('active');
          
          // If diagram tab is active, redraw the canvas
          if (tabId === 'diagram') {
            drawEntityRelationships();
          }
        });
      });
      
      // Search functionality
      const searchInput = document.getElementById('searchInput');
      const searchButton = document.getElementById('searchButton');
      const endpointCards = document.querySelectorAll('.endpoint-card');
      
      function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        
        endpointCards.forEach(card => {
          const path = card.querySelector('.endpoint-path').textContent.toLowerCase();
          const description = card.querySelector('.endpoint-description').textContent.toLowerCase();
          
          if (path.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      }
      
      searchButton.addEventListener('click', performSearch);
      searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          performSearch();
        }
      });
      
      // Filter functionality
      const filterButtons = document.querySelectorAll('.filter-button');
      
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          const method = button.getAttribute('data-method');
          
          // Remove active class from all filter buttons
          filterButtons.forEach(b => b.classList.remove('active'));
          
          // Add active class to current button
          button.classList.add('active');
          
          // Filter endpoint cards
          endpointCards.forEach(card => {
            if (method === 'all' || card.getAttribute('data-method') === method) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
      
      // Environment selector
      const envButtons = document.querySelectorAll('.env-button');
      let currentBaseUrl = 'http://localhost:3000/api';
      
      envButtons.forEach(button => {
        button.addEventListener('click', () => {
          const env = button.getAttribute('data-env');
          
          // Remove active class from all env buttons
          envButtons.forEach(b => b.classList.remove('active'));
          
          // Add active class to current button
          button.classList.add('active');
          
          // Update base URL based on environment
          if (env === 'development') {
            currentBaseUrl = 'http://localhost:3000/api';
          } else if (env === 'production') {
            currentBaseUrl = 'https://jencity-api.example.com/api';
          }
          
          // Update all cURL commands with new base URL
          updateCurlCommands();
        });
      });
      
      function updateCurlCommands() {
        const curlCodeBlocks = document.querySelectorAll('.code-example pre code');
        const copyButtons = document.querySelectorAll('.code-example .copy-button');
        
        curlCodeBlocks.forEach((block, index) => {
          const originalCommand = block.textContent;
          let newCommand;
          
          if (originalCommand.includes('http://localhost:3000/api')) {
            newCommand = originalCommand.replace('http://localhost:3000/api', currentBaseUrl);
          } else if (originalCommand.includes('https://jencity-api.example.com/api')) {
            newCommand = originalCommand.replace('https://jencity-api.example.com/api', currentBaseUrl);
          }
          
          if (newCommand) {
            block.textContent = newCommand;
            copyButtons[index].setAttribute('data-clipboard-text', newCommand);
          }
        });
      }
      
      // Copy to clipboard functionality
      const copyButtons = document.querySelectorAll('.copy-button');
      
      copyButtons.forEach(button => {
        button.addEventListener('click', () => {
          const textToCopy = button.getAttribute('data-clipboard-text');
          
          navigator.clipboard.writeText(textToCopy).then(() => {
            // Change button text temporarily
            const originalText = button.textContent;
            button.textContent = 'Copié!';
            
            setTimeout(() => {
              button.textContent = originalText;
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        });
      });
      
      // Back to top button
      const backToTopButton = document.getElementById('backToTop');
      
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          backToTopButton.classList.add('visible');
        } else {
          backToTopButton.classList.remove('visible');
        }
      });
      
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
      
      // Draw entity relationships on canvas
      function drawEntityRelationships() {
        const canvas = document.getElementById('relationshipCanvas');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Entity data from the API configuration
        const entities = ${JSON.stringify(entities)};
        
        // Calculate layout
        const padding = 20;
        const boxWidth = 200;
        const boxHeight = 30 + entities.reduce((max, entity) => 
          Math.max(max, (entity.fields || []).length * 20 + 40), 0);
        
        const columns = 3;
        const rows = Math.ceil(entities.length / columns);
        
        const spacingX = (canvas.width - padding * 2) / columns;
        const spacingY = (canvas.height - padding * 2) / rows;
        
        // Entity positions
        const entityPositions = {};
        
        // Draw entities
        entities.forEach((entity, index) => {
          const col = index % columns;
          const row = Math.floor(index / columns);
          
          const x = padding + col * spacingX + (spacingX - boxWidth) / 2;
          const y = padding + row * spacingY;
          
          // Store entity position for drawing relationships
          entityPositions[entity.name] = {
            x: x + boxWidth / 2,
            y: y + boxHeight / 2,
            width: boxWidth,
            height: boxHeight
          };
          
          // Draw entity box
          ctx.fillStyle = '#f5f5f5';
          ctx.strokeStyle = '#3498db';
          ctx.lineWidth = 2;
          
          // Box with rounded corners
          ctx.beginPath();
          ctx.moveTo(x + 10, y);
          ctx.lineTo(x + boxWidth - 10, y);
          ctx.quadraticCurveTo(x + boxWidth, y, x + boxWidth, y + 10);
          ctx.lineTo(x + boxWidth, y + boxHeight - 10);
          ctx.quadraticCurveTo(x + boxWidth, y + boxHeight, x + boxWidth - 10, y + boxHeight);
          ctx.lineTo(x + 10, y + boxHeight);
          ctx.quadraticCurveTo(x, y + boxHeight, x, y + boxHeight - 10);
          ctx.lineTo(x, y + 10);
          ctx.quadraticCurveTo(x, y, x + 10, y);
          ctx.closePath();
          
          ctx.fill();
          ctx.stroke();
          
          // Entity name header
          ctx.fillStyle = '#3498db';
          ctx.fillRect(x, y, boxWidth, 30);
          
          ctx.fillStyle = 'white';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(entity.name, x + boxWidth / 2, y + 20);
          
          // Entity fields
          if (entity.fields && entity.fields.length) {
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            
            entity.fields.forEach((field, fieldIndex) => {
              const fieldY = y + 50 + fieldIndex * 20;
              
              // Highlight primary keys
              if (field.isPrimary) {
                ctx.fillStyle = '#e74c3c';
                ctx.fillText('🔑 ' + field.name + ': ' + field.type, x + 15, fieldY);
                ctx.fillStyle = '#333';
              } else {
                ctx.fillText(field.name + ': ' + field.type, x + 15, fieldY);
              }
            });
          }
        });
        
        // Draw relationships
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 1;
        
        entities.forEach(sourceEntity => {
          if (sourceEntity.relations && sourceEntity.relations.length) {
            const sourcePos = entityPositions[sourceEntity.name];
            
            sourceEntity.relations.forEach(relation => {
              const targetPos = entityPositions[relation.entity];
              
              if (targetPos) {
                // Calculate starting and ending points
                let startX, startY, endX, endY;
                
                // Determine which side of the boxes to connect
                if (Math.abs(sourcePos.x - targetPos.x) > Math.abs(sourcePos.y - targetPos.y)) {
                  // Horizontal connection
                  if (sourcePos.x < targetPos.x) {
                    startX = sourcePos.x + sourcePos.width / 2;
                    endX = targetPos.x - targetPos.width / 2;
                  } else {
                    startX = sourcePos.x - sourcePos.width / 2;
                    endX = targetPos.x + targetPos.width / 2;
                  }
                  startY = sourcePos.y;
                  endY = targetPos.y;
                } else {
                  // Vertical connection
                  if (sourcePos.y < targetPos.y) {
                    startY = sourcePos.y + sourcePos.height / 2;
                    endY = targetPos.y - targetPos.height / 2;
                  } else {
                    startY = sourcePos.y - sourcePos.height / 2;
                    endY = targetPos.y + targetPos.height / 2;
                  }
                  startX = sourcePos.x;
                  endX = targetPos.x;
                }
                
                // Draw line
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                
                // Draw arrow
                const arrowSize = 10;
                const angle = Math.atan2(endY - startY, endX - startX);
                
                ctx.beginPath();
                ctx.moveTo(endX, endY);
                ctx.lineTo(
                  endX - arrowSize * Math.cos(angle - Math.PI / 6),
                  endY - arrowSize * Math.sin(angle - Math.PI / 6)
                );
                ctx.lineTo(
                  endX - arrowSize * Math.cos(angle + Math.PI / 6),
                  endY - arrowSize * Math.sin(angle + Math.PI / 6)
                );
                ctx.closePath();
                ctx.fillStyle = '#34495e';
                ctx.fill();
                
                // Draw relationship type
                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;
                
                ctx.fillStyle = 'white';
                ctx.fillRect(midX - 25, midY - 10, 50, 20);
                ctx.strokeRect(midX - 25, midY - 10, 50, 20);
                
                ctx.fillStyle = '#2ecc71';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(relation.type, midX, midY + 4);
              }
            });
          }
        });
      }
      
      // Draw the diagram when the page loads
      window.addEventListener('load', drawEntityRelationships);
      
      // Redraw on window resize
      window.addEventListener('resize', () => {
        if (document.querySelector('.tab[data-tab="diagram"]').classList.contains('active')) {
          drawEntityRelationships();
        }
      });
    </script>
  </body>
  </html>
  `;
};

module.exports = { generateDocTemplate };
