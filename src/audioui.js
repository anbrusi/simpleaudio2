import { Plugin } from '@ckeditor/ckeditor5-core';
import { FileDialogButtonView, FileRepository } from '@ckeditor/ckeditor5-upload';
import { logError } from '@ckeditor/ckeditor5-utils';
import simpleAudioIcon from '../theme/icons/audio.svg';

export default class AudioUI extends Plugin {

	static get pluginName() {
		return 'AudioUI';
	}

	static get requires() {
		return [ FileRepository ];
	}

	init() {
		console.log( 'AudioUI#init' );
		const editor = this.editor;
		const t = editor.t;
		// const model = editor.model;

		// Add the "simpleAudioButton" to feature components.
		editor.ui.componentFactory.add( 'simpleAudio', locale => {
			const view = new FileDialogButtonView( locale );

			view.set( {
				acceptedType: 'audio/mpeg',
				allowMultipleFiles: false
			} );

			view.buttonView.set( {
				label: t( 'Simple audio' ),
				icon: simpleAudioIcon,
				tooltip: true
			} );

			view.on( 'done', ( evt, files ) => {
				if ( files[ 0 ] ) {
					this.insertAudio( files[ 0 ] );
				} else {
					logError( 'No file available', {} );
				}
			} );

			return view;
		} );

		// console.log( 'AudioUI.init() executed' );
	}

	insertAudio( file ) {
		const editor = this.editor;
		// console.log( 'insert audio from file ', file );
		// console.log( 'plugins', editor.plugins );
		const fileRepository = editor.plugins.get( 'FileRepository' );
		const loader = fileRepository.createLoader( file );

		loader.upload().then( result => this.createAudio( result ), error => logError( 'error', error ) );
		// console.log( 'loader', loader );
		// console.log( 'Repository', fileRepository );
	}

	createAudio( uploadResult ) {
		const model = this.editor.model;

		// console.log( 'uploadResult', uploadResult );
		model.change( writer => {
			const audio = writer.createElement( 'simpleaudio', { source: uploadResult.url, controls: '' } );

			// Locally this delay was not necessary, but on Cyon it solved the problem, that audios run only after a reload
			// The delay of 1 sec is emirical, but 0.5 sec was not sufficient
			// Probably it would be better to probe if the mp3 file is available
			// loader.upload is a promise and we get to createAudio only after php stored the file,
			// but apparently it is not yet available as soon as it has been successfully stored
			setTimeout( () => model.insertContent( audio ), 1000);
		} );
	}
}
