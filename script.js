// 1. CONFIGURACIÓN: Solo pegá el ID entre las comillas simples
const SHEET_ID = '1abc1234567890xyz'; // <--- CAMBIÁ ESTO POR TU ID REAL

// Esta forma es más segura y no usa las llaves que causan el error de "Template Expression"
const CSV_URL = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/export?format=csv';

/**
 * CARGA DEL CATÁLOGO
 */
async function loadCatalog() {
    const gallery = document.getElementById('gallery');
    try {
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error("No se pudo conectar con la planilla. ¿Está publicada en la web?");
        
        const data = await response.text();
        const rows = data.split('\n').slice(1); 
        
        gallery.innerHTML = ''; 

        rows.forEach(row => {
            const columns = row.split(','); 
            if (columns.length < 3) return;

            const name = columns[0].trim();
            const price = columns[1].trim();
            const imgUrl = columns[2].trim();
            const sizes = columns[3] ? columns[3].trim() : 'Consultar talles';

            const card = document.createElement('div');
            card.className = 'product-card';
            card.onclick = () => openModal(name, price, imgUrl, sizes);
            card.innerHTML = `
                <img src="${imgUrl}" alt="${name}" onerror="this.src='https://via.placeholder.com/400x600?text=Imagen+No+Encontrada'">
                <h3>${name}</h3>
                <p>${price}</p>
            `;
            gallery.appendChild(card);
        });
    } catch (error) {
        gallery.innerHTML = `<p style="color:#D4AF37; text-align:center; padding: 50px;">Error: ${error.message}</p>`;
    }
}

/**
 * LÓGICA DEL MODAL Y LUPA (ZOOM)
 */
function setupZoom() {
    const img = document.getElementById('modalImg');
    const lens = document.querySelector('.zoom-lens');
    const result = document.getElementById('zoomResult');
    const container = document.querySelector('.zoom-wrapper');

    if (!img || !lens || !result) return;

    container.onmousemove = (e) => {
        const rect = img.getBoundingClientRect();
        lens.style.display = "block";
        result.style.display = "block";

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        x = x - (lens.offsetWidth / 2);
        y = y - (lens.offsetHeight / 2);

        if (x > img.width - lens.offsetWidth) x = img.width - lens.offsetWidth;
        if (x < 0) x = 0;
        if (y > img.height - lens.offsetHeight) y = img.height - lens.offsetHeight;
        if (y < 0) y = 0;

        lens.style.left = x + "px";
        lens.style.top = y + "px";

        const cx = result.offsetWidth / lens.offsetWidth;
        const cy = result.offsetHeight / lens.offsetHeight;

        result.style.backgroundImage = "url('" + img.src + "')";
        result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
        result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    };

    container.onmouseleave = () => {
        lens.style.display = "none";
        result.style.display = "none";
    };
}

function openModal(name, price, imgSrc, sizes) {
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalImg').src = imgSrc;
    document.getElementById('modalSizes').innerText = sizes;
    
    // Cambiá el número por el tuyo (con código de país, ej: 549...)
    const mensaje = encodeURIComponent("Hola, quiero consultar por el vestido: " + name);
    document.getElementById('btnWhatsapp').href = "https://wa.me/5491100000000?text=" + mensaje;

    document.getElementById('productModal').style.display = 'block';
    setTimeout(setupZoom, 150);
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

window.onload = loadCatalog;
window.onclick = (e) => {
    if (e.target == document.getElementById('productModal')) closeModal();
};
