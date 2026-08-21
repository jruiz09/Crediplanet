
const  nombreDelDiaSegunFecha = fecha => [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ][new Date(fecha).getDay()];




  
module.exports = {
    nombreDelDiaSegunFecha,
}