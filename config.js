import { Dimensions } from 'react-native';

const STAGEWIDTH = Dimensions.get('window').width;
const STAGEHEIGHT = Dimensions.get('window').height - 50;
const TILES = 6;
const COLUMNS = 3;
const WIDTH = STAGEWIDTH / COLUMNS;
const ROWS = TILES % COLUMNS > 0 ? Math.floor(TILES / COLUMNS) + 2 : Math.floor(TILES / COLUMNS) + 1;
const HEIGHT = STAGEHEIGHT / ROWS;

export { STAGEWIDTH, STAGEHEIGHT, TILES, COLUMNS, WIDTH, ROWS, HEIGHT }