javascript:(function grabStats() {
    var grabBox = document.createElement('div');
    var closeButton = document.createElement('button');
    var countVisibleItemsText = document.createElement('div');
    var countExtractedItemsText = document.createElement('div');
    grabBox.setAttribute('style', 'position: absolute; top: 10px; left: 260px; background:rgba(175, 175, 175, 0.9); padding: 0.5em; box-shadow: 5px 5px 20px #6f6f6f;');
    grabBox.setAttribute('id', 'grabBox');
    closeButton.setAttribute('style', ' height: 2em; width: 2em; position: absolute; top: 0; right: 0;');
    closeButton.innerHTML = 'X';
    closeButton.addEventListener('click', function () {
        document.body.removeChild(grabBox)
    });
    grabBox.appendChild(closeButton);
    countVisibleItemsText.setAttribute('style', ' height: 2em; display: inline-block;');
    grabBox.appendChild(countVisibleItemsText);
    countExtractedItemsText.setAttribute('style', ' height: 2em; display: inline-block; margin-left: 2em');
    grabBox.appendChild(countExtractedItemsText);
    var resultBox = document.createElement('textarea');
    resultBox.setAttribute('style', 'width: 900px; height: 200px; display:block; border-top: 1px solid black;');
    resultBox.setAttribute('id', 'resultBox');
    grabBox.appendChild(resultBox);
    extractData();
    document.querySelector('.section-scrollbox').addEventListener('DOMSubtreeModified', function (propname, oldValue, newValue) {
        extractData()
    }, false);
    document.body.append(grabBox);
    function extractData() {
        var resultArray = [];
        resultArray.push('title\taddress\tviews\tsource');
        var photoList = document.querySelectorAll('.section-photo-bucket-content');
        countVisibleItemsText.innerHTML = '<b>' + photoList.length + '</b> sichtbar';
        photoList.forEach(function (entry) {
            var title = entry.querySelector('.section-photo-bucket-title span').innerHTML;
            var address = entry.querySelector('.section-photo-bucket-subtitle span').innerHTML;
            var photoList = entry.querySelectorAll('.section-photo-bucket-photo-container');
            photoList.forEach(function (photoContainer) {
                var viewCount = photoContainer.querySelector('.section-photo-bucket-caption-label');
                var image = photoContainer.querySelector('img');
                resultArray.push(title + '\t' + address + '\t' + (viewCount ? viewCount.innerHTML : 'n/a') + '\t' + (image ? image.src : 'n/a'));
            });
        });
        countExtractedItemsText.innerHTML = '<b>' + (resultArray.length - 1) + '</b> extrahiert (Fotoliste scrollen aktualisiert hier automatisch)';
        resultBox.value = resultArray.join('\n');
    }
})();