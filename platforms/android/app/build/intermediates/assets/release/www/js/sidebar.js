var sidebarData = [

    {menu:'Registrar Ponto', link:'capturaPonto', icon:'ti-time'},
    //{menu:'Map', link:'here', icon:'ti-map'},
    //{menu:'Storage', link:'storage', icon:'ti-files'},
    //{menu:'Scanner', link:'scanner', icon:'ti-eye'},
    {menu:'Qr Ponto', link:'qrPonto', icon:'ti-layout-grid4-alt'},
];

var sidebar = '<li id="${link}"><a href="${link}.html"><i class="${icon}"></i><p>${menu}</p></a></li>';
    
$("#sidebar").empty();

$.tmpl( sidebar, sidebarData).appendTo( "#sidebar" );

var navbarData = [
    {menu:'&nbsp;Perfil', link:'profile', icon:'ti-user'}
];

var navbar = '<li><a href="${link}.html"><i class="${icon}"></i> <p> ${menu}</p></a></li>';

$("#navbars").empty();

$.tmpl( sidebar, navbarData ).appendTo( "#navbars" );