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
        var p = document.createElement('p');
        var a = document.createElement('a')
        p.style.cssText = 'margin: 5px 0px; text-indent: ' + hLevel * 2 + 'em';
        a.href = '#' + id
        a.innerText = content
        a.style.cssText = 'text-decoration: none'
        a.setAttribute('target', '_self')
        p.appendChild(a)
        tocTag.appendChild(p);
        // 不直接在循环里面appendChild 
        html += p.outerHTML
        // html += '<p style="margin: 5px 0px; text-indent: ' + hLevel * 2 + 'em"><a href="#' + id + '" target="_self" style="text-decoration: none">' + content + '</a></p>'
    }
    tocTag.innerHTML = html
}
generateToc()