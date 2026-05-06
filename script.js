// Configuración directa para evitar errores de sintaxis
const CSV_URL = 'https://docs.google.com/spreadsheets/d/1-K--QwKKTzi5nQRQjKQyP88YfDpJBz4ShFMfz_gM0Fk/export?format=csv&gid=0';

async function loadInventory() {
    try {
        const response = await fetch(CSV_URL);
        const data = await response.text();
        
        // Separamos las filas
        const rows = data.split('\n').slice(1);
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = ''; 

        rows.forEach(row => {
            // Separar por comas respetando el contenido entre comillas
            const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            if(columns.length < 9) return;

            // Limpieza de datos
            const clean = (text) => text ? text.replace(/['"]+/g, '').trim() : '';

            const product = {
                nombre: clean(columns[4]),
                precio: clean(columns[5]),
                colores: clean(columns[6]),
                talles: clean(columns[7]),
                // Transformamos el link de Drive para que sea una imagen directa
                img: clean(columns[8]).replace('/view?usp=sharing', '').replace('/view?usp=drivesdk', '').replace('file/d/', 'uc?id='),
                stock: clean(columns[9])
            };

            // Solo creamos la tarjeta si tiene nombre e imagen
            if (product.nombre && product.img) {
                const card = document.createElement('div');
                card.className = 'product-card';
                
                // Si en la columna J pusiste 'N', aparece el cartel de Agotado
                const stockStatus = product.stock.toUpperCase() === 'N' ? '<div class="out-of-stock">AGOTADO</div>' : '';
                
                card.innerHTML = `
                    ${stockStatus}
                    <img src="${product.img}" onclick="openDetail('${product.nombre}', '${product.precio}', '${product.img}', '${product.colores}', '${product.talles}')" alt="${product.nombre}">
                    <div class="product-info">
                        <h3>${product.nombre}</h3>
                        <p class="price">${product.precio}</p>
                    </div>
                `;
                gallery.appendChild(card);
            }
        });
    } catch (error) {
        console.error("Error al conectar con el Drive:", error);
    }
}

function openDetail(name, price, img, colors, sizes) {
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalImg').src = img;
    document.getElementById('modalColors').innerText = colors;
    document.getElementById('modalSizes').innerText = sizes;
    document.getElementById('productModal').style.display = "block";
}

// Ejecutar la carga al abrir la página
loadInventory();
