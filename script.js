// 1. Configuración de la Lupa
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

        result.style.backgroundImage = `url('${img.src}')`;
        result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
        result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    };

    container.onmouseleave = () => {
        lens.style.display = "none";
        result.style.display = "none";
    };
}

// 2. Función para abrir el modal (llamar desde el click de la prenda)
function openModal(name, price, imgSrc) {
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalImg').src = imgSrc;
    
    document.getElementById('productModal').style.display = 'block';
    
    // El pequeño delay asegura que la imagen ya esté cargada para calcular el zoom
    setTimeout(setupZoom, 150);
}

// 3. Función para cerrar el modal
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
    // Limpiamos el zoom al cerrar
    document.getElementById('zoomResult').style.display = 'none';
}

// 4. Cerrar si hacen click fuera del contenido negro
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target == modal) {
        closeModal();
    }
}
