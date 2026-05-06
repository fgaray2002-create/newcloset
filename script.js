// Link directo sin variables para evitar errores de comillas
const CSV_URL = 'https://docs.google.com/spreadsheets/d/1-K--QwKKTzi5nQRQjKQyP88YfDpJBz4ShFMfz_gM0Fk/export?format=csv&gid=0';

async function loadInventory() {
    try {
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error('No se pudo conectar con el Drive');
        
        const data = await response.text();
        const rows = data.split('\n').slice(1);
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = ''; 

        rows.forEach(row => {
            // Separar por comas (maneja casos con comas dentro de celdas)
            const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            if(columns.length < 9) return;

            const clean = (text) => text ? text.replace(/['"]+/g, '').trim() : '';

            const product = {
                nombre: clean(columns[4]),
                precio: clean(columns[5]),
                colores: clean(columns[6]),
                talles: clean(columns[7]),
                // Limpieza profunda del ID de imagen de Drive
                img: clean(columns[8])
                    .replace('https://drive.google.com/file/d/', '')
                    .replace('/view?usp=sharing', '')
                    .replace('/view?usp=drivesdk', '')
                    .split('/')[0], 
                stock: clean(columns[9])
            };

            if (product.nombre && product.img) {
                const card = document.createElement('div');
                card.className = 'product-card';
                
                // Si en el Excel (Columna J) hay una 'N', se marca como agotado
                const isOutOfStock = product.stock.toUpperCase() === 'N';
                const stockStatus = isOutOfStock ? '<div class="out-of-stock">AGOTADO</div>' : '';
                
                // Si no hay stock, la imagen se ve un poco opaca
                const imgStyle = isOutOfStock ? 'style="opacity: 0.5; filter: grayscale(1);"' : '';

                card.innerHTML = `
                    ${stockStatus}
                    <img src="https://lh3.googleusercontent.com/d/${product.img}" ${imgStyle} 
                         onclick="openDetail('${product.nombre}', '${product.precio}', 'https://lh3.googleusercontent.com/d/${product.img}', '${product.colores}', '${product.talles}')">
                    <div class="product-info">
                        <h3>${product.nombre}</h3>
                        <p class="price">${product.precio}</p>
                    </div>
                `;
                gallery.appendChild(card);
            }
        });
    } catch (error) {
        console.error("Error crítico:", error);
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

loadInventory();
