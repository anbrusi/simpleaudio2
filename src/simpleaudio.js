// simpleaudio.js

import { Plugin } from '@ckeditor/ckeditor5-core';
import AudioEditing from './audioediting';
import AudioUI from './audioui';

export default class SimpleAudio extends Plugin {

	static get pluginName() {
		return 'SimpleAudio';
	}

	static get requires() {
		return [ AudioEditing, AudioUI ];
	}

	init() {
		console.log( 'SimpleAudio#init' );
	}
}
