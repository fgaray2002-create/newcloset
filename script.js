// 1. CONFIGURACIÓN DEL CATÁLOGO
const SHEET_ID = '1-K--QwKKTzi5nQRQjKQyP88YfDpJBz4ShFMfz_gM0Fk'; 
const CSV_URL = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/export?format=csv&gid=0';

/**
 * CARGA DE DATOS DESDE GOOGLE SHEETS
 */
async function loadCatalog() {
    const gallery = document.getElementById('gallery');
    try {
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error("Error al conectar con la planilla");
        
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Ignorar encabezados
        
        gallery.innerHTML = ''; 

        rows.forEach(row => {
            // Dividir por comas cuidando que los datos no tengan comas internas
            const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
            if (columns.length < 3) return;

            const name = columns[0].replace(/"/g, '').trim();
            const price = columns[1].replace(/"/g, '').trim();
            const imgUrl = columns[2].replace(/"/g, '').trim();
            const sizes = columns[3] ? columns[3].replace(/"/g, '').trim() : 'Consultar';

            const card = document.createElement('div');
            card.className = 'product-card';
            card.onclick = function() { openModal(name, price, imgUrl, sizes); };
            card.innerHTML = `
                <img src="${imgUrl}" alt="${name}" onerror="this.src='https://via.placeholder.com/400x600?text=Imagen+No+Disponible'">
                <h3>${name}</h3>
                <p>${price}</p>
            `;
            gallery.appendChild(card);
        });
    } catch (error) {
        console.error("Error cargando catálogo:", error);
        gallery.innerHTML = '<p style="color:#D4AF37; text-align:center;">Error al cargar productos. Revisa la publicación de la planilla.</p>';
    }
}

/**
 * LÓGICA DE LA LUPA (ZOOM)
 */
function setupZoom() {
    const img = document.getElementById('modalImg');
    const lens = document.querySelector('.zoom-lens');
    const result = document.getElementById('zoomResult');
    const container = document.querySelector('.zoom-wrapper');

    if (!img || !lens || !result) return;

    container.onmousemove = function(e) {
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

    container.onmouseleave = function() {
        lens.style.display = "none";
        result.style.display = "none";
    };
}

/**
 * GESTIÓN DEL MODAL
 */
function openModal(name, price, imgSrc, sizes) {
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalImg').src = imgSrc;
    document.getElementById('modalSizes').innerText = "Talles: " + sizes;
    
    const msg = encodeURIComponent("Hola, consulto por el diseño: " + name);
    document.getElementById('btnWhatsapp').href = "https://wa.me/5491100000000?text=" + msg;

    document.getElementById('productModal').style.display = 'block';
    setTimeout(setupZoom, 150);
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

window.onload = loadCatalog;
window.onclick = function(e) {
    if (e.target == document.getElementById('productModal')) closeModal();
};
