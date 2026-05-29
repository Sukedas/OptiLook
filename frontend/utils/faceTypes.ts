export interface FaceTypeDetail {
  id: number;
  key: string;
  name: string;
  description: string;
  tips: string;
  svgIcon: string;
}

export const faceTypes: Record<number, FaceTypeDetail> = {
  1: {
    id: 1,
    key: "ovalado",
    name: "Ovalado",
    description: "Rostro equilibrado con proporciones suaves.",
    tips: "¡Estás de suerte! Casi cualquier forma de montura te queda espectacular. Prueba marcos rectangulares para añadir ángulos fuertes.",
    svgIcon: `<svg viewBox="0 0 100 100" class="w-16 h-16 stroke-indigo-400 fill-none" stroke-width="2">
      <ellipse cx="50" cy="50" rx="25" ry="38" />
      <path d="M40 45 Q50 48 60 45" stroke-width="1.5" />
      <path d="M42 62 Q50 67 58 62" stroke-width="1.5" />
    </svg>`,
  },
  2: {
    id: 2,
    key: "redondo",
    name: "Redondo",
    description: "Contornos curvos y ancho similar al alto.",
    tips: "Necesitas contraste. Elige marcos angulosos, rectangulares o cuadrados para estructurar tus facciones y alargar tu rostro.",
    svgIcon: `<svg viewBox="0 0 100 100" class="w-16 h-16 stroke-amber-400 fill-none" stroke-width="2">
      <circle cx="50" cy="50" r="33" />
      <path d="M41 45 Q50 48 59 45" stroke-width="1.5" />
      <path d="M44 65 Q50 60 56 65" stroke-width="1.5" />
    </svg>`,
  },
  3: {
    id: 3,
    key: "cuadrado",
    name: "Cuadrado",
    description: "Mandíbula marcada y frente amplia.",
    tips: "Suaviza tus ángulos. Los marcos ovalados y redondos son tus mejores aliados. Evita monturas muy cuadradas que exageren tus facciones.",
    svgIcon: `<svg viewBox="0 0 100 100" class="w-16 h-16 stroke-rose-400 fill-none" stroke-width="2">
      <rect x="22" y="20" width="56" height="60" rx="10" />
      <path d="M38 43 Q50 46 62 43" stroke-width="1.5" />
      <path d="M42 65 Q50 69 58 65" stroke-width="1.5" />
    </svg>`,
  },
  4: {
    id: 4,
    key: "corazon",
    name: "Corazón",
    description: "Frente amplia y mentón estrecho.",
    tips: "Equilibra el rostro. Las monturas redondas, ovaladas, marcos delgados y de colores claros ensancharán la parte inferior visualmente.",
    svgIcon: `<svg viewBox="0 0 100 100" class="w-16 h-16 stroke-teal-400 fill-none" stroke-width="2">
      <path d="M50 85 Q75 55 75 38 A15 15 0 0 0 49 32 A15 15 0 0 0 25 38 Q25 55 50 85 Z" />
      <path d="M40 45 Q50 47 60 45" stroke-width="1.5" />
      <path d="M43 60 Q50 63 57 60" stroke-width="1.5" />
    </svg>`,
  },
  5: {
    id: 5,
    key: "diamante",
    name: "Diamante",
    description: "Pómulos prominentes y frente estrecha.",
    tips: "Destaca tus ojos. Las monturas ovaladas, redondas o con marcos superiores marcados (tipo Browline/Clubmaster) son ideales.",
    svgIcon: `<svg viewBox="0 0 100 100" class="w-16 h-16 stroke-emerald-400 fill-none" stroke-width="2">
      <path d="M50 15 L78 50 L50 85 L22 50 Z" />
      <path d="M39 44 Q50 46 61 44" stroke-width="1.5" />
      <path d="M44 63 Q50 66 56 63" stroke-width="1.5" />
    </svg>`,
  },
};

export const getFaceDetail = (id?: number | null): FaceTypeDetail => {
  return faceTypes[id || 1] || faceTypes[1];
};
