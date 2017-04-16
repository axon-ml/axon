/**
 * Settings for Monaco Editor.
 */
export const EditorSettings = {
    language: "python"
}

/**
 * Load a Monaco Editor in the given element.
 * 
 * @argument elem: The id of element to attach to.
 * @argument settings: an object of settings for the editor.
 * @returns nothing
 */
export function load(elem, settings) {
    console.debug(`Loading editor @ ${elem}`);
    let stringRep = JSON.stringify(settings);
    console.log(stringRep);
    eval(`
        require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs/' }});
        require(['vs/editor/editor.main'], function() {
            var editor = monaco.editor.create(document.getElementById('${elem}'), JSON.parse('${stringRep}'));
        });
    `);
}