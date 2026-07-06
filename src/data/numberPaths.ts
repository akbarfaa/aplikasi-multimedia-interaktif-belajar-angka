// Simple SVG paths for numbers 0-10 on a 200x200 canvas.
// Each number is a list of strokes; each stroke is an SVG path "d" string.
export const NUMBER_PATHS: Record<number, string[]> = {
  0: ["M 100 30 C 40 30 40 170 100 170 C 160 170 160 30 100 30"],
  1: ["M 70 60 L 100 40 L 100 170"],
  2: ["M 55 60 C 70 25 145 30 140 75 C 135 110 60 130 55 170 L 150 170"],
  3: ["M 55 55 C 90 20 160 40 130 90 C 100 110 100 110 130 115 C 170 130 130 190 55 155"],
  4: ["M 130 30 L 55 130 L 160 130", "M 130 30 L 130 175"],
  5: ["M 150 40 L 65 40 L 60 100 C 100 80 160 95 150 140 C 140 180 70 175 55 155"],
  6: ["M 150 45 C 100 25 55 60 55 120 C 55 175 155 175 150 120 C 145 80 70 80 60 115"],
  7: ["M 50 40 L 155 40 L 90 175"],
  8: ["M 100 30 C 40 30 40 100 100 100 C 160 100 160 30 100 30", "M 100 100 C 40 100 40 175 100 175 C 160 175 160 100 100 100"],
  9: ["M 145 100 C 140 60 60 60 60 95 C 60 130 145 130 145 95 L 145 100 L 120 175"],
  10: ["M 40 60 L 60 40 L 60 170", "M 120 30 C 80 30 80 170 120 170 C 160 170 160 30 120 30"],
};

export const NUMBER_WORDS_EN = ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];
export const NUMBER_WORDS_ID = ["Nol","Satu","Dua","Tiga","Empat","Lima","Enam","Tujuh","Delapan","Sembilan","Sepuluh"];
