(function() {

    // localStorage.removeItem('patterns')

    function createPatternRow(index, withInputs = false, item) {
        var $row = document.createElement('tr')
        $row.dataset.index = index
        var $cell = document.createElement('td')
        var $cell2 =  document.createElement('td')
        var $cell3 =  document.createElement('td')
        var $srcInput = document.createElement('input')
        $srcInput.classList.add('src')
        if (item && item.src) {
            $srcInput.value = item.src
        }
        $srcInput.setAttribute('name', 'src[' + index + ']')
        var $destInput = document.createElement('input')
        $destInput.classList.add('dest')
        if (item && item.dest) {
            $destInput.value = item.dest
        }
        $srcInput.setAttribute('name', 'dest[' + index + ']')
        var $btn = document.createElement('button')
        if (withInputs) {
            $cell.appendChild($srcInput)
            $cell2.appendChild($destInput)
            $btn.classList.add('remove')
            $btn.innerHTML = "-"
        } else {
            $btn.classList.add('add')
            $btn.innerHTML = "+"
        }
        $cell3.appendChild($btn)
        $row.appendChild($cell)
        $row.appendChild($cell2)
        $row.appendChild($cell3)
        return $row;
    }

    function saveItems() {
        var items = []
        var $rows = $patterns.querySelectorAll('tbody tr')
        for (var i = 0; i<$rows.length; i++) {
            var src = $rows[i].querySelector('.src').value
            if (src.length > 0) {
                var dest = $rows[i].querySelector('.dest').value
                items.push( { src: src, dest: dest })        
            }
        }

        localStorage.setItem('patterns', JSON.stringify(items))
    }

    function getItems() {
        var items = localStorage.getItem('patterns')
        if (items) {
            items = JSON.parse(items)
            return items
        }

        return []
    }
    function populateItems() {
        $tbody.innerHTML = ''
        var count = 0
        var items = getItems()
        if (items) {
            count = items.length
            for(var i =0; i<count; i++) {
                var $row = createPatternRow(i + 1, true, items[i])
                $tbody.appendChild($row)
            }
        }

        return count
    }

    function loadPatternForm() {
        var count = populateItems()

        var $row = createPatternRow(count + 1, true)
        $tbody.appendChild($row)
    }

    var $form = document.querySelector('form[name="cleaner"]')
    var $btn = document.querySelector('button[name="clean"]')
    var $status = document.querySelector('[name="status"]')
    var $src = document.querySelector('textarea[name="src"]')
    var $dest = document.querySelector('textarea[name="dest"]')

    var $patterns = document.querySelector('form[name="patterns"]')
    var $tbody = $patterns.querySelector('table tbody')
    var $tfoot = $patterns.querySelector('table tfoot')
 
    loadPatternForm()
    var $addRow = createPatternRow(-1, false)
    $tfoot.appendChild($addRow)

    $patterns.addEventListener('blur', function(e) {
        if (e.target.nodeName == 'INPUT') {
            saveItems()
        }
    }, true)

    $patterns.addEventListener('click', function(e) {
        e.preventDefault()

        var $btn = e.target
        if ($btn.classList.contains('add')) {
            var curCount = $patterns.querySelectorAll('tbody tr').length
            var $addRow = createPatternRow(curCount + 1, true)
            $tbody.appendChild($addRow)
            saveItems()
        } else if ($btn.classList.contains('remove')) {
            $btn.parentNode.parentNode.remove()
            saveItems()
            loadPatternForm()
        }
    })

    $form.addEventListener('submit', function(e) {
        e.preventDefault()
        $status.textContent = ''
        $btn.setAttribute('disabled', 'disabled')

        var content = $src.value
        var items = getItems()
        for(var i=0; i<items.length; i++) {
            var item = items[i]
            content = content.replace(new RegExp(item.src, 'g'), item.dest)
        }

        $dest.value = content;

        $status.textContent = 'Done!'
        $btn.removeAttribute('disabled')
    })
}())