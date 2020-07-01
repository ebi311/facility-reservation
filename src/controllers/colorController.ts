const colors = [
  '#C62828',
  '#0277BD',
  '#E65100',
  '#37474F',
  '#6A1B9A',
  '#283593',
  '#827717',
  '#4E342E',
];

let index = 0;

const pickColor = (): string => {
  const mod = index % colors.length;
  index++;
  return colors[mod];
};

export default pickColor;
