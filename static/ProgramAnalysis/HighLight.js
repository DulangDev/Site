function edit(e){

    if(e.data === "{" || e.data === '(' || e.data === '['){
        let ins_string = "";
        let str_offset = 0;
        let former_selection = editor.selectionStart;
        switch (e.data) {
            case "{":
                let indent = count_indentation(editor.value, editor.selectionStart);
                ins_string =  `\n${indent}    \n${indent}}`;
                str_offset = 5 + indent.length;
                break;
            case "(":
                ins_string = "  )";
                str_offset = 1;
                break;
            case "[":
                ins_string = "  ]";
                str_offset = 1;
                break;
        }
        editor.value = editor.value.substr(0, editor.selectionStart) + ins_string + editor.value.substr(editor.selectionStart);
        editor.selectionEnd = editor.selectionStart = former_selection + str_offset;
    }
    if(e.inputType === "insertLineBreak"){
        let indent = count_indentation(editor.value, editor.selectionStart);
        let ins_string =  `${indent}`;
        let str_offset =  indent.length;
        let former_selection = editor.selectionStart;
        editor.value = editor.value.substr(0, editor.selectionStart) + ins_string + editor.value.substr(editor.selectionStart);
        editor.selectionEnd = editor.selectionStart = former_selection + str_offset;
        save();
    }



    let lexems = lexical_analyze(editor.value);
    codeRepr.innerHTML = lexems.reduce((acc, lex) => {
        return acc + lex_to_text(lex);
    }, "");
    editor.style.height = editor.scrollHeight + "px";

};
