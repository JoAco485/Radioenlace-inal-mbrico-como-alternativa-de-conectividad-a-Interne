Repositorio oficial de respaldo y versionamiento del proyecto de grado desarrollado en el marco del curso **Proyecto de Grado (202016907)** de la **Universidad Nacional Abierta y a Distancia (UNAD)** – Escuela de Ciencias Básicas, Tecnología e Ingeniería (ECBTI).

---

## 📋 Información del Proyecto

* **Título:** Diseño de un radioenlace inalámbrico como alternativa de conectividad a Internet para la sede de Desarrollo Rural de la Institución Educativa Santiago Gutiérrez Ángel, vereda La Estrella, Argelia, Valle del Cauca.
* **Autores:**
  * Diego Fernando Rueda Gil - Investigador principal
  * Jorge Armando Acosta Vásquez
* **Programa:** Ingeniería de Sistemas
* **Tutor:** Orlando Gómez Barboza
* **Marco de Ingeniería:** CDIO (*Concebir, Diseñar, Implementar y Operar*) con enfoque de desarrollo incremental.
* **Nivel de Madurez Tecnológica objetivo:** TRL 5 (*Validación de tecnología en entorno relevante simulado*).

---

## 🎯 Propósito del Repositorio

De acuerdo con las directrices metodológicas de la **Fase 4 – Componente práctico**, este repositorio centraliza y respalda los artefactos técnicos, el código fuente del prototipo funcional **RadioLink**, el modelado gráfico tridimensional en **SketchUp** y las evidencias de verificación del diseño:

1. **`/modelado-3d-sketchup`**: Representación gráfica tridimensional del entorno geográfico, puntos de transmisión/recepción, trayectoria de línea de vista y distribución espacial entre la cabecera municipal de Argelia y la sede educativa en la vereda La Estrella.
2. **`/documentacion`**: Documento Maestro actualizado bajo normas APA 7, bitácoras de seguimiento y capturas de ejecución de los casos de prueba funcionales (`CP-01`, `CP-02` y `CP-03`).

---

## 💻 Prototipo Funcional: RadioLink

**RadioLink** es una herramienta web académica diseñada para apoyar el dimensionamiento preliminar de radioenlaces punto a punto.

### Funcionalidades implementadas
* **Cálculo de Pérdidas en Espacio Libre (FSPL):** Basado en la Recomendación UIT-R P.525-5:
  $$\text{FSPL (dB)} = 32.44 + 20\log_{10}(d_{\text{km}}) + 20\log_{10}(f_{\text{MHz}})$$
* **Potencia Isotrópica Radiada Equivalente (EIRP):**
  $$\text{EIRP (dBm)} = P_{tx} + G_{tx}$$
* **Potencia Recibida Estimada ($P_r$):**
  $$P_r\text{ (dBm)} = P_{tx} + G_{tx} + G_{rx} - \text{FSPL} - L_{\text{adicionales}}$$
* **Margen del Enlace ($M$):**
  $$M\text{ (dB)} = P_r - S_r$$
* **Clasificación e interpretación automática:** Evalúa si el margen es favorable ($\ge 20\text{ dB}$), positivo con requerimiento de revisión ($0\text{ a }19.99\text{ dB}$) o insuficiente ($< 0\text{ dB}$).
* **Esquema conceptual dinámico:** Actualiza visualmente el estado de la conexión, distancia, frecuencia, potencia recibida y margen estimado.
* **Validación de entradas e historial de sesión:** Previene cálculos con campos vacíos, no numéricos o valores físicos inválidos ($d \le 0$, $f \le 0$, $L < 0$) y registra el historial de pruebas ejecutadas.

## 🧪 Casos de Prueba Verificados

| ID | Prueba | Acción Ejecutada | Resultado Verificado | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **CP-01** | Cálculo inicial | Ejecución con parámetros base ($d = 5\text{ km}$, $f = 5800\text{ MHz}$, $P_{tx} = 20\text{ dBm}$, $G_{tx} = G_{rx} = 23\text{ dBi}$, $L = 3\text{ dB}$, $S_r = -75\text{ dBm}$). | $\text{FSPL} = 121.69\text{ dB}$, $\text{EIRP} = 43.00\text{ dBm}$, $P_r = -58.69\text{ dBm}$, Margen $= 16.31\text{ dB}$. | ✅ Aprobado |
| **CP-02** | Modificación de parámetros | Actualización dinámica de distancia ($85\text{ km}$), frecuencia ($12000\text{ MHz}$) y ganancias de antena. | Recálculo inmediato de indicadores ($\text{FSPL} = 152.61\text{ dB}$, $P_r = -57.61\text{ dBm}$, Margen $= 49.39\text{ dB}$), actualización del diagrama conceptual y registro en historial. | ✅ Aprobado |
| **CP-03** | Validación de campos | Envío de formulario con campos vacíos o valores negativos/cero. | Bloqueo del cálculo y despliegue de alertas descriptivas por cada campo inválido. | ✅ Aprobado |

---

## ⚠️ Alcance y Delimitación Académica

Este proyecto se circunscribe al **diseño técnico y validación en entorno simulado**. Los resultados generados por **RadioLink** y el modelo 3D en **SketchUp** constituyen estimaciones académicas de apoyo al diseño y no sustituyen estudios de campo, mediciones con analizador de espectro ni la instalación física de infraestructura.
