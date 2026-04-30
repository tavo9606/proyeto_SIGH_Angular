import { HttpInterceptorFn } from '@angular/common/http';

// Interceptor de autenticación.
// Se ejecuta automáticamente ANTES de cada petición HTTP que haga la app.
// Su función es agregar el token JWT al header "Authorization" para que
// el backend sepa que el usuario está autenticado.
// Sin esto, habría que agregar el token manualmente en cada llamada a la API.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtiene el token guardado en localStorage al hacer login
  const token = localStorage.getItem('token');

  if (token) {
    // Clona la petición original y le agrega el header de autorización.
    // Se clona porque las peticiones HTTP son inmutables en Angular.
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    // Continúa con la petición modificada (con el token)
    return next(authReq);
  }

  // Si no hay token (usuario no autenticado), deja pasar la petición sin modificar
  return next(req);
};
