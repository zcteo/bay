// 今日诗词
jinrishici.load(function (result) {
    if (result.status === "success") {
        var poem = document.querySelector("#poem")
        poem.innerHTML = ''
        poem.style = "line-height:185%"
        var title = document.createElement("div")
        var author = document.createElement("div")
        author.style = "text-indent:2em;font-size:14px;color:gray"
        var content = document.createElement("div")
        title.innerHTML = '<b>' + result.data.origin.title + '<b>'
        author.innerHTML = '—— ' + result.data.origin.dynasty + ' · ' + result.data.origin.author
        var contentHtml = ''
        for (var i = 0; i < result.data.origin.content.length; i++) {
            contentHtml += result.data.origin.content[i] + '<br>'
        }
        content.innerHTML = contentHtml
        poem.appendChild(title)
        poem.appendChild(author)
        poem.appendChild(content)
    }
});
