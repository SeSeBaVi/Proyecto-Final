document.addEventListener('DOMContentLoaded', () => {
    // Modales
    const modalLogin = document.getElementById('modal-login');
    const modalRegister = document.getElementById('modal-register');
    const modalPublicar = document.getElementById('modal-publicar');
    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const btnPublicar = document.getElementById('btn-publicar');
    const userInfo = document.getElementById('user-info');
    const btnLogout = document.getElementById('btn-logout');

    // Mostrar modales
    btnLogin.onclick = () => modalLogin.style.display = 'flex';
    btnRegister.onclick = () => modalRegister.style.display = 'flex';
    if(btnPublicar) btnPublicar.onclick = () => modalPublicar.style.display = 'flex';
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = () => {
            modalLogin.style.display = 'none';
            modalRegister.style.display = 'none';
            modalPublicar.style.display = 'none';
        };
    });

    // Estado de sesión
    function actualizarEstadoSesion() {
        const user = localStorage.getItem('user');
        if(user) {
            const u = JSON.parse(user);
            userInfo.textContent = `Bienvenido, ${u.nombre}`;
            btnLogin.style.display = 'none';
            btnRegister.style.display = 'none';
            btnPublicar.style.display = 'inline-block';
            btnLogout.style.display = 'inline-block';
        } else {
            userInfo.textContent = '';
            btnLogin.style.display = 'inline-block';
            btnRegister.style.display = 'inline-block';
            btnPublicar.style.display = 'none';
            btnLogout.style.display = 'none';
        }
    }

    btnLogout.onclick = function() {
        localStorage.removeItem('user');
        actualizarEstadoSesion();
    };

    // Login
    document.getElementById('form-login').onsubmit = async function(e) {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const res = await fetch('php/login.php', { method: 'POST', body: data });
        const json = await res.json();
        form.querySelector('.msg').textContent = json.msg;
        if(json.success) {
            modalLogin.style.display = 'none';
            localStorage.setItem('user', JSON.stringify(json));
            actualizarEstadoSesion();
        }
    };

    // Registro
    document.getElementById('form-register').onsubmit = async function(e) {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const res = await fetch('php/register.php', { method: 'POST', body: data });
        const json = await res.json();
        form.querySelector('.msg').textContent = json.msg;
        if(json.success) {
            modalRegister.style.display = 'none';
        }
    };

    // Publicar evento
    document.getElementById('form-publicar').onsubmit = async function(e) {
        e.preventDefault();
        const form = e.target;
        const user = JSON.parse(localStorage.getItem('user'));
        if(!user) {
            form.querySelector('.msg').textContent = 'Debes iniciar sesión';
            return;
        }
        const data = new FormData(form);
        data.append('id_creador', user.id);
        const res = await fetch('php/publicar_evento.php', { method: 'POST', body: data });
        const json = await res.json();
        form.querySelector('.msg').textContent = json.msg;
        if(json.success) {
            form.reset();
            document.getElementById('modal-publicar').style.display = 'none';
            cargarEventos();
        }
    };

    // Modal para ver evento
    function crearModalVerEvento() {
        let modal = document.getElementById('modal-ver-evento');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-ver-evento';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-contenido" style="background:#fff;padding:2em;border-radius:8px;min-width:300px;max-width:400px;position:relative;">
                    <button type="button" class="close-modal" style="position:absolute;top:10px;right:10px;">Cerrar</button>
                    <div id="detalle-evento"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        // Siempre asigna el evento cerrar
        const btnCerrar = modal.querySelector('.close-modal');
        if (btnCerrar) {
            btnCerrar.onclick = () => {
                modal.style.display = 'none';
            };
        }
        return modal;
    }

    async function cargarEventos() {
        const res = await fetch('php/listar_eventos.php');
        const eventos = await res.json();
        const lista = document.getElementById('lista-eventos');
        lista.innerHTML = '';
        eventos.forEach(ev => {
            const div = document.createElement('div');
            div.className = 'evento';
            div.style.display = 'flex';
            div.style.alignItems = 'flex-start';
            div.style.gap = '1em';
            div.innerHTML = `
                <div>
                    <h4>${ev.titulo}</h4>
                    <p>${ev.descripcion}</p>
                    <p><b>Fecha:</b> ${ev.fecha_evento} ${ev.hora_evento || ''}</p>
                    <p><b>Lugar:</b> ${ev.lugar}</p>
                    <button class="btn-ver-mas" style="margin-top:0.5em;">Ver más</button>
                </div>
            `;
            // Asignar evento click al botón "Ver más"
            div.querySelector('.btn-ver-mas').onclick = (e) => {
                e.stopPropagation();
                mostrarDetalleEvento(ev);
            };
            lista.appendChild(div);
        });
        // Si tienes mapa, aquí puedes llamar a la función para mostrar los eventos en el mapa
    }

    function mostrarDetalleEvento(ev) {
        const modal = crearModalVerEvento();
        const detalle = modal.querySelector('#detalle-evento');
        detalle.innerHTML = `
            <h3>${ev.titulo}</h3>
            <p>${ev.descripcion}</p>
            <p><b>Fecha:</b> ${ev.fecha_evento} ${ev.hora_evento || ''}</p>
            <p><b>Lugar:</b> ${ev.lugar}</p>
            ${ev.imagen ? `<img src="uploads/${ev.imagen}" alt="Imagen del evento" style="max-width:100%;margin-top:1em;border-radius:8px;">` : ''}
        `;
        modal.style.display = 'flex';
    }

    // Google Maps
    let map;
    function mostrarEnMapa(eventos) {
        if(!window.google) return;
        if(!map) {
            map = new google.maps.Map(document.getElementById('googleMap'), {
                center: {lat: -13.53195, lng: -71.967463},
                zoom: 13
            });
        }
        // markers.forEach(m => m.setMap(null));
        // markers = [];
        eventos.forEach(ev => {
            if(ev.lat && ev.lng) {
                const marker = new google.maps.Marker({
                    position: {lat: parseFloat(ev.lat), lng: parseFloat(ev.lng)},
                    map,
                    title: ev.titulo
                });
                // markers.push(marker);
            }
        });
    }

    // Asigna el evento al botón cerrar del modal de ver evento
    const modalVerEvento = document.getElementById('modal-ver-evento');
    if (modalVerEvento) {
        const btnCerrar = modalVerEvento.querySelector('.close-modal');
        if (btnCerrar) {
            btnCerrar.onclick = () => {
                modalVerEvento.style.display = 'none';
            };
        }
    }

    actualizarEstadoSesion();
    cargarEventos();
    mostrarEnMapa([]); // Llama a la función para mostrar el mapa vacío o con eventos
});