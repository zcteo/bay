// 生成目录
function generateToc() {
    // 获取 TOC
    var pTags = document.getElementsByTagName('p')
    var tocTag = null
    for (var i = 0; i < pTags.length; i++) {
        var pTag = pTags[i]
        var tagTxt = pTag.innerText.toLowerCase()
        if (tagTxt === '[toc]') {
            tocTag = pTag
            break
        }
    }
    if (tocTag === null) {
        return
    }
    // 获取标题
    var startHeaderLevel = 2
    var endHeaderLevel = 4
    var headers = new Array()
    for (var i = startHeaderLevel; i <= endHeaderLevel; i++) {
        var tmpHs = document.getElementsByTagName('h' + i)
        for (var j = 0; j < tmpHs.length; j++) {
            headers.push(tmpHs[j])
        }
    }
    // 按照先后排序
    headers = headers.sort(function (a, b) {
        return a.offsetTop - b.offsetTop
    })
    var html = ''
    for (var i = 0; i < headers.length; i++) {
        var id = headers[i].id
        var content = headers[i].innerText
        var hLevel = parseInt(headers[i].nodeName.substr(1)) - startHeaderLevel
        var p = document.createElement('p')
        var a = document.createElement('a')
        p.style.cssText = 'margin: 5px 0px; text-indent: ' + hLevel * 2 + 'em'
        a.href = '#' + id
        a.innerText = content
        a.style.cssText = 'text-decoration: none'
        a.setAttribute('target', '_self')
        p.appendChild(a)
        tocTag.appendChild(p)
        // 不直接在循环里面appendChild 
        html += p.outerHTML
        // html += '<p style="margin: 5px 0px; text-indent: ' + hLevel * 2 + 'em"><a href="#' + id + '" target="_self" style="text-decoration: none">' + content + '</a></p>'
    }
    tocTag.innerHTML = html
}
generateToc()

/**
 * 1. 创建一个textarea，把想要复制的内容赋值到textarea的value上；
 * 2. 把这个textarea插入到body内；
 * 3. 获取这个textarea，对它执行选中；
 * 4. 执行document的copy事件；
 * 5，删除刚刚插入的textarea。
 */
function copyText(text) {
    var element = document.createElement('textarea')
    element.value = text
    document.getElementsByTagName('body')[0].appendChild(element)
    element.select()
    document.execCommand('copy')
    element.remove()
}

function onCopyClick(button) {
    var childrens = button.parentNode.children
    var code = null
    for (var i = 0; i < childrens.length; i++) {
        if ('code' === childrens[i].tagName.toLowerCase()) {
            code = childrens[i]
            break
        }
    }
    if (null === code) {
        return
    }
    var txt = code.innerText
    // 去掉最后的换行符
    if (txt.endsWith('\n')) {
        txt = txt.slice(0, txt.length - 1)
    }
    // 去掉最后的回车符
    if (txt.endsWith('\r')) {
        txt = txt.slice(0, txt.length - 1)
    }
    copyText(txt)
    button.innerText = "copied"
}

function onCodeMouseLeave(parent) {
    var childrens = parent.children
    var button = null
    for (var i = 0; i < childrens.length; i++) {
        if ('copy_code_btn' === childrens[i].className) {
            button = childrens[i]
            break
        }
    }
    if (null != button) {
        button.innerText = "copy"
    }
}

var lastScrollLeft = 0
function onCodeScroll(parent) {
    var curScrollLeft = parent.scrollLeft
    if (Math.abs(curScrollLeft - lastScrollLeft) < 5) {
        return
    }
    lastScrollLeft = curScrollLeft
    var childrens = parent.children
    var button = null
    for (var i = 0; i < childrens.length; i++) {
        if ('copy_code_btn' === childrens[i].className) {
            button = childrens[i]
            break
        }
    }
    if (null != button) {
        button.style.right = '-' + curScrollLeft + 'px';
    }
}

function createCopyBtn() {
    var codeTags = document.getElementsByTagName('code')
    for (var i = 0; i < codeTags.length; i++) {
        var parent = codeTags[i].parentNode
        btnHtml = '<button class="copy_code_btn" onclick="onCopyClick(this)">copy</button>'
        parent.innerHTML = btnHtml + parent.innerHTML
        parent.setAttribute('onmouseleave', 'onCodeMouseLeave(this)')
        parent.setAttribute('onscroll', 'onCodeScroll(this)')
    }
}
createCopyBtn()
