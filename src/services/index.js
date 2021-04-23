import axios from 'axios';
import { script } from '../apis/index';

const execScript = ({ scriptName = '', params = undefined }) => axios.post(script, { name: scriptName, params })

export {
  execScript
}