let editor = document.getElementById("code");
let codeRepr = document.getElementById("code-render");


function get_lexem(str, startpos){

    let lexems = [
        "->","$eol", "..", ".", "(", ")",
        "{", "}", "[", "]", ",", ":",
        "==", "!=", "<", ">", "<=", ">=",
        "+=", "-=", "*=", "/=", "=", "+", "-", "**", "*", "/", "\\", ";"
    ];
    let keywords = [
        "or", "and", "not", "if",
        "for", "true", "false", "else", "fun", "$class",
        "async", "write", "import", "null", "in", "return", "this" ,
        "while", "$indent", "$dedent", "class"
    ];
    let newpos = startpos;
    if(str.charAt(startpos) === '\n'){
        return {
            type: "linebreak",
            start: startpos,
            end: startpos
        };
    }

    while( str.charAt(startpos) === " " ){
        startpos++
    }
    if(newpos !== startpos)
        return {
            type: "ws",
            start: newpos,
            end: startpos - 1
        };
    if(str.charAt(startpos) === '#'){
        let endpos = startpos + 1;
        while( str.charAt(endpos) !== '\n' && endpos < str.length ){
            endpos++;
        }
        return {
            type: "comment",
            value: str.substr(startpos, endpos - startpos),
            start: startpos,
            end: endpos - 1
        }
    }
    if(str.charAt(startpos) === '"'){
        let endpos = startpos + 1;
        while(str.charAt(endpos) !== '"' && endpos < str.length){
            if(str.charAt(endpos) === '\\'){
                endpos++;
            }
            endpos++;
        }
        if( endpos !== str.length ) return {
            type: "string",
            start: startpos,
            end: endpos,
            value: str.substr(startpos + 1, endpos - 1 - startpos)
        }; else return {
            type: "unterminated",
            start: startpos,
            end: endpos - 1,
            value: str.substr(startpos + 1, endpos - 1 - startpos)
        }
    }
    for(let i = 0; i < lexems.length; ++i){
        let lex_len = lexems[i].length;
        if( str.substr(startpos, lex_len) === lexems[i] ){
            return {
                type: "kw",
                start: startpos,
                end: startpos + lexems[i].length - 1,
                value: lexems[i]
            }
        }
    }
    let end_reader = startpos;
    while(      str.charAt(end_reader) >= 'a' && str.charAt(end_reader) <= 'z'
            ||  str.charAt(end_reader) >= 'A' && str.charAt(end_reader) <= 'Z'
            ||  str.charAt(end_reader) === '_'
        ){
        end_reader++;
    }
    if(end_reader !== startpos){
        for(let i = 0; i < keywords.length; ++i){
            let lex_len = keywords[i].length;
            if( str.substr(startpos, lex_len) === keywords[i] && lex_len === end_reader - startpos ){
                return {
                    type: "kw",
                    start: startpos,
                    end: startpos + keywords[i].length - 1,
                    value: keywords[i]
                }
            }
        }
        return {
            type: "name",
            start: startpos,
            end: end_reader - 1,
            value: str.substr(startpos, end_reader - startpos)
        }
    }
    let is_range = null;
    while( str.charAt(end_reader) >= '0' && str.charAt(end_reader) <= '9' || str.charAt(end_reader) === '.' ){
        if(str.charAt(end_reader + 1) === '.' && str.charAt(end_reader) === '.'){
            is_range = true;
        }
        end_reader++;
    }
    if(end_reader !== startpos){
        return {
            type: !is_range ? "number" : "range",
            start: startpos,
            end: end_reader- 1,
            value: str.substr(startpos, end_reader - startpos)
        }
    }
    return {
        type: "none",
        start: startpos,
        end: startpos
    }

}

function save(){
    let text = editor.value;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/savefile");
    xhr.setRequestHeader("Content-type", "text-plain");
    xhr.send(text)
}

function lexical_analyze(text){
    let lexarray = [];
    for(let i = 0; i < text.length; ++i){
        let next_lex = get_lexem(text, i);
        i = next_lex.end;
        lexarray.push(next_lex);
    }
    return lexarray;
}

function lex_to_text(lexem){
    try{
        lexem.value = lexem.value.replace(/</gm, "&#60").replace(/>/gm, "&#62");
    } catch (e) {

    }

    switch(lexem.type){
        case "ws":
            return "<span class='name'>"+" ".repeat(lexem.end - lexem.start + 1)+"</span>";
        case "string":
            return `<span class="literal">"${lexem.value}"</span>`;
        case "number":
            return `<span class="literal">${lexem.value}</span>`;
        case "name":
            return `<span class="name">${lexem.value}</span>`;
        case "linebreak":
            return "<br>";
        case "unterminated":
            return `<span class="literal">"${lexem.value}</span>`;
        case "range":
            return `<span class="range">${lexem.value}</span>`;
        case "kw":{
            switch (lexem.value) {
                case ">": lexem.value = "&#62"; break;
                case "<": lexem.value = "&#60"
            }
            return `<span class="kw">${lexem.value}</span>`;
        }
        case "comment":
            return  `<span class="comment">${lexem.value}</span>`;
    }
    return ""
}

function count_indentation(text, pos){
    let lines = text.split("\n");
    let symcounter = 0;
    let lineno = 0;
    for(; lineno < lines.length && symcounter < pos; lineno++){
        symcounter += lines[lineno].length + 1;
    }
    let currline = lines[lineno - 1];
    let i = 0;
    while( currline.charAt(i) === ' ' ){
        i++;
    }

    return " ".repeat(i);
}
function encodeArr(sym){
    if(sym === "<")
        return "&#60";
    if(sym === ">")
        return "&#62";
    else return sym;
}


function execute(){
    fetch("/execute").then(r=>r.text()).then(r=>{
        document.querySelector("#responser").innerText = r;
    })
}


