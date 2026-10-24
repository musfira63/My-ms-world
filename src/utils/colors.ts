export interface ColorGroup {
  name: string;
  colors: string[];
}

// Office Theme Color Matrix: 10 columns x 6 rows (Base + 5 tints/shades)
export const OFFICE_THEME_COLUMNS: ColorGroup[] = [
  {
    name: 'White / Black',
    colors: ['#FFFFFF', '#F2F2F2', '#D9D9D9', '#BFBFBF', '#A6A6A6', '#7F7F7F']
  },
  {
    name: 'Dark Slate',
    colors: ['#000000', '#7F7F7F', '#595959', '#3F3F3F', '#262626', '#0D0D0D']
  },
  {
    name: 'Warm Gray',
    colors: ['#EEECE1', '#DDD9C3', '#C4BD97', '#948A54', '#494529', '#1D1B10']
  },
  {
    name: 'Office Navy',
    colors: ['#1F497D', '#C6D9F1', '#8DB3E2', '#548DD4', '#17365D', '#0F243E']
  },
  {
    name: 'Accent Blue',
    colors: ['#4F81BD', '#DBE5F1', '#B8CCE4', '#95B3D7', '#376092', '#254061']
  },
  {
    name: 'Accent Crimson',
    colors: ['#C00000', '#F2DCDB', '#E5B9B7', '#D99694', '#963634', '#632423']
  },
  {
    name: 'Accent Orange',
    colors: ['#F79646', '#FDEADA', '#FBD5B5', '#FAC08F', '#E26B00', '#974806']
  },
  {
    name: 'Forest Emerald',
    colors: ['#9BBB59', '#EBF1DD', '#D7E3BC', '#C3D69B', '#76933C', '#4F6128']
  },
  {
    name: 'Royal Purple',
    colors: ['#8064A2', '#E5E0EC', '#CCC1DA', '#B2A2C7', '#604A7B', '#403151']
  },
  {
    name: 'Aqua Cyan',
    colors: ['#4BACC6', '#DBEEF4', '#B7DDE8', '#92CDDC', '#31859C', '#215967']
  }
];

export const STANDARD_COLORS = [
  '#C00000', // Dark Red
  '#FF0000', // Red
  '#FFC000', // Orange
  '#FFFF00', // Yellow
  '#92D050', // Light Green
  '#00B050', // Green
  '#00B0F0', // Light Blue
  '#0070C0', // Blue
  '#002060', // Dark Blue
  '#7030A0', // Purple
];

export const HIGHLIGHTER_COLORS = [
  { name: 'No Color', color: 'transparent', label: 'None' },
  { name: 'Yellow', color: '#FFFF00', label: 'Yellow' },
  { name: 'Bright Green', color: '#00FF00', label: 'Bright Green' },
  { name: 'Cyan', color: '#00FFFF', label: 'Turquoise' },
  { name: 'Pink', color: '#FF00FF', label: 'Magenta' },
  { name: 'Sky Blue', color: '#00B0F0', label: 'Sky Blue' },
  { name: 'Red', color: '#FF4D4D', label: 'Red' },
  { name: 'Dark Blue', color: '#3366FF', label: 'Blue' },
  { name: 'Teal', color: '#008080', label: 'Teal' },
  { name: 'Lavender', color: '#E0BBE4', label: 'Lavender' },
  { name: 'Warm Peach', color: '#FFE5B4', label: 'Peach' },
  { name: 'Light Gray', color: '#E0E0E0', label: 'Gray 25%' },
];

export const PAGE_TINT_COLORS = [
  { name: 'Pure White', color: '#FFFFFF', border: '#E5E7EB' },
  { name: 'Ivory Cream', color: '#FCFBF7', border: '#EFECE6' },
  { name: 'Soft Linen', color: '#F8F6F0', border: '#E8E4DA' },
  { name: 'Executive Slate', color: '#F4F5F7', border: '#DFE2E6' },
  { name: 'Pale Mint', color: '#F2F8F5', border: '#DCECE3' },
  { name: 'Pale Sky', color: '#F0F5FA', border: '#DCE8F4' },
  { name: 'Sepia Reading', color: '#F9F4EB', border: '#EADFCB' },
  { name: 'Night Focus', color: '#1E232A', border: '#333D48' },
];
