<h1 align="center">Benchmark JS vs WASM</h1>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/WebAssembly-654FF0?style=for-the-badge&logo=webassembly&logoColor=white" alt="WebAssembly">
  <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust">
  <img src="https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white" alt="C++">
</p>

Este proyecto es una SPA para un benchmark del rendimiento de varios algoritmos implementados en JavaScript, WebAssembly (WASM) con C++ y Rust. El propósito es evaluar y analizar las diferencias de rendimiento entre estas tecnologías.

Puedes probar la aplicación en línea en [aquí](https://rockycott.github.io/benchmark-wasm-vs-js/).

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
└── 📁libs
    └── 📁collisionDetection
        └── 📁cpp
            └── collisionDetection.js
            └── collisionDetection.wasm
        └── 📁rust
            └── collision_detection.d.ts
            └── collision_detection.js
            └── collision_detection_bg.wasm
            └── collision_detection_bg.wasm.d.ts
    └── 📁fibonacci
        └── 📁cpp
            └── fib.js
            └── fib.wasm
        └── 📁rust
            └── fibRust.js
            └── fibRust.wasm
            └── fibRust.wasm.d.ts
    └── 📁imageConvolute
        └── 📁cpp
            └── imageConvolute.js
            └── imageConvolute.wasm
        └── 📁rust
            └── image_convolute.d.ts
            └── image_convolute.js
            └── image_convolute_bg.wasm
            └── image_convolute_bg.wasm.d.ts
    └── 📁multiplyDouble
        └── 📁cpp
            └── multiplyDouble.js
            └── multiplyDouble.wasm
        └── 📁rust
            └── multiply_double.d.ts
            └── multiply_double.js
            └── multiply_double_bg.wasm
            └── multiply_double_bg.wasm.d.ts
    └── 📁multiplyDoubleVector
        └── 📁cpp
            └── multiplyDoubleVec.js
            └── multiplyDoubleVec.wasm
        └── 📁rust
            └── multiply_double_vector.d.ts
            └── multiply_double_vector.js
            └── multiply_double_vector_bg.wasm
            └── multiply_double_vector_bg.wasm.d.ts
    └── 📁multiplyIntVector
        └── 📁cpp
            └── multiplyIntVec.js
            └── multiplyIntVec.wasm
        └── 📁rust
            └── multiplyIntVecRust.js
            └── multiplyIntVecRust.wasm
            └── multiplyIntVecRust.wasm.d.ts
    └── 📁quicksortDouble
        └── 📁cpp
            └── quicksortDouble.js
            └── quicksortDouble.wasm
        └── 📁rust
            └── quick_sort_double.d.ts
            └── quick_sort_double.js
            └── quick_sort_double_bg.wasm
            └── quick_sort_double_bg.wasm.d.ts
    └── 📁quicksortInt
        └── 📁cpp
            └── quicksortInt.js
            └── quicksortInt.wasm
        └── 📁rust
            └── quick_sort_int.d.ts
            └── quick_sort_int.js
            └── quick_sort_int_bg.wasm
            └── quick_sort_int_bg.wasm.d.ts
    └── 📁sumConsecutiva
        └── 📁rust
            └── sum_consecutiva.d.ts
            └── sum_consecutiva.js
            └── sum_consecutiva_bg.wasm
            └── sum_consecutiva_bg.wasm.d.ts
    └── 📁sumDouble
        └── 📁cpp
            └── sumDouble.js
            └── sumDouble.wasm
        └── 📁rust
            └── sum_double.d.ts
            └── sum_double.js
            └── sum_double_bg.wasm
            └── sum_double_bg.wasm.d.ts
    └── 📁sumInt
        └── 📁cpp
            └── sumInt.js
            └── sumInt.wasm
        └── 📁rust
            └── sum_int.d.ts
            └── sum_int.js
            └── sum_int_bg.wasm
            └── sum_int_bg.wasm.d.ts
└── 📁src
    └── 📁app
        └── app.js
        └── 📁components
            └── Header.js
            └── Navbar.js
        └── 📁pages
            └── About.js
            └── Error-404.js
            └── Home.js
            └── 📁algorithms
                └── CollisionDetection.js
                └── Fibonacci.js
                └── MultiplyDouble.js
                └── MultiplyDoubleVector.js
                └── MultiplyIntVector.js
                └── QuicksortDouble.js
                └── QuicksortInt.js
                └── SumDouble.js
                └── SumInt.js
                └── SumaConsecutiva.js
                └── imageConvolute.js
                └── videoConvolute.js
        └── 📁routes
            └── index.routes.js
            └── routes.js
        └── 📁utils
            └── getData.js
            └── getHash.js
            └── resolveRoutes.js
    └── 📁assets
        └── 📁images
            └── avatar.jpg
            └── image.jpg
            └── image2.jpg
        └── 📁styles
            └── style.css
            └── style.css.map
            └── style.scss
        └── 📁videos
            └── video.mp4
    └── index.html
    └── index.js
    └── styles.css
└── .gitignore
└── babel.config.json
└── README.md
└── package.json
└── webpack.config.js
```

## Algoritmos Implementados

1. **Collision Detection:** Este algoritmo tiene como función detectar colisiones entre objetos en un espacio tridimensional. Es fundamental en aplicaciones de simulación y juegos, donde se utiliza para garantizar que los objetos virtuales interactúen de manera realista, evitando superposiciones no deseadas y garantizando una experiencia interactiva coherente.

2. **Fibonacci:** Calcula el enésimo número de la secuencia de Fibonacci, donde cada número es la suma de los dos números anteriores. Aunque aparentemente simple, este algoritmo demuestra su utilidad en diversas aplicaciones, como modelado de crecimiento, teorı́a de números y optimización.

3. **Multiply Double:** Realiza la multiplicación repetida de dos números en coma flotante, brindando una base sólida para operaciones matemáticas esenciales en aplicaciones cientı́ficas y de ingenierı́a. La precisión y eficiencia de la multiplicación en coma flotante son cruciales en una variedad de contextos.

4. **Multiply Int Vector:** Multiplica elementos de un vector de números enteros. Este algoritmo ofrece una herramienta valiosa en aplicaciones que involucran procesamiento de datos y álgebra lineal. Puede utilizarse para entender la base de operaciones en grandes conjuntos de datos.

5. **Multiply Double Vector:** Similar al algoritmo anterior, este algoritmo multiplica elementos de dos vectores de números en coma flotante. Es esencial en tareas de procesamiento de señales, gráficos por computadora y simulaciones fı́sicas que involucran vectores de valores.

6. **QuickSort Int:** Es una técnica de ordenamiento altamente eficiente que se utiliza para ordenar arreglos de números enteros. Su capacidad para realizar particiones y ordenar elementos lo convierte en una elección común en aplicaciones que requieren una clasificación rápida y eficaz de datos.

7. **QuickSort Double:** Similar al algoritmo anterior, el Quicksort se aplica aquı́ para ordenar un arreglo de números en coma flotante. Esta implementación es crucial en aplicaciones que requieren una clasificación rápida y precisa de datos con decimales.

8. **Sum Int:** Calcula la suma de elementos en un arreglo de números enteros. Este proceso básico tiene aplicaciones en estadı́sticas, análisis de datos y cálculos matemáticos esenciales.

9. **Sum Double:** Al igual que el algoritmo anterior, se encarga de calcular la suma de elementos en un arreglo, pero en este caso, de números en coma flotante.

10. **Image Convolute:** Este algoritmo permite realizar una convolución de imagen utilizando un kernel de peso especı́fico. La convolución de imágenes es esencial en
procesamiento de imágenes y visión por computadora para aplicar efectos, realzar
caracterı́sticas y filtrar imágenes de manera personalizada.

11. **Video Convolute:** La aplicación de convolución a un video en tiempo real. Es
una tarea avanzada que involucra la manipulación de múltiples cuadros por segundo.
Esta idea básica se emplea en aplicaciones de procesamiento de video en tiempo real,
como efectos visuales y análisis de video.

12. **Suma Consecutiva:** Calcula la suma de los números consecutivos hasta un número dado. Este algoritmo es útil en aplicaciones que requieren la suma de una secuencia de números, como cálculos matemáticos y análisis de datos.

13. **RayTracer:** Esta opción redirige a una página que muestra un RayTracer en acción. El RayTracing es una técnica avanzada de renderizado que simula la interacción de la luz con los objetos en una escena 3D. Es fundamental en la creación de gráficos fotorrealistas en aplicaciones de diseño, simulación, animación y videojuegos.

## Resultados de Benchmark

Aquí se presentarán los resultados de las pruebas de rendimiento para cada algoritmo. Esta sección será actualizada con los resultados obtenidos de los benchmarks.

### Example Algorithm
- JavaScript:
- C++ WASM:
- Rust WASM:

...

## Artículo Académico

Se incluirá un enlace al artículo académico que detalla las pruebas y análisis de rendimiento realizados con estos algoritmos. (Estado del artículo: En Aprobación)

## Instalación y Uso Local

Si deseas clonar y ejecutar el proyecto localmente, sigue estos pasos:

1. Clona el repositorio:
    ```sh
    git clone https://github.com/RockyCott/benchmark-wasm-vs-js.git
    cd benchmark-wasm-vs-js
    ```

2. Instala las dependencias:
    ```sh
    npm install
    ```

3. Ejecuta el servidor de desarrollo:
    ```sh
    npm start
    ```

4. Automáticamente se abrirá una ventana en tu navegador con la aplicación en ejecución. Si no es así, abre tu navegador y accede a `http://localhost:9000/`.

## Tecnologías Utilizadas

- **JavaScript**: Lenguaje principal para la lógica de la aplicación.
- **Rust**: Utilizado para implementar algunos algoritmos y compilarlos a WASM.
- **C++**: Utilizado para implementar algunos algoritmos y compilarlos a WASM.
- **Webpack**: Utilizado para el empaquetado y la configuración del proyecto.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-feature`).
3. Realiza tus cambios y haz un commit (`git commit -am 'Agrega nueva feature'`).
4. Empuja los cambios a tu rama (`git push origin feature/nueva-feature`).
5. Abre un Pull Request.