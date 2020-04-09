var snips = {};

// to-do: trim keys and vals

$(document).ready(() => {
    load();
    adjust();

    $('#add').click(() => {
        let k = $('#key').val(), v = $('#val').val();

        if (!check(k,v)) {
            return;
        } else $('#msg').hide();

        snips[k] = v;
        addNode(k,v);
        update();
        $('#nodes').show();

        $('#key').val("");
        $('#val').val("");
        // console.log('added key to local storage');
    }); 

    $('#clear').click(() => {
        for (let i of $('.node-x')) i.click();
    }); 
});

function update() {
    localStorage.setItem("snips_ext",JSON.stringify(snips));
}

function check(k,v,bypass=false) {
    // true bypass value: the original value for a key 
    ret = true;
    if (!k || !(k.trim())) {
        $('#msg').text("The title cannot be empty");
        ret = false;
    } else if (!v || !(v.trim())) {
        $('#msg').text("The note cannot be empty");
        ret = false;
    } else if (snips.hasOwnProperty(k) && !(bypass && snips[k] == bypass)) {
        $('#msg').text('Duplicate titles are not allowed'); 
        ret = false;
    }
    if (!ret) $('#msg').show();
    else $('#msg').hide();
    return ret;
}

function adjust() {
    $('#nodes').show();
    if ($("#nodes").children().length == 0) {
        $('#nodes').hide();
        $('#msg').text('No notes stored');
        $('#msg').show();
    } else $('#msg').hide();

    $('.node').css('width',$('#nodes').children().length > 8 ? '98%' : '100%');
}

function load() {
    let data = localStorage.getItem('snips_ext');
    if (!data) {
        localStorage.setItem("snips_ext","{}");
        // console.log('set key in local storage');
    } else {
        data = JSON.parse(data);
        snips = data;
        console.log(data);
        if (Object.keys(data).length > 0) {
            for (let k of Object.keys(data)) addNode(k,data[k]);
        }
    }
}

function addNode(k,v) {
    let key=$('<div></div>'),val=$('<div></div>'),div = $('<div></div>');
    let tools = $('<div></div>'), bck = $('<div></div>');
    
    let key_ed=$('<input></input>').val(k), val_ed=$('<textarea></textarea>').val(v);
    let key_txt=$('<span></span>').text(k), val_txt=$('<span></span>').text(v);

    [key_ed, val_ed].map(i => i.hide());

    key.append(key_txt,key_ed);
    val.append(val_txt,val_ed);

    let x = $('<span></span>').text('x');
    let cb = $('<span></span>').text('📋');
    let ed = $('<span></span>').text('✏️'); 

    let chk = $('<span></span>').text('✅'); 
    chk.hide();

    key.addClass('node-key');
    val.addClass('node-val');
    div.addClass('node');
    x.addClass('node-x');
	bck.addClass('node-tools-bck');
    val.attr('id',`node-${k}-val`);

    tools.addClass('node-tools');
    tools.append(chk,ed,cb,x,bck);

    div.append(key,val,tools);

    div.hover(() => tools.show());
    div.mouseleave(() => tools.hide());

    x.click(() => {
        delete snips[k];
        update();
        div.remove();
        adjust();
    });

    cb.click(() => {
        let range = document.createRange();
        range.selectNode(document.getElementById(`node-${k}-val`).firstChild);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range); 
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        $('#msg').text('Copied!');
        $('#msg').show();
        setTimeout(()=>$('#msg').hide(),1000);
    });

    ed.click(() => {
        div.mouseleave(() => tools.show());
        [ed,cb,x].map(i => i.hide());
        chk.show();

        [key_txt, val_txt].map(i => i.hide());
        [key_ed, val_ed].map(i => i.show());

        chk.click(() => {
            if (!check(key_ed.val(),val_ed.val(),val_txt.text())) return;

            div.mouseleave(() => tools.hide());
            [ed,cb,x,bck].map(i => i.show());
            chk.hide();


            delete snips[key_txt.text()];
            snips[key_ed.val()] = val_ed.val();

            update();

            key_txt.text(key_ed.val());
            val_txt.text(val_ed.val());

            [key_txt, val_txt].map(i => i.show());
            [key_ed, val_ed].map(i => i.hide());
        });

    });

    $('#nodes').append(div);

    adjust();
}