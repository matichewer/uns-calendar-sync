# UNS Calendar Sync

Aplicación web para sincronizar el calendario académico de la Universidad Nacional del Sur (UNS).

## Qué hace

- Lee los eventos publicados en el calendario de la UNS.
- Te permite marcar (seleccionar) los eventos que quieras incluir.
- Genera y descarga un archivo en formato ICS con los eventos seleccionados.
- Ese archivo ICS lo podés importar en cualquier aplicación de calendario (por ejemplo Google Calendar, Outlook, Apple Calendar, etc.).

## ¿Qué es un archivo ICS?

ICS (iCalendar) es un formato estándar para intercambiar datos de calendarios y eventos. Un archivo `.ics` contiene información como título del evento, fecha y hora, descripción y ubicación. La mayoría de aplicaciones de calendario soportan importar archivos `.ics` o suscribirse a calendarios que los generen.

Beneficios de usar ICS:
- Portabilidad: funciona con Google Calendar, Outlook, Apple Calendar y otras.
- Offline: podés descargar el archivo y conservar una copia local.

## Ejemplo: importar en Google Calendar

1. Abrí Google Calendar en la web.
2. En la parte izquierda, hacé click en el signo + junto a "Otros calendarios" y elegí "Importar".
3. Subí el archivo `.ics` que descargaste y elegí el calendario donde importarlo.
4. Confirmá y verás los eventos añadidos.

## Estructura del proyecto

- `/` (raíz): aplicación frontend creada con Vite + React + TypeScript.
- `/src`: código fuente de la interfaz.
	- `main.tsx`, `App.tsx`: entrada principal y estructura de la app.
	- `components/`: componentes UI (filtros, filas de evento, calendario, helpers y componentes reutilizables).
	- `utils/`: funciones utilitarias, incluyendo `generateICS.ts` y `parseCalendar.ts` que se encargan de crear archivos ICS y parsear el calendario fuente.
- `/api`: servidor proxy (Node) que consulta la web del calendario de la UNS y devuelve los datos necesarios al frontend.
- `/public`: archivos estáticos servidos por la aplicación.
- `/nginx`: configuración ejemplo para servir la app con Nginx (opcional, para despliegue en Docker/servidor).

## Desarrollo local

Comandos principales (desde la raíz del proyecto):

```
git clone https://github.com/matichewer/uns-calendar-sync/
cd uns-calendar-sync
npm install
npm run dev      # inicia Vite en modo desarrollo
npm run build    # build de producción
npm run preview  # sirve la build localmente
```


## Contribuir

Si querés mejorar la app, podés:

- Escribirme
- Abrir un issue describiendo el cambio.
- Enviar un pull request

