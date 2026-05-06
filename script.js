const CSV_URL = 'https://docs.google.com/spreadsheets/d/1-K--QwKKTzi5nQRQjKQyP88YfDpJBz4ShFMfz_gM0Fk/export?format=csv&gid=0';

const COLOR_MAP = {
    'negro': '#000000',
    'blanco': '#ffffff',
    'dorado': '#D4AF37',
    'rojo': '#8B0000',
    'azul': '#000080',
    'rosa': '#FFC0CB',
    'verde': '#2E8B57',
    'beige': '#F5F5DC',
    'gris': '#808080',
    'celeste': '#87CEEB'
};

async function loadInventory() {
    try {
        const response = await fetch(CSV_URL);
        const data = await response.text();
        const rows = data.split('\n').slice(1);
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = ''; 

        rows.forEach(row => {
            const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if(columns.length < 9) return;

            const clean = (text) => text ? text.replace(/['"]+/g, '').trim() : '';

            const product = {
                nombre: clean(columns[4]),
                precio: clean(columns[5]),
                coloresTxt: clean(columns[6]),
                talles: clean(columns[7]),
                imgPrincipal: extractDriveId(clean(columns[8])),
                stock: clean(columns[9]).toUpperCase(),
                fotosColores: columns[10] ? clean(columns[10]) : ''
            };

            if (product.nombre && product.imgPrincipal) {
                const card = document.createElement('div');
                card.className = 'product-card';
                
                const isOutOfStock = product.stock === 'N';
                const stockLabel = isOutOfStock ? '<div class="out-of-stock">SIN STOCK</div>' : '';
                const imgStyle = isOutOfStock ? 'style="opacity: 0.3; filter: grayscale(1);"' : '';
                const thumb = `https://lh3.googleusercontent.com/u/0/d/${product.imgPrincipal}`;

                card.innerHTML = `
                    ${stockLabel}
                    <img src="${thumb}" ${imgStyle} onclick="showDetail('${encodeURIComponent(JSON.stringify(product))}')">
                    <div class="product-info">
                        <h3 style="margin: 15px 0 5px; font-size: 1.1rem;">${product.nombre}</h3>
                        <p style="color: var(--gold); font-weight: bold;">${product.precio}</p>
                    </div>
                `;
                gallery.appendChild(card);
            }
        });
    } catch (e) { console.error("Error cargando catálogo:", e); }
}

function extractDriveId(url) {
    if (!url) return '';
    let id = "";
    if (url.includes('id=')) id = url.split('id=')[1].split('&')[0];
    else if (url.includes('/d/')) id = url.split('/d/')[1].split('/')[0];
    return id.trim();
}

function showDetail(encodedData) {
    const p = JSON.parse(decodeURIComponent(encodedData));
    document.getElementById('modalName').innerText = p.nombre;
    document.getElementById('modalPrice').innerText = p.precio;
    document.getElementById('modalSizes').innerText = p.talles;
    
    const mainImg = document.getElementById('modalImg');
    mainImg.src = `https://lh3.googleusercontent.com/u/0/d/${p.imgPrincipal}`;
    
    const colorContainer = document.getElementById('modalColors');
    colorContainer.innerHTML = '';

    if (p.fotosColores) {
        const pairs = p.fotosColores.split(',');
        pairs.forEach(pair => {
            const [colorName, colorUrl] = pair.split('|');
            if(!colorName || !colorUrl) return;

            const btn = document.createElement('div');
            btn.className = 'color-btn';
            btn.title = colorName.trim();
            btn.style.backgroundColor = COLOR_MAP[colorName.toLowerCase().trim()] || '#333';
            
            btn.onclick = () => {
                const newId = extractDriveId(colorUrl);
                mainImg.style.opacity = '0';
                setTimeout(() => {
                    mainImg.src = `https://lh3.googleusercontent.com/u/0/d/${newId}`;
                    mainImg.style.opacity = '1';
                }, 250);
            };
            colorContainer.appendChild(btn);
        });
    } else {
        colorContainer.innerText = p.coloresTxt;
    }

    // Link de Whatsapp dinámico
    const mensaje = `Hola! Me interesa el ${p.nombre} que vi en la web.`;
    document.getElementById('btnWhatsapp').href = `https://wa.me/TUNUMEROAQUI?text=${encodeURIComponent(mensaje)}`;
    
    document.getElementById('productModal').style.display = "block";
}

loadInventory();
