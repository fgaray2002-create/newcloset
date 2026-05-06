// 1. CONFIGURACIÓN DEL CATÁLOGO
const SHEET_ID = '2PACX-1vR18lDn6kt3Os6Dk3GoQ8BxNdRTptmV18Ax_6L76wNzYVU7TwQ-jfpPulir6M92LcN15sNKg0wORg79'; // <--- PEGA TU ID ACÁ ENTRE LAS COMILLAS

// Usamos concatenación simple (+) para evitar el error de "template expression"
const CSV_URL = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/export?format=csv';

/**
 * FUNCIÓN PARA CARGAR LOS VESTIDOS
 */
async function loadCatalog() {
    const gallery = document.getElementById('gallery');
    try {
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error("Error de conexión");
        
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
            card.onclick = function() { openModal(name, price, imgUrl, sizes); };
            card.innerHTML = 
                '<img src="' + imgUrl + '" alt="' + name + '">' +
                '<h3>' + name + '</h3>' +
                '<p>' + price + '</p>';
            gallery.appendChild(card);
        });
    } catch (error) {
        gallery.innerHTML = '<p style="color:#D4AF37; text-align:center;">Error cargando catálogo. Revisa si la planilla está publicada en la web.</p>';
    }
}

/**
 * FUNCIÓN DE LA LUPA (ZOOM)
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
 * APERTURA Y CIERRE DEL MODAL
 */
function openModal(name, price, imgSrc, sizes) {
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalImg').src = imgSrc;
    document.getElementById('modalSizes').innerText = sizes;
    
    // Configura tu WhatsApp (ej: 549...)
    const msg = encodeURIComponent("Hola, consulto por: " + name);
    document.getElementById('btnWhatsapp').href = "https://wa.me/TUNUMEROAQUI?text=" + msg;

    document.getElementById('productModal').style.display = 'block';
    setTimeout(setupZoom, 150);
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Iniciar procesos
window.onload = loadCatalog;
window.onclick = function(e) {
    if (e.target == document.getElementById('productModal')) closeModal();
};
