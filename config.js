import { Dimensions } from 'react-native';
import { isIphoneX } from './utils';

const TOPPAD = isIphoneX() ? 30 : 20;
const BOTTOMPAD = isIphoneX() ? 23 : 0;
const CLOCKHEIGHT = 40;
const STAGEWIDTH = Dimensions.get('window').width;
const STAGEHEIGHT = Dimensions.get('window').height - ( TOPPAD + BOTTOMPAD + CLOCKHEIGHT );
const TILES = 3;
const COLUMNS = 3;
const WIDTH = STAGEWIDTH / COLUMNS;
const ROWS = Math.ceil(TILES / COLUMNS) + 1;
const HEIGHT = STAGEHEIGHT / ROWS;

export { TOPPAD, BOTTOMPAD, CLOCKHEIGHT, STAGEWIDTH, STAGEHEIGHT, TILES, COLUMNS, WIDTH, ROWS, HEIGHT }