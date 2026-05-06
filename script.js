// CONFIGURACIÓN DE DATOS
// Reemplaza esto con el ID largo de tu hoja de Google Sheets
const SHEET_ID = 'TU_ID_DE_GOOGLE_SHEETS_AQUI'; 
const CSV_URL = `https://docs.google.com/spreadsheets/d/${1-K--QwKKTzi5nQRQjKQyP88YfDpJBz4ShFMfz_gM0Fk}/export?format=csv`;

/**
 * 1. CARGA DEL CATÁLOGO DESDE GOOGLE SHEETS
 */
async function loadCatalog() {
    try {
        const response = await fetch(CSV_URL);
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Ignoramos la primera fila (títulos)
        const gallery = document.getElementById('gallery');
        
        gallery.innerHTML = ''; // Limpiamos antes de cargar

        rows.forEach(row => {
            // Dividimos por coma (ajustar a ';' si tu Excel usa punto y coma)
            const columns = row.split(','); 
            if (columns.length < 3) return;

            const name = columns[0].trim();
            const price = columns[1].trim();
            const imgUrl = columns[2].trim();
            const sizes = columns[3] ? columns[3].trim() : 'Consultar talles';

            // Creamos la tarjeta del vestido
            const card = document.createElement('div');
            card.className = 'product-card';
            card.onclick = () => openModal(name, price, imgUrl, sizes);
            card.innerHTML = `
                <img src="${imgUrl}" alt="${name}">
                <h3>${name}</h3>
                <p>${price}</p>
            `;
            gallery.appendChild(card);
        });
    } catch (error) {
        console.error("Error al conectar con el catálogo:", error);
    }
}

/**
 * 2. LÓGICA DE LA LUPA (ZOOM)
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

        // Coordenadas relativas a la imagen
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        // Centrar la lente en el puntero
        x = x - (lens.offsetWidth / 2);
        y = y - (lens.offsetHeight / 2);

        // Evitar que la lente se salga de los bordes
        if (x > img.width - lens.offsetWidth) x = img.width - lens.offsetWidth;
        if (x < 0) x = 0;
        if (y > img.height - lens.offsetHeight) y = img.height - lens.offsetHeight;
        if (y < 0) y = 0;

        lens.style.left = x + "px";
        lens.style.top = y + "px";

        // Cálculo de la potencia del zoom
        const cx = result.offsetWidth / lens.offsetWidth;
        const cy = result.offsetHeight / lens.offsetHeight;

        result.style.backgroundImage = `url('${img.src}')`;
        result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
        result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    };

    container.onmouseleave = () => {
        lens.style.display = "none";
        result.style.display = "none";
    };
}

/**
 * 3. FUNCIONES DEL MODAL
 */
function openModal(name, price, imgSrc, sizes) {
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalImg').src = imgSrc;
    document.getElementById('modalSizes').innerText = sizes;
    
    // Configuramos el link de WhatsApp automáticamente
    const mensaje = encodeURIComponent(`Hola Boutique Elegance, me interesa el vestido: ${name}`);
    document.getElementById('btnWhatsapp').href = `https://wa.me/TUNUMEROAQUI?text=${mensaje}`;

    document.getElementById('productModal').style.display = 'block';
    
    // Delay de 150ms para que la imagen cargue y el zoom calcule bien
    setTimeout(setupZoom, 150);
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Iniciar catálogo al cargar la página
window.onload = loadCatalog;

// Cerrar al hacer click fuera del cuadro
window.onclick = (e) => {
    if (e.target == document.getElementById('productModal')) closeModal();
};
