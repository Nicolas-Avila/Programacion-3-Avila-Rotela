const CAR_PRODUCTOS = "cartProductsId";

document.addEventListener("DOMContentLoaded", () => {
    loadProductos();
    cargarProductosAlCarrito();
});

function getProductosDB()
{
    const url = "../dbProducts.json";
    return fetch(url).then(response => {
        return response.json();
    }).then( resultado => {
        return resultado;
    }

    ).catch(err => {
        console.log(err);
    });
}





async function loadProductos()
{
    
    const array = await getProductosDB();
    //console.log(array);
    let html = '';

    array.forEach(productos => {
        html += `
        <div class="col-3 product-container">
            <div class="card product">
                <img 
                    src = "${productos.image}"
                    class = "card-img-top"
                    alt = "${productos.name}"
                />
                <div class = "card-body">
                    <h5 class="card-title">${productos.name}</h5>
                    <p class="card-text">${productos.extraInfo}</p>
                    <p class="card-text">${productos.price} $ / unidad</p>
                    <button type="button" class="btn btn-primary btn-cart" onclick=(agregarProductosAlCarrito(${productos.id}))>Agregar al carrito</button>
                </div>
            </div>    
        </div>
        `;
    });
    //console.log(html);
    document.getElementsByClassName("products")[0].innerHTML = html;
}

function openCloseCarrito()
{
    const contenedorDelCarrito = document.getElementsByClassName("cart-products")[0];
    
    contenedorDelCarrito.classList.forEach(
        item => {
            if (item === "hidden")
            {
               contenedorDelCarrito.classList.remove("hidden");
               contenedorDelCarrito.classList.add("active");
            }
            else
            {
                if(item === "active"){
                    contenedorDelCarrito.classList.remove("active");
                    contenedorDelCarrito.classList.add("hidden");
                }
            }
        }
    );
}

function agregarProductosAlCarrito(idProduct)
{
    // console.log("agregando id " + idProduct);
    let listaDeProductos = [];
    let localStorageItems = localStorage.getItem(CAR_PRODUCTOS);

    if(localStorageItems === null)
    {
        listaDeProductos.push(idProduct);
        localStorage.setItem(CAR_PRODUCTOS,listaDeProductos);
    }
    else
    {
        let productsId = localStorage.getItem(CAR_PRODUCTOS);
        if(productsId.length > 0)
        {
            productsId += "," + idProduct;

        }
        else
        {
            productsId = idProduct;
        }
        localStorage.setItem(CAR_PRODUCTOS,productsId);
    }


    cargarProductosAlCarrito();
}

async function cargarProductosAlCarrito()
{
    const productos = await getProductosDB();
    let html = "";
    const localStorageItems = localStorage.getItem(CAR_PRODUCTOS);

    if(!localStorageItems)
    {
        html = `<div class="cart-product empty">
            <p>Carrito vacío</p>
        </div>
        `;
    }
    else
    {
        const idProductsSplit = localStorageItems.split(',');
        // obtengo un array sin duplicados
    
        const idProductsCart = Array.from(new Set(idProductsSplit));
    
        idProductsCart.forEach(
            id => 
                {
                    productos.forEach(
                        producto => 
                            {
                                if(id == producto.id)
                                {
                                    //seguir desde el quantity
                                    const cantidad = contarIDduplicados(id,idProductsSplit);
                                    const precioTotal = producto.price * cantidad;
                                    html += `
                                        <div class="cart-product">
                                            <img class="cart-product-img" src="${producto.image}" alt="${producto.name}" />
                                            <div class="cart-product-info">
                                                <span class="quantity">${cantidad}</span>
                                                <p>
                                                    ${producto.name}
                                                    
                                                </p>
                                                <p>${precioTotal.toFixed(2)}$</p>
                                                <p class="change-quantity">
                                                    <button onClick=(decrementarCantidad(${producto.id}))>-</button>
                                                    <button onClick=(incrementarCantidad(${producto.id}))>+</button>
                                                </p>
                                                <p class="cart-product-delete">
                                                    <button onClick=(borrarProductosAlCarrito(${producto.id}))>Eliminar</button>
                                                    
                                                </p>
                                            </div>
                                        </div>
                                    `;
                                }
                            }
    
                    );
                }
        );
    
        
    }
    document.getElementsByClassName("cart-products")[0].innerHTML = html;


}

function contarIDduplicados(valor, arrayIds)
{
    let contador = 0;
    arrayIds.forEach
    (
        id => 
        {
            if(valor == id)
            {
                contador ++;
            }
        }
    );
    return contador;
}

function borrarProductosAlCarrito(idProduct)
{

    const idProductsCart = localStorage.getItem(CAR_PRODUCTOS);
    if(idProductsCart)
    {
        const arrayIdProductos = idProductsCart.split(",");
        let cuenta = 0;
    
        const resultIdBorrar = borrarTodosLosId(idProduct,arrayIdProductos);
        if(resultIdBorrar)
        {
            let cadenaDeIds = "";
            resultIdBorrar.forEach
            (
                id => 
                    {
                        cuenta++;
                        if(cuenta < resultIdBorrar.length)
                        {
                            cadenaDeIds += id + ',';
                        }
                        else
                        {
                            cadenaDeIds += id;
                        }
                    }
            );
            localStorage.setItem(CAR_PRODUCTOS, cadenaDeIds);
        }
        const idProductsCart1 = localStorage.getItem(CAR_PRODUCTOS);
        if(!idProductsCart1)
        {
            localStorage.removeItem(CAR_PRODUCTOS);
        }

    }
    cargarProductosAlCarrito();

}

function borrarTodosLosId(id, arrayids)
{
    return arrayids.filter(items => 
        {
            return items != id;
        });
}


function incrementarCantidad(id)
{
    //console.log("incrementar " + id);
    const idProductsCart = localStorage.getItem(CAR_PRODUCTOS);
    
    if(idProductsCart)
        {
            const arrayIdProductos = idProductsCart.split(",");
            arrayIdProductos.push(id);
            let cuenta = 0;
        
            let cadenaDeIds = "";
            arrayIdProductos.forEach
            (
                id => 
                    {
                        cuenta++;
                        if(cuenta < arrayIdProductos.length)
                        {
                            cadenaDeIds += id + ',';
                        }
                        else
                        {
                            cadenaDeIds += id;
                        }
                    }
            );
            localStorage.setItem(CAR_PRODUCTOS, cadenaDeIds);
            
    
        }
        cargarProductosAlCarrito();

}

function decrementarCantidad(id)
{
    const idProductsCart = localStorage.getItem(CAR_PRODUCTOS);
    
    if(idProductsCart)
    {
        const arrayIdProductos = idProductsCart.split(",");
        arrayIdProductos.pop();
        let cuenta = 0;
    
        let cadenaDeIds = "";
        arrayIdProductos.forEach
        (
            id => 
                {
                    cuenta++;
                    if(cuenta < arrayIdProductos.length)
                    {
                        cadenaDeIds += id + ',';
                    }
                    else
                    {
                        cadenaDeIds += id;
                    }
                }
        );
        localStorage.setItem(CAR_PRODUCTOS, cadenaDeIds);
        

    }
    cargarProductosAlCarrito();

}
