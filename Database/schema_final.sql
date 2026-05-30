DROP TABLE IF EXISTS "requiere" CASCADE;
DROP TABLE IF EXISTS "recomendacion" CASCADE;
DROP TABLE IF EXISTS "transaccion" CASCADE;
DROP TABLE IF EXISTS "formulaOf" CASCADE;
DROP TABLE IF EXISTS "montura" CASCADE;
DROP TABLE IF EXISTS "material" CASCADE;
DROP TABLE IF EXISTS "tipoRostro" CASCADE;
DROP TABLE IF EXISTS "usuario" CASCADE;

CREATE TABLE "usuario"(
    "idUsuario" BIGINT NOT NULL,
    "idFormulaActual" BIGINT NULL,
    "idTipo" BIGINT NULL,
    "primerNombre" VARCHAR(255) NOT NULL,
    "segundoNombre" VARCHAR(255) NOT NULL,
    "primerApellido" VARCHAR(255) NOT NULL,
    "segundoApellido" VARCHAR(255) NOT NULL,
    "correoUsuario" VARCHAR(255) NOT NULL,
    "fechaNacimiento" DATE NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "hashContrasena" BIGINT NOT NULL,
    "rol" VARCHAR(50) NOT NULL DEFAULT 'cliente'
);
ALTER TABLE
    "usuario" ADD PRIMARY KEY("idUsuario");
ALTER TABLE
    "usuario" ADD CONSTRAINT "usuario_correousuario_unique" UNIQUE("correoUsuario");
ALTER TABLE
    "usuario" ADD CONSTRAINT "usuario_idFormulaActual_unique" UNIQUE("idFormulaActual");
CREATE TABLE "formulaOf"(
    "idUsuario" BIGINT NOT NULL,
    "idFormula" BIGINT NOT NULL,
    "vigencia" BOOLEAN NOT NULL,
    "fechaCarga" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "formulaPDF" VARCHAR(255) NOT NULL,
    "observacion" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "formulaOf" ADD PRIMARY KEY("idFormula");
CREATE TABLE "transaccion"(
    "idTransaccion" BIGINT NOT NULL,
    "idUsuario" BIGINT NOT NULL,
    "fechaTransaccion" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "direccionEnvio" VARCHAR(255) NOT NULL,
    "estadoTransaccion" VARCHAR(255) NOT NULL,
    "metodoPago" VARCHAR(255) NOT NULL,
    "totalTransaccion" DECIMAL(8, 2) NOT NULL
);
ALTER TABLE
    "transaccion" ADD PRIMARY KEY("idTransaccion");
CREATE TABLE "tipoRostro"(
    "idTipo" BIGINT NOT NULL,
    "nombreTipo" VARCHAR(255) NOT NULL,
    "descripcionTipo" VARCHAR(255) NOT NULL,
    "imagenTipo" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "tipoRostro" ADD PRIMARY KEY("idTipo");
CREATE TABLE "montura"(
    "idMontura" BIGINT NOT NULL,
    "idMaterial" BIGINT NOT NULL,
    "nombreMontura" VARCHAR(255) NOT NULL,
    "imagenMontura" VARCHAR(255) NOT NULL,
    "stockMontura" INTEGER NOT NULL,
    "colorMontura" VARCHAR(255) NOT NULL,
    "generoMontura" VARCHAR(255) NOT NULL,
    "precioMontura" DECIMAL(8, 2) NOT NULL
);
ALTER TABLE
    "montura" ADD PRIMARY KEY("idMontura");
CREATE TABLE "recomendacion"(
    "idRecomendacion" BIGINT NOT NULL,
    "idTipo" BIGINT NOT NULL,
    "idMontura" BIGINT NOT NULL,
    "nivelCompatibilidad" INTEGER NOT NULL
);
ALTER TABLE
    "recomendacion" ADD PRIMARY KEY("idRecomendacion");
CREATE TABLE "requiere"(
    "idRequiere" BIGINT NOT NULL,
    "idMontura" BIGINT NOT NULL,
    "idFormula" BIGINT NULL,
    "idTransaccion" BIGINT NOT NULL,
    "subtotal" BIGINT NOT NULL,
    "lentesR" BOOLEAN NOT NULL,
    "cantidadR" BIGINT NOT NULL,
    "precioUnitarioR" DECIMAL(8, 2) NOT NULL
);
ALTER TABLE
    "requiere" ADD PRIMARY KEY("idRequiere");
CREATE TABLE "material"(
    "idMaterial" BIGINT NOT NULL,
    "nombreMaterial" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "material" ADD PRIMARY KEY("idMaterial");
ALTER TABLE
    "formulaOf" ADD CONSTRAINT "formulaof_idusuario_foreign" FOREIGN KEY("idUsuario") REFERENCES "usuario"("idUsuario");
ALTER TABLE
    "usuario" ADD CONSTRAINT "usuario_idtipo_foreign" FOREIGN KEY("idTipo") REFERENCES "tipoRostro"("idTipo");
ALTER TABLE
    "usuario" ADD CONSTRAINT "usuario_idformulaactual_foreign" FOREIGN KEY("idFormulaActual") REFERENCES "formulaOf"("idFormula");
ALTER TABLE
    "transaccion" ADD CONSTRAINT "transaccion_idusuario_foreign" FOREIGN KEY("idUsuario") REFERENCES "usuario"("idUsuario");
ALTER TABLE
    "montura" ADD CONSTRAINT "montura_idmaterial_foreign" FOREIGN KEY("idMaterial") REFERENCES "material"("idMaterial");
ALTER TABLE
    "requiere" ADD CONSTRAINT "requiere_idmontura_foreign" FOREIGN KEY("idMontura") REFERENCES "montura"("idMontura");
ALTER TABLE
    "requiere" ADD CONSTRAINT "requiere_idtransaccion_foreign" FOREIGN KEY("idTransaccion") REFERENCES "transaccion"("idTransaccion");
ALTER TABLE
    "recomendacion" ADD CONSTRAINT "recomendacion_idmontura_foreign" FOREIGN KEY("idMontura") REFERENCES "montura"("idMontura");
ALTER TABLE
    "requiere" ADD CONSTRAINT "requiere_idformula_foreign" FOREIGN KEY("idFormula") REFERENCES "formulaOf"("idFormula");
ALTER TABLE
    "recomendacion" ADD CONSTRAINT "recomendacion_idtipo_foreign" FOREIGN KEY("idTipo") REFERENCES "tipoRostro"("idTipo");

INSERT INTO "usuario" (
    "idUsuario",
    "idFormulaActual",
    "idTipo",
    "primerNombre",
    "segundoNombre",
    "primerApellido",
    "segundoApellido",
    "correoUsuario",
    "fechaNacimiento",
    "direccion",
    "hashContrasena",
    "rol"
) VALUES
(1, NULL, NULL, 'Ana', 'Lucia', 'Gomez', 'Perez', 'ana.gomez@example.com', '1998-03-14', 'Calle 10 # 15-20', 1234567890, 'administrador'),
(2, NULL, NULL, 'Carlos', 'Andres', 'Ramirez', 'Lopez', 'carlos.ramirez@example.com', '1995-07-22', 'Avenida 5 # 8-30', 2345678901, 'cliente'),
(3, NULL, NULL, 'Maria', 'Fernanda', 'Torres', 'Diaz', 'maria.torres@example.com', '2000-11-05', 'Carrera 12 # 45-18', 3456789012, 'cliente'),
(4, NULL, NULL, 'Jorge', 'Ivan', 'Martinez', 'Sanchez', 'jorge.martinez@example.com', '1992-01-28', 'Calle 24 # 9-11', 4567890123, 'cliente'),
(5, NULL, NULL, 'Laura', 'Valentina', 'Castro', 'Rojas', 'laura.castro@example.com', '1997-09-16', 'Transversal 3 # 22-40', 5678901234, 'cliente'),
(6, NULL, NULL, 'Diego', 'Alejandro', 'Vargas', 'Moreno', 'diego.vargas@example.com', '1994-04-09', 'Diagonal 7 # 30-25', 6789012345, 'cliente'),
(7, NULL, NULL, 'Sofia', 'Isabel', 'Ortiz', 'Herrera', 'sofia.ortiz@example.com', '2001-12-21', 'Calle 18 # 6-14', 7890123456, 'cliente'),
(8, NULL, NULL, 'Mateo', 'Emilio', 'Navarro', 'Cruz', 'mateo.navarro@example.com', '1999-06-03', 'Avenida 9 # 17-56', 8901234567, 'cliente'),
(9, NULL, NULL, 'Camila', 'Patricia', 'Mendoza', 'Gil', 'camila.mendoza@example.com', '1996-10-30', 'Carrera 4 # 11-07', 9012345678, 'cliente'),
(10, NULL, NULL, 'Sebastian', 'David', 'Pena', 'Flores', 'sebastian.pena@example.com', '1993-02-12', 'Calle 31 # 2-19', 1122334455, 'cliente'),
(99, NULL, NULL, 'Admin', '', 'OptiLook', '', 'admin@optilook.com', '1990-01-01', 'Oficina Central', 8996614481545633832, 'administrador');

INSERT INTO "material" (
    "idMaterial",
    "nombreMaterial"
) VALUES
(1, 'Acetato'),
(2, 'Metal'),
(3, 'Titanio'),
(4, 'TR90'),
(5, 'Madera'),
(6, 'Aluminio'),
(7, 'Acero inoxidable'),
(8, 'Fibra de carbono'),
(9, 'Nylon'),
(10, 'Policarbonato');

INSERT INTO "montura" (
    "idMontura",
    "idMaterial",
    "nombreMontura",
    "imagenMontura",
    "stockMontura",
    "colorMontura",
    "generoMontura",
    "precioMontura"
) VALUES
(1, 1, 'Classic Oval', 'classic_oval.png', 18, 'Negro', 'Unisex', 189900.00),
(2, 2, 'Urban Round', 'urban_round.png', 12, 'Dorado', 'Unisex', 219900.00),
(3, 3, 'Pro Square', 'pro_square.png', 10, 'Plata', 'Hombre', 249900.00),
(4, 4, 'Light Fit', 'light_fit.png', 25, 'Azul', 'Mujer', 169900.00),
(5, 5, 'Eco Wood', 'eco_wood.png', 8, 'Cafe', 'Unisex', 279900.00),
(6, 6, 'Soft Frame', 'soft_frame.png', 15, 'Rojo', 'Mujer', 199900.00),
(7, 7, 'Edge Line', 'edge_line.png', 14, 'Verde', 'Hombre', 239900.00),
(8, 8, 'Neo Slim', 'neo_slim.png', 9, 'Gris', 'Unisex', 259900.00),
(9, 9, 'Flex Wave', 'flex_wave.png', 20, 'Negro', 'Mujer', 179900.00),
(10, 10, 'Nature Bold', 'nature_bold.png', 6, 'Marron', 'Hombre', 289900.00);

INSERT INTO "tipoRostro" (
    "idTipo",
    "nombreTipo",
    "descripcionTipo",
    "imagenTipo"
) VALUES
(1, 'Ovalado', 'Rostro equilibrado con proporciones suaves', 'ovalado.png'),
(2, 'Redondo', 'Contornos curvos y ancho similar al alto', 'redondo.png'),
(3, 'Cuadrado', 'Mandibula marcada y frente amplia', 'cuadrado.png'),
(4, 'Corazon', 'Frente amplia y menton estrecho', 'corazon.png'),
(5, 'Diamante', 'Pometulos prominentes y frente estrecha', 'diamante.png'),
(6, 'Alargado', 'Rostro mas largo que ancho', 'alargado.png'),
(7, 'Triangular', 'Mandibula ancha y frente estrecha', 'triangular.png'),
(8, 'Rectangular', 'Similar al cuadrado pero mas largo', 'rectangular.png'),
(9, 'Hexagonal', 'Lineas angulosas y equilibrio general', 'hexagonal.png'),
(10, 'Piriforme', 'Frente estrecha y mandibula amplia', 'piriforme.png');

INSERT INTO "formulaOf" (
    "idUsuario",
    "idFormula",
    "vigencia",
    "fechaCarga",
    "formulaPDF",
    "observacion"
) VALUES
(1, 101, TRUE, '2026-04-01 09:00:00', 'formula_101.pdf', 'Formula inicial cargada'),
(2, 102, TRUE, '2026-04-02 10:15:00', 'formula_102.pdf', 'Revision optometrica reciente'),
(3, 103, TRUE, '2026-04-03 11:30:00', 'formula_103.pdf', 'Formula con ajuste leve'),
(4, 104, TRUE, '2026-04-04 08:45:00', 'formula_104.pdf', 'Uso cotidiano'),
(5, 105, TRUE, '2026-04-05 14:20:00', 'formula_105.pdf', 'Paciente con lentes de lectura'),
(6, 106, TRUE, '2026-04-06 16:05:00', 'formula_106.pdf', 'Control anual actualizado'),
(7, 107, FALSE, '2026-04-07 12:40:00', 'formula_107.pdf', 'Formula vencida en revision'),
(8, 108, TRUE, '2026-04-08 13:55:00', 'formula_108.pdf', 'Formula digital adjunta'),
(9, 109, TRUE, '2026-04-09 15:10:00', 'formula_109.pdf', 'Paciente con astigmatismo'),
(10, 110, TRUE, '2026-04-10 17:25:00', 'formula_110.pdf', 'Formula para lentes progresivos');

INSERT INTO "transaccion" (
    "idTransaccion",
    "idUsuario",
    "fechaTransaccion",
    "direccionEnvio",
    "estadoTransaccion",
    "metodoPago",
    "totalTransaccion"
) VALUES
(1, 1, '2026-04-11 09:10:00', 'Calle 10 # 15-20', 'Completada', 'Tarjeta credito', 189900.00),
(2, 2, '2026-04-11 10:20:00', 'Avenida 5 # 8-30', 'Pendiente', 'PSE', 219900.00),
(3, 3, '2026-04-11 11:30:00', 'Carrera 12 # 45-18', 'Completada', 'Efectivo', 249900.00),
(4, 4, '2026-04-11 12:40:00', 'Calle 24 # 9-11', 'En preparacion', 'Tarjeta debito', 169900.00),
(5, 5, '2026-04-11 13:50:00', 'Transversal 3 # 22-40', 'Completada', 'Nequi', 279900.00),
(6, 6, '2026-04-11 15:00:00', 'Diagonal 7 # 30-25', 'Cancelada', 'Tarjeta credito', 199900.00),
(7, 7, '2026-04-11 16:10:00', 'Calle 18 # 6-14', 'Completada', 'Daviplata', 239900.00),
(8, 8, '2026-04-11 17:20:00', 'Avenida 9 # 17-56', 'Pendiente', 'Transferencia', 259900.00),
(9, 9, '2026-04-11 18:30:00', 'Carrera 4 # 11-07', 'Completada', 'Tarjeta credito', 179900.00),
(10, 10, '2026-04-11 19:40:00', 'Calle 31 # 2-19', 'Completada', 'PSE', 289900.00);

INSERT INTO "recomendacion" (
    "idRecomendacion",
    "idTipo",
    "idMontura",
    "nivelCompatibilidad"
) VALUES
(1, 1, 1, 95),
(2, 2, 2, 90),
(3, 3, 3, 93),
(4, 4, 4, 88),
(5, 5, 5, 91),
(6, 6, 6, 86),
(7, 7, 7, 89),
(8, 8, 8, 87),
(9, 9, 9, 84),
(10, 10, 10, 85);

INSERT INTO "requiere" (
    "idRequiere",
    "idMontura",
    "idFormula",
    "idTransaccion",
    "subtotal",
    "lentesR",
    "cantidadR",
    "precioUnitarioR"
) VALUES
(1, 1, 101, 1, 189900, TRUE, 1, 189900.00),
(2, 2, 102, 2, 219900, TRUE, 1, 219900.00),
(3, 3, 103, 3, 249900, TRUE, 1, 249900.00),
(4, 4, 104, 4, 169900, FALSE, 1, 169900.00),
(5, 5, 105, 5, 279900, TRUE, 1, 279900.00),
(6, 6, 106, 6, 199900, TRUE, 1, 199900.00),
(7, 7, 107, 7, 239900, FALSE, 1, 239900.00),
(8, 8, 108, 8, 259900, TRUE, 1, 259900.00),
(9, 9, 109, 9, 179900, TRUE, 1, 179900.00),
(10, 10, 110, 10, 289900, TRUE, 1, 289900.00);

SELECT * FROM usuario;
SELECT * FROM formulaof;
SELECT * FROM transaccion;
SELECT * FROM tiporostro;
SELECT * FROM montura;
SELECT * FROM recomendacion;
SELECT * FROM requiere;
SELECT * FROM material;


-- Primer Trigger, no permite que el precio de las monturas sea aumentado al doble 
CREATE OR REPLACE FUNCTION fn_validar_precio_montura()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND NEW."precioMontura" > OLD."precioMontura" THEN
        IF NEW."precioMontura" > OLD."precioMontura" * 2 THEN
            RAISE EXCEPTION 'El aumento en la montura supera el doble de su precio. PrecioActual: %, PrecioNuevo: %',
                OLD."precioMontura", NEW."precioMontura";  
        END IF;
    END IF;
    RETURN NEW;  
END $$;

CREATE OR REPLACE TRIGGER trg_validar_precio_montura
	BEFORE INSERT OR UPDATE ON "montura"
	FOR EACH ROW
	WHEN (NEW."precioMontura" IS NOT NULL)
	EXECUTE FUNCTION fn_validar_precio();

--Query para probar si el primer trigger funciona
UPDATE "montura"
SET "precioMontura" = 400000
WHERE "idMontura" = 1;


--Segundo Trigger, muestra cuando se realiza un cambio en el campo formulaPDF de la tabla formulaof
CREATE TABLE aux_formula(
    idaux SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT now(),
    campo TEXT,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    usuario TEXT
);

CREATE OR REPLACE FUNCTION fn_aux_cambios_formula()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        IF NEW."formulaPDF" <> OLD."formulaPDF" THEN
            INSERT INTO aux_formula
            VALUES (
                DEFAULT,
                now(),
                'formulaPDF',
                OLD."formulaPDF"::TEXT,
                NEW."formulaPDF"::TEXT,
                current_user
            );
        END IF;
    END IF;

    RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_aux_formula_pdf
	AFTER UPDATE ON "formulaof"
	FOR EACH ROW
	EXECUTE FUNCTION fn_aux_cambios_formula();


--Query para prueba si el segundo trigger funciona
UPDATE "formulaof"
SET "formulaPDF" = 'nueva_formula_101.pdf'
WHERE "idFormula" = 101;

SELECT * FROM aux_formula;