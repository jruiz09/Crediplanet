export const formatearFecha = fecha =>{
    const fechaNueva = new Date(fecha)
    fechaNueva.setMinutes(fechaNueva.getMinutes() + fechaNueva.getTimezoneOffset())
    const opciones = {
        year: 'numeric',
        month: '2-digit',
        day:'2-digit'
    }
    return fechaNueva.toLocaleDateString('es-Es', opciones)
}