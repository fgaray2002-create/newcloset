const CSV_URL = 'https://docs.google.com/spreadsheets/d/1-K--QwKKTzi5nQRQjKQyP88YfDpJBz4ShFMfz_gM0Fk/export?format=csv&gid=0';

const COLOR_MAP = { 'negro': '#000', 'blanco': '#fff', 'dorado': '#D4AF37', 'rojo': '#8B0000', 'rosa': '#FFC0CB', 'beige': '#F5F5DC' };

async function loadInventory() {
    const response = await fetch(CSV_URL);
    const data = await response.text();
    const rows = data.split('\n').slice(1);
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    rows.forEach(row => {
        const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if(cols.length < 9) return;
        const clean = (t) => t ? t.replace(/['"]+/g, '').trim() : '';

        const p = {
            id: extractDriveId(clean(cols[8])),
            nombre: clean(cols[4]),
            precio: clean(cols[5]),
            colores: clean(cols[6]),
            talles: clean(cols[7]),
            stock: clean(cols[9]).toUpperCase(),
            fotosColores: cols[10] ? clean(cols[10]) : ''
        };

        if (p.nombre && p.id) {
            const card = document.createElement('div');
            card.className = 'product-card';
            const imgUrl = `https://lh3.googleusercontent.com/u/0/d/${p.id}`;
            card.innerHTML = `
                ${p.stock === 'N' ? '<div class="out-of-stock">AGOTADO</div>' : ''}
                <img src="${imgUrl}" onclick="openProduct('${encodeURIComponent(JSON.stringify(p))}')">
                <h3>${p.nombre}</h3>
                <p style="color:var(--gold)">${p.precio}</p>
            `;
            gallery.appendChild(card);
        }
    });
}

function extractDriveId(url) {
    if (!url) return '';
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : '';
}

function openProduct(data) {
    const p = JSON.parse(decodeURIComponent(data));
    const modalImg = document.getElementById('modalImg');
    const imgPath = `https://lh3.googleusercontent.com/u/0/d/${p.id}`;
    
    document.getElementById('modalName').innerText = p.nombre;
    document.getElementById('modalPrice').innerText = p.precio;
    document.getElementById('modalSizes').innerText = p.talles;
    modalImg.src = imgPath;
    
    // Configurar Colores
    const container = document.getElementById('modalColors');
    container.innerHTML = '';
    if (p.fotosColores) {
        p.fotosColores.split(',').forEach(pair => {
            const [name, url] = pair.split('|');
            const btn = document.createElement('div');
            btn.className = 'color-btn';
            btn.style.backgroundColor = COLOR_MAP[name.toLowerCase().trim()] || '#333';
            btn.onclick = () => {
                const newId = extractDriveId(url);
                modalImg.src = `https://lh3.googleusercontent.com/u/0/d/${newId}`;
                initZoom(); // Reiniciar lupa con nueva foto
            };
            container.appendChild(btn);
        });
    }

    document.getElementById('btnWhatsapp').href = `https://wa.me/TUNUMERO?text=Consulta: ${p.nombre}`;
    document.getElementById('productModal').style.display = 'block';
    setTimeout(initZoom, 500); // Dar tiempo a que cargue la imagen
}

function initZoom() {
    const img = document.getElementById("modalImg");
    const lens = document.getElementById("zoomLens");
    const result = document.getElementById("zoomResult");
    const wrapper = document.getElementById("zoomWrapper");

    wrapper.onmousemove = (e) => {
        lens.style.display = "block";
        result.style.display = "block";
        
        const rect = wrapper.getBoundingClientRect();
        let x = e.pageX - rect.left - window.pageXOffset - (lens.offsetWidth / 2);
        let y = e.pageY - rect.top - window.pageYOffset - (lens.offsetHeight / 2);

        // Limites
        if (x > wrapper.offsetWidth - lens.offsetWidth) x = wrapper.offsetWidth - lens.offsetWidth;
        if (x < 0) x = 0;
        if (y > wrapper.offsetHeight - lens.offsetHeight) y = wrapper.offsetHeight - lens.offsetHeight;
        if (y < 0) y = 0;

        lens.style.left = x + "px";
        lens.style.top = y + "px";

        const cx = result.offsetWidth / lens.offsetWidth;
        const cy = result.offsetHeight / lens.offsetHeight;

        result.style.backgroundImage = `url('${img.src}')`;
        result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
        result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    };

    wrapper.onmouseleave = () => {
        lens.style.display = "none";
        result.style.display = "none";
    };
}

function closeModal() { document.getElementById('productModal').style.display = 'none'; }
loadInventory();
