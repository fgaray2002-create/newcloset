// 1. CONFIGURACIÓN
const SHEET_ID = '1-K--QwKKTzi5nQRQjKQyP88YfDpJBz4ShFMfz_gM0Fk'; 
const CSV_URL = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/export?format=csv&gid=0';

/**
 * CARGA DEL CATÁLOGO
 */
async function loadCatalog() {
    const gallery = document.getElementById('gallery');
    try {
        const response = await fetch(CSV_URL);
        const data = await response.text();
        const rows = data.split('\n').slice(1);
        
        gallery.innerHTML = ''; 

        rows.forEach(row => {
            // Separación por comas respetando comillas
            const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
            if (columns.length < 3) return;

            const name = columns[0].replace(/"/g, '').trim();
            const price = columns[1].replace(/"/g, '').trim();
            let imgUrl = columns[2].replace(/"/g, '').trim();
            const sizes = columns[3] ? columns[3].replace(/"/g, '').trim() : 'Consultar talles';

            // --- MAGIA PARA GOOGLE DRIVE ---
            // Si el link es de Drive, lo convertimos a link directo de imagen
            if (imgUrl.includes('drive.google.com')) {
                let fileId = "";
                if (imgUrl.includes('/d/')) {
                    fileId = imgUrl.split('/d/')[1].split('/')[0];
                } else if (imgUrl.includes('id=')) {
                    fileId = imgUrl.split('id=')[1].split('&')[0];
                }
                imgUrl = 'https://lh3.googleusercontent.com/u/0/d/' + fileId;
            }

            const card = document.createElement('div');
            card.className = 'product-card';
            card.onclick = () => openModal(name, price, imgUrl, sizes);
            card.innerHTML = `
                <img src="${imgUrl}" alt="${name}" onerror="this.src='https://via.placeholder.com/400x600?text=Imagen+No+Disponible'">
                <h3>${name}</h3>
                <p>${price}</p>
            `;
            gallery.appendChild(card);
        });
    } catch (error) {
        console.error("Error:", error);
        gallery.innerHTML = '<p style="color:#D4AF37; text-align:center;">Cargando diseños exclusivos...</p>';
    }
}

/**
 * FUNCIONALIDAD DEL MODAL
 */
function openModal(name, price, imgSrc, sizes) {
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalImg').src = imgSrc;
    document.getElementById('modalSizes').innerText = "Talles disponibles: " + sizes;
    
    // Configura tu número de WhatsApp aquí (con código de país, ej: 549...)
    const miTelefono = "5491100000000"; 
    const mensaje = encodeURIComponent("¡Hola Boutique Elegance! Me encantó el diseño " + name + ". ¿Tienen disponibilidad?");
    document.getElementById('btnWhatsapp').href = "https://wa.me/" + miTelefono + "?text=" + mensaje;

    document.getElementById('productModal').style.display = 'block';
    
    // Iniciamos la lupa después de que abra el modal
    setTimeout(setupZoom, 150);
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

/**
 * FUNCIONALIDAD DE LA LUPA (ZOOM)
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

// Iniciar catálogo y eventos de cierre
window.onload = loadCatalog;
window.onclick = (e) => {
    if (e.target == document.getElementById('productModal')) closeModal();
};
