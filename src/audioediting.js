import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget } from '@ckeditor/ckeditor5-widget';

export default class AudioEditing extends Plugin {

	static get requires() {
		return [ Widget ];
	}

	init() {
		console.log( 'AudioEditing#init' );
		this._defineSchema();
		// console.log( 'AudioUI#init() got called, schema is defined' );
		this._defineConverters();
		// console.log( 'Converters for Audio have been defined' );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;
		schema.register( 'simpleaudio', {
			isObject: true,
			isBlock: true,
			allowAttributes: [ 'source', 'controls' ],
			allowWhere: '$text',
			allowChildren: '$text'
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: 'audio',
				attributes: [ 'controls', 'src' ]
			},
			model: ( viewElement, { writer } ) => {
				// console.log(viewElement);
				return writer.createElement( 'simpleaudio', {
					controls: viewElement.getAttribute( 'controls' ), source: viewElement.getAttribute( 'src' )
				} );
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: {
				name: 'simpleaudio',
				attributes: [ 'controls, source' ]
			},
			view: ( modelElement, { writer } ) => {
				// console.log(modelElement);
				return writer.createContainerElement( 'audio', {
					controls: modelElement.getAttribute( 'controls' ), src: modelElement.getAttribute( 'source' )
				} );
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: {
				name: 'simpleaudio',
				attributes: [ 'controls, source' ]
			},
			view: ( modelElement, { writer: viewWriter } ) => {
				// console.log(modelElement);
				const audioModelElement = viewWriter.createEditableElement( 'audio', {
					controls: modelElement.getAttribute( 'controls' ), src: modelElement.getAttribute( 'source' )
				} );
				return toWidget( audioModelElement, viewWriter );
			}
		} );
	}
}
