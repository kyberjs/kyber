const utils = require('../utils');
const baseTags = require('./base');

const htmlTags = 'a,abbr,acronym,address,applet,area,article,aside,audio,b,base,basefont,bdi,bdo,big,blockquote,body,br,button,canvas,caption,center,cite,code,col,colgroup,datalist,dd,del,details,dfn,dialog,dir,div,dl,dt,em,embed,fieldset,figcaption,figure,font,footer,form,frame,frameset,h1,h2,h3,h4,h5,h6,head,header,hr,html,i,iframe,img,input,ins,kbd,keygen,label,legend,li,link,main,map,mark,menu,menuitem,meta,meter,nav,noframes,noscript,object,ol,optgroup,option,output,p,param,picture,pre,progress,q,rp,rt,ruby,s,samp,script,section,select,small,source,span,strike,strong,style,sub,summary,sup,svg,table,tbody,td,textarea,tfoot,th,thead,time,title,tr,track,tt,u,ul,var,video,wbr';

const unaryTags = 'area,base,basefont,br,col,embed,frame,hr,img,input,keygen,link,meta,param,source,track,wbr';
const isUnaryTag = utils.makeMap(unaryTags, true);

const plainTag = 'textarea,script,style';
const isPlainTag = utils.makeMap(plainTag, true);

const preformattedTag = 'pre';
const isPreformattedTag = utils.makeMap(preformattedTag, true);

const inlineTag = 'a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,noscript,object,q,s,samp,select,small,span,strike,strong,sub,sup,svg,textarea,tt,u,var';
const isInlineTag = utils.makeMap(inlineTag, true);

const binaryCompile = function binaryCompile(element, children, env, template) {
    return baseTags.compile(element, children, env, template);
};

const unaryCompile = function unaryCompile(element, children, env, template) {
    const attrs = baseTags.compileAttrs(element.attrsList, element, env, template);
    const unaryCode = new utils.Code();
    unaryCode.add(`<${element.tag}`, true);
    unaryCode.add(attrs);
    unaryCode.add('/>', true);

    return unaryCode.combine();
};

exports.each = function each(handler) {
    htmlTags.split(',').forEach(name => {
        const unary = isUnaryTag(name); // 自闭和标签
        const plain = isPlainTag(name); // 包含非 HTML 片段标签
        const preformatted = isPreformattedTag(name); // 预格式化的标签
        const inline = isInlineTag(name); // 行内标签
        handler(name, {plain, unary, preformatted, inline, compile: unary ? unaryCompile : binaryCompile});
    });
};
