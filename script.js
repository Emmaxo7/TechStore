// =====================================================
// BASE DE DATOS LOCAL
// =====================================================

let productos =
    JSON.parse(localStorage.getItem("productos")) || [

    {
        id: 1,
        codigo: "LAP001",
        nombre: "Laptop Gamer",
        categoria: "Laptops",
        compra: 18000,
        venta: 22999,
        stock: 8,
        minimo: 3
    },

    {
        id: 2,
        codigo: "MON001",
        nombre: 'Monitor 27"',
        categoria: "Monitores",
        compra: 3500,
        venta: 4899,
        stock: 12,
        minimo: 5
    },

    {
        id: 3,
        codigo: "TEC001",
        nombre: "Teclado Mecánico RGB",
        categoria: "Accesorios",
        compra: 800,
        venta: 1299,
        stock: 20,
        minimo: 5
    },

    {
        id: 4,
        codigo: "MOU001",
        nombre: "Mouse Gamer",
        categoria: "Periféricos",
        compra: 500,
        venta: 899,
        stock: 4,
        minimo: 5
    },

    {
        id: 5,
        codigo: "GPU001",
        nombre: "Tarjeta Gráfica RTX",
        categoria: "Componentes",
        compra: 11000,
        venta: 13999,
        stock: 3,
        minimo: 3
    }

];


let clientes =
    JSON.parse(localStorage.getItem("clientes")) || [

    {
        id: 1,
        nombre: "Cliente General",
        telefono: "5555555555",
        correo: "cliente@gmail.com",
        direccion: "Ciudad de México"
    }

];


let proveedores =
    JSON.parse(localStorage.getItem("proveedores")) || [];


let ventas =
    JSON.parse(localStorage.getItem("ventas")) || [];


let carritoVenta = [];


// =====================================================
// GUARDAR DATOS
// =====================================================

function guardarDatos() {

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );

    localStorage.setItem(
        "clientes",
        JSON.stringify(clientes)
    );

    localStorage.setItem(
        "proveedores",
        JSON.stringify(proveedores)
    );

    localStorage.setItem(
        "ventas",
        JSON.stringify(ventas)
    );

}


// =====================================================
// NAVEGACIÓN
// =====================================================

function mostrarSeccion(id) {

    document.querySelectorAll(".seccion")
        .forEach(seccion => {

            seccion.classList.remove("activa");

        });


    document.getElementById(id)
        .classList.add("activa");


    if (id === "dashboard") {
        actualizarDashboard();
    }

    if (id === "inventario") {
        mostrarProductos();
    }

    if (id === "ventas") {
        cargarVenta();
        mostrarHistorialVentas();
    }

    if (id === "clientes") {
        mostrarClientes();
    }

    if (id === "proveedores") {
        mostrarProveedores();
    }

    if (id === "reportes") {
        generarReportes();
    }


    document.getElementById("sidebar")
        .classList.remove("active");

}


// =====================================================
// SIDEBAR
// =====================================================

function toggleSidebar() {

    document
        .getElementById("sidebar")
        .classList.toggle("active");

}


// =====================================================
// INVENTARIO
// =====================================================

function mostrarProductos() {

    const tabla =
        document.getElementById("tablaProductos");

    const busqueda =
        document.getElementById("buscarProducto")
        ?.value
        .toLowerCase() || "";


    tabla.innerHTML = "";


    productos
        .filter(producto =>
            producto.nombre
                .toLowerCase()
                .includes(busqueda)
        )
        .forEach(producto => {

            const stockClase =
                producto.stock <= producto.minimo
                    ? "stock-bajo"
                    : "stock-normal";


            tabla.innerHTML += `

                <tr>

                    <td>
                        ${producto.codigo}
                    </td>

                    <td>
                        <strong>
                            ${producto.nombre}
                        </strong>
                    </td>

                    <td>
                        ${producto.categoria}
                    </td>

                    <td>
                        $${producto.compra.toLocaleString("es-MX")}
                    </td>

                    <td>
                        $${producto.venta.toLocaleString("es-MX")}
                    </td>

                    <td class="${stockClase}">
                        ${producto.stock}
                    </td>

                    <td>

                        <button
                            class="btn warning"
                            onclick="editarProducto(${producto.id})">

                            ✏️

                        </button>

                        <button
                            class="btn danger"
                            onclick="eliminarProducto(${producto.id})">

                            🗑️

                        </button>

                    </td>

                </tr>

            `;

        });

}


// =====================================================
// MODAL PRODUCTO
// =====================================================

function abrirProducto() {

    document.getElementById("productoId").value = "";

    document.getElementById("productoCodigo").value = "";

    document.getElementById("productoNombre").value = "";

    document.getElementById("productoCompra").value = "";

    document.getElementById("productoVenta").value = "";

    document.getElementById("productoStock").value = "";

    document.getElementById("productoMinimo").value = "5";


    document.getElementById("modalProducto")
        .style.display = "flex";

}


// =====================================================
// GUARDAR PRODUCTO
// =====================================================

function guardarProducto() {

    const id =
        document.getElementById("productoId").value;


    const producto = {

        id: id
            ? Number(id)
            : Date.now(),

        codigo:
            document.getElementById("productoCodigo").value,

        nombre:
            document.getElementById("productoNombre").value,

        categoria:
            document.getElementById("productoCategoria").value,

        compra:
            Number(document.getElementById("productoCompra").value),

        venta:
            Number(document.getElementById("productoVenta").value),

        stock:
            Number(document.getElementById("productoStock").value),

        minimo:
            Number(document.getElementById("productoMinimo").value)

    };


    if (
        !producto.codigo ||
        !producto.nombre ||
        producto.venta <= 0
    ) {

        alert("Completa correctamente los datos.");

        return;

    }


    if (id) {

        const indice =
            productos.findIndex(
                p => p.id === Number(id)
            );

        productos[indice] = producto;

    } else {

        productos.push(producto);

    }


    guardarDatos();

    mostrarProductos();

    cerrarModal("modalProducto");

    actualizarDashboard();

    alert("✅ Producto guardado correctamente.");

}


// =====================================================
// EDITAR PRODUCTO
// =====================================================

function editarProducto(id) {

    const producto =
        productos.find(p => p.id === id);


    if (!producto) return;


    document.getElementById("productoId").value =
        producto.id;

    document.getElementById("productoCodigo").value =
        producto.codigo;

    document.getElementById("productoNombre").value =
        producto.nombre;

    document.getElementById("productoCategoria").value =
        producto.categoria;

    document.getElementById("productoCompra").value =
        producto.compra;

    document.getElementById("productoVenta").value =
        producto.venta;

    document.getElementById("productoStock").value =
        producto.stock;

    document.getElementById("productoMinimo").value =
        producto.minimo;


    document.getElementById("modalProducto")
        .style.display = "flex";

}


// =====================================================
// ELIMINAR PRODUCTO
// =====================================================

function eliminarProducto(id) {

    const producto =
        productos.find(p => p.id === id);


    if (
        !confirm(
            `¿Eliminar ${producto.nombre}?`
        )
    ) return;


    productos =
        productos.filter(
            p => p.id !== id
        );


    guardarDatos();

    mostrarProductos();

    actualizarDashboard();

}


// =====================================================
// CLIENTES
// =====================================================

function abrirCliente() {

    document.getElementById("clienteNombre").value = "";

    document.getElementById("clienteTelefono").value = "";

    document.getElementById("clienteCorreo").value = "";

    document.getElementById("clienteDireccion").value = "";


    document.getElementById("modalCliente")
        .style.display = "flex";

}


function guardarCliente() {

    const nombre =
        document.getElementById("clienteNombre").value;


    if (!nombre) {

        alert("Escribe el nombre del cliente.");

        return;

    }


    clientes.push({

        id: Date.now(),

        nombre,

        telefono:
            document.getElementById("clienteTelefono").value,

        correo:
            document.getElementById("clienteCorreo").value,

        direccion:
            document.getElementById("clienteDireccion").value

    });


    guardarDatos();

    cerrarModal("modalCliente");

    mostrarClientes();

    actualizarDashboard();

    alert("✅ Cliente registrado.");

}


function mostrarClientes() {

    const tabla =
        document.getElementById("tablaClientes");

    tabla.innerHTML = "";


    clientes.forEach(cliente => {

        tabla.innerHTML += `

            <tr>

                <td>
                    ${cliente.nombre}
                </td>

                <td>
                    ${cliente.telefono}
                </td>

                <td>
                    ${cliente.correo}
                </td>

                <td>
                    ${cliente.direccion}
                </td>

                <td>

                    <button
                        class="btn danger"
                        onclick="eliminarCliente(${cliente.id})">

                        🗑️

                    </button>

                </td>

            </tr>

        `;

    });

}


function eliminarCliente(id) {

    if (
        !confirm(
            "¿Eliminar este cliente?"
        )
    ) return;


    clientes =
        clientes.filter(
            c => c.id !== id
        );


    guardarDatos();

    mostrarClientes();

    actualizarDashboard();

}


// =====================================================
// PROVEEDORES
// =====================================================

function abrirProveedor() {

    document.getElementById("proveedorEmpresa").value = "";

    document.getElementById("proveedorContacto").value = "";

    document.getElementById("proveedorTelefono").value = "";

    document.getElementById("proveedorCorreo").value = "";


    document.getElementById("modalProveedor")
        .style.display = "flex";

}


function guardarProveedor() {

    const empresa =
        document.getElementById("proveedorEmpresa").value;


    if (!empresa) {

        alert("Escribe el nombre de la empresa.");

        return;

    }


    proveedores.push({

        id: Date.now(),

        empresa,

        contacto:
            document.getElementById("proveedorContacto").value,

        telefono:
            document.getElementById("proveedorTelefono").value,

        correo:
            document.getElementById("proveedorCorreo").value

    });


    guardarDatos();

    cerrarModal("modalProveedor");

    mostrarProveedores();

    alert("✅ Proveedor registrado.");

}


function mostrarProveedores() {

    const tabla =
        document.getElementById("tablaProveedores");

    tabla.innerHTML = "";


    proveedores.forEach(proveedor => {

        tabla.innerHTML += `

            <tr>

                <td>
                    ${proveedor.empresa}
                </td>

                <td>
                    ${proveedor.contacto}
                </td>

                <td>
                    ${proveedor.telefono}
                </td>

                <td>
                    ${proveedor.correo}
                </td>

                <td>

                    <button
                        class="btn danger"
                        onclick="eliminarProveedor(${proveedor.id})">

                        🗑️

                    </button>

                </td>

            </tr>

        `;

    });

}


function eliminarProveedor(id) {

    if (
        !confirm(
            "¿Eliminar este proveedor?"
        )
    ) return;


    proveedores =
        proveedores.filter(
            p => p.id !== id
        );


    guardarDatos();

    mostrarProveedores();

}


// =====================================================
// VENTAS
// =====================================================

function cargarVenta() {

    const clienteSelect =
        document.getElementById("ventaCliente");

    const productoSelect =
        document.getElementById("ventaProducto");


    clienteSelect.innerHTML = "";

    productoSelect.innerHTML = "";


    clientes.forEach(cliente => {

        clienteSelect.innerHTML += `

            <option value="${cliente.id}">

                ${cliente.nombre}

            </option>

        `;

    });


    productos
        .filter(p => p.stock > 0)
        .forEach(producto => {

            productoSelect.innerHTML += `

                <option value="${producto.id}">

                    ${producto.nombre}
                    -
                    $${producto.venta.toLocaleString("es-MX")}

                </option>

            `;

        });

}


function agregarProductoVenta() {

    const productoId =
        Number(
            document.getElementById("ventaProducto").value
        );


    const cantidad =
        Number(
            document.getElementById("ventaCantidad").value
        );


    const producto =
        productos.find(
            p => p.id === productoId
        );


    if (!producto || cantidad <= 0) {

        alert("Selecciona un producto válido.");

        return;

    }


    if (cantidad > producto.stock) {

        alert(
            `Solo hay ${producto.stock} unidades disponibles.`
        );

        return;

    }


    const existente =
        carritoVenta.find(
            p => p.id === producto.id
        );


    if (existente) {

        if (
            existente.cantidad + cantidad >
            producto.stock
        ) {

            alert("No hay suficiente stock.");

            return;

        }

        existente.cantidad += cantidad;

    } else {

        carritoVenta.push({

            id: producto.id,

            nombre: producto.nombre,

            precio: producto.venta,

            cantidad

        });

    }


    mostrarCarritoVenta();

}


function mostrarCarritoVenta() {

    const contenedor =
        document.getElementById("productosVenta");

    contenedor.innerHTML = "";


    let total = 0;


    carritoVenta.forEach((item, index) => {

        const subtotal =
            item.precio * item.cantidad;


        total += subtotal;


        contenedor.innerHTML += `

            <div class="venta-item">

                <div>

                    <strong>
                        ${item.nombre}
                    </strong>

                    <br>

                    ${item.cantidad}
                    x
                    $${item.precio.toLocaleString("es-MX")}

                </div>

                <div>

                    $${subtotal.toLocaleString("es-MX")}

                    <button
                        class="btn danger"
                        onclick="eliminarProductoVenta(${index})">

                        ✕

                    </button>

                </div>

            </div>

        `;

    });


    document.getElementById("ventaTotal")
        .textContent =
        "$" + total.toLocaleString("es-MX");

}


function eliminarProductoVenta(index) {

    carritoVenta.splice(index, 1);

    mostrarCarritoVenta();

}


// =====================================================
// REGISTRAR VENTA
// =====================================================

function registrarVenta() {

    if (carritoVenta.length === 0) {

        alert(
            "Agrega productos a la venta."
        );

        return;

    }


    const clienteId =
        Number(
            document.getElementById("ventaCliente").value
        );


    const cliente =
        clientes.find(
            c => c.id === clienteId
        );


    let total = 0;


    carritoVenta.forEach(item => {

        total +=
            item.precio * item.cantidad;

    });


    // Descontar inventario

    carritoVenta.forEach(item => {

        const producto =
            productos.find(
                p => p.id === item.id
            );


        producto.stock -= item.cantidad;

    });


    const venta = {

        id: Date.now(),

        fecha: new Date().toLocaleString("es-MX"),

        cliente:
            cliente
                ? cliente.nombre
                : "Cliente General",

        productos:
            [...carritoVenta],

        total,

        metodo:
            document.getElementById("metodoPago").value

    };


    ventas.push(venta);

    carritoVenta = [];


    guardarDatos();

    mostrarCarritoVenta();

    cargarVenta();

    mostrarHistorialVentas();

    actualizarDashboard();

    alert(
        "✅ Venta registrada correctamente."
    );

}


function mostrarHistorialVentas() {

    const contenedor =
        document.getElementById("historialVentas");

    contenedor.innerHTML = "";


    if (ventas.length === 0) {

        contenedor.innerHTML =
            "<p>No hay ventas registradas.</p>";

        return;

    }


    ventas
        .slice()
        .reverse()
        .slice(0, 10)
        .forEach(venta => {

            contenedor.innerHTML += `

                <div class="venta-item">

                    <div>

                        <strong>
                            Venta #${venta.id}
                        </strong>

                        <br>

                        ${venta.cliente}

                        <br>

                        <small>
                            ${venta.fecha}
                        </small>

                    </div>

                    <strong>

                        $${venta.total.toLocaleString("es-MX")}

                    </strong>

                </div>

            `;

        });

}


// =====================================================
// DASHBOARD
// =====================================================

function actualizarDashboard() {

    const totalVentas =
        ventas.reduce(
            (total, venta) =>
                total + venta.total,
            0
        );


    const stockBajo =
        productos.filter(
            p => p.stock <= p.minimo
        ).length;


    document.getElementById("totalVentas")
        .textContent =
        "$" + totalVentas.toLocaleString("es-MX");


    document.getElementById("totalProductos")
        .textContent =
        productos.length;


    document.getElementById("totalClientes")
        .textContent =
        clientes.length;


    document.getElementById("stockBajo")
        .textContent =
        stockBajo;


    mostrarVentasDashboard();

    mostrarStockBajo();

}


// =====================================================
// VENTAS RECIENTES
// =====================================================

function mostrarVentasDashboard() {

    const contenedor =
        document.getElementById("ventasRecientes");

    contenedor.innerHTML = "";


    const recientes =
        ventas
            .slice()
            .reverse()
            .slice(0, 5);


    if (recientes.length === 0) {

        contenedor.innerHTML =
            "<p>No hay ventas.</p>";

        return;

    }


    recientes.forEach(venta => {

        contenedor.innerHTML += `

            <div class="venta-item">

                <span>

                    ${venta.cliente}

                </span>

                <strong>

                    $${venta.total.toLocaleString("es-MX")}

                </strong>

            </div>

        `;

    });

}


// =====================================================
// STOCK BAJO
// =====================================================

function mostrarStockBajo() {

    const contenedor =
        document.getElementById(
            "productosStockBajo"
        );


    contenedor.innerHTML = "";


    const bajos =
        productos.filter(
            p => p.stock <= p.minimo
        );


    if (bajos.length === 0) {

        contenedor.innerHTML =
            "<p>✅ No hay productos con stock bajo.</p>";

        return;

    }


    bajos.forEach(producto => {

        contenedor.innerHTML += `

            <div class="venta-item">

                <span>
                    ${producto.nombre}
                </span>

                <strong class="stock-bajo">

                    ${producto.stock}
                    unidades

                </strong>

            </div>

        `;

    });

}


// =====================================================
// REPORTES
// =====================================================

function generarReportes() {

    const totalVentas =
        ventas.reduce(
            (total, venta) =>
                total + venta.total,
            0
        );


    const valorInventario =
        productos.reduce(
            (total, producto) =>
                total +
                producto.compra *
                producto.stock,
            0
        );


    document.getElementById("reporteVentas")
        .textContent =
        "$" + totalVentas.toLocaleString("es-MX");


    document.getElementById("valorInventario")
        .textContent =
        "$" + valorInventario.toLocaleString("es-MX");


    document.getElementById("reporteClientes")
        .textContent =
        clientes.length;


    // Producto más vendido

    let vendidos = {};


    ventas.forEach(venta => {

        venta.productos.forEach(item => {

            if (!vendidos[item.nombre]) {

                vendidos[item.nombre] = 0;

            }

            vendidos[item.nombre] +=
                item.cantidad;

        });

    });


    let productoTop = "Sin ventas";

    let cantidadTop = 0;


    Object.keys(vendidos)
        .forEach(nombre => {

            if (
                vendidos[nombre] >
                cantidadTop
            ) {

                cantidadTop =
                    vendidos[nombre];

                productoTop =
                    nombre;

            }

        });


    document.getElementById(
        "productoMasVendido"
    ).textContent =
        productoTop;


    // Inventario

    const reporte =
        document.getElementById(
            "reporteInventario"
        );


    reporte.innerHTML = "";


    productos.forEach(producto => {

        reporte.innerHTML += `

            <div class="venta-item">

                <span>

                    ${producto.nombre}

                </span>

                <strong>

                    ${producto.stock} unidades

                </strong>

            </div>

        `;

    });

}


// =====================================================
// CERRAR MODALES
// =====================================================

function cerrarModal(id) {

    document.getElementById(id)
        .style.display = "none";

}


// =====================================================
// INICIALIZAR
// =====================================================

guardarDatos();

actualizarDashboard();

mostrarProductos();

mostrarClientes();

mostrarProveedores();

cargarVenta();

mostrarHistorialVentas();

generarReportes();
