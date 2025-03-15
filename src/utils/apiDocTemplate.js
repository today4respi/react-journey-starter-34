
// Template for API documentation with class diagram
const generateDocTemplate = (routes, entities) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JendoubaLife API Documentation</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/json.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
  <style>
    :root {
      --primary-color: #2c3e50;
      --secondary-color: #3498db;
      --success-color: #27ae60;
      --danger-color: #e74c3c;
      --warning-color: #f39c12;
      --info-color: #2980b9;
      --light-bg: #f8f9fa;
      --dark-bg: #343a40;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: var(--light-bg);
      padding-top: 20px;
    }
    .navbar {
      background-color: var(--primary-color);
      box-shadow: 0 2px 4px rgba(0,0,0,.1);
    }
    .jumbotron {
      background-color: var(--primary-color);
      color: white;
      padding: 2rem;
      border-radius: 0.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,.1);
    }
    .api-title {
      color: white;
      font-weight: 600;
    }
    .api-description {
      opacity: 0.9;
    }
    .card {
      border: none;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,.05);
      border-radius: 0.5rem;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0,0,0,.1);
    }
    .card-header {
      background-color: white;
      padding: 1rem;
      border-bottom: 1px solid rgba(0,0,0,.125);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .endpoint {
      display: flex;
      align-items: center;
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }
    .http-method {
      padding: 0.4rem 0.75rem;
      border-radius: 4px;
      color: white;
      font-weight: bold;
      margin-right: 1rem;
      min-width: 80px;
      text-align: center;
    }
    .method-get { background-color: var(--info-color); }
    .method-post { background-color: var(--success-color); }
    .method-put { background-color: var(--warning-color); }
    .method-delete { background-color: var(--danger-color); }
    .endpoint-path {
      font-size: 1.1rem;
      word-break: break-all;
    }
    .card-body {
      padding: 1.5rem;
    }
    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: var(--primary-color);
    }
    .description {
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }
    .code-block {
      background-color: #1e1e1e;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1.5rem;
      overflow: auto;
      position: relative;
    }
    .code-block pre {
      margin: 0;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
    .copy-button {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background-color: rgba(255,255,255,0.1);
      border: none;
      color: #ddd;
      border-radius: 4px;
      padding: 0.4rem 0.75rem;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s;
    }
    .copy-button:hover {
      background-color: rgba(255,255,255,0.2);
      color: white;
    }
    .param-name {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      color: var(--primary-color);
    }
    .param-type {
      color: var(--info-color);
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
    }
    .status {
      font-weight: 600;
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      font-size: 0.9rem;
      color: white;
    }
    .status-200, .status-201 { background-color: var(--success-color); }
    .status-204 { background-color: var(--info-color); }
    .status-400, .status-404 { background-color: var(--warning-color); }
    .status-500 { background-color: var(--danger-color); }
    .sidebar {
      position: sticky;
      top: 20px;
      height: calc(100vh - 40px);
      overflow-y: auto;
      padding-right: 15px;
    }
    .nav-link {
      padding: 0.5rem 0;
      color: var(--primary-color);
      border-left: 2px solid transparent;
      transition: all 0.2s;
    }
    .nav-link:hover, .nav-link.active {
      color: var(--secondary-color);
      border-left-color: var(--secondary-color);
      padding-left: 0.5rem;
    }
    .entity-badge {
      background-color: var(--light-bg);
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
      padding: 0.25rem 0.5rem;
      margin-right: 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .entity-badge.active {
      background-color: var(--primary-color);
      color: white;
    }
    .postman-button {
      background-color: #FF6C37;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.4rem 0.75rem;
      margin-left: 1rem;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s;
    }
    .postman-button:hover {
      background-color: #E05320;
    }
    .required-badge {
      background-color: rgba(231, 76, 60, 0.2);
      color: var(--danger-color);
      border-radius: 4px;
      padding: 0.15rem 0.5rem;
      margin-left: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .search-box {
      position: relative;
      margin-bottom: 1rem;
    }
    .search-box input {
      width: 100%;
      padding: 0.5rem 2.5rem 0.5rem 1rem;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
    }
    .search-box i {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
    }
    .mermaid {
      text-align: center;
      margin-bottom: 2rem;
    }
    .tab-content {
      margin-top: 1rem;
    }
    .class-diagram-container {
      margin-bottom: 3rem;
      background-color: white;
      border-radius: 0.5rem;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,.05);
    }
    .tab-pane {
      padding: 1.5rem;
      background-color: white;
      border-radius: 0 0 0.5rem 0.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,.05);
    }
    .nav-tabs .nav-link {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem 0.5rem 0 0;
      font-weight: 500;
      color: var(--primary-color);
    }
    .nav-tabs .nav-link.active {
      background-color: white;
      color: var(--secondary-color);
      border-bottom: 3px solid var(--secondary-color);
    }
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
    }
    .toast {
      margin-bottom: 10px;
    }
    @media (max-width: 767px) {
      .sidebar {
        position: relative;
        height: auto;
        margin-bottom: 2rem;
      }
      .endpoint {
        flex-direction: column;
        align-items: flex-start;
      }
      .http-method {
        margin-bottom: 0.5rem;
      }
      .endpoints-container {
        margin-top: 2rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="jumbotron">
      <h1 class="api-title">JendoubaLife API Documentation</h1>
      <p class="api-description">Une documentation complète de l'API JendoubaLife pour les développeurs.</p>
      <div class="d-flex mt-4">
        <select id="environmentSelector" class="form-select me-2" style="max-width: 200px;">
          <option value="local">Local Environment</option>
          <option value="development">Development</option>
          <option value="production">Production</option>
        </select>
        <div>
          <span class="badge bg-primary" id="baseUrlBadge">Base URL: http://localhost:3000/api</span>
        </div>
      </div>
    </div>

    <div class="class-diagram-container">
      <ul class="nav nav-tabs" id="diagramTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="classes-tab" data-bs-toggle="tab" data-bs-target="#classes" type="button" role="tab" aria-controls="classes" aria-selected="true">Diagramme de Classes</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="tables-tab" data-bs-toggle="tab" data-bs-target="#tables" type="button" role="tab" aria-controls="tables" aria-selected="false">Tables de Base de Données</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="relations-tab" data-bs-toggle="tab" data-bs-target="#relations" type="button" role="tab" aria-controls="relations" aria-selected="false">Relations</button>
        </li>
      </ul>
      <div class="tab-content" id="diagramTabsContent">
        <div class="tab-pane fade show active" id="classes" role="tabpanel" aria-labelledby="classes-tab">
          <div class="mermaid">
            classDiagram
            ${generateClassDiagram(entities)}
          </div>
        </div>
        <div class="tab-pane fade" id="tables" role="tabpanel" aria-labelledby="tables-tab">
          <div class="mermaid">
            classDiagram
            ${generateTableDiagram(entities)}
          </div>
        </div>
        <div class="tab-pane fade" id="relations" role="tabpanel" aria-labelledby="relations-tab">
          <div class="mermaid">
            flowchart TD
            ${generateRelationsDiagram(entities)}
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-3">
        <div class="sidebar">
          <h5>Filtrer</h5>
          <div class="search-box">
            <input type="text" id="searchInput" placeholder="Rechercher une API..." class="form-control">
            <i class="bi bi-search"></i>
          </div>
          
          <h6 class="mt-3">Par entité</h6>
          <div id="entityFilter" class="d-flex flex-wrap mb-3">
            <span class="entity-badge active" data-entity="all">Toutes</span>
            ${getUniqueEntities(routes).map(entity => `<span class="entity-badge" data-entity="${entity}">${entity}</span>`).join('')}
          </div>
          
          <h6>Par méthode</h6>
          <div id="methodFilter" class="d-flex flex-wrap mb-3">
            <span class="entity-badge active" data-method="all">Toutes</span>
            <span class="entity-badge" data-method="get">GET</span>
            <span class="entity-badge" data-method="post">POST</span>
            <span class="entity-badge" data-method="put">PUT</span>
            <span class="entity-badge" data-method="delete">DELETE</span>
          </div>
          
          <h5>Endpoints</h5>
          <nav id="sidebar-nav">
            <ul class="nav flex-column">
              ${routes.map((route, index) => `
                <li class="nav-item">
                  <a class="nav-link" href="#endpoint-${index}" data-entity="${getEntityFromPath(route.path)}" data-method="${route.method}">
                    <span class="badge method-${route.method}">${route.method.toUpperCase()}</span>
                    ${route.path}
                  </a>
                </li>
              `).join('')}
            </ul>
          </nav>
        </div>
      </div>
      
      <div class="col-md-9 endpoints-container">
        ${routes.map((route, index) => {
          return `
            <div class="card endpoint-card" id="endpoint-${index}" data-entity="${getEntityFromPath(route.path)}" data-method="${route.method}">
              <div class="card-header">
                <div class="endpoint">
                  <span class="http-method method-${route.method}">${route.method.toUpperCase()}</span>
                  <span class="endpoint-path">${route.path}</span>
                </div>
                <div>
                  <button class="postman-button" data-endpoint="${index}">Test in Postman</button>
                  <button class="copy-button" data-endpoint="${index}">Copy</button>
                </div>
              </div>
              <div class="card-body">
                <div class="description">${route.description}</div>
                
                ${route.params ? `
                <div class="section-title">Paramètres d'URL</div>
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${route.params.map(param => `
                      <tr>
                        <td>
                          <span class="param-name">${param.name}</span>
                          ${param.required ? '<span class="required-badge">Requis</span>' : ''}
                        </td>
                        <td><span class="param-type">${param.type}</span></td>
                        <td>${param.description}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                ` : ''}
                
                ${route.requestBody ? `
                <div class="section-title">Corps de la requête</div>
                <div class="code-block">
                  <button class="copy-button" data-type="request" data-endpoint="${index}">Copy</button>
                  <pre><code class="language-json">${JSON.stringify(route.requestBody, null, 2)}</code></pre>
                </div>
                ` : ''}
                
                <div class="section-title">Réponse</div>
                <div class="d-flex align-items-center mb-3">
                  <span class="status status-${route.response.status}">${route.response.status}</span>
                  <span class="ms-2">${getStatusText(route.response.status)}</span>
                </div>
                
                <div class="code-block">
                  <button class="copy-button" data-type="response" data-endpoint="${index}">Copy</button>
                  <pre><code class="language-json">${JSON.stringify(route.response, null, 2)}</code></pre>
                </div>
                
                <div class="section-title">Exemple de requête</div>
                <ul class="nav nav-tabs" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#curl-${index}" type="button" role="tab">cURL</button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#js-${index}" type="button" role="tab">JavaScript</button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#python-${index}" type="button" role="tab">Python</button>
                  </li>
                </ul>
                <div class="tab-content">
                  <div class="tab-pane fade show active" id="curl-${index}" role="tabpanel">
                    <div class="code-block">
                      <button class="copy-button" data-type="curl" data-endpoint="${index}">Copy</button>
                      <pre><code class="language-bash">${generateCurlExample(route)}</code></pre>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="js-${index}" role="tabpanel">
                    <div class="code-block">
                      <button class="copy-button" data-type="js" data-endpoint="${index}">Copy</button>
                      <pre><code class="language-javascript">${generateJSExample(route)}</code></pre>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="python-${index}" role="tabpanel">
                    <div class="code-block">
                      <button class="copy-button" data-type="python" data-endpoint="${index}">Copy</button>
                      <pre><code class="language-python">${generatePythonExample(route)}</code></pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  </div>

  <div class="toast-container"></div>

  <script>
    // Initialize syntax highlighting
    document.addEventListener('DOMContentLoaded', () => {
      hljs.highlightAll();
      
      // Initialize mermaid diagrams
      mermaid.initialize({
        startOnLoad: true,
        theme: 'neutral',
        securityLevel: 'loose',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      });
    });

    // Environment selector
    const environmentSelector = document.getElementById('environmentSelector');
    const baseUrlBadge = document.getElementById('baseUrlBadge');
    
    const environments = {
      local: 'http://localhost:3000/api',
      development: 'https://dev-api.jendoubalife.com/api',
      production: 'https://api.jendoubalife.com/api'
    };
    
    environmentSelector.addEventListener('change', function() {
      const env = this.value;
      baseUrlBadge.textContent = 'Base URL: ' + environments[env];
      
      // Update all code examples with the new base URL
      document.querySelectorAll('.code-block pre code').forEach(codeBlock => {
        const codeText = codeBlock.textContent;
        const updatedCode = updateBaseUrlInCode(codeText, environments[env]);
        codeBlock.textContent = updatedCode;
      });
      
      hljs.highlightAll();
    });
    
    function updateBaseUrlInCode(code, newBaseUrl) {
      Object.keys(environments).forEach(env => {
        code = code.replace(new RegExp(environments[env], 'g'), newBaseUrl);
      });
      return code;
    }

    // Copy code buttons
    document.querySelectorAll('.copy-button').forEach(button => {
      button.addEventListener('click', function() {
        const endpointId = this.dataset.endpoint;
        const type = this.dataset.type || 'endpoint';
        let textToCopy = '';
        
        if (type === 'endpoint') {
          const endpoint = document.querySelector(\`#endpoint-\${endpointId} .endpoint-path\`).textContent;
          const method = document.querySelector(\`#endpoint-\${endpointId} .http-method\`).textContent;
          const baseUrl = baseUrlBadge.textContent.replace('Base URL: ', '');
          textToCopy = \`\${method} \${baseUrl}\${endpoint}\`;
        } else {
          const codeBlock = this.nextElementSibling;
          textToCopy = codeBlock.textContent;
        }
        
        navigator.clipboard.writeText(textToCopy)
          .then(() => showToast('Copié !', 'Success'))
          .catch(err => showToast('Erreur lors de la copie', 'danger'));
      });
    });
    
    // Postman test buttons
    document.querySelectorAll('.postman-button').forEach(button => {
      button.addEventListener('click', function() {
        const endpointId = this.dataset.endpoint;
        const endpoint = document.querySelector(\`#endpoint-\${endpointId} .endpoint-path\`).textContent;
        const method = document.querySelector(\`#endpoint-\${endpointId} .http-method\`).textContent.toLowerCase();
        const baseUrl = baseUrlBadge.textContent.replace('Base URL: ', '');
        
        // Generate Postman collection JSON
        const postmanCollection = generatePostmanCollection(baseUrl, endpoint, method, endpointId);
        
        // Create data URL to download collection
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(postmanCollection));
        
        // Create download link
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", \`jendoubalife_\${endpoint.replace(/\\//g, '_')}.postman_collection.json\`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
        showToast('Collection Postman générée!', 'success');
      });
    });
    
    function generatePostmanCollection(baseUrl, endpoint, method, endpointId) {
      // Get request body if exists
      let requestBody = null;
      const requestCodeBlock = document.querySelector(\`#endpoint-\${endpointId} .code-block[data-type="request"] pre code\`);
      if (requestCodeBlock) {
        try {
          requestBody = JSON.parse(requestCodeBlock.textContent);
        } catch (e) {
          console.error("Error parsing request body", e);
        }
      }
      
      return {
        "info": {
          "_postman_id": generateUUID(),
          "name": \`JendoubaLife API - \${endpoint}\`,
          "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        "item": [
          {
            "name": endpoint,
            "request": {
              "method": method.toUpperCase(),
              "header": [
                {
                  "key": "Content-Type",
                  "value": "application/json"
                }
              ],
              "url": {
                "raw": \`\${baseUrl}\${endpoint}\`,
                "host": [baseUrl.replace(/https?:\\/\\//, '').replace('/api', '')],
                "path": ["api", ...endpoint.split('/').filter(p => p)]
              },
              "body": requestBody ? {
                "mode": "raw",
                "raw": JSON.stringify(requestBody, null, 2)
              } : undefined
            },
            "response": []
          }
        ]
      };
    }
    
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    
    // Toast notification
    function showToast(message, type = 'success') {
      const toastContainer = document.querySelector('.toast-container');
      const toastId = 'toast-' + Date.now();
      
      const toastHTML = \`
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="\${toastId}">
          <div class="toast-header">
            <strong class="me-auto">JendoubaLife API</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body bg-\${type} text-white">
            \${message}
          </div>
        </div>
      \`;
      
      toastContainer.insertAdjacentHTML('beforeend', toastHTML);
      const toastElement = document.getElementById(toastId);
      const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
      toast.show();
      
      // Remove toast from DOM after it's hidden
      toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
      });
    }
    
    // Filter functionality
    const searchInput = document.getElementById('searchInput');
    const entityBadges = document.querySelectorAll('#entityFilter .entity-badge');
    const methodBadges = document.querySelectorAll('#methodFilter .entity-badge');
    const endpointCards = document.querySelectorAll('.endpoint-card');
    const navLinks = document.querySelectorAll('#sidebar-nav .nav-link');
    
    function filterEndpoints() {
      const searchTerm = searchInput.value.toLowerCase();
      const activeEntity = document.querySelector('#entityFilter .entity-badge.active').dataset.entity;
      const activeMethod = document.querySelector('#methodFilter .entity-badge.active').dataset.method;
      
      endpointCards.forEach(card => {
        const cardEntity = card.dataset.entity;
        const cardMethod = card.dataset.method;
        const cardContent = card.textContent.toLowerCase();
        
        const matchesSearch = searchTerm === '' || cardContent.includes(searchTerm);
        const matchesEntity = activeEntity === 'all' || cardEntity === activeEntity;
        const matchesMethod = activeMethod === 'all' || cardMethod === activeMethod;
        
        if (matchesSearch && matchesEntity && matchesMethod) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
      
      // Also filter sidebar nav links
      navLinks.forEach(link => {
        const linkEntity = link.dataset.entity;
        const linkMethod = link.dataset.method;
        const linkContent = link.textContent.toLowerCase();
        
        const matchesSearch = searchTerm === '' || linkContent.includes(searchTerm);
        const matchesEntity = activeEntity === 'all' || linkEntity === activeEntity;
        const matchesMethod = activeMethod === 'all' || linkMethod === activeMethod;
        
        if (matchesSearch && matchesEntity && matchesMethod) {
          link.style.display = 'block';
        } else {
          link.style.display = 'none';
        }
      });
    }
    
    searchInput.addEventListener('input', filterEndpoints);
    
    entityBadges.forEach(badge => {
      badge.addEventListener('click', function() {
        document.querySelector('#entityFilter .entity-badge.active').classList.remove('active');
        this.classList.add('active');
        filterEndpoints();
      });
    });
    
    methodBadges.forEach(badge => {
      badge.addEventListener('click', function() {
        document.querySelector('#methodFilter .entity-badge.active').classList.remove('active');
        this.classList.add('active');
        filterEndpoints();
      });
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('#sidebar-nav .nav-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
          top: targetElement.offsetTop - 20,
          behavior: 'smooth'
        });
        
        // Highlight active link
        document.querySelectorAll('#sidebar-nav .nav-link').forEach(navLink => {
          navLink.classList.remove('active');
        });
        this.classList.add('active');
      });
    });
    
    // Highlight nav item on scroll
    window.addEventListener('scroll', function() {
      const scrollPosition = window.scrollY;
      
      endpointCards.forEach((card, index) => {
        if (card.style.display !== 'none') {
          const cardTop = card.offsetTop - 100;
          const cardBottom = cardTop + card.offsetHeight;
          
          if (scrollPosition >= cardTop && scrollPosition < cardBottom) {
            document.querySelectorAll('#sidebar-nav .nav-link').forEach(link => {
              link.classList.remove('active');
            });
            
            const correspondingLink = document.querySelector(\`#sidebar-nav .nav-link[href="#endpoint-\${index}"]\`);
            if (correspondingLink) {
              correspondingLink.classList.add('active');
            }
          }
        }
      });
    });
  </script>
</body>
</html>
  `;
};

// Helper function to generate class diagram
function generateClassDiagram(entities) {
  let diagram = '';
  entities.forEach(entity => {
    diagram += `class ${entity.name} {\n`;
    
    // Add fields
    entity.fields.forEach(field => {
      const fieldType = field.type === 'object' ? 'Object' : 
                       field.type === 'array' ? 'Array' : 
                       field.type.charAt(0).toUpperCase() + field.type.slice(1);
      diagram += `    ${field.isPrimary ? '+' : '-'}${field.name}: ${fieldType}\n`;
    });
    
    diagram += '}\n';
  });
  
  // Add relationships
  entities.forEach(entity => {
    if (entity.relations) {
      entity.relations.forEach(relation => {
        if (relation.type === 'hasMany') {
          diagram += `${entity.name} "1" -- "n" ${relation.entity} : has many\n`;
        } else if (relation.type === 'belongsTo') {
          diagram += `${entity.name} "n" -- "1" ${relation.entity} : belongs to\n`;
        }
      });
    }
  });
  
  return diagram;
}

// Helper function to generate table diagram
function generateTableDiagram(entities) {
  let diagram = '';
  entities.forEach(entity => {
    diagram += `class ${entity.name} {\n`;
    
    // Add fields with more database-specific details
    entity.fields.forEach(field => {
      let fieldType = field.type === 'object' ? 'JSON' : 
                     field.type === 'array' ? 'ARRAY' : 
                     field.type === 'string' ? 'VARCHAR(255)' :
                     field.type === 'text' ? 'TEXT' :
                     field.type === 'number' ? 'INTEGER' :
                     field.type === 'date' ? 'TIMESTAMP' :
                     field.type === 'boolean' ? 'BOOLEAN' :
                     field.type.toUpperCase();
      
      let constraints = [];
      if (field.isPrimary) constraints.push('PK');
      if (field.reference) constraints.push('FK');
      if (!field.isOptional && !field.isPrimary) constraints.push('NOT NULL');
      
      const constraintStr = constraints.length > 0 ? ` <<${constraints.join(',')}>>`  : '';
      
      diagram += `    ${field.name}: ${fieldType}${constraintStr}\n`;
    });
    
    diagram += '}\n';
  });
  
  return diagram;
}

// Helper function to generate relation diagram
function generateRelationsDiagram(entities) {
  let diagram = '';
  
  // Add nodes
  entities.forEach(entity => {
    diagram += `    ${entity.name}["${entity.name}"]\n`;
  });
  
  // Add relationships
  entities.forEach(entity => {
    if (entity.relations) {
      entity.relations.forEach(relation => {
        if (relation.type === 'hasMany') {
          diagram += `    ${entity.name} -->|"1:n"| ${relation.entity}\n`;
        } else if (relation.type === 'belongsTo') {
          diagram += `    ${entity.name} -->|"n:1"| ${relation.entity}\n`;
        }
      });
    }
  });
  
  return diagram;
}

// Helper function to get unique entities from routes
function getUniqueEntities(routes) {
  const entities = new Set();
  routes.forEach(route => {
    const entity = getEntityFromPath(route.path);
    if (entity) {
      entities.add(entity);
    }
  });
  return Array.from(entities);
}

// Helper function to extract entity name from route path
function getEntityFromPath(path) {
  const parts = path.split('/');
  // The entity is typically the first part after the initial slash
  return parts[1] || 'other';
}

// Helper function to generate curl example
function generateCurlExample(route) {
  const baseUrl = 'http://localhost:3000/api';
  let path = route.path;
  
  // Replace path parameters with placeholders
  if (route.params) {
    route.params.forEach(param => {
      path = path.replace(`:${param.name}`, param.name === 'id' ? '1' : param.name);
    });
  }
  
  let curlCommand = \`curl -X \${route.method.toUpperCase()} "\${baseUrl}\${path}"\`;
  
  if (route.requestBody) {
    curlCommand += \` \\
  -H "Content-Type: application/json" \\
  -d '\${JSON.stringify(route.requestBody, null, 2)}'\`;
  }
  
  return curlCommand;
}

// Helper function to generate JavaScript example
function generateJSExample(route) {
  const baseUrl = 'http://localhost:3000/api';
  let path = route.path;
  
  // Replace path parameters with placeholders
  if (route.params) {
    route.params.forEach(param => {
      path = path.replace(`:${param.name}`, param.name === 'id' ? '1' : param.name);
    });
  }
  
  let jsExample = '';
  
  if (route.method.toLowerCase() === 'get') {
    jsExample = \`fetch("\${baseUrl}\${path}")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));\`;
  } else {
    jsExample = \`fetch("\${baseUrl}\${path}", {
  method: "\${route.method.toUpperCase()}",
  headers: {
    "Content-Type": "application/json",
  },\${route.requestBody ? \`
  body: JSON.stringify(\${JSON.stringify(route.requestBody, null, 2)}),\` : ''}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));\`;
  }
  
  return jsExample;
}

// Helper function to generate Python example
function generatePythonExample(route) {
  const baseUrl = 'http://localhost:3000/api';
  let path = route.path;
  
  // Replace path parameters with placeholders
  if (route.params) {
    route.params.forEach(param => {
      path = path.replace(`:${param.name}`, param.name === 'id' ? '1' : param.name);
    });
  }
  
  let pythonExample = \`import requests

url = "\${baseUrl}\${path}"\`;
  
  if (route.method.toLowerCase() === 'get') {
    pythonExample += \`

response = requests.get(url)
print(response.json())\`;
  } else {
    pythonExample += \`

payload = \${JSON.stringify(route.requestBody, null, 2) || '{}'}
headers = {"Content-Type": "application/json"}

response = requests.\${route.method.toLowerCase()}(url, json=payload, headers=headers)
print(response.json())\`;
  }
  
  return pythonExample;
}

// Helper function to get HTTP status text
function getStatusText(status) {
  const statusTexts = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error'
  };
  
  return statusTexts[status] || '';
}

module.exports = { generateDocTemplate };
